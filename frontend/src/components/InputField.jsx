import { TextField, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";

const InputField = ({ label, type }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <TextField
      fullWidth
      label={label}
      type={type === "password" && !showPassword ? "password" : "text"}
      variant="outlined"
      margin="normal"
      sx={{
        backgroundColor: "#f0f0f0", // Light gray background
        fontFamily: "Poppins, sans-serif",
        "& .MuiInputBase-input": {
        //   color: "purple", // Text stays black
        },
        "& label": {
          color: "black", // Label stays black
        },
        "& label.Mui-focused": {
          color: "purple", // Label remains black when focused
        },
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: "black", // Default border color
          },
          "&:hover fieldset": {
            borderColor: "purple", // Black border on hover
          },
          "&.Mui-focused fieldset": {
            borderColor: "purple", // Black border when clicked
          },
        },
      }}
      InputProps={{
        endAdornment:
          type === "password" ? (
            <InputAdornment position="end">
              <IconButton onClick={handleClickShowPassword} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ) : null,
      }}
    />
  );
};

export default InputField;
