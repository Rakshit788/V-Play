"use client";
import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { uploadVideo } from "@/redux/videoslice";
import { useRouter } from "next/navigation";
import { throttle } from "lodash";
import { useSelector } from "react-redux";


const Uploadpage = () => {
    const [videoFile, setVideoFile] = useState(null);
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState(false);

    const dispatch = useDispatch();
    const router = useRouter();
    

    const resetForm = () => {
        setVideoFile(null);
        setThumbnailFile(null);
        setThumbnailPreview("");
        setTitle("");
        setDescription("");
        setTags("");
    };

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) setVideoFile(file);
    };

    const throttledUpload = throttle(async (dispatch, formData, setIsUploading, setUploadError, router, resetForm) => {
        setIsUploading(true);
        try {
            const data = await dispatch(uploadVideo(formData));
            console.log("Upload successful", data);
            
            if (data?.payload?._id) {
                resetForm();
                router.push("/video/upload");
            } 
            
        } catch (error) {
            console.error("Upload failed", error);
            setUploadError(true);
            
            
        } finally {
            setIsUploading(false);
        }
    }, 3000);

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnailFile(file);
            setThumbnailPreview(URL.createObjectURL(file));
        }
    };

    const handleUpload = useCallback(
        async (e) => {
            e.preventDefault();
            if (!videoFile || !title) {
                setUploadError("Please select a video and enter a title.");
                return;
            }

            const tagArray = tags.split(",").map((tag) => tag.trim());

            const formData = new FormData();
            formData.append("video", videoFile);
            formData.append("thumbnail", thumbnailFile);
            formData.append("title", title);
            formData.append("description", description);
            formData.append("tags", JSON.stringify(tagArray));

            throttledUpload(dispatch, formData, setIsUploading, setUploadError, router, resetForm);
        },
        [dispatch, videoFile, thumbnailFile, title, description, tags, router]
    );

    return (
        <div className="max-w-lg mx-auto p-6 bg-gray-900 shadow-xl rounded-lg border border-gray-700 text-white">
            <h2 className="text-2xl font-bold mb-4 text-center text-blue-400">
                {uploadError ? "Upload Failed" : "Upload Video"}
            </h2>

            {uploadError && (
                <div className="text-center">
                    <p className="text-red-400 mb-4">{uploadError}</p>
                    <button
                        onClick={() => setUploadError("")}
                        className="w-full p-3 bg-red-600 text-white rounded hover:bg-red-500 transition"
                    >
                        Retry
                    </button>
                </div>
            )}

            {!uploadError && (
                <form onSubmit={handleUpload} className="space-y-4">
                    <input type="file" accept="video/*" id="videoInput" className="hidden" onChange={handleVideoChange} />
                    <label htmlFor="videoInput" className="block w-full p-3 bg-gray-800 border border-gray-600 rounded text-center cursor-pointer hover:bg-gray-700 transition">
                        {videoFile ? videoFile.name : "Select Video"}
                    </label>

                    <input type="file" accept="image/*" id="thumbnailInput" className="hidden" onChange={handleThumbnailChange} />
                    <label htmlFor="thumbnailInput" className="block w-full p-3 bg-gray-800 border border-gray-600 rounded text-center cursor-pointer hover:bg-gray-700 transition">
                        {thumbnailFile ? thumbnailFile.name : "Select Thumbnail"}
                    </label>

                    {thumbnailPreview && <img src={thumbnailPreview} alt="Thumbnail Preview" className="w-full h-40 object-cover rounded mt-2 border border-gray-600" />}

                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        rows="3"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Tags (comma-separated)"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />

                    <button type="submit" className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-500 transition duration-300" disabled={isUploading}>
                        {isUploading ? "Uploading..." : "Upload VIDEO"}
                    </button>
                </form>
            )}
        </div>
    );
};

export default Uploadpage;
