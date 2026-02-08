import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function CheckAuth({children, protectedRoute}) {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  useEffect(()=>{
    const token = localStorage.getItem("token");
    if(protectedRoute){
      if(!token){
        navigate("/login")
      }else{
        setLoading(false)
      }
    }else{
      if(token){
        if(token.user.role == "admin"){
          navigate("/admin")
        }
        else if(token.user.role == "moderator"){
          navigate("/admin")
        }else{
          navigate("/");
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