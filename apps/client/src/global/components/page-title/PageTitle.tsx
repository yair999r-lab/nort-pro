import { Box, Typography } from "@mui/material";
import { CSSProperties, FC } from "react";

interface PageTitleProps {
  title: string;
  subtitle?: string;
  sx?: CSSProperties;
  fontSize?: string;
}

const PageTitle: FC<PageTitleProps> = ({
  title,
  subtitle,
  sx,
  fontSize = "30px",
}) => (
  <Box sx={sx}>
    <Typography
      sx={{
        textAlign: "center",
        fontSize: fontSize,
        fontWeight: "bold",
        color: "success.main",
      }}
    >
      {title}
    </Typography>
    {subtitle && (
      <Typography
        variant="body1"
        component="h2"
        color="success.main"
        textAlign="center"
        sx={{
          opacity: 0.8,
        }}
      >
        {subtitle}
      </Typography>
    )}
  </Box>
);

export default PageTitle;
