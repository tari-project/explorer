import { styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";

export const StyledBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 4,
  minWidth: "100px",
});

export const ValueTypography = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "lowerCase",
})<{ lowerCase?: boolean }>(({ lowerCase }) => ({
  textTransform: lowerCase ? "none" : "uppercase",
  fontFamily: "DrukHeavy",
  fontSize: "30px",
  color: "#fff",
  textAlign: "center",
  transition: "font-size 0.3s ease-in-out",
  lineHeight: "0.9",
}));

export const LabelTypography = styled(Typography)({
  fontSize: "11px",
  color: "#fff",
  textAlign: "center",
  lineHeight: "1.2",
});
