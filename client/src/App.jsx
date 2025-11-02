import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import PageLoader from './components/PageLOader'
import SingupPage from './pages/SingupPage'
import LoginPage from './pages/LoginPage'
import ImagePage from './pages/ImagePage'
import { useauthStore } from './store/useauthstore'



const App = () => {
  const {authUser,isCheckingAuth,checkauth}=useauthStore()

  useEffect(()=>{
    checkauth()
  },[checkauth])

  console.log("auth user",authUser);

  if(isCheckingAuth) return <PageLoader/>
  
  return (
    <div className='min-h-screen relative flex items-center justify-center p-4 overflow-hidden text-black'>
      <Routes>
        <Route path='/' element={authUser ? <ImagePage /> : <Navigate to={"/login"}/>}/>
        <Route path="/singup" element={<SingupPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route/>
      </Routes>
    </div>
  )
}

export default App