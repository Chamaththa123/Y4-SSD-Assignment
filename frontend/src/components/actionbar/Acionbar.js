import React, { useState,useEffect } from "react";
import {IoIosLogOut} from 'react-icons/io'
import './actionbar.scss'
import { useStateContext } from "../../contexts/NavigationContext";
import axios from "axios"

const Actionbar = () => {
  const { token, setUser, setToken, user } = useStateContext();

  const getUser = async () => {
    try {
        const response = await axios.get("http://localhost:8080/login/sucess", { withCredentials: true });

        setUser(response.data.user)
    } catch (error) {
        console.log("error", error)
    }
}

 // logoout
 const logout = ()=>{
  window.open("http://localhost:8080/logout","_self")
  setUser(null);
setToken(null);
}

useEffect(() => {
  getUser()
}, [])

  return (
    <div className="main-ribbon">
        <div className="inventory-management-text">
            Main Dashboard
        </div>

        <div className="user-details">
          <img className='user-image' src='https://pbs.twimg.com/media/FjU2lkcWYAgNG6d.jpg' alt="profile" />
          <div className="profile-details">
              <span className='username'>{user?.email}</span>
              <span className='designation'>Admin</span>
          </div>
          <button onClick={logout} className='logout-user'>
              Logout<IoIosLogOut className='logout-user-icon'/>
          </button>
        </div>
    </div>
  )
}

export default Actionbar