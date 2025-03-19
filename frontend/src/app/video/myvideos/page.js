"use client";
import { useSelector, useDispatch } from "react-redux";
import VideoCard from "@/components/VideoCard";
import { useEffect, useState } from "react";
import { myvideos } from "@/redux/videoslice";

const MyVideos = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.video);
  const [videosList, setVideosList] = useState([]);

  useEffect(() => {
    const dispatchMyVideos = async () => {
      const res = await dispatch(myvideos());
      setVideosList(res.payload.myvideos);
    };
    dispatchMyVideos();
  }, [dispatch]);

  return (
    <div className=" mx-auto p-6 min-h-screen text-white w-full">
      <div className=" p-4 rounded-lg shadow-lg backdrop-blur-md">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-200">
          My Videos
        </h1>

        {loading && (
          <p className="text-orange-400 text-lg text-center">Loading videos...</p>
        )}
        {error && (
          <p className="text-red-500 text-lg text-center">Error: {error}</p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
          {videosList.length > 0 ? (
            videosList.map((video) => <VideoCard key={video._id} video={video} />)
          ) : (
            !loading && (
              <p className="text-gray-400 text-center col-span-full">
                No videos found.
              </p>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default MyVideos;
