import React from "react";
import { Container, Typography, Divider } from "@mui/material";
import LoginForm from "./components/LoginForm";
import Preparation from "./components/Preparation";
import UpdateHistory from "./components/UpdateHistory";

const TopPage: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        PC Mei - TOPページ
      </Typography>
      <LoginForm />
      <Divider sx={{ my: 4 }} />
      <Preparation />
      <Divider sx={{ my: 4 }} />
      <UpdateHistory />
    </Container>
  );
}

export default TopPage;
