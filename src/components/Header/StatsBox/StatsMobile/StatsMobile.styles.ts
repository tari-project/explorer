import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";

export const Wrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(3),
  [theme.breakpoints.down("md")]: {
    flexWrap: "wrap",
    "& > *": {
      width: "45%",
    },
  },
  [theme.breakpoints.up("md")]: {
    flexDirection: "row",
    gap: theme.spacing(4),
    "& > *": {
      borderRight: `1px solid ${theme.palette.divider}`,
      paddingRight: theme.spacing(2),
    },
    "& > *:last-child": {
      borderRight: "none",
    },
  },
}));

export const StatsWrapperSml = styled(Box)(() => ({
  display: "flex",
  flexDirection: "row",
  gap: "16px",
  justifyContent: "space-between",
  alignItems: "flex-start",
  width: "100%",
  borderTop: "1px solid rgba(255, 255, 255, 0.1)",
  padding: "12px 6px",
  position: "sticky",
  bottom: "0",
  left: "0",
  right: "0",
  background: "rgba(29, 25, 40, 0.9)",
  backdropFilter: "blur(10px)",
  boxShadow: "0px -4px 20px rgba(0, 0, 0, 0.05)",
}));

export const StatsRowSml = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "4px",
  margin: "0 auto",
}));
