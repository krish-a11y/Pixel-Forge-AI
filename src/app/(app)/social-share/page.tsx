"use client";
import React, { useEffect, useRef, useState } from "react";
import { CldImage } from "next-cloudinary";

// options for the image conversion
const socialFormats = {
  "Instagram Square (1:1)": { width: 1080, height: 1080, aspectRatio: "1:1" },
  "Instagram Portrait (4:5)": { width: 1080, height: 1350, aspectRatio: "4:5" },
  "Twitter Post (16:9)": { width: 1200, height: 675, aspectRatio: "16:9" },
  "Twitter Header (3:1)": { width: 1500, height: 500, aspectRatio: "3:1" },
  "Facebook Cover (205:78)": { width: 820, height: 312, aspectRatio: "205:78" },
};

// it just  gives all the keys of the obj in union
type SocialFormat = keyof typeof socialFormats;
export default function SocialShare() {

  // tracking the uploaded image file
  const [uploadedImage,setUploadedImage]=useState<string|null>(null);

  // for tracking the selected format
  const [selectedFormat,setSelectedFormat]=useState<SocialFormat>("Instagram Square (1:1)")

  // for tracking the image upload process
  const [isUploading,setIsUploading]=useState(false);

  const [isTransforming,setIsTransforming]=useState(false);

  // it refers to the the image tag in the page
  const imageRef=useRef<HTMLImageElement>(null);
  
  useEffect(()=>{
      if(uploadedImage)
      {
        setIsTransforming(true);
      }
  },[uploadedImage,selectedFormat])

  const handleFileUpload=async (event:React.ChangeEvent<HTMLInputElement>)=>
  {
    // extracting the image file
    const file=event.target.files?.[0];
    // if the file absent
    if(!file)return ;

    // as the image upload is ongoing
    setIsUploading(true);
    // creating form data and inserting the image file
    const formData=new FormData();
    formData.append("file",file);

    try {
      // uploading the image backend endpoint
      const response=await fetch("/api/image-upload",{method:"POST", body:formData})

      if(!response.ok)throw new Error("failed to upload image")

        // extracting the publicId from the response
      const data=await response.json();

      // updating the image state
      setUploadedImage(data.publicId)
    } catch (error:any) {
      
      console.log(error);
      alert("failed to upload image")
    }finally{
      // as the upload has completed
      setIsUploading(false)
    }
  }
  return <div>SocialShare</div>;
}
