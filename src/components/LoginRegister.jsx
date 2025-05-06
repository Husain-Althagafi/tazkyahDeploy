// src/components/LoginRegister.jsx with added social login functionality
import axios from "axios";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";
import "../styles/loginRegister.css";

const LoginRegister = () => {
  const [active, setActive] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ login: null, register: null });

  const navigate = useNavigate();
  const location = useLocation();
  const { success, error: toastError } = useToast();

  // Get return URL from location state or default to home
  const returnUrl = location.state?.returnUrl || "/";

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrors((prev) => ({ ...prev, login: null }));
    setLoading(true);

    try {
      // Validate input
      if (!loginData.email || !loginData.password) {
        throw new Error("Please fill in all fields");
      }

      // Submit login request
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        loginData
      );

      if (response.data.success) {
        // Store token
        localStorage.setItem("token", response.data.token);

        // Show success message
        success("Login successful!");

        // Redirect to appropriate page based on user role
        const userRole = response.data.user.role;
        if (userRole === "admin") {
          navigate("/admin-profile");
        } else if (userRole === "instructor") {
          navigate("/instructor-courses");
        } else {
          // For students or any other role, go to return URL or user profile
          navigate(returnUrl);
        }
      } else {
        throw new Error(response.data.error || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage =
        err.response?.data?.error || err.message || "Login failed";
      setErrors((prev) => ({ ...prev, login: errorMessage }));
      toastError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrors((prev) => ({ ...prev, register: null }));
    setLoading(true);

    try {
      // Validate input
      if (
        !registerData.firstName ||
        !registerData.lastName ||
        !registerData.email ||
        !registerData.password
      ) {
        throw new Error("Please fill in all required fields");
      }

      if (registerData.password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }

      // Submit registration request
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/register`,
        {
          firstName: registerData.firstName,
          lastName: registerData.lastName,
          email: registerData.email,
          password: registerData.password,
        }
      );

      if (response.data.success) {
        // Store token
        localStorage.setItem("token", response.data.token);

        // Show success message
        success("Registration successful! You are now logged in.");

        // Redirect to appropriate page
        navigate("/user-profile");
      } else {
        throw new Error(response.data.error || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      const errorMessage =
        err.response?.data?.error || err.message || "Registration failed";
      setErrors((prev) => ({ ...prev, register: errorMessage }));
      toastError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle social media authentication
  const handleSocialLogin = (provider) => {
    // Beyond the scope of SWE 363, could be implemented for the real client later.
    // This function handles social login redirection

    // In a real implementation, you'd need to:
    // 1. Set up OAuth endpoints on the backend for each provider
    // 2. Configure appropriate redirect URLs and authentication callbacks
    // 3. Handle tokens and user creation/linking on the backend

    // For now, we'll provide appropriate links to each provider's OAuth page
    // These URLs would typically point to your backend OAuth endpoints
    const oauthUrls = {
      google: "https://accounts.google.com/o/oauth2/v2/auth",
      facebook: "https://www.facebook.com/v11.0/dialog/oauth",
      github: "https://github.com/login/oauth/authorize",
      linkedin: "https://www.linkedin.com/oauth/v2/authorization",
    };

    // For demonstration purposes, we'll log what would happen and alert the user
    console.log(`Initiating ${provider} OAuth flow`);

    // In a real application, you would redirect to your backend endpoint like:
    // window.location.href = `${process.env.REACT_APP_API_URL}/auth/${provider}`;

    // Since we don't have the backend implementation yet, show an informative message
    alert(
      `Authenticating with ${provider}... \n\nIn a complete implementation, this would redirect to the ${provider} login page. This feature requires backend OAuth configuration.`
    );
  };

  return (
    <div className="login-register-wrapper">
      <div className={active ? "container active" : "container"}>
        {/* Login Form */}
        <div className="form-box login">
          <form onSubmit={handleLoginSubmit}>
            <h1>Login</h1>
            <div className="input-box">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={loginData.email}
                onChange={handleLoginChange}
                required
              />
              <i className="bx bxs-envelope"></i>
            </div>
            <div className="input-box">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={loginData.password}
                onChange={handleLoginChange}
                required
              />
              <i className="bx bxs-lock-alt"></i>
            </div>
            <div className="forgot-link">
              <a href="#forgot-password">Forgot Password?</a>
            </div>
            {errors.login && <div className="form-error">{errors.login}</div>}
            <button type="submit" className="btn" disabled={loading}>
              {loading && active === false ? "Logging in..." : "Login"}
            </button>
            <p>or login with social platforms</p>
            <div className="social-icons">
              {/* Updated social login links with proper OAuth handlers */}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleSocialLogin("google");
                }}
              >
                <i className="bx bxl-google"></i>
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleSocialLogin("facebook");
                }}
              >
                <i className="bx bxl-facebook"></i>
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleSocialLogin("github");
                }}
              >
                <i className="bx bxl-github"></i>
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleSocialLogin("linkedin");
                }}
              >
                <i className="bx bxl-linkedin"></i>
              </a>
            </div>
          </form>
        </div>

        {/* Register Form */}
        <div className="form-box register">
          <form onSubmit={handleRegisterSubmit}>
            <h1>Registration</h1>
            <div className="input-box">
              <input
                type="text"
                name="firstName"
                placeholder="First name"
                value={registerData.firstName}
                onChange={handleRegisterChange}
                required
              />
              <i className="bx bxs-user"></i>
            </div>
            <div className="input-box">
              <input
                type="text"
                name="lastName"
                placeholder="Last name"
                value={registerData.lastName}
                onChange={handleRegisterChange}
                required
              />
              <i className="bx bxs-user"></i>
            </div>
            <div className="input-box">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={registerData.email}
                onChange={handleRegisterChange}
                required
              />
              <i className="bx bxs-envelope"></i>
            </div>
            <div className="input-box">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={registerData.password}
                onChange={handleRegisterChange}
                required
              />
              <i className="bx bxs-lock-alt"></i>
            </div>
            {errors.register && (
              <div className="form-error">{errors.register}</div>
            )}
            <button type="submit" className="btn" disabled={loading}>
              {loading && active === true ? "Registering..." : "Register"}
            </button>
            <p>or register with social platforms</p>
            <div className="social-icons">
              {/* Updated social registration links with proper OAuth handlers */}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleSocialLogin("google");
                }}
              >
                <i className="bx bxl-google"></i>
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleSocialLogin("facebook");
                }}
              >
                <i className="bx bxl-facebook"></i>
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleSocialLogin("github");
                }}
              >
                <i className="bx bxl-github"></i>
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleSocialLogin("linkedin");
                }}
              >
                <i className="bx bxl-linkedin"></i>
              </a>
            </div>
          </form>
        </div>

        {/* Toggle Panels */}
        <div className="toggle-box">
          <div className="toggle-panel toggle-left">
            <h1>Hello, Welcome!</h1>
            <p>Don't have an account?</p>
            <button
              className="btn register-btn"
              onClick={() => setActive(true)}
              type="button"
            >
              Register
            </button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Welcome Back!</h1>
            <p>Already have an account?</p>
            <button
              className="btn login-btn"
              onClick={() => setActive(false)}
              type="button"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
