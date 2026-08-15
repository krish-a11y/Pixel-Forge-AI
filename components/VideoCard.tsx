import React, { useState } from 'react'
import {getCldImageUrl,getCldVideoUrl} from "next-cloudinary"
import {Download,Clock,FileDown,FileUp} from "lucide-react"
import dayjs from 'dayjs'
import  relativeTime from "dayjs/plugin/relativeTime"
import { filesize } from 'filesize'
import { Video } from '../types'


dayjs.extend(relativeTime)

interface VideoCardProps{
    video:Video,
    onDownload:(url:string,title:string)=>void;
}
const VideoCard:React.FC<VideoCardProps>=({video,onDownload})=> {

    const [isHovered,setHovered]=useState(false);
    const [previewError,setPreviewError]=useState(false);

    const getThumbnailUrl=(publicId:string)=>
    {
     return getCldImageUrl(
        {
            src:publicId,
            width:400,
            height:225,
            crop:"fill",
            gravity:"auto",
            format:"jpg",
            quality:"auto",
            assetType:"video"
        }
     )
    }
  return (
    <div>VideoCard</div>
  )
}

export default VideoCard