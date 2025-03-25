import { TextField, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";

const InputField = ({ label, type, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  return (
    <TextField
      fullWidth
      label={label}
      type={type === "password" && !showPassword ? "password" : "text"}
      variant="outlined"
      margin="normal"
      onChange={onChange}
      sx={{
        backgroundColor: "#f0f0f0",
        fontFamily: "Poppins, sans-serif",
        "& .MuiInputBase-root": { backgroundColor: "#f0f0f0" },
        "& .MuiInputBase-input": { color: "black" },
        "& label": { color: "purple" },
        "& label.Mui-focused": { color: "purple" },
        "& .MuiOutlinedInput-root": {
          "& fieldset": { borderColor: "purple" },
          "&:hover fieldset": { borderColor: "purple" },
          "&.Mui-focused fieldset": { borderColor: "purple" },
        },
        "& input:-webkit-autofill": {
          backgroundColor: "#f0f0f0 !important",
          color: "black !important",
          WebkitBoxShadow: "0 0 0px 1000px #f0f0f0 inset !important",
          WebkitTextFillColor: "black !important",
        },
      }}
      slotProps={{
        input: {
          endAdornment:
            type === "password" ? (
              <InputAdornment position="end">
                <IconButton
                  onClick={togglePasswordVisibility}
                  edge="end"
                  sx={{
                    color: "black",
                    "&:hover": { color: "purple" },
                    "&:focus": { outline: "none" },
                  }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ) : null,
        },
      }}
    />
  );
};

export default InputField;
