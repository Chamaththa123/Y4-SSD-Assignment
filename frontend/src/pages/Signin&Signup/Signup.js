import React, { useContext, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { publicRequest } from "../../requestMethods";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import validationSchema from "../../schemas/validationSchema";
import PasswordStrengthMeter from "../../components/PasswordStrengthMeter";
import PasswordRequirements from "../../components/PasswordRequirements";

function Signup() {
  const navigate = useNavigate();

  const { user, setUser } = useContext(UserContext);

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
    setPasswordValidator({
      ...passwordValidator,
      [e.target.name]: e.target.value,
    });

    const newPasswordRequirements = { ...passwordRequirements };
    const password = e.target.value;

    if (password.length >= 8) {
      newPasswordRequirements.minLength = true;
    } else {
      newPasswordRequirements.minLength = false;
    }

    if (password.match(/[a-z]/)) {
      newPasswordRequirements.lowercase = true;
    } else {
      newPasswordRequirements.lowercase = false;
    }

    if (password.match(/[A-Z]/)) {
      newPasswordRequirements.uppercase = true;
    } else {
      newPasswordRequirements.uppercase = false;
    }

    if (password.match(/[0-9]/)) {
      newPasswordRequirements.number = true;
    } else {
      newPasswordRequirements.number = false;
    }

    if (password.match(/[@$!%*?&]/)) {
      newPasswordRequirements.specialCharacter = true;
    } else {
      newPasswordRequirements.specialCharacter = false;
    }

    setPasswordRequirements(newPasswordRequirements);

    let strength = 0;
    if (password.length >= 8) {
      strength++;
    }
    if (password.match(/[a-z]/)) {
      strength++;
    }
    if (password.match(/[A-Z]/)) {
      strength++;
    }
    if (password.match(/[0-9]/)) {
      strength++;
    }
    if (password.match(/[@$!%*?&]/)) {
      strength++;
    }
    setPasswordStrength(strength);
  };

  const signupSubmitHandler = async (e) => {
    e.preventDefault();

    try {
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
          {/* Password Strength Meter */}
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