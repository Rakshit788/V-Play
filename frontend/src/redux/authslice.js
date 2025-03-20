'use client '
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Toaster ,  toast } from 'react-hot-toast';

const initialState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false, 

 
};

// Async thunks for API calls
export const registerUser = createAsyncThunk('/auth/register', async (userData, { rejectWithValue }) => {
  try {
    console.log(userData);
    
    const { data } = await axios.post('http://localhost:3001/api/v1/user/register', userData);
    console.log(data);
    
    return data;
  } catch (err) {
    console.log(err);
    
    return rejectWithValue(err.response.data);
  }
});

export const loginUser = createAsyncThunk(
  "user/login",
  async (userData, { rejectWithValue }) => {
    try {
      console.log("Dispatching loginUser with:", userData);

      const { data } = await axios.post(
        "http://localhost:3001/api/v1/user/login",
        userData,
        { withCredentials: true } 
     
              );

              

      console.log("Login Success:", data);
      return data;
    } catch (err) {
     
      return rejectWithValue(err.response?.data || "An error occurred");
    }
  }
);


export const getProfile = createAsyncThunk('/auth/profile', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get("http://localhost:3001/api/v1/user/profile" , {withCredentials:true});
    return data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
try {
    await axios.get("http://localhost:3001/api/v1/user/logout",  { withCredentials: true });
    return null; 
} catch (error) {
    console.error("Logout Error:", error.response?.data || error.message);
    return error.response?.data || "An error occurred";
}
});


export const verifyAuth =  createAsyncThunk("auth/verifyAuth", async () => {
   try {
     const {data} =  await axios.get("http://localhost:3001/api/v1/user/verify", {withCredentials:true});
       console.log("verifyAuth", data);
        return data;
   } catch (error) {
     console.log("error", error);
     
   }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
       
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; 
        console.log('gg');
        
        state.isAuthenticated = true;  
        console.log('hi');
              
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));  
     localStorage.setItem('isAuthenticated', JSON.stringify(true));
     
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
         state.isAuthenticated = false;
        state.user = null;
        localStorage.removeItem('token', null);
        localStorage.removeItem('user', null);  
        localStorage.removeItem("isAuthenticated");
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export default authSlice.reducer;
