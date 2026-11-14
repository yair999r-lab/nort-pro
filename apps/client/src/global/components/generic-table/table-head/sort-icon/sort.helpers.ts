import { SxProps } from "@mui/material";

export const getSortArrowSx = (isOrder: boolean): SxProps => ({
  fontSize: isOrder ? "25px" : "20px",
  cursor: "pointer",
  color: isOrder ? "#888888" : "#aaaaaa",
  transition: "0.3s",
  "&:hover": {
    color: "#70dbd4",
  },
});
