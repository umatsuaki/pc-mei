import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
    palette: {
        primary: {
            main: "#00d4ff",
        },
    },
    breakpoints: {
        values: {
            // extra-small
            xs: 0,
            // small
            sm: 600,
            // medium
            md: 900,
            // large
            lg: 1020,
            // extra-large
            xl: 1536,
        },
    },
});
