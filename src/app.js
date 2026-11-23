require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const globalErrorHandler = require("./middlewares/error");

const usersRouter = require("./modules/user/users.router");


const app = express();
app.set("trust proxy", 1);
//Security Middlewares
app.use(helmet());
const allowedOrigins = [
    "http://localhost:5173",
    "https://shop-co-webapp.vercel.app"
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));
app.use(express.json());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
const passport = require("passport");
require("./modules/user/passport");

app.use(passport.initialize());

const apiLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 100,
    message: {
        status: "fail",
        message: "Too many requests, try again later."
    },
    standardHeaders: true,
    legacyHeaders: false,
});
const authLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 5,
    message: "Too many login attempts, try again later"
});
//Routes
app.use(cookieParser());
app.use("/api", apiLimiter);
app.use("/api/v1/users/login", authLimiter);
app.use('/api/v1/users', usersRouter)


//Global Error Handler
app.use(globalErrorHandler);


module.exports = app;