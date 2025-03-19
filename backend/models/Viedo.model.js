import mongoose, { Schema } from 'mongoose';

const VideoSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true, // Removes leading/trailing whitespace
        maxlength: 100 // Limit title length
    },
    description: {
        type: String,
        trim: true,
        maxlength: 1000 // Optional description length
    },
    videoUrl: {
        type: String,
        required: true // URL to the video file
    },
    thumbnailUrl: {
        type: String,
        required: true // URL to the video thumbnail
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Refers to the User model
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    likes: {
        type: [Schema.Types.ObjectId], // Array of user IDs who liked the video
        ref: 'User',
        default: []
    },
    dislikes: {
        type: [Schema.Types.ObjectId], // Array of user IDs who disliked the video
        ref: 'User',
        default: []
    },
    tags: {
        type: [String], // Tags for categorization
        default: []   ,  
        trim : true  ,  
    }   , 
    playlist : {
        type: [Schema.Types.ObjectId], // Array of video IDs
        ref: 'Playlist',
        default: []
    }   ,   
    viewers: { type: [String], default: [] }
  
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

VideoSchema.index({title: 'text', description: 'text', tags: 'text'})

const Videos  =   mongoose.model('Video', VideoSchema);

export  default  Videos
