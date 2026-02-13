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
    if(form.email === "" || form.password === ""){
      handleError("Fill All Required Fields");
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
      const res = await fetch(`${import.meta.env.VITE_URL}/auth/sign-in`,{
        method: "POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify(form),
        credentials: "include"
      });

      if(res.ok){
        const jsonRes = await res.json();
        localStorage.setItem("token", jsonRes.data.token);
        localStorage.setItem("user", JSON.stringify(jsonRes.data.user));
        setForm({email: "", password:""});
        navigate("/");
      } else {
        handleError("Invalid Credentials");
      }
    } catch(error){
      handleError("Something went Wrong");
    } finally {
      setloading(false);
    } 
  }

  return (
    <div className='bg-white w-screen h-screen relative font-sans selection:bg-amber-200'>
      
      {/* Neobrutalist Error Toast */}
      {error.state && (
        <div className='fixed top-6 right-6 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg px-6 py-4 z-50 animate-in fade-in slide-in-from-top-4 duration-300'>
            <p className='text-black font-black uppercase text-xs tracking-widest flex items-center gap-2'>
              <span className='text-red-600 text-lg'>×</span> {error.message}
            </p>
        </div>
      )}

      <div className='flex justify-center h-screen items-center px-4'>
        <div className='bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-2xl w-full max-w-md overflow-hidden'>
          
          {/* Header */}
          <div className='bg-blue-500 border-b-2 border-black py-6'>
            <h2 className='text-white text-3xl font-black text-center uppercase italic tracking-tighter'>
              Welcome Back
            </h2>
          </div>

          <form onSubmit={handleSubmit} className='p-8'>
            <div className='space-y-6'>
              {/* Email Input */}
              <div className='flex flex-col gap-2'>
                <label className='font-black uppercase text-xs tracking-widest text-slate-700'>Email Address</label>
                <input 
                  className='border-2 border-black rounded-xl p-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-black font-bold' 
                  onChange={handleChange} 
                  name='email' 
                  type="email"
                  placeholder="name@company.com"
                  value={form.email}
                />
              </div>

              {/* Password Input */}
              <div className='flex flex-col gap-2'>
                <label className='font-black uppercase text-xs tracking-widest text-slate-700'>Password</label>
                <input 
                  className='border-2 border-black rounded-xl p-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-black font-bold' 
                  onChange={handleChange} 
                  name='password' 
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                />
              </div>
            </div>

            <div className='mt-10'>
              <button 
                type='submit' 
                disabled={loading}
                className={`group relative bg-amber-400 border-2 border-black py-4 w-full font-black uppercase tracking-widest rounded-xl cursor-pointer transition-all active:translate-y-1 active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-amber-300 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Authenticating...' : 'Sign In →'}
              </button>
            </div>
          </form>

          <div className='bg-slate-50 border-t-2 border-black py-4 text-center'>
            <p className='text-black font-bold text-sm uppercase tracking-tighter'>
              Don't have an account? 
              <Link className='text-blue-600 hover:underline pl-2' to={"/signup"}>Join the flow</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login