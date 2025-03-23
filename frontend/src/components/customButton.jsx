import { Button } from "@mui/material";

const CustomButton = ({ text, textColor, buttonColor, ...props }) => {
  return (
    <Button
      variant="contained"
      fullWidth
      sx={{
        color: textColor,
        backgroundColor: buttonColor,
        textTransform: "none", 
        fontFamily: "Poppins, sans-serif",
        "&:focus": { outline: "none" },
        "&:active": { outline: "none", boxShadow: "none" },
        "&:hover": { backgroundColor: buttonColor },
      }}
      {...props}
    >
      {text}
    </Button>
  );
};

export default CustomButton;
