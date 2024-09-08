import React, { useContext, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { publicRequest } from "../../requestMethods";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import * as yup from "yup";

// Yup validation schema

const validationSchema = yup.object().shape({
  username: yup
    .string()
    .required("Please add username")
    .min(4, "Username must be at least 4 characters long")
    .max(16, "Username cannot be longer than 16 characters")
    .matches(
      /^[A-Za-z0-9 ]+$/,
      "Username must be alphanumeric and can contain spaces"
    ),
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Please add email"),
  password: yup
    .string()
    .required("Please add password")
    .min(8, "Password must be at least 8 characters long")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
      "Password must contain at least 8 characters, one letter and one number"
    ),
  repassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

function Signup() {
  const navigate = useNavigate();

  const { user, setUser } = useContext(UserContext);

  // set this state variable true if you want to display the error
  const [errorState, setErrorState] = useState(false);

  // password validator
  const [passwordValidator, setPasswordValidator] = useState({
    username: "",
    email: "",
    password: "",
    repassword: "",
  });

  const signUpFieldHandler = (e) => {
    setPasswordValidator({
      ...passwordValidator,
      [e.target.name]: e.target.value,
    });
  };

  const signupSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      // Validate input using Yup
      await validationSchema.validate(passwordValidator, { abortEarly: false });

      publicRequest
        .post("/users", {
          username: passwordValidator.username,
          email: passwordValidator.email,
          password: passwordValidator.password,
        })
        .then((res) => {
          if (res.status === 201) {
            setUser(res.data);
            navigate("/");
          }
        })
        .catch((err) => {
          toast.error(err.response.data.message);
        });
    } catch (validationErrors) {
      setErrorState(true);
      validationErrors.inner.forEach((error) => {
        toast.error(error.message);
      });
    }
  };

  return (
    <div className="signin-signup-cpt-frame">
      <form onSubmit={signupSubmitHandler}>
        {/* username container */}
        <div className="input-container-signin-signup">
          <span className="signin-signup-label">Username*</span>
          <input
            type="text"
            className="signin-signup-input-field"
            placeholder="Enter your username"
            name="username"
            value={passwordValidator.username}
            onChange={signUpFieldHandler}
            required
          />
        </div>
        {/* email container */}
        <div className="input-container-signin-signup">
          <span className="signin-signup-label">Email*</span>
          <input
            type="email"
            className="signin-signup-input-field"
            placeholder="Enter your email"
            name="email"
            value={passwordValidator.email}
            onChange={signUpFieldHandler}
            required
          />
        </div>
        {/* password container */}
        <div className="input-container-signin-signup">
          <span className="signin-signup-label">Password*</span>
          <input
            type="password"
            className="signin-signup-input-field"
            placeholder="Enter your password"
            name="password"
            value={passwordValidator.password}
            onChange={signUpFieldHandler}
            required
          />
        </div>
        {/* confirm password container */}
        <div className="input-container-signin-signup">
          <span className="signin-signup-label">Re-enter Password*</span>
          <input
            type="password"
            className="signin-signup-input-field"
            placeholder="Re-enter the password"
            name="repassword"
            value={passwordValidator.repassword}
            onChange={signUpFieldHandler}
            required
          />
        </div>
        {/* error message */}
        {errorState && (
          <span className="error-state-signin">
            Validation errors found. Please check your inputs!
          </span>
        )}
        <button type="submit" className="signin-signup-btn">
          Sign up
        </button>
      </form>
    </div>
  );
}

export default Signup;
