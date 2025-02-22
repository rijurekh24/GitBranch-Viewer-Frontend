import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from "@mui/material";
import { GitHub as GitHubIcon } from "@mui/icons-material";

const Login = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleLogin = () => {
    setLoading(true);
    window.location.href = "http://localhost:5000/auth/github";
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor="#0C1017"
    >
      <Card
        sx={{
          width: 400,
          textAlign: "center",
          p: 3,
          boxShadow: 3,
          bgcolor: "#1E242C",
          borderRadius: 3,
        }}
      >
        <CardContent>
          <Typography variant="h4" gutterBottom>
            GitBranch Viewer
          </Typography>
          <Typography variant="body2" color="#aaa" sx={{ mb: 3 }}>
            Connect your GitHub account to explore your repositories and view
            their branches effortlessly.
          </Typography>

          <Button
            variant="contained"
            startIcon={!loading ? <GitHubIcon /> : null}
            onClick={handleLogin}
            disabled={loading}
            sx={{
              bgcolor: "#333",
              color: "white",
              "&:hover": { bgcolor: "#444" },
              width: "100%",
              py: 1.2,
              border: "none",
              boxShadow: 0,
              borderRadius: 3,
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "Login with GitHub"
            )}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
