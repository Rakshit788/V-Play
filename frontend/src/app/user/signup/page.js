'use client'   
import React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux' 
import { registerUser } from '@/redux/authslice'
import { redirect } from 'next/navigation'
import Link from 'next/link'


const signUp = () => {
const {register ,  handleSubmit   ,  formState:{errors} } =  useForm() 
const dispatch = useDispatch()
const onSubmit = (data) => {
    dispatch(registerUser(data)) 
    redirect('/user/login')
}
    
return (
  <div className="flex items-center justify-center min-h-screen">   
    <div className="flex flex-col items-center justify-center w-[300px] h-[400px] border-gray-500 border-2 shadow-sm gap-3  p-6 rounded-lg"> 
      <h2 className="text-xl font-bold">SIGN UP</h2> 

      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="flex flex-col mb-3">
          <label htmlFor="name">Name</label>
          <input 
            id="name" 
            type="text" 
            {...register('name', { required: 'Name is required' })} 
            className="border p-2 rounded-md"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <div className="flex flex-col mb-3">
          <label htmlFor="email">Email</label>
          <input 
            id="email" 
            type="text" 
            {...register('email', { required: 'Email is required' })}  
            className="border p-2 rounded-md"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        <div className="flex flex-col mb-3">
          <label htmlFor="password">Password</label>
          <input 
            id="password" 
            type="password" 
            {...register('password', { required: 'Password is required' })} 
            className="border p-2 rounded-md"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">SIGN UP</button>  
      </form> 
       <span> Already have an account <Link href='/user/login' className='text-blue-600'> Login</Link> </span>
    </div>
  </div>
);
}

export default signUp
