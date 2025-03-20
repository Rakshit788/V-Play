"use client";

import { Search, Home, ListVideo, History, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { randomVideos } from "@/redux/videoslice"; 
import VideoCard from "@/components/videocard";

export default function Header() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [logindetail, setLogindetail] = useState(null);

  const random = useSelector((state) => state.video.randomVideos);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem("isAuthenticated");
      try {
        setLogindetail(storedData ? JSON.parse(storedData) : null);
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
      }
    }

    dispatch(randomVideos());
  }, [dispatch]);

  const handleNavigation = () => {
    router.push(logindetail ? "/user/dashboard" : "/user/login");
  };

  return (
    <div className="flex h-full bg-black text-white">
      {/* Sidebar */}
      <aside className="w-[250px] hidden md:flex flex-col bg-gray-900 p-4 border-r border-gray-700">
        <h2 className="text-xl font-bold mb-4">Menu</h2>
        <nav className="space-y-3">
          <button className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded-lg w-full">
            <Home className="w-5 h-5" /> Home
          </button>
          <button className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded-lg w-full">
            <ListVideo className="w-5 h-5" /> My Playlist
          </button>
          <button className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded-lg w-full">
            <History className="w-5 h-5" /> Watch History
          </button>
          <button className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded-lg w-full">
            <Heart className="w-5 h-5" /> Liked Videos
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 p-6">
        {/* Header Section */}
        <div className="flex justify-between w-full items-center mb-6">
          <span className="font-bold text-2xl">Vplay</span>

          <div className="flex items-center border border-white rounded-full w-[600px] h-[40px] px-4">
            <Search className="text-white w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-transparent outline-none px-2 text-white"
            />
          </div>

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            onClick={handleNavigation}
          >
            {logindetail ? "Dashboard" : "Login"}
          </button>
        </div>

        {/* Video Grid Section */}
        <div className="w-full">
          <h2 className="text-xl font-semibold mb-4">Recommended Videos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {random?.length > 0 ? (
              random.map((video) => <VideoCard key={video._id} video={video} />)
            ) : (
              <p className="text-gray-400 text-center col-span-full">
                No videos found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
