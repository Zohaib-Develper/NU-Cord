import { useState } from "react";
import { Box, Container, Paper, Typography, Divider } from "@mui/material";
import googleLogo from "../assets/google.svg";
import SignupImage from "../assets/signup.png";
import GoogleButton from "../components/googleButton";
import WelcomeText from "../components/welcomeText";
import CheckBox from "../components/checkBox";
import FallingStars from "../components/fallingStars";
import "../style/signup.css";

function SignupPage() {
  const [checked, setChecked] = useState(false);

  //  GoogleButton function
  const googleButton = () => {
    console.log("Sign Up Google Button Clicked "); //[FOR DEBUGGING ONLY]
    if (checked)
      window.location.href = "http://localhost:8000/user/auth/google";
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#5D0EE7",
        position: "relative",
        overflow: "hidden",
        padding: { xs: 2, md: 0 },
      }}
    >
      {/* Add the stars effect */}
      <FallingStars />

      <Container maxWidth="xs">
        <Paper
          elevation={6}
          sx={{
            height: { xs: "auto", md: 400 },
            padding: { xs: 3, md: 6 },
            borderRadius: 20,
            textAlign: "center",
            position: "relative",
          }}
        >
          {/* Welcome Text */}
          <WelcomeText />

          {/* Horizontal Line */}
          <Divider
            sx={{ backgroundColor: "black", width: "70%", mx: "auto", mt: 3.5 }}
          />

          {/* Google Signup Button */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <GoogleButton
              image={googleLogo}
              text="Sign up with NU mail"
              onClick={googleButton}
            />
          </Box>

          {/* Terms & Conditions Checkbox */}
          <CheckBox
            checked={checked}
            onChange={setChecked}
            label="Terms & Conditions"
          />
        </Paper>
      </Container>

      {/* Signup Image - Responsive */}
      <img
        src={SignupImage}
        alt="Signup Illustration"
        className="signup-image"
      />
    </Box>
  );
}

export default SignupPage;