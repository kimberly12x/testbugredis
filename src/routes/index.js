const express = require("express");
const router = express.Router();

const usersRouter = require("./users");
const creditCardRouter = require("./creditCard");
const airlinesRouter = require("./airlines");
const airportRouter = require("./airport");
const flightRouter = require("./flight");
const reviewRouter = require("./review");
const bookingRouter = require("./booking");

router

    .use("/users", usersRouter)
    .use("/creditCard", creditCardRouter)
    .use("/airlines", airlinesRouter)
    .use("/airport", airportRouter)
    .use("/flight", flightRouter)
    .use("/review", reviewRouter)
    .use("/booking", bookingRouter)

module.exports = router;
 