import { SxProps } from "@mui/material";

export const NOT_ROTATE_ICON: SxProps = {
  cursor: "pointer",
  transition: "0.3s",
  color: "#2db5ab",
  p: 0,
  ":hover": {
    color: "#70dbd4",
  },
};

export const ROTATE_ICON: SxProps = {
  color: "white",
  borderRadius: "50%",
  transition: "0.3s",
  p: 0,
  transform: "rotate(180deg)",
  transformOrigin: "center",
};
