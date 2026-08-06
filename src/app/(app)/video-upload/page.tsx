"use client"
// video upload page frontend
import React, { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
function VideoUpload() {
  // for tracking uploaded file
   const [file,setFile]=useState<File|null>(null);
  //  for tracking the title of the file
   const [title,setTitle]=useState("");
  //  for tracking the description of  the file
   const [description,setDescription]=useState("");
  //  for tracking the state of the upload
   const [isUploading,setIsUploading]=useState(false);

   const router=useRouter();

  //  setting the max file size(60 mb)
  const MAX_FILE_SIZE=60*1024*1024

  // when user click on submit
  const handleSubmit=async(e:React.FormEvent)=>
  {
     e.preventDefault();
     if(!file)
     {
      return ;
     }

     if(file.size>MAX_FILE_SIZE)
     {
      alert("file size too large")
     }

     setIsUploading(true);
     const formData=new FormData();
     formData.append("file",file);
     formData.append("title",title);
     formData.append("description",description);
     formData.append("originalSize",file.size.toString());

     try {
      
      const response=await axios.post("/api/video-upload",formData);
      if(response.status!=200)
      {
        throw new Error("failed to upload video")
      }
     } catch (error:any) {
      console.log("failed to upload video",error)
     }finally
     {
      setIsUploading(false);
     }
  }
     return (
       <div className="container mx-auto p-4">
         <h1 className="text-2xl font-bold mb-4">Upload Video</h1>
         <form onSubmit={handleSubmit} className="space-y-4">
           <div>
             <label className="label">
               <span className="label-text">Title</span>
             </label>
             <input
               type="text"
               value={title}
               onChange={(e) => setTitle(e.target.value)}
               className="input input-bordered w-full"
               required
             />
           </div>
           <div>
             <label className="label">
               <span className="label-text">Description</span>
             </label>
             <textarea
               value={description}
               onChange={(e) => setDescription(e.target.value)}
               className="textarea textarea-bordered w-full"
             />
           </div>
           <div>
             <label className="label">
               <span className="label-text">Video File</span>
             </label>
             <input
               type="file"
               accept="video/*"
               onChange={(e) => setFile(e.target.files?.[0] || null)}
               className="file-input file-input-bordered w-full"
               required
             />
           </div>
           <button
             type="submit"
             className="btn btn-primary"
             disabled={isUploading}
           >
             {isUploading ? "Uploading..." : "Upload Video"}
           </button>
         </form>
       </div>
     );
}

export default VideoUpload