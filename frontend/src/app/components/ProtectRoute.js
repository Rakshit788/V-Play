'use client' 
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const ProtectRoute = ({children}) => {
    const [loading , setloading] =  useState(true);
  const router  =   useRouter() ; 
    useEffect(()=>{
           
         const loginDetail  =  JSON.parse(localStorage.getItem('isAuthenticated'));
         console.log('hi',loginDetail);
          
         if(!loginDetail)  router.push('/user/login'); 
         else setloading(false);
    }, [])
  
    if(loading)  return <div>loading...</div>
    return children
} 

export default ProtectRoute
