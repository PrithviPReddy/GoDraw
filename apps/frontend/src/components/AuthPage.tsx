"use client";

import { HTTP_BACKEND } from "@/config";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AuthPage({ isSignin }: { isSignin: boolean }) {
  const router = useRouter();
  const [username , setUserName] = useState<string>("");
  const [password , setPassword] = useState<string>("");
  const [name , setName] = useState<string>("");
  
  
  
  const handleAuth = async () => {
    
    const endpoint = isSignin ? `${HTTP_BACKEND}/signin` : `${HTTP_BACKEND}/signup`

    if (username === "" || password === "" || name === ""){
      alert("please fill in the details")
      return
    }

    const body = {
      username: username,
      password: password,
      name: name,
    }


    try{
      const res = await axios.post(endpoint,body ,{
        headers:{
          "Content-Type" : "application/json",
        },
      })

      const token = res.data?.token

      localStorage.setItem("token", token)

      if (!isSignin) {router.push("/signin")}
      if (isSignin) {router.push("/create-room")}



    }catch(error : any){
        if (error.response) {
        alert(error.response.data?.message || "Authentication failed");
      } else {
        alert(error);
      }

    }

    
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gray-900">
      <div className="p-8 w-full max-w-sm bg-gray-800 rounded-xl shadow-xl border border-gray-700">
        <h1 className="text-2xl font-semibold text-gray-100 mb-6 text-center">
          {isSignin ? "Welcome Back" : "Create an Account"}
        </h1>

        <div className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Email"
            className="px-4 py-2 bg-gray-700 border border-gray-600 text-gray-200 placeholder-gray-400 
                       rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value = {username}
            onChange={(e) => setUserName(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="px-4 py-2 bg-gray-700 border border-gray-600 text-gray-200 placeholder-gray-400 
                       rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value = {password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="text"
            placeholder="Name"
            className="px-4 py-2 bg-gray-700 border border-gray-600 text-gray-200 placeholder-gray-400 
                       rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value = {name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <button
          onClick={handleAuth}
          className="mt-6 w-full py-2 bg-blue-600 text-white font-medium rounded-lg 
                     hover:bg-blue-700 transition-all"
        >
          {isSignin ? "Sign in" : "Sign up"}
        </button>

        {/* Navigation Links */}
        <p className="mt-6 text-center text-gray-400 text-sm">
          {isSignin ? (
            <>
              Don’t have an account?{" "}
              <button
                onClick={() => router.push("/signup")}
                className="text-cyan-400 hover:underline"
              >
                Create one
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => router.push("/signin")}
                className="text-cyan-400 hover:underline"
              >
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
