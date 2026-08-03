// route for getting videos 
import { NextRequest,NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma/client";

import { PrismaPg } from "@prisma/adapter-pg";

// connceting to the DB
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});


// getting the videos
 export async function  GET(request:NextRequest)
 {
    try {
       const videos=await prisma.video.findMany({
        orderBy:{
            createdAt:"desc"
        }

       })
       return NextResponse.json(videos)        
    } catch (error:any) {
        return NextResponse.json({error:"error"},{status:500})
    }
    // disconnecting to the DB
    finally
    {
        await prisma.$disconnect();
    }
 }