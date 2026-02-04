import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Login() {

  const [form, setForm] = useState({email:"", password:""});
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    setForm({...form, [event.target.name]: event.target.value});
  }

  const handleSubmit = async(event)=>{
    event.preventDefault();
    setloading(true);
    
    try{
      const res = await fetch(`${import.meta.env.VITE_URL}/login`,{
        method: "POST",
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify(form)
      });

      if(res.ok){
        const data = res.json;
        localStorage.setItem("token",data.token);
        localStorage.setItem("user",JSON.stringify(data.user));
        navigate("/");
      }else{
        window.alert("Failed login");
      }

    }catch(error){
      window.alert("Something went Wrong");
    }
    finally{
      setloading(false);
    }
  }

  return (
    <div className='bg-blue-100 w-screen h-screen'>
      <div className='flex justify-center h-screen items-center'>
        <div className='border-1 bg-white shadow shadow-blue-950 rounded rounded-lg'>
          <div className='text-black text-2xl font-semibold text-center'>Sign-up</div>
          <form action="">
            <div className='p-5'>
              <input className='border border-black rounded' type="text"/>
              <label htmlFor=""></label>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login