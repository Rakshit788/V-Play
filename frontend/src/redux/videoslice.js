'use client'
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import { actionAsyncStorage } from "next/dist/server/app-render/action-async-storage.external"
import toast from "react-hot-toast"


const initialstate = {
     subscribers: [],  // check rather to make it number or array  
     watch_history: [],
     liked_videos:  [],  // ✅ Load from Local Storage
  dislike_videos:   [], 
     playlist: [],
     myvideos: [],
     randomVideos: [],
     currentVideo : [] , 
     loading: false,
     error: null,
     sucess: null,





}

export const uploadVideo = createAsyncThunk('user/uploadVideo', async (formData, { rejectWithValue }) => {
     try {
          const { data } = await axios.post(
               'http://localhost:3001/api/v1/video/upload',
               formData,
               { withCredentials: true }


          );

          console.log('slsice', data);

          return data


     } catch (error) {
          console.log('upload error ', error);
          return rejectWithValue(error.respone.data)
     }
})






export const myvideos = createAsyncThunk('user/myvideos', async (_, { rejectWithValue }) => {
     try {
          const { data } = await axios.get('http://localhost:3001/api/v1/video/myvideos', { withCredentials: true })
          console.log('hi');

          console.log('myvideos', data);
          return data;
     } catch (error) {
          console.log('myvideos error', error);
          return rejectWithValue(error.response.data)
     }
})

export const randomVideos = createAsyncThunk('user/randomvideos', async (_, { rejectWithValue }) => {
     try {
          const { data } = await axios.get('http://localhost:3001/api/v1/video/random', { withCredentials: true })
          console.log('random videos', data);
          return data

     } catch (error) {
          console.log(error);
          return rejectWithValue(error.response.data)

     }
})


export  const videosdetals =  createAsyncThunk('video/detaills' ,  async (id , {rejectWithValue})=>{
       try {
           const {data} =  await  axios.get(`http://localhost:3001/api/v1/video/details/${id}` , {withCredentials: true})
           console.log('video details' ,  data) ;

           return data   ; 

       } catch (error) {
           console.log(error) ; 
           return rejectWithValue(error.response.data) ; 
          
       }
})




export const handleLikeDislike = createAsyncThunk(
  "user/like",
  async ({ id, action }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:3001/api/v1/video/${id}/${action}`,
        {},
        { withCredentials: true }
      );
      console.log(response);
      

      // ✅ Return only necessary data (exclude headers)
      return response.data;  
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);




const videoslice = createSlice({
     name: 'videoslice',
     initialState: initialstate,
     reducers: {},
     extraReducers: (builder) => {

          builder.addCase(uploadVideo.fulfilled, (state, action) => {
               state.myvideos.push(action.payload);
               toast.success('Video uploaded successfully')
               state.sucess = true


          })

          builder.addCase(uploadVideo.pending, () => {
               toast.loading('Uploading!!!')
               state.loading = true
               state.error = null

          })

          builder.addCase(uploadVideo.rejected, (state, acttion) => {
               toast.error('error while uploading  Please try again')
               state.error = true
               state.loading = false
               state.sucess = false
          })

          builder.addCase(myvideos.fulfilled, (state, action) => {
               state.myvideos = action.payload

          })

          builder.addCase(myvideos.rejected, (state, action) => {
               state.myvideos = null

          });

          builder.addCase(randomVideos.fulfilled, (state, action) => {
               state.randomVideos = action.payload?.videos;
          })
          builder.addCase(randomVideos.rejected, (state) => {
               state.randomVideos = [];
          });
          builder.addCase(videosdetals.fulfilled ,  (state , action)=>{
                state.currentVideo =  action.payload 

                if(!state.watch_history.includes(action.payload?._id)) state.watch_history.push(action.payload._id) ; 
          })

          builder.addCase(handleLikeDislike.fulfilled, (state, action) => {
               console.log(action.payload);
             
               const { id, action: handleld } = action.payload;
               console.log(handleld);
             
               if (handleld === "Like") {
                 console.log(state.liked_videos);
                 console.log(state.dislike_videos);
             
                 if (state.dislike_videos.includes(id)) {
                   state.dislike_videos = state.dislike_videos.filter((oid) => oid !== id);
                 }
             
                 if (!state.liked_videos.includes(id)) {
                   state.liked_videos.push(id);
                 }
             
               } else {
                 if (state.liked_videos.includes(id)) {
                   state.liked_videos = state.liked_videos.filter((oid) => oid !== id);
                 }
             
                 if (!state.dislike_videos.includes(id)) {
                   state.dislike_videos.push(id);
                 }
               }
             
               // ✅ Move localStorage update outside
               setTimeout(() => {
                 localStorage.setItem("disliked_videos", JSON.stringify(state.dislike_videos));
                 localStorage.setItem("liked_videos", JSON.stringify(state.liked_videos));
               }, 0);
             });
             
     }
})







export default videoslice.reducer


