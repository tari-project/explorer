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

export const StatsMobileContainer = styled(Box)(() => ({
  position: "sticky",
  bottom: "0",
  left: "0",
  right: "0",
  zIndex: 10,
}));

export const StatsWrapperSml = styled(Box)(() => ({
  display: "flex",
  flexDirection: "row",
  gap: "4px",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  padding: "12px 6px",
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

export const ToggleContainer = styled(Box)(() => ({
  position: "relative",
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  marginRight: "0px",
}));

export const ToggleButton = styled(Box)(() => ({
  position: "absolute",
  top: "-48px",
  right: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "40px",
  height: "40px",
  background: "rgba(29, 25, 40, 0.9)",
  backdropFilter: "blur(10px)",
  borderRadius: "50%",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  cursor: "pointer",
  transition: "all 0.2s ease-in-out",
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.2)",
  },
}));

export const ToggleIcon = styled(Box)(() => ({
  color: "#fff",
  fontSize: "18px",
}));
