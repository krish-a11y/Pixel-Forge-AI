// uploading the image to the cloudinary
import { NextResponse,NextRequest } from "next/server";
import {auth} from "@clerk/nextjs/server"
import { v2 as cloudinary } from "cloudinary";
import { error } from "console";

// configration of the cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

// interface for storing the result after uploading image
interface CloudinaryUploadResult {
    public_id:string,
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

    try {
        
        // extracting the image file
        const formData= await request.formData();
        const file= formData.get('file') as File||null;

        // if the image is absent
        if(!file)
        {
            return NextResponse.json({error:"file not found"},{status:400})
        }

        // converting  the image data into btytes and storing it in array buffer
        const bytes= await  file.arrayBuffer();

        // shifting the image data from the array buffer to only buffer(cloudinary accepts that)
        const buffer=Buffer.from(bytes);

        // uploading the image
        const result=await  new Promise<CloudinaryUploadResult>(
            (resolve,reject)=>
            {
               const uplaoadStream=cloudinary.uploader.upload_stream(
                {
                    folder:"pixelforge-image-upload"
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

        return NextResponse.json({publicId:result.public_id},{status:200})
    } catch (error:any) {
        console.log("Upload image failed",error);
        return NextResponse.json({error:"Uplaod,image,failed"},{status:500})
    }
}