// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");

// const connectDB = require("./config/db");

// dotenv.config();

// connectDB();

// const app = express();

// app.use(cors());
// app.use(express.json());

// app.use("/api/auth", require("./routes/authRoutes"));
// app.use("/api/questions", require("./routes/questionRoutes"));

// const questionRoutes = require("./routes/questionRoutes");

// // Mount the router at /api
// // app.use("/api", questionRoutes);

// const adminRoutes = require("./routes/admin")
// app.use("/api/admin", adminRoutes)


// app.get("/", (req, res) => {
//   res.send("Live Exam Portal Backend Running");
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


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
app.use("/api/questions", require("./routes/questionRoutes")); // For question list & default post
app.use("/api/admin", require("./routes/adminRoutes"));        // For admin-only routes

app.get("/", (req, res) => {
    console.log("/ route called in the server.js")
    res.send("Live Exam Portal Backend Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));