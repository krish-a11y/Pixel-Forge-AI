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

  // uploading the image to the cloudinary
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

  // downloading the image
  const handleDownload=()=>
  {
    // if the image absent
     if(!imageRef.current)return ;

    //  this requets for the image to the the url (src)which returns promise
     fetch(imageRef.current.src)
    //  convert  the image data in to binary memory and stores it in browser memory
     .then((response)=>response.blob())
     .then((blob)=>{
      // creating url for refersing the stored blob
      const url=window.URL.createObjectURL(blob)
      // creating anchor tag
      const link=document.createElement("a");
      // setting its url to the blob link
      link.href=url;
      // setting the name of the download image
      link.download=`${selectedFormat.replace(/\s+/g,"_").toLowerCase()}.png`;
      // appending the anchor tag to the DOM
      document.body.appendChild(link);
      // automatically clicking the image
      link.click();
      // removing the image link
      document.body.removeChild(link);
      // discards  the URL of the blob
      window.URL.revokeObjectURL(url);
     })
  }
 return (
   <div className="container mx-auto p-4 max-w-4xl">
     <h1 className="text-3xl font-bold mb-6 text-center">
       Social Media Image Creator
     </h1>

     <div className="card">
       <div className="card-body">
         <h2 className="card-title mb-4">Upload an Image</h2>
         <div className="form-control">
           <label className="label">
             <span className="label-text">Choose an image file</span>
           </label>
           <input
             type="file"
             onChange={handleFileUpload}
             className="file-input file-input-bordered file-input-primary w-full"
           />
         </div>

         {isUploading && (
           <div className="mt-4">
             <progress className="progress progress-primary w-full"></progress>
           </div>
         )}

         {uploadedImage && (
           <div className="mt-6">
             <h2 className="card-title mb-4">Select Social Media Format</h2>
             <div className="form-control">
               <select
                 className="select select-bordered w-full"
                 value={selectedFormat}
                 onChange={(e) =>
                   setSelectedFormat(e.target.value as SocialFormat)
                 }
               >
                 {Object.keys(socialFormats).map((format) => (
                   <option key={format} value={format}>
                     {format}
                   </option>
                 ))}
               </select>
             </div>

             <div className="mt-6 relative">
               <h3 className="text-lg font-semibold mb-2">Preview:</h3>
               <div className="flex justify-center">
                 {isTransforming && (
                   <div className="absolute inset-0 flex items-center justify-center bg-base-100 bg-opacity-50 z-10">
                     <span className="loading loading-spinner loading-lg"></span>
                   </div>
                 )}
                 <CldImage
                   width={socialFormats[selectedFormat].width}
                   height={socialFormats[selectedFormat].height}
                   src={uploadedImage}
                   sizes="100vw"
                   alt="transformed image"
                   crop="fill"
                   aspectRatio={socialFormats[selectedFormat].aspectRatio}
                   gravity="auto"
                   ref={imageRef}
                   onLoad={() => setIsTransforming(false)}
                 />
               </div>
             </div>

             <div className="card-actions justify-end mt-6">
               <button className="btn btn-primary" onClick={handleDownload}>
                 Download for {selectedFormat}
               </button>
             </div>
           </div>
         )}
       </div>
     </div>
   </div>
 );
}
