"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ThumbsUp, Eye } from "lucide-react";

const VideoCard = ({ video }) => {
  const router = useRouter();

  return (
    <div 
      className="w-full max-w-[350px] bg-gradient-to-br from-gray-800 via-gray-900 to-black 
                 text-white p-3 rounded-xl shadow-lg cursor-pointer transition-all duration-300 
                 hover:scale-105 hover:shadow-2xl hover:bg-gray-800/80 backdrop-blur-md"
      onClick={() => router.push(`/watch/${video._id}`)}
    >
      {/* Video Thumbnail */}
      <div className="relative w-full h-[200px] rounded-xl overflow-hidden">
        <Image
          src={video.thumbnailUrl}
          alt={video.title}
          fill
          className="object-cover rounded-xl hover:opacity-90 transition-opacity duration-200"
        />
      </div>

      {/* Video Info */}
      <div className="mt-3 space-y-2">
        {/* Video Title */}
        <h2 className="text-white text-lg font-semibold truncate">
          {video.title}
        </h2>

        {/* Video Stats */}
        <div className="flex items-center justify-between text-gray-400 text-sm">
          <span className="flex items-center gap-1">
            <ThumbsUp className="w-4 h-4 text-blue-400" /> {video.likes} Likes
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4 text-green-400" /> {video.views} Views
          </span>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
