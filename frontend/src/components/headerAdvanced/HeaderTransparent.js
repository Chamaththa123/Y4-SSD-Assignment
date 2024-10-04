import React, { useState, useEffect } from "react";
import "./HeaderAdvanced.scss";
import logo from '../../assets/imgs/hero-sec-image/logo.png';
import noData from '../../assets/imgs/error-displayers/no-data.png';
import { SlArrowDown } from 'react-icons/sl';
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../../contexts/NavigationContext";

const HeaderTransparent = () => {
	const navigate = useNavigate();
	const [visibility, setVisibility] = useState(false);
	const { token, setUser, setToken, user } = useStateContext();

	// Log status will depend on whether token is available or not
	const logStatus = Boolean(token);

	return (
		<div className="nav-container-header-adv-transparent">
			{/* this is for the company logo */}
			<div className="partition-nav-1">
				<img src={logo} alt="Company Logo" className="company-logo" />
				<span className="brand-text-header-adv">Central Pet Care111</span>
			</div>

			{/* this is for the link section */}
			<div className="partition-nav-2-header-adv">
				<span className="nav-links-header-advanced" onClick={() => navigate("/")}>Home</span>
				<span className="nav-links-header-advanced" onClick={() => navigate("/services")}>Services</span>
				<span className="nav-links-header-advanced" onClick={() => navigate("/store")}>Store</span>
				
				{/* If the user is not logged in, show Sign In/Sign Up buttons */}
				{!logStatus ? (
					<>

				<div className="partition-nav-3">
					<div className="nav-login-btn-header-advanced"onClick={()=>{
					navigate("/login")
				}}>SignUp/ SignIn</div>
				</div>
					</>
				) : (
					<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>{user.email}</b></span>
				)}
			</div>
		</div>
	);
};

export default HeaderTransparent;
