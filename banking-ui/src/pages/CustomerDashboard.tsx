import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  TextField,
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
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import BalanceIcon from "@mui/icons-material/AccountBalance";
import { User, Transaction } from "../types";
import {
  submitTransaction,
  getBalance,
  getCustomerTransactions,
} from "../services/api";

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Top-up dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [topupAmount, setTopupAmount] = useState("");
  const [pin, setPin] = useState("");

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser) as User;
    if (parsedUser.role !== "CUSTOMER") {
      navigate("/login");
      return;
    }

    setUser(parsedUser);
    loadBalance(parsedUser.cardNumber!);
    loadTransactions(parsedUser.cardNumber!);
  }, [navigate]);

  const loadBalance = async (cardNumber: string) => {
    try {
      const data = await getBalance(cardNumber);
      if (data.exists) {
        setBalance(data.balance);
      }
    } catch (err) {
      console.error("Error loading balance:", err);
    }
  };

  const loadTransactions = async (cardNumber: string) => {
    try {
      const data = await getCustomerTransactions(cardNumber);
      setTransactions(data || []);
    } catch (err) {
      console.error("Error loading transactions:", err);
    }
  };

  const handleTopupClick = () => {
    setOpenDialog(true);
    setError("");
    setSuccess("");
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setTopupAmount("");
    setPin("");
  };

  const handleTopup = async () => {
    if (!topupAmount || !pin || !user?.cardNumber) {
      setError("Please enter amount and PIN");
      return;
    }

    if (parseFloat(topupAmount) <= 0) {
      setError("Amount must be greater than 0");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await submitTransaction({
        cardNumber: user.cardNumber,
        pin,
        amount: parseFloat(topupAmount),
        type: "topup",
      });

      if (response.status === "SUCCESS") {
        setSuccess(`Top-up of $${topupAmount} successful!`);
        handleCloseDialog();
        loadBalance(user.cardNumber);
        loadTransactions(user.cardNumber);
      } else {
        setError(response.message || "Transaction failed");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error processing transaction");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4">Welcome, {user.customerName || user.username}</Typography>
        <Button
          variant="outlined"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}

      {/* Balance Card */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <BalanceIcon sx={{ mr: 1, color: "primary.main" }} />
                <Typography color="textSecondary" gutterBottom>
                  Current Balance
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: "primary.main" }}>
                ${balance?.toFixed(2) || "0.00"}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, color: "textSecondary" }}>
                Card: {user.cardNumber}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Button
                fullWidth
                variant="contained"
                color="success"
                onClick={handleTopupClick}
                sx={{ mb: 2 }}
              >
                Top-up Account
              </Button>
              <Typography variant="body2" sx={{ color: "textSecondary" }}>
                Add funds to your account
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Transaction History */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Transaction History
        </Typography>
        {transactions.length === 0 ? (
          <Typography color="textSecondary">No transactions yet</Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell>Date</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Reason</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>
                      {new Date(tx.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          textTransform: "uppercase",
                          fontSize: "0.75rem",
                          fontWeight: "bold",
                          color:
                            tx.type === "topup" ? "green" : "red",
                        }}
                      >
                        {tx.type}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">${tx.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          color:
                            tx.status === "SUCCESS" ? "green" : "red",
                          fontWeight: "bold",
                        }}
                      >
                        {tx.status}
                      </Typography>
                    </TableCell>
                    <TableCell>{tx.reason}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Top-up Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Top-up Account</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Amount"
            type="number"
            value={topupAmount}
            onChange={(e) => setTopupAmount(e.target.value)}
            inputProps={{ step: "0.01", min: "0" }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="PIN"
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleTopup}
            variant="contained"
            disabled={loading}
          >
            {loading ? "Processing..." : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CustomerDashboard;
