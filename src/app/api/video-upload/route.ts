// uploading the video to the cloudinary also storing videos public id  and its meta data in the Prisma
import { NextResponse,NextRequest } from "next/server";
import {auth} from "@clerk/nextjs/server"
import { v2 as cloudinary } from "cloudinary";
import { error } from "console";
import { PrismaClient } from "@/generated/prisma/client";

import { PrismaPg } from "@prisma/adapter-pg";

// connceting to the DB
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

// configration of the cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

// interface for storing the result after uploading video
interface CloudinaryUploadResult {
    public_id:string,
    bytes:number,
    duration?:number
    [key:string]:any
}
export  async  function POST(request:NextRequest)
{
    // if the user in noty signed  in, dont allow for uploading
    const {userId}=  await auth()

    if(!userId)
    {
        return NextResponse.json({error:"Unauthorized"},{status:401})
    }

    // if any cloudinary credential is absent
    if (
      !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return NextResponse.json(
        { error: "Cloudinary credentials not found" },
        { status: 500 },
      );
    }
    try {
        
        // extracting the video file
        const formData= await request.formData();
        const file= formData.get('file') as File||null;
        const title=formData.get("title") as String;
        const description=formData.get("description") as String;
        const originalSize=formData.get("originalSize") as String;
        
        // if the video is absent
        if(!file)
        {
            return NextResponse.json({error:"file not found"},{status:400})
        }

        // converting  the video data into btytes and storing it in array buffer
        const bytes= await  file.arrayBuffer();

        // shifting the video data from the array buffer to only buffer(cloudinary accepts that)
        const buffer=Buffer.from(bytes);

        // uploading the video
        const result=await  new Promise<CloudinaryUploadResult>(
            (resolve,reject)=>
            {
               const uplaoadStream=cloudinary.uploader.upload_stream(
                {
                    resource_type:"video",
                    folder:"pixelforge-video-upload",
                    transformation:[
                      {quality:"auto",fetch_format:"mp4"}
                    ]
                },
                (error,result)=>
                {
                    if(error)reject(error);
                    else  resolve(result as CloudinaryUploadResult)
                }
               )

            //    ending the upload
               uplaoadStream.end(buffer);
            }
        )

        const  video=await prisma.video.create({
          data:{
            title:String(title),
            description:String(description),
            publicId:result.public_id,
            originalSize:String(originalSize),
            compressedSize: String(result.bytes),
            duration:result.duration||0
          }
        })
        return NextResponse.json(video)
    } catch (error:any) {
        console.log("Upload video failed",error);
        return NextResponse.json({error:"Uplaod,video,failed"},{status:500})
    }finally
    {
      // disconncting the DB
      prisma.$disconnect();
    }
}