import { useState } from "react";
import { Card, CardContent, Typography, Divider, Box } from "@mui/material";
import signinImage from "../assets/signin.png";
import googleLogo from "../assets/google.svg";
import CheckBox from "../components/checkBox";
import GoogleButton from "../components/googleButton";
import CustomButton from "../components/CustomButton";
import WelcomeText from "../components/welcomeText";
import FallingStars from "../components/fallingStars";
import InputField from "../components/InputField";
import "../style/signin.css";

const SigninPage = () => {
  const [checked, setChecked] = useState(false);

  // Google Button Click Handler
  const googleButton = () => {
    console.log("Sign In Google Button Clicked"); //[FOR DEBUGGING ONLY]
    // if(checked)
    // window.location.href = "http://localhost:8000/user/auth/google";
  };

  return (
    <div className="signin-container">
      {/* Add the stars effect */}
      <FallingStars />

      <div className="signin-image">
        <img src={signinImage} alt="Sign In" />
      </div>

      {/* Login card */}
      <Card className="signin-card">
        <CardContent>
          <WelcomeText />

          {/* Google Sign-In Button */}
          <div className="google-auth-button">
            <GoogleButton image={googleLogo} text="Sign in with NU mail" />
          </div>

          {/* OR Divider */}
          <Box display="flex" alignItems="center" my={2}>
            <Divider sx={{ flexGrow: 1, backgroundColor: "black" }} />
            <Typography sx={{ mx: 2, color: "black", fontWeight: "bold" }}>
              OR
            </Typography>
            <Divider sx={{ flexGrow: 1, backgroundColor: "black" }} />
          </Box>

          {/* Input Fields */}
          <InputField label="example@campus.nu.edu.pk" type="text" />
          <InputField label="password" type="password" />

          {/* Remember Me & Forgot Password */}
          <div className="signin-options">
            <CheckBox
              checked={checked}
              onChange={setChecked}
              label="Remember me"
            />
            <a href="/forgot-password" className="forgot-password">
              Forgot Password?
            </a>
          </div>

          {/* Login Button */}
          <CustomButton text="Login" textColor="#fff" buttonColor="#5D0EE7" />

          {/* Register Link */}
          <Typography
            variant="body2"
            className="register-link"
            sx={{ marginTop: "16px" }}
          >
            Don't have an account? <a href="sign up page">Register</a>
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default SigninPage;
