import auth from "../middleware/auth.middleware.js";
import { uploadMultiple } from "../middleware/multer.middleware.js";
import { Router } from "express";
import { body } from "express-validator";
import { getMyVideos ,  video_Uploader , getRandomVideos, handleLikeDislike, handleSubscribeUnsubscribe,deleteVideo, make_playlist ,  addVideoToPlaylist ,  getViedosOntags , videoDetails}      from  "../controllers/Viedo.controller.js"

const videorouter  =  Router() ; 

videorouter.post("/upload" ,  auth , uploadMultiple , video_Uploader )


videorouter.post("/delete/:id", auth , deleteVideo ) ;



videorouter.post('/:videoId/subscribe', auth , handleSubscribeUnsubscribe ) ;

videorouter.post('/playlist/create', auth , make_playlist ) ;
videorouter.post('/playlist/add', auth , addVideoToPlaylist ) ;
videorouter.get('/playlist/search' ,  getViedosOntags) ; 

videorouter.post("/:id/:action", auth , handleLikeDislike ) ;

videorouter.get("/random" , getRandomVideos ) ; 


videorouter.get("/myvideos" ,  auth , getMyVideos ) ;

videorouter.get("/details/:id" , videoDetails ) ;
 








export  default  videorouter   ; 
