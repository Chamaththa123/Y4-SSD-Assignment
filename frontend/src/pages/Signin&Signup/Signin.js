import { useRef, useState } from "react";
import { publicRequest } from "../../requestMethods";
import { useNavigate } from "react-router-dom";
import "./SigninSignupStyles.scss";
import axiosClient from "../../axios-client";
import { useStateContext } from "../../contexts/NavigationContext.js";

function Signin() {
  const { setUser, setToken } = useStateContext();
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();
  const emailRef = useRef();
  const passwordRef = useRef();

  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });

  const validate = (loginData) => {
    const errors = {};
    if (!loginData.email) {
      errors.email = "Email is required";
    } else if (!loginData.email.includes("@")) {
      errors.email = "Enter a valid Email address";
    }
    if (!loginData.password) {
      errors.password = "Password is required";
    }
    setFormErrors(errors);
    return errors;
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const loginData = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    const validationErrors = validate(loginData);

    if (Object.keys(validationErrors).length === 0) {
      axiosClient
        .post("/users/login", loginData)
        .then(({ data }) => {
          setUser(data.user);
          console.log("tokn", data.token);
          setToken(data.token);
          console.log("User and token set successfully");
          navigate("/");
        })
        .catch(({ response }) => {
          console.log(response.message);
          if (response && response.status === 400) {
            setAlertMessage("Invalid Email or Password");
            setShowAlert(true);
          } else if (response && response.status === 429) {
            setAlertMessage("Too many login attempts, please try again later.");
            setShowAlert(true);
          } else if (response && response.status === 403) {
            const lockMessage =
              response.data?.message ||
              "Your account is locked. Please try again later.";
            setAlertMessage(lockMessage);
            setShowAlert(true);
          } else {
            setAlertMessage(response?.data.error || "An error occurred");
            setShowAlert(true);
          }
        });
    }
  };

  return (
    <div className="signin-signup-cpt-frame">
      <form onSubmit={handleLogin}>
        {/* email container */}
        <div className="input-container-signin-signup">
          <span className="signin-signup-label">Email*</span>
          <input
            type="email"
            className="signin-signup-input-field"
            placeholder="Enter your email"
            ref={emailRef}
          />
          {formErrors.email && (
            <span style={{ fontSize: "13px", color: "red" }}>
              {formErrors.email}
            </span>
          )}
        </div>

        {/* password container */}
        <div className="input-container-signin-signup">
          <span className="signin-signup-label">Password*</span>
          <input
            type="password"
            className="signin-signup-input-field"
            placeholder="Enter your password"
            ref={passwordRef}
          />
          {formErrors.password && (
            <span style={{ fontSize: "13px", color: "red" }}>
              {formErrors.password}
            </span>
          )}
        </div>
        {/* error message */}
        {showAlert && (
          <div style={{ fontSize: "13px", color: "red" }}>{alertMessage}</div>
        )}
        <button type="submit" className="signin-signup-btn">
          Sign in
        </button>
      </form>
    </div>
  );
}

export default Signin;
