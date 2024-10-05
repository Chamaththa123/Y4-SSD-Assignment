import React, { useState,useEffect } from "react";
import "./header.scss";
import { SlArrowDown } from "react-icons/sl";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../../../contexts/NavigationContext";

const Header = () => {
  const navigate = useNavigate();
  const [visibility, setVisibility] = useState(false);

  const { token, setUser, setToken, user } = useStateContext();
  // const [userdata, setUser] = useState({});
  console.log("response", user)

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
  const logStatus = Boolean(token);

  return (
    <div className="nav-container">
      {/* this is for the company logo */}
      <div className="partition-nav-1">
        <img alt="" className="company-logo" />
        <span className="brand-text">Central Pet Care</span>
      </div>
      {/* this is for the link section */}
      <div className="partition-nav-2">
        <span
          className="nav-links"
          onClick={() => {
            navigate("/");
          }}
        >
          Home
        </span>
        {/* <span className="nav-links">About</span> */}
        <span
          className="nav-links"
          onClick={() => {
            navigate("/services");
          }}
        >
          Services
        </span>
        <span
          className="nav-links"
          onClick={() => {
            navigate("/store");
          }}
        >
          Store
        </span>

        {
  user && Object.keys(user).length > 0 ? (
    <>
      <span style={{ color: "white", fontWeight: "bold" }}>
        {user?.email}
      </span>
      <span onClick={logout}>Logout</span>
      <span>
        <img
          src={user?.image}
          style={{ width: "50px", borderRadius: "50%" }}
          alt=""
        />
      </span>
      {user?.role === 1 && <button onClick={() => navigate('/admin/delivery/add-driver')}>Admin</button>}

    </>
  ) : (
    <>
      {!logStatus ? (
        <div className="partition-nav-3">
          <div
            className="nav-login-btn-header-advanced"
            onClick={() => {
              navigate("/login");
            }}
          >
            SignUp/ SignIn
          </div>
        </div>
      ) : (
        <div className={`partition-nav-3 show`}>
          <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <b>{user?.email}</b>
          </span>
          <img
            src={user?.image || "https://i.pinimg.com/originals/86/63/78/866378ef5afbe8121b2bcd57aa4fb061.jpg"}
            alt=""
            className="profile-cpt-image"
          />
          <button
            className="drop-btn-header-adv"
            onClick={() => {
              setVisibility(!visibility);
            }}
          >
            <SlArrowDown className="arrow-header-adv" />
          </button>
          <div
            className={
              visibility ? `btn-section-header-adv` : `btn-section-header-adv hide`
            }
          >
            <span className="scroller-btns">Profile</span>
            <span
              className="scroller-btns"
              onClick={() => {
                navigate("/account/myOrders");
              }}
            >
              MyOrders
            </span>
            <span className="scroller-btns" onClick={logout}>Logout</span>
          </div>
        </div>
      )}
    </>
  )
}

        {/* <span className="nav-links">Contact</span> */}
      </div>
    </div>
  );
};

export default Header;
