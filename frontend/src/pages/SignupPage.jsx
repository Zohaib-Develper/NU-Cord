import { useState } from "react";
import {
  Box,
  Checkbox,
  Container,
  Paper,
  Typography,
  Divider,
} from "@mui/material";
import "../style/signup.css";
import googleLogo from "../assets/google.svg";
import SignupImage from "../assets/signup.png";
import GoogleButton from "../components/googleButton";
import WelcomeText from "../components/welcomeText"; 

function SignupPage() {
  const [checked, setChecked] = useState(false);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        width: "100vw",
        backgroundColor: "#5D0EE7",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={6}
          sx={{
            height: 400,
            padding: 6,
            borderRadius: 15,
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
            <GoogleButton image={googleLogo} text="Sign up with NU mail" />
          </Box>

          {/* Terms & Conditions */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            marginTop={1}
          >
            <Checkbox
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              sx={{
                "& .MuiSvgIcon-root": {
                  fontSize: 20,
                  color: "black",
                },
                "&.Mui-checked .MuiSvgIcon-root": {
                  fontSize: 20,
                  color: "#5D0EE7",
                },
              }}
            />

            <Typography
              variant="body2"
              sx={{ cursor: "pointer" }}
              onClick={() => setChecked(!checked)}
            >
              Terms & Conditions
            </Typography>
          </Box>
        </Paper>
      </Container>

      {/* Signup Image at the Bottom Right */}
      <img
        src={SignupImage}
        alt="Signup Illustration"
        className="signup-image"
      />
    </Box>
  );
}

export default SignupPage;
