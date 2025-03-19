import mongoose ,  { Schema } from "mongoose";

const PlaylistSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100 // Limit playlist name length
    },
    description: {
        type: String,
        trim: true,
        maxlength: 1000 // Optional description for the playlist
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User', // The user who created the playlist
        required: true
    },
    videos: {
        type: [Schema.Types.ObjectId], // Array of video IDs
        ref: 'Video',
        default: []
    }
}, { timestamps: true }); 

const Playlist  =   mongoose.model('Playlist', PlaylistSchema); 
export  default  Playlist   ; 
