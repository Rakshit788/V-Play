import Videos from "../models/Viedo.model.js";
import  {validationResult}    from  "express-validator"
import uploadOnCloudinary from "../cloudinary.js";
import User from "../models/User.model.js";
import Playlist from "../models/playlistt.model.js";



export  const video_Uploader  =  async(req,res)=>{ 
              const errors  =  validationResult(req)   ; 
              console.log("hi");
                
              if(!errors.isEmpty()){
                return  res.status(400).json({errors: errors.array()}) 
              }
             const {title  ,  description ,   tags }   =  req.body  ;
            
                  
               
        try {
                 const user  =   await User.findById(req.user._id ) ; 
                  if(!user) return res.status(400).json({msg : "user is not logged in so cannot upload viedos"}) ; 
                 
                  
                 
                  const viedourl  =  req.files.video[0].path  ;   
                  const thumbnailurl  =  req.files.thumbnail[0].path ;

                  if(!viedourl || !thumbnailurl){
                    return res.json({msg : " erroR in req.file of video"}) ; 
                  }

                

                  
                  
    const Upload_video = await uploadOnCloudinary(viedourl)
    const video_url  =  Upload_video.secure_url
    const Upload_thumbnail = await uploadOnCloudinary(thumbnailurl)
     const thumbnail_url  =  Upload_thumbnail.url
  
    
                  
          if(!video_url || !thumbnail_url) {
            return res.status(400).json({msg : "error with cloudinary "})   ; 
          }
          console.log("after");
          

     
     
 
    
                  const viedo_obj  =  await  Videos.create({
                     title ,   
                     description   , 
                     owner : user._id   , 
                     videoUrl : video_url   , 
                     thumbnailUrl : thumbnail_url   , 
                     tags : tags  ? tags.split(",") : []   
                  })

                 

    
                if(!viedo_obj) return res.status(400).json({msg : "something went wrong wile  uploading viedo "})   ; 
                console.log(viedo_obj);

                user.viedos.push(viedo_obj._id)   ; 
                await user.save()   ; 

                
                 
    
                 return res.status(200).json({msg : "video uploaded sucessfull" , 
                          Viedo : viedo_obj }
                 )  
    
        } catch (error) {
              console.log(error);
              
            return res.status(400).json({msg : "something is wrong while uploading"})   ;  
        }

               
} 


  



export const handleLikeDislike = async (req, res) => {
  try {
    const videoId = req.params.id; // Extract video ID from params
    const userId = req?.user?._id; // Extract user ID
    const action = req.params.action; // Extract action (Like or Dislike)

    console.log({ videoId, userId, action }); // Debugging

    // Validate inputs
    if (!videoId || !userId || !action) {
      return res.status(400).json({ msg: "Error: Missing required fields." });
    }

    // Find the video in the database
    const video = await Videos.findById(videoId);
    if (!video) {
      return res.status(404).json({ msg: "Error: Video not found." });
    }

    // Handle actions
    if (action === "Like") {
      if (video.likes.includes(userId)) {
        // Remove user from likes if already liked
        video.likes = video.likes.filter((id) => id.toString() != userId.toString());
        console.log(video.likes);
        
      } else {
        // Add user to likes and ensure they are removed from dislikes
        video.likes.push(userId);
        video.dislikes = video.dislikes.filter((id) => id.toString() != userId.toString());
      }
    } else if (action === "Dislike") {
      if (video.dislikes.includes(userId)) {
        // Remove user from dislikes if already disliked
        video.dislikes = video.dislikes.filter((id) => id.toString() !== userId.toString());
      } else {
        // Add user to dislikes and ensure they are removed from likes
        video.dislikes.push(userId);
        video.likes = video.likes.filter((id) => id.toString() !== userId.toString());
      }
    } else {
      return res.status(400).json({ msg: "Error: Invalid action provided." });
    }

    // Save the updated video document
    await video.save();

    // Respond with updated like and dislike counts
    return res.json({
      msg: "Like/Dislike operation successful.",
      likes: video.likes.length,
      dislikes: video.dislikes.length,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Something went wrong with the Like/Dislike controller." });
  }
};


 export const deleteVideo  =  async (req  ,  res)=>{

        const {id}  =  req.params  ; 
        try {
          // Validate videoId
          if (!id) {
              return res.status(400).json({ msg: "Video ID is required." });
          }
  
          // Find the video in the database
          const video = await Videos.findById(id);
  
          if (!video) {
              return res.status(404).json({ msg: "Video not found." });
          }
  
          
          const userId = req.user?._id;
          if (!userId || video.owner.toString() !== userId.toString()) {
              return res.status(403).json({ msg: "You are not authorized to delete this video." });
          }

          const user  = await User.findById(userId)   ;
          if(!user){
            return res.status(400).json({msg : "user not found"})   ;
          }
          user.viedos =  user.viedos.filter((vid)=> vid.toString() !== id.toString())   ;
          await user.save({ validateModifiedOnly: true })   ;

           


  
          // Delete the video
          await Videos.findByIdAndDelete(id);
          if(Videos.findById(id)){
            return res.status(400).json({msg : "something is wrong with deleting video"})   ;
          }  
          return res.status(200).json({ msg: "Video deleted successfully." });
      } catch (error) {
          console.error("Error deleting video:", error);
          return res.status(500).json({ msg: "An error occurred while deleting the video." });
      }    
 }

 
 
 export const handleSubscribeUnsubscribe = async (req, res) => {
   try {
     const {action}  = req.query; 
     const w = req.user ;
     const watcher = w._id;
     const {videoId} = req.params;

     
     console.log(req.query);
     
     
     
 
     // Fetch video and owner
     const video = await Videos.findById(videoId).populate('owner'); // Assuming 'owner' is a populated field
     if (!video) {
       return res.status(404).json({ msg: "Video not found" });
     }
     const owner = video.owner;
 
     if (!watcher) {
       return res.status(400).json({ msg: "Please login to subscribe or unsubscribe." });
     }
 
     if (!action) {
       return res.status(400).json({ msg: "Action is required (subscribe or unsubscribe)." });
     }
     console.log("hi");
     
     // Subscribe or unsubscribe logic using atomic operations
     if (action === "subscribe") {
       await User.findByIdAndUpdate(
         owner._id,
         { $addToSet: { Subscribers: watcher } }, // Adds watcher to Subscribers if not already present
         { new: true }
       );
     } else if (action === "unsubscribe") {
       await User.findByIdAndUpdate(
         owner._id,
         { $pull: { Subscribers: watcher } }, // Removes watcher from Subscribers if present
         { new: true }
       );
     } else {
       return res.status(400).json({ msg: "Invalid" });
     }
 
     res.status(200).json({ msg: `Successfully ${action}` });
   } catch (error) {
   console.log(error);
   
     res.status(500).json({ msg: "An error occurred. Please try again later." });
   }
 };

 export const make_playlist = async (req, res) => {
  const { name, description, videos = [] } = req.body;
  const userId = req.user._id;

  console.log(req.body);
  

  try {
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ msg: "You are not authorized to make the playlist" });
    }

    
    if (!name || !description) {
      return res.status(400).json({ msg: "Please fill in the required details to make the playlist" });
    }

    // Check video count
    if (videos.length > 10) {
      return res.status(400).json({ msg: "Cannot add more than 10 videos in a playlist" });
    }

    // Validate video ownership
    if (videos.length > 0) {
      for (const vid of videos) {
        const vidDetail = await Videos.findById(vid);
        if (!vidDetail) {
          return res.status(400).json({ msg: `Video with ID ${vid} does not exist` });
        }
        if (vidDetail.owner.toString() !== userId.toString()) {
          return res.status(403).json({ msg: "You are not authorized to add videos you don't own to the playlist" });
        }
      }
    }  

    // Create playlist
    const playlist = await Playlist.create({
      name,
      description,
      owner: userId,
      videos,
    });
         user.playlists.push(playlist._id)   ;
         await  user.save()   ;
    if (!playlist) {
      return res.status(500).json({ msg: "Error while creating the playlist" });
    }

    return res.status(200).json({
      msg: "Playlist created successfully",
      playlist,
    });
  } catch (error) {
    console.error("Error in make_playlist:", error);
    return res.status(500).json({ msg: "An error occurred while making the playlist" });
  }
};


export const addVideoToPlaylist = async (req, res) => {
  try {
    const { playlistId, videoId } = req.body;  

    // Check if both playlistId and videoId are provided
    if (!playlistId || !videoId) {
      return res.status(400).json({ msg: "Playlist ID and Video ID are required." });
    }

    
    const playlist = await Playlist.findById(playlistId);

    // Check if the playlist exists
    if (!playlist) {
      return res.status(404).json({ msg: "Playlist not found." });
    }

    // Check if the user is the owner of the playlist
    if (playlist.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "You are not authorized to modify this playlist." });
    }

    // Validate video ownership
    const video = await Videos.findById(videoId);
    if (!video) {
      return res.status(404).json({ msg: "Video not found." });
    }
   
    if (!playlist.videos.includes(videoId)) {
      playlist.videos.push(videoId);
      await playlist.save();
    } else {
      return res.status(400).json({ msg: "Video already exists in the playlist." });
    }

    // Return success response
    res.status(200).json({ 
      msg: "Video added to playlist successfully.", 
      playlist 
    });

  } catch (error) {
    console.error("Error adding video to playlist:", error);
    res.status(500).json({ msg: "An error occurred while adding the video to the playlist." });
  }
};

export  const removePlaylist =  async(req,res)=>{
 try {
    const {playlistId  ,  videoId} =  req.body  
      if(!playlistId ,  !videoId) {
       return  res.status(400).json({msg: "please fill the required detais for removing video playlist"})   ; 
 
      }
 
        const  vid  =  await  Videos.findById(videoId)  ; 
        if(!vid){
         return res.json({msg: "something is wrong with the video id"})
        }
        const owner  =  vid.owner   ; 
        if(owner.toString() !== req.user._id.toString()) {
         return  res.json({msg : "u are not authorised to deleyte this video"})   ; 
        }
 
 
        const playlist =  await  Playlist.findById(playlistId) ; 
        if(!playlist) {
         return  res.json({msg : "playlist not found"})   ;   
          
        }
 await  playlist.updateOne({
   _id : playlistId  
 } , 
 {
   $pull : {
     videos : videoId
   }
 })
 
 await  playlist.save() ; 
 
 
 return res.status(200).json({ msg: "Video removed from playlist successfully" });      
 
 } catch (error) {
         console.log(error);
         return  res.status(400).json({msg : "something is wrong with remove playlist"})   ;
         
 }



}

// first make somme changes in db 
export const getPlaylists = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch playlists created by the user
    const playlists = await Playlist.find({ owner: userId });

    return res.status(200).json({ playlists });
  } catch (error) {
    console.error("Error fetching playlists:", error);
    return res.status(500).json({ msg: "An error occurred while fetching playlists." });
  }
};

export const getViedosOntags = async (req, res)=>{
   
     try {
        const {tag ,  search } =  req.query  ;
        if(!tag && !search){
          return res.status(400).json({msg : "please provide tag"})   ; 
        }     
        
        const video  =  []   ; 
        if(search) {
            video   =  await Videos.aggregate([
              { $match: { $text: { $search: search } } },
              {
                  $project: {
                      _id: 1,
                      title: 1,
                      description: 1,
                      videoUrl: 1,
                      thumbnailUrl: 1,
                      owner: 1,
                      views: 1,
                      likes: 1,
                      dislikes: 1,
                      tags: 1,
                      playlist: 1,
                      viewers: 1,
                      score: { $meta: "textScore" }
                  }
              },
              { $sort: { score: -1 } }
            ])
        }


         video  = await Videos.aggregate([
          {$match : {tags : {$regex: tag , $options:"i"}  }} , 
          {$unwind : "$tags"} , 
          { $match: { tags: { $regex: tag, $options: "i" } } }, 
          {
            $group: {
              _id: "$_id",
              title: { $first: "$title" },
              description: { $first: "$description" },
              videoUrl: { $first: "$videoUrl" },
              thumbnailUrl: { $first: "$thumbnailUrl" },
              owner: { $first: "$owner" },
              views: { $first: "$views" },
              likes: { $first: "$likes" },
              dislikes: { $first: "$dislikes" },
              tags: { $push: "$tags" },
              playlist: { $first: "$playlist" },
              viewers: { $first: "$viewers" },
            },
          } 

          
        ])
        if(video.length === 0){
          return res.status(404).json({msg : "no video found with this tag"})   ; 
        } 
        return res.status(200).json({video})   ;
      } catch (error) {
        console.log(error);
return  res.status(400).json({msg : "something is wrong with getViedosOntags"})   ;
     }
}

export  const addTowatchHistory =  async(req,res)=>{
         const  userId =  req.user._id ; 
         const {videoId} =  req.body  ; 

         if(!videoId){
           return res.status(400).json({msg : "please provide video id"})   ; 
         }

         if(!userId){
           return res.status(400).json({msg : "please login to get watch history"})   ; 
         }

          try {
              const user  =  await User.findById(userId)   ;
                const find  =  user.watchHistory.findIndex((vid)=> vid.video.toString() === videoId.toString())   ;
                if(find >-1){
                  user.watchHistory[find].watchedAt =  Date.now() ; 
                }else {
                    user.watchHistory.push({video: videoId ,  watchedAt: Date.now()})   ;
                }
                  return  res.status(400).json({msg: "video added to watchhistory sucessfully"})   ; 


           } catch (error) {
            console.log(error);
            return res.status(400).json({msg : "something is wrong with getwatchHistory"})   ;
          }
}

export const getwatchHistory = async (req, res) => {
  const userId = req.user._id;

  if (!userId) {
      return res.status(400).json({ msg: "Please login to get watch history" });
  }

  try {
      const user = await User.findById(userId);
      if (!user) {
          return res.status(400).json({ msg: "User not found" });
      }

      const result = await User.aggregate([
          { $match: { _id: user._id } },  // 🔹 Only fetch watch history for this user
          { $unwind: "$watchHistory" }, 
          {
              $lookup: {
                  from: "videos",  // 🔹 Correct lowercase collection name
                  localField: "watchHistory.video",
                  foreignField: "_id",
                  as: "videoDetails"
              }
          },
          { $unwind: "$videoDetails" },
          {
              $project: {
                  _id: "$watchHistory._id",
                  video: "$watchHistory.video",
                  watchedAt: "$watchHistory.watchedAt",
                  title: "$videoDetails.title",
                  description: "$videoDetails.description",
                  videoUrl: "$videoDetails.videoUrl",
                  thumbnailUrl: "$videoDetails.thumbnailUrl",
                  owner: "$videoDetails.owner",
                  views: "$videoDetails.views",
                  likes: "$videoDetails.likes",
                  dislikes: "$videoDetails.dislikes",
                  tags: "$videoDetails.tags",
                  playlist: "$videoDetails.playlist",
                  viewers: "$videoDetails.viewers",
              }
          }
      ]);

      return res.status(200).json(result);  // ✅ Send response

  } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "Internal server error" });
  }
};

export const getRandomVideos = async (req, res) => {
  console.log('hi');
  
  try {
      const randomvideos = await Videos.aggregate([
          { $sample: { size: 15 } },
          {
              $project: {
                  _id: 1,  // Ensure you're getting the actual _id
                  title: 1,
                  description: 1,
                  videoUrl: 1,
                  thumbnailUrl: 1,
                  owner: 1,
                  views: 1,
                  likes: 1,
                  dislikes: 1,
                  tags: 1,
                  playlist: 1,
                  viewers: 1
              }
          }
      ]);

      if (randomvideos.length === 0) {
          return res.status(404).json({ msg: "No videos found" });
      }

      return res.status(200).json({ videos: randomvideos, msg: "Here are some random videos" });

  } catch (error) {
      console.error("Error in fetching random videos:", error);
      return res.status(500).json({ error: "Internal server error" });
  }
};


export const getMyVideos = async (req, res) => {
    try {
         const userId  =  req.user._id ; 
          
         const myvid  = await  Videos.aggregate([
          {$match: {owner : userId}} , 
          {
            $project: {
                _id: 1,
                title: 1,
                description: 1,
                videoUrl: 1,
                thumbnailUrl: 1,
                owner: 1,
                views: 1,
                likes: 1,
                dislikes: 1,
                tags: 1,
                playlist: 1,
                viewers: 1
            } }
         ])

          if(myvid.length === 0){
            return res.status(404).json({msg : " you do not have any  videos"})   ; 
          }
          console.log('hi');
          

          return res.status(200).json({myvideos : myvid , msg: "here are your videos"})   ; 
    } catch (error) {
       console.log(error);
       
    }
}


export  const videoDetails =  async(req,res)=>{ 
   const {id} =  req.params  ; 
   const userId  =  req.user?._id || req.ip 


   try {
       const video  =  await  Videos.findById(id) ; 
       if(!video){
         return res.status(400).json({msg : "video not found"})   ; 
       }
       if(!video.viewers.includes(userId)){
        video.views +=  1
          video.viewers.push(userId)
          await  video.save()
     }
     
       return res.status(200).json({ message : "video is trackked and details are passed ",video})   ;

      
   } catch (error) {
      return 
   }
}


// put this in video detaills only   ; 

// export  const trackviews = async function (req  ,  res) {
 
//   const videoId  =  req.params.id ; 
//   const userId  =  req.user._id || req.ip  ; 
//   console.log(userId);
  
//   console.log(videoId);
//   ;
//   try {
//       const video  =  await Videos.findById(videoId)   ; 
//       if(!video) {
//         return res.status(400).json({msg : " video is not found in trackview "})   ; 
//       }

//       if(!video.viewers.includes(userId)){
//            video.views  += 1  ; 
//            video.viewers.push(userId)   ; 
//            await  video.save()   ; 
//       }
//       return res.status(200).json({msg : "view tracked"})   
//   } catch (error) {

//     return res.status(400).json({msg : "error in trackViews"})   ; 
//   }



// } 
















 








 











