import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import type { User } from "../types";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    let user: User | null = null;

    if (username === "cust1" && password === "pass") {
      user = {
        id: "1",
        username,
        role: "CUSTOMER",
        cardNumber: "4123456789012345",
        customerName: "John Doe",
      };
    } else if (username === "admin" && password === "admin") {
      user = {
        id: "2",
        username,
        role: "ADMIN",
      };
    }

    if (!user) {
      setError("Invalid credentials");
      return;
    }

    sessionStorage.setItem("user", JSON.stringify(user));
    navigate(user.role === "ADMIN" ? "/admin" : "/customer");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
          <Typography variant="h4" gutterBottom align="center">
            🏦 Banking System POC
          </Typography>
          <Typography
            variant="body2"
            sx={{ mt: 2, mb: 3, textAlign: "center", color: "text.secondary" }}
          >
            Secure Transaction Processing
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError("");
            }}
            onKeyPress={handleKeyPress}
            sx={{ mt: 2 }}
            variant="outlined"
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            onKeyPress={handleKeyPress}
            sx={{ mt: 2 }}
            variant="outlined"
          />

          <Button
            fullWidth
            variant="contained"
            onClick={handleLogin}
            sx={{ mt: 3 }}
            size="large"
          >
            Login
          </Button>

          <Box sx={{ mt: 3, p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
              Demo Credentials:
            </Typography>
            <Typography variant="body2">
              <strong>Customer:</strong> cust1 / pass
            </Typography>
            <Typography variant="body2">
              <strong>Admin:</strong> admin / admin
            </Typography>
            <Typography variant="caption" sx={{ display: "block", mt: 1 }}>
              Card: 4123456789012345 | PIN: 1234
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
