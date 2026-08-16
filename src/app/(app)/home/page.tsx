"use client"
import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import VideoCard from '../../../../components/VideoCard'
import { Video } from '../../../../types';
function Home() {
  // treacking the videos on the site
  const [videos,setVideos]=useState<Video[]>([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState(null);

  // getting all the videos from the DB
  const fetchVideos=useCallback(async()=>{

    try {
        const response=await axios.get("/api/videos");
        if(Array.isArray(response.data))
        {
          // setting the videos to the fetched videos
          setVideos(response.data);
        }
    } catch (error:any) {
     console.log(error);
     setError(error); 
    }
    // setting the loading to false as video fetch is completed
    finally
    {
     setLoading(false);
    }
  },[])

  useEffect(()=>{
    fetchVideos();
  },[fetchVideos])

  // downloading  the video
  const handleDownload = useCallback((url: string, title: string) => {
    // creating new element
    const link = document.createElement("a");
    // appending  the video link
    link.href = url;
    // as the user click the video open on new window
    link.setAttribute("target", "_blank");

    // tell the browser to download the video
    link.setAttribute("download", `${title}.mp4`);

    // appending the child to the DOM
    document.body.appendChild(link);

    // automatically clicking on the tag to start the doenload
    link.click();

    // removing the element as the download is over
    document.body.removeChild(link);
  }, []);

  if(loading)
  {
    return <div>Loading...</div>
  }
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Videos</h1>
      {videos.length === 0 ? (
        <div className="text-center text-lg text-gray-500">
          No videos available
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onDownload={handleDownload}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home