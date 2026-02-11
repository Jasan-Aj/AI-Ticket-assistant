import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function CheckAuth({children, protectedRoute}) {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  useEffect(()=>{
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if(protectedRoute){

      if(!token){
        navigate("/login")
      }
      else if(user.role === "admin"){
        navigate("/admin");
        setLoading(false);
      }
      else if(user.role === "moderator"){
        navigate("/moderator");
        setLoading(false);
      }
      else{
        navigate("/dashboard");
        setLoading(false);
      }
    }else{
      if(token){
        
        if(user.role == "admin"){
          navigate("/admin")
        }
        else if(user.role == "moderator"){
          navigate("/moderator")
        }else{
          navigate("/dashboard");
        }
        
      }else{
        setLoading(false)
      }
    }
  },[navigate, protectedRoute]);

  if(loading){
    return <>Loading...</>
  }
  return children;
}

export default CheckAuth