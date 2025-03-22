import { Typography } from "@mui/material";

function WelcomeText() {
  return (
    <>
      <Typography variant="h5" sx={{ fontFamily: "Poppins", color: "black" }}>
        Welcome to
      </Typography>
      <Typography
        variant="h4"
        fontWeight="800"
        sx={{ fontFamily: "Poppins", color: "#5D0EE7" }}
      >
        NU-Cord
      </Typography>
    </>
  );
}

export default WelcomeText;
