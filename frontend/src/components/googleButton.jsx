import { Button } from "@mui/material";

function GoogleButton({ image, text }) {
  return (
    <Button
      variant="contained"
      startIcon={<img src={image} alt="Google" style={{ width: 30 }} />}
      sx={{
        py: 1.3,
        width: "100%",
        maxWidth: "350px",
        textTransform: "none",
        boxShadow: 5,
        backgroundColor: "#5D0EE7",
        "&:hover": { backgroundColor: "#4A0BBE" },
        "&:focus": { outline: "none", boxShadow: "none" },
      }}
    >
      {text}
    </Button>
  );
}

export default GoogleButton;
