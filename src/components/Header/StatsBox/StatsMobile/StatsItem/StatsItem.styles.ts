import { styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";

export const StyledBox = styled(Box)({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: "8px",
  flex: 1,
});

export const ValueTypography = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "lowerCase",
})<{ lowerCase?: boolean }>(({ lowerCase }) => ({
  textTransform: lowerCase ? "lowercase" : "uppercase",
  fontSize: "11px",
  color: "#fff",
  fontWeight: "bold",
  lineHeight: "1.2",
}));

export const LabelTypography = styled(Typography)({
  fontSize: "11px",
  color: "#cacaca",
  lineHeight: "1.2",
});
