import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";

import BGImage from "../../assets/bg.svg";

type LayoutContext = {
  pageName: string;
  pageNameJP: string;
  imageUrl: string;
};

export const layoutContext = createContext<LayoutContext>({
  pageName: "",
  pageNameJP: "",
  imageUrl: "",
});
export const setLayoutContext = createContext<
  React.Dispatch<React.SetStateAction<LayoutContext>>
>(() => void 0);

export const LayoutProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [value, setValue] = useState<LayoutContext>({
    pageName: "",
    pageNameJP: "",
    imageUrl: "",
  });

  return (
    <layoutContext.Provider value={value}>
      <setLayoutContext.Provider value={setValue}>
        {children}
      </setLayoutContext.Provider>
    </layoutContext.Provider>
  );
};

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  const location = useLocation();
  const value = useContext(layoutContext);
  if (location.pathname === "/") return <>{children}</>;

  const theme = useTheme();

  return (
    <Box
      sx={{
        pt: "130px",
        pb: "250px",
        [theme.breakpoints.down("lg")]: {
          pt: "100px",
          pb: "145px",
        },
        backgroundImage: `url(${BGImage})`,
        backgroundSize: "cover",
      }}
    >
      <Box
        sx={{
          backgroundImage: `url(${value.imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "50%",
          width: "100%",
          height: "300px",
          [theme.breakpoints.down("lg")]: {
            height: "150px",
          },
        }}
      >
        <Box
          sx={{
            pt: "120px",
            pl: "120px",
            [theme.breakpoints.down("lg")]: { pt: "60px", pl: "32px" },
          }}
        >
          <Typography
            sx={{
              fontSize: "52px",
              lineHeight: "1",
              letterSpacing: "0.04em",
              color: "white",
              [theme.breakpoints.down("lg")]: { fontSize: "24px" },
            }}
          >
            {value.pageName}
          </Typography>
          <Typography
            sx={{
              fontSize: "13px",
              color: "primary.main",
              letterSpacing: "0.5em",
              [theme.breakpoints.down("lg")]: { fontSize: "11px" },
            }}
          >
            {value.pageNameJP}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          px: "130px",
          mt: "40px",
          maxWidth: "1020px",
          mx: "auto",
          [theme.breakpoints.down("lg")]: {
            px: "32px",
          },
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Link
            underline="none"
            component={RouterLink}
            to="/"
            sx={{ fontSize: "14px" }}
          >
            TOP
          </Link>
          <ArrowForwardIosRoundedIcon sx={{ height: "14px" }} />
          <Typography sx={{ fontSize: "14px" }}>{value.pageName}</Typography>
        </Stack>
        <Box
          sx={{
            mt: "100px",
            [theme.breakpoints.down("lg")]: { mt: "40px" },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
