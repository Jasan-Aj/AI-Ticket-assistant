import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';

function Login() {

  const [form, setForm] = useState({email:"", password:""});
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState({state: false, message: ""});

  const handleChange = (event) => {
    setForm({...form, [event.target.name]: event.target.value});
  }

  const handleError = (message)=>{
    setError({state:true, message});
    setTimeout(() => {
      setError({state:false, message:""})
    }, 3000);
  }

  const validateInput = ()=>{
    if(form.email == "" || form.password == ""){
      console.log(form.email, form.password, form.confirmPassword);
      handleError("Fill All Required Feilds");
      return false;
    }
    return true;
  }
    
  const handleSubmit = async(event)=>{
    event.preventDefault();
    const validateRes = validateInput();
    setloading(true);

    if(validateRes){
      try{
        const res = await fetch(`${import.meta.env.VITE_URL}/auth/login`,{
          method: "POST",
          headers:{
            "Content-Type":"application/json"
          },
          body: JSON.stringify(form)
        });

        if(res.ok){
          const jsonRes = res.json;
          localStorage.setItem("token",jsonRes.data.token);
          localStorage.setItem("user",JSON.stringify(jsonRes.data.user));
          setForm({email: "", password:""})
          navigate("/");
        }else{
          handleError("Failed login");
        }

      }catch(error){
        handleError("Something went Wrong");
      }
      finally{
        setloading(false);
      } 
    }
  }

  return (
    <div className='bg-gray-100 w-screen h-screen relative'>
      {
            error.state && (
            <div className='absolute bottom-6 right-6 bg-white shadow-lg border-l-4 border-red-500 rounded-lg px-4 py-4 z-10'>
                <p className='text-red-900 font-semibold'>
                {error.message}
                </p>
            </div>
            )
        }
      <div className='flex justify-center h-screen items-center'>
        <div className=' bg-white  border  border-b-3 border-r-3 rounded-lg'>
          <div className='text-black text-2xl font-semibold text-center py-4'>Login</div>
          <form onSubmit={handleSubmit}>
            <div className='px-4 pt-4 flex flex-col'>
              <label htmlFor="" className='text-black text-md'>Email</label>
              <input className='border-2 border-gray-500 rounded p-1 sm:w-sm text-black' onChange={(e)=>handleChange(e)} name='email' type="text"/>
            </div>

            <div className='px-4 pt-4 flex flex-col'>
              <label htmlFor="" className='text-black text-md'>Password</label>
              <input className='border-2 border-gray-500 rounded p-1 sm:w-sm text-black' onChange={(e)=>handleChange(e)} name='password' type="text"/>
            </div>

            <div className='py-5 flex justify-center px-4'>
              <button type='submit' className='bg-blue-700 py-2 w-full font-semibold rounded-lg cursor-pointer text-white'>Login</button>
            </div>
          </form>
          <div className='text-sm flex justify-center pt-1 pb-4'>
            <p className='text-black'>Dont have an account?</p>
            <Link className='text-blue-800 font-semibold pl-2 cursor-pointer' to={"/signup"} >Signup</Link>
          </div>
        </div>
       
      </div>
    </div>
  )
}

export default Login