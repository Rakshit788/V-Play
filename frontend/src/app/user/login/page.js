'use client'
import * as React from "react";
import { useDispatch  } from "react-redux";
import { useState  } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/redux/authslice";
import Link from "next/link";

export default function LoginPage() {
  const dispatch = useDispatch();
  
const router  =  useRouter() 

  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault(); // Prevent page reload

  

    try {
   
      const result = await dispatch(  loginUser({ email, password }));
  

  
      if (result.payload) {
   
        router.push("/");
      } else {
        console.error("Login failed:", result);
        setError("Invalid email or password.");
      }
    } catch (error) {
      console.log(error);
       
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center justify-center w-[300px] p-6 shadow-lg border border-gray-300 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Login</h2>

        <form onSubmit={onSubmit} className="w-full">
          <div className="flex flex-col mb-3">
            <label htmlFor="email" className="font-medium">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => { 
                console.log(e.target.value);
                setEmail(e.target.value) 
              
                
              }
              }
              className="border p-2 rounded-md"
              required
            />
          </div>

          <div className="flex flex-col mb-3">
            <label htmlFor="password" className="font-medium">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 rounded-md"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
            Login
          </button>
        </form>

        <div className="mt-4">
          <span className="text-sm">
            Don't have an account? <Link href="/user/signup" className="text-blue-600 hover:underline">Sign Up</Link>
          </span>
        </div>
      </div>
    </div>
  );
}
