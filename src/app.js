const express = require("express");
const cors = require("cors");
const env = require("./config/env");
const errorMiddleware = require("./middlewares/error.middleware");

const authRoutes = require("./routes/auth.routes");
const usersRoutes = require("./routes/users.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const practicalClassesRoutes = require("./routes/practicalClasses.routes");
const theoryClassesRoutes = require("./routes/theoryClasses.routes");
const schedulingRoutes = require("./routes/scheduling.routes");
const adminRoutes = require("./routes/admin.routes");

const app = express();

app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "API CEA operativa" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/practical-classes", practicalClassesRoutes);
app.use("/api/theory-classes", theoryClassesRoutes);
app.use("/api/scheduling", schedulingRoutes);
app.use("/api/admin", adminRoutes);

app.use(errorMiddleware);

module.exports = app;