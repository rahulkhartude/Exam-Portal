
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");



const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

// Middleware
// app.use(cors());
app.use(cors({
  origin: "http://localhost:3000" // Only allow requests from this specific port
}));
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/questionRoutes"));      
app.get("/", (req, res) => {
    res.send("Live Exam Portal Backend Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));