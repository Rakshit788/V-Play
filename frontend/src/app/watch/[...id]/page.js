"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { videosdetals } from "@/redux/videoslice";
import { handleLikeDislike } from "@/redux/videoslice"; 


import Image from "next/image";

const VideoDetails = () => {
  const params = useParams();
  const dispatch = useDispatch();
 



  
  
 const [liked_videos , setliked_videos] =  useState(JSON.parse(localStorage.getItem('liked_videos') )) ;
 const [disliked_videos , sedistliked_videos] =  useState(JSON.parse(localStorage.getItem('dislike_videos') ))
  const [video, setVideo] = useState(null);
  const [similarVideos, setSimilarVideos] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

 

  useEffect(() => {
    if (!params?.id) return;

    const fetchVideo = async () => {
      try {
        const data = await dispatch(videosdetals(params.id)).unwrap();
    
        
        setVideo(data?.video);
        setComments(data.comments || []);

      
      } catch (error) {
        console.error("Error fetching video details:", error);
      }
    };

    fetchVideo();
  }, [params.id, dispatch]);

  
  const handleLike = async () => {
    try {
      await dispatch(handleLikeDislike({ id: params.id, action:'Like' }));
      const lv  =  JSON.parse(localStorage.getItem('liked_videos') )
      setliked_videos(lv)
      // console.log(liked_videos, 'l');
      // console.log(disliked_videos)
      setLiked(true);
      setDisliked(false); // Reset dislike when liking
    } catch (error) {
      console.error("Error liking video:", error);
    }
  };

  const handleDislike = async () => {
    try {
      await dispatch(handleLikeDislike({ id: params.id, action: "Dislike" }));
      const dl  =  localStorage.getItem('dislike_videos')
      sedistliked_videos(dl)
      // console.log(liked_videos);
      // console.log(disliked_videos, 'd')
      
      setDisliked(true);
      setLiked(false); // Reset like when disliking
    } catch (error) {
      console.error("Error disliking video:", error);
    }
  };

 

  const handleSubscribe = () => {
    setSubscribed(!subscribed);
  };

//   const handleAddComment = async () => {
//     if (!newComment.trim()) return;

//     // Simulate API call to add comment
//     setComments([...comments, { text: newComment, id: Date.now() }]);
//     setNewComment("");
//   };

  if (!video) return <div className="text-white text-center mt-10">Loading...</div>;

  return (
    <div className="flex flex-col md:flex-row h-screen bg-black text-white">
      {/* Video Player Section */}
      <div className="w-full md:w-3/4 p-4">
        <video src={video.videoUrl} controls className="w-full h-[70vh] rounded-lg shadow-lg" />
        <h1 className="text-2xl font-bold mt-3">{video.title}</h1>

        {/* Like, Dislike & Subscribe Buttons */}
        <div className="flex gap-4 mt-4">
          <button
            className={`px-4 py-2 rounded-lg ${
              liked ? "bg-green-600" : "bg-gray-700"
            } hover:bg-green-700`}
            onClick={()=>{handleLike()}}
          >
            👍 Like
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              disliked ? "bg-red-600" : "bg-gray-700"
            } hover:bg-red-700`}
            onClick={handleDislike}
          >
            👎 Dislike
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              subscribed ? "bg-blue-600" : "bg-gray-700"
            } hover:bg-blue-700`}
            onClick={handleSubscribe}
          >
            {subscribed ? "Subscribed ✅" : "Subscribe"}
          </button>
        </div>

        {/* Video Description */}
        <p className="mt-4 text-gray-300">{video.description}</p>

        {/* Comments Section */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Comments</h2>
          <div className="mt-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-2 rounded-lg bg-gray-800 border border-gray-600"
              placeholder="Add a comment..."
            />
            <button
              
              className="mt-2 px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600"
            >
              Comment
            </button>
          </div>
          <div className="mt-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <p key={comment.id} className="text-gray-400 mt-2">
                  {comment.text}
                </p>
              ))
            ) : (
              <p className="text-gray-400">No comments yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Similar Videos Section */}
      <div className="w-full md:w-1/4 p-4 border-l border-gray-700">
        <h2 className="text-xl font-semibold mb-3">Similar Videos</h2>
        {similarVideos.length ? (
          similarVideos.map((vid) => (
            <div key={vid._id} className="flex gap-2 mb-3">
              <Image src={vid.thumbnailUrl} alt="thumbnail" width={100} height={60} className="rounded-lg" />
              <div>
                <h3 className="text-sm font-bold">{vid.title}</h3>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No similar videos found.</p>
        )}
      </div>
    </div>
  );
};

export default VideoDetails;
