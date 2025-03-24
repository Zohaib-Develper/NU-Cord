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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checked, setChecked] = useState(false);

  const handleCredentialsLogin = async () => {
    console.log("Sign in button clicked"); //Debugging
    try {
      const response = await fetch("http://localhost:8000/user/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Login successful:", data);
        // Perform action with data.
      } else {
        console.error("Login failed:", data);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="signin-container">
      <FallingStars />

      <div className="signin-image">
        <img src={signinImage} alt="Sign In" />
      </div>

      <Card className="signin-card">
        <CardContent>
          <WelcomeText />

          <div className="google-auth-button">
            <GoogleButton image={googleLogo} text="Sign in with NU mail" />
          </div>

          <Box display="flex" alignItems="center" my={2}>
            <Divider sx={{ flexGrow: 1, backgroundColor: "black" }} />
            <Typography sx={{ mx: 2, color: "black", fontWeight: "bold" }}>
              OR
            </Typography>
            <Divider sx={{ flexGrow: 1, backgroundColor: "black" }} />
          </Box>

          {/* Input Fields */}
          <InputField
            label="example@campus.nu.edu.pk"
            type="text"
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputField
            label="password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />

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
          <CustomButton
            text="Login"
            textColor="#fff"
            buttonColor="#5D0EE7"
            onClick={handleCredentialsLogin}
          />

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
