const express = require("express");
const instituteRouter = require("./routers/instituteRouter");
const boardRouter = require("./routers/boardRouter");
const mediumRouter = require("./routers/mediumRouter");
const sectionRoutes = require("./routers/sectionRouter");
const stdRouter = require("./routers/stdRouter");
const subjectRouter = require("./routers/subjectRouter");

const app = express();
app.use(express.json());

app.use("/api/v1/institute", instituteRouter);
app.use("/api/v1/institute", boardRouter);
app.use("/api/v1/institute", mediumRouter);
app.use("/api/v1/institute", sectionRoutes);
app.use("/api/v1/institute", stdRouter);
app.use("/api/v1/institute", subjectRouter);

module.exports = app;
