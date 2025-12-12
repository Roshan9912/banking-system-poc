import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Button,
  Typography,
  Box,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import RefreshIcon from "@mui/icons-material/Refresh";
import { User, Transaction } from "../types";
import { getAllTransactions } from "../services/api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser) as User;
    if (parsedUser.role !== "ADMIN") {
      navigate("/login");
      return;
    }

    setUser(parsedUser);
    loadTransactions();
  }, [navigate]);

  const loadTransactions = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllTransactions();
      setTransactions(data || []);
    } catch (err) {
      setError("Failed to load transactions");
      console.error("Error loading transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  // Statistics
  const totalTransactions = transactions.length;
  const successfulTransactions = transactions.filter(
    (t) => t.status === "SUCCESS"
  ).length;
  const failedTransactions = transactions.filter(
    (t) => t.status === "FAILED"
  ).length;
  const totalWithdrawals = transactions
    .filter((t) => t.type === "withdraw" && t.status === "SUCCESS")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalTopups = transactions
    .filter((t) => t.type === "topup" && t.status === "SUCCESS")
    .reduce((sum, t) => sum + t.amount, 0);

  if (!user) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4">Admin Dashboard</Typography>
          <Typography variant="body2" color="textSecondary">
            User: {user.username}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadTransactions}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="outlined"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* Statistics */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(5, 1fr)" }, gap: 2, mb: 4 }}>
        {[
          { label: "Total Transactions", value: totalTransactions, color: "#2196F3" },
          { label: "Successful", value: successfulTransactions, color: "#4CAF50" },
          { label: "Failed", value: failedTransactions, color: "#F44336" },
          { label: "Total Withdrawals", value: `$${totalWithdrawals.toFixed(2)}`, color: "#FF9800" },
          { label: "Total Top-ups", value: `$${totalTopups.toFixed(2)}`, color: "#9C27B0" },
        ].map((stat, idx) => (
          <Paper key={idx} sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
              {stat.label}
            </Typography>
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", color: stat.color }}
            >
              {stat.value}
            </Typography>
          </Paper>
        ))}
      </Box>

      {/* Transactions Table */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          All Transactions
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : transactions.length === 0 ? (
          <Typography color="textSecondary">No transactions yet</Typography>
        ) : (
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell>ID</TableCell>
                  <TableCell>Customer Name</TableCell>
                  <TableCell>Card Number</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell>Timestamp</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>{tx.id}</TableCell>
                    <TableCell>{tx.customerName || "N/A"}</TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: "monospace",
                          fontSize: "0.85rem",
                        }}
                      >
                        {tx.cardNumber.replace(/(.{4})/g, "$1 ")}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          textTransform: "uppercase",
                          fontSize: "0.75rem",
                          fontWeight: "bold",
                          color:
                            tx.type === "topup"
                              ? "#4CAF50"
                              : "#FF9800",
                        }}
                      >
                        {tx.type}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        sx={{
                          fontWeight: "bold",
                          color:
                            tx.type === "topup"
                              ? "#4CAF50"
                              : "#FF9800",
                        }}
                      >
                        {tx.type === "topup" ? "+" : "-"}${tx.amount.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          color:
                            tx.status === "SUCCESS"
                              ? "#4CAF50"
                              : "#F44336",
                          fontWeight: "bold",
                          fontSize: "0.875rem",
                        }}
                      >
                        {tx.status}
                      </Typography>
                    </TableCell>
                    <TableCell>{tx.reason}</TableCell>
                    <TableCell sx={{ fontSize: "0.85rem" }}>
                      {new Date(tx.timestamp).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
};

export default AdminDashboard;
