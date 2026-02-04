import React, { useState } from 'react'
import {useNavigate} from "react-router-dom"

function Signup() {

  const [form, setForm] = useState({email: "", password: ""});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event)=>{
    setForm({...form, [event.target.name]: event.target.value})
  }

  const handleSubmit = async (event)=>{
    event.preventDefault();
    setLoading(true);

    try{
      const res = await fetch(`${import.meta.env.VITE_URL}/signup`,{
        method: "POST",
        headers: {
          "Content-Type":"application/json"
        },
        body: JSON.stringify(form)
      });

      const data = res.json;
      if(res.ok){
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/");
      }else{
        window.alert("Signup failed!")
      }
      
    }catch(error){
      window.alert("Something went wrong!")
    }
    finally{
      setLoading(false);
    }
  }

  return (
    <div>Signup</div>
  )
}

export default Signup