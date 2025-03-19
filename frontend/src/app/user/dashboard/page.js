'use client'
import React, { useActionState, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProtectRoute from '@/app/components/ProtectRoute';
import { getProfile, logoutUser } from '@/redux/authslice';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
    const [userdata, setUserdata] = useState({});
    const dispatch = useDispatch();
    const router  =  useRouter() ; 
    const data = JSON.parse(localStorage.getItem('user'));
  
    
     
     
    

    const handleLogout = async () => {
        console.log(localStorage.getItem('isAuthenticated'));
        const response = await dispatch(logoutUser());
     
        router.push('/');
    };

    useEffect(() => {
        const fetchData = async () => {
            const response = await dispatch(getProfile());
            setUserdata(response.payload);
          
        };
        fetchData();
    }, []);

    console.log(userdata);

    return (
        <ProtectRoute>
            <div className="min-h-screen flex">
                {/* Sidebar */}
                <aside className="w-64 h-screen p-6 flex flex-col bg-gray-800 border-r border-gray-700 shadow-md">
                    <h2 className="text-xl font-bold text-center mb-6 text-gray-300">
                        <Link href={'/'}>VPLAY</Link>
                    </h2>
                    <nav className="flex flex-col gap-4">
                        <button onClick={(e)=>{router.push('/video/myvideos')}} className="py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-md border border-gray-600">
                            My Videos
                        </button>
                        <button className="py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-md border border-gray-600">
                            Liked Videos
                        </button>
                        <button className="py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-md border border-gray-600">
                            Watch History
                        </button>
                        <button className="py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-md border border-gray-600">
                            My Playlist
                        </button>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6">
                    {/* Top Bar */}
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold text-gray-200">Dashboard</h1>
                        <div className="flex gap-4">
                            <button  onClick={()=>{router.push('/video/upload')}}className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md shadow-md">
                                Upload Video
                            </button>
                            <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md shadow-md" onClick={handleLogout}>
                                Sign Out
                            </button>
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="bg-gray-800 p-4 rounded-lg w-full max-w-md border border-gray-700">
                        <h2 className="text-lg font-semibold text-gray-300">{userdata?.name || data?.usersent?.name}</h2>
                        <p className="text-gray-400">{userdata?.email || data?.usersent.email}</p>
                        <p className="text-gray-400">Subscribers: {userdata?.subscribers || 0}</p>
                        <button className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md shadow-md">
                            Update Profile
                        </button>
                    </div>

                    {/* Video Content Placeholder */}
                    <div className="mt-6 bg-gray-800 p-6 rounded-lg border border-gray-700">
                        <p className="text-gray-400">Your videos will be displayed here...</p>
                    </div>
                </main>
            </div>
        </ProtectRoute>
    );
};

export default Dashboard;
