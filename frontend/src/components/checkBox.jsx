import { Checkbox, Typography, Box } from "@mui/material";

function CheckBox({ checked, onChange, label }) {
  return (
    <Box display="flex" alignItems="center" justifyContent="center" marginTop={1}>
      <Checkbox
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        sx={{
          "& .MuiSvgIcon-root": { fontSize: 20, color: "black" },
          "&.Mui-checked .MuiSvgIcon-root": { fontSize: 20, color: "#5D0EE7" },
        }}
      />
      <Typography variant="body2" sx={{ cursor: "pointer" }} onClick={() => onChange(!checked)}>
        {label}
      </Typography>
    </Box>
  );
}

export default CheckBox;
