'use client'
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authslice.js';  // Import default reducer
import videoreducer from './videoslice.js'

export const store = configureStore({
  reducer: {
    auth: authReducer, 
     video : videoreducer
  },
});
