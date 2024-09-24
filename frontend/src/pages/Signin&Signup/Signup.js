import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../../components/PasswordStrengthMeter";
import PasswordRequirements from "../../components/PasswordRequirements";
import axiosClient from "../../axios-client";
import { useStateContext } from "../../contexts/NavigationContext.js";
import validationSchema from "../../schemas/validationSchema";

function Signup() {
  const navigate = useNavigate();
  const { setUser } = useStateContext();
  const [errorState, setErrorState] = useState(false);
  
  const [passwordValidator, setPasswordValidator] = useState({
    username: "",
    email: "",
    password: "",
    repassword: "",
  });

  const [passwordRequirements, setPasswordRequirements] = useState({
    lowercase: false,
    uppercase: false,
    number: false,
    specialCharacter: false,
    minLength: false,
  });

  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const signUpFieldHandler = (e) => {
    const { name, value } = e.target;
    setPasswordValidator({
      ...passwordValidator,
      [name]: value,
    });

    if (name === "password") {
      const newPasswordRequirements = { ...passwordRequirements };
      const password = value;

      newPasswordRequirements.minLength = password.length >= 8;
      newPasswordRequirements.lowercase = /[a-z]/.test(password);
      newPasswordRequirements.uppercase = /[A-Z]/.test(password);
      newPasswordRequirements.number = /[0-9]/.test(password);
      newPasswordRequirements.specialCharacter = /[@$!%*?&]/.test(password);

      setPasswordRequirements(newPasswordRequirements);

      let strength = 0;
      if (newPasswordRequirements.minLength) strength++;
      if (newPasswordRequirements.lowercase) strength++;
      if (newPasswordRequirements.uppercase) strength++;
      if (newPasswordRequirements.number) strength++;
      if (newPasswordRequirements.specialCharacter) strength++;

      setPasswordStrength(strength);
    }
  };

  const signupSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      // Validate the input data using validation schema
      await validationSchema.validate(passwordValidator, { abortEarly: false });

      // Check if password and repassword match
      if (passwordValidator.password !== passwordValidator.repassword) {
        toast.error("Passwords do not match!");
        return;
      }

      // Make an API request to register the user
      const response = await axiosClient.post("/users", {
        username: passwordValidator.username,
        email: passwordValidator.email,
        password: passwordValidator.password,
      });

      if (response.status === 201) {
        setUser(response.data);
        navigate("/");
        toast.success("Registration successful!");
      }
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
        {/* Username Input */}
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

        {/* Email Input */}
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

        {/* Password Input */}
        <div className="input-container-signin-signup">
          <span className="signin-signup-label">Password*</span>
          <input
            type="password"
            className="signin-signup-input-field"
            placeholder="Enter your password"
            name="password"
            value={passwordValidator.password}
            onChange={signUpFieldHandler}
            onFocus={() => setIsPasswordFocused(true)}
            onBlur={() => setIsPasswordFocused(false)}
            required
          />
          <PasswordStrengthMeter passwordStrength={passwordStrength} />
        </div>

        {/* Password Requirements */}
        {isPasswordFocused && (
          <PasswordRequirements passwordRequirements={passwordRequirements} />
        )}

        {/* Confirm Password Input */}
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
