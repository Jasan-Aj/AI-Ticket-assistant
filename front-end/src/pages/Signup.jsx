import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';

function Signup() {
  const [form, setForm] = useState({email:"", password:"", confirmPassword:"", name:""});
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
    if(form.email === "" || form.password === "" || form.confirmPassword ==="" || form.name === ""){
      handleError("Fill all required fields");
      return false;
    }
    else if(form.password.length < 8){
      handleError("Minimum 8 characters required");
      return false;
    }
    else if(form.password !== form.confirmPassword){
      handleError("Passwords do not match");
      return false;
    }
    return true;
  }

  const handleSubmit = async(event)=>{
    event.preventDefault();
    const validateRes = validateInput();
    if(!validateRes) return;

    setloading(true);
    try{
      const res = await fetch(`${import.meta.env.VITE_URL}/auth/signup`,{
        method: "POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify(form)
      });

      if(res.ok){
        const jsonRes = await res.json(); // Fixed: added await and ()
        localStorage.setItem("token", jsonRes.data.token);
        localStorage.setItem("user", JSON.stringify(jsonRes.data.user));
        setForm({email: "", password:"", confirmPassword:"", name:""})
        navigate("/");
      } else {
        handleError("Registration failed");
      }
    } catch(error){
      handleError("Something went Wrong");
    } finally {
      setloading(false);
    } 
  }

  return (
    <div className='bg-white relative w-screen h-screen font-sans selection:bg-blue-100 overflow-y-auto'>

      {/* Neobrutalist Error Toast */}
      {error.state && (
        <div className='fixed top-6 right-6 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg px-6 py-4 z-50'>
            <p className='text-black font-black uppercase text-xs tracking-widest'>
              {error.message}
            </p>
        </div>
      )}

      <div className='flex justify-center min-h-screen items-center py-10 px-4'>
        <div className='bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-2xl w-full max-w-md overflow-hidden'>
          
          {/* Header */}
          <div className='bg-green-500 border-b-2 border-black py-6'>
            <h2 className='text-white text-3xl font-black text-center uppercase italic tracking-tighter'>
              Create Account
            </h2>
          </div>

          <form onSubmit={handleSubmit} className='p-6 space-y-4'>
            <div className='flex flex-col gap-1'>
              <label className='font-black uppercase text-[10px] tracking-widest text-slate-500 pl-1'>Full Name</label>
              <input 
                className='border-2 border-black rounded-xl p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-400 transition-all text-black font-bold' 
                onChange={handleChange} name='name' type="text" placeholder="John Doe"
              />
            </div>

            <div className='flex flex-col gap-1'>
              <label className='font-black uppercase text-[10px] tracking-widest text-slate-500 pl-1'>Email</label>
              <input 
                className='border-2 border-black rounded-xl p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-400 transition-all text-black font-bold' 
                onChange={handleChange} name='email' type="email" placeholder="john@example.com"
              />
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div className='flex flex-col gap-1'>
                <label className='font-black uppercase text-[10px] tracking-widest text-slate-500 pl-1'>Password</label>
                <input 
                  className='border-2 border-black rounded-xl p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-400 transition-all text-black font-bold' 
                  onChange={handleChange} name='password' type="password" placeholder="••••••••"
                />
              </div>

              <div className='flex flex-col gap-1'>
                <label className='font-black uppercase text-[10px] tracking-widest text-slate-500 pl-1'>Confirm</label>
                <input 
                  className='border-2 border-black rounded-xl p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-400 transition-all text-black font-bold' 
                  onChange={handleChange} name='confirmPassword' type="password" placeholder="••••••••"
                />
              </div>
            </div>

            <div className='pt-6'>
              <button 
                type='submit' 
                disabled={loading}
                className='bg-blue-600 border-2 border-black py-3.5 w-full font-black uppercase tracking-widest rounded-xl cursor-pointer transition-all active:translate-y-1 active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-blue-500 text-white'
              >
                {loading ? 'Processing...' : 'Register Now'}
              </button>
            </div>
          </form>

          <div className='bg-slate-50 border-t-2 border-black py-4 text-center'>
            <p className='text-black font-bold text-sm uppercase tracking-tighter'>
              Already a member? 
              <Link className='text-green-600 hover:underline pl-2' to={"/login"}>Login here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup