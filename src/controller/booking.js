const { v4: uuidv4 } = require("uuid");
const bookingModel = require("../models/booking");
const flightModel = require("../models/flight");
const createError = require("http-errors");
const responseHelper = require("../helper/responseHelper");
// const client = require('../config/redis')
const usersModel = require("../models/users");

const bwipjs = require("bwip-js");

const crypto = require("crypto");
// const { authenticateGoogle, uploadToGoogleDrive, deleteFromGoogleDrive, uploadToGoogleDriveQR } = require("../middlewares/GoogleCloudServices");

const bookingController = {
  getPaginationBooking: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const search = req.query.search;
      let querysearch = "";
      if (search === undefined) {
        querysearch = `inner join users on booking.users_id = users.id 
                                inner join flight on booking.flight_id = flight.id 
                                inner join airlines on flight.airlines_id = airlines.id  
                                inner join airport as airport_depature on flight.airport_depature = airport_depature.id 
                                inner join airport as airport_arrive on flight.airport_arrive = airport_arrive.id 
                `;
      } else {
        querysearch = `inner join users on booking.users_id = users.id 
                                inner join flight on booking.flight_id = flight.id 
                                inner join airlines on flight.airlines_id = airlines.id  
                                inner join airport as airport_depature on flight.airport_depature = airport_depature.id 
                                inner join airport as airport_arrive on flight.airport_arrive = airport_arrive.id 
                                where users.name ilike '\%${search}\%' `;
      }

      const totalData = parseInt((await bookingModel.selectAllSearchCount(querysearch)).rows[0].count);
      const sortby = "booking." + (req.query.sortby || "created_on");
      const sort = req.query.sort || "desc";
      const result = await bookingModel.selectPaginationBooking({ limit, offset, sortby, sort, querysearch });
      const totalPage = Math.ceil(totalData / limit);
      const pagination = {
        currentPage: page,
        limit: limit,
        totalData: totalData,
        totalPage: totalPage,
      };
      responseHelper(res, result.rows, 200, null, pagination);
    } catch (error) {
      console.log(error);
      res.send(createError(404));
    }
  },
  getBooking: async (req, res) => {
    try {
      const id = req.params.id;

      const checkbooking = await bookingModel.selectBooking(id);

      try {
        if (checkbooking.rowCount == 0) throw "Booking has not found";
      } catch (error) {
        return responseHelper(res, null, 404, error);
      }

      const result = checkbooking;
      // client.setEx(`transaction/${id}`, 60 * 60, JSON.stringify(result.rows))
      responseHelper(res, result.rows, 200, null);
    } catch (error) {
      res.send(createError(404));
    }
  },
  insertBooking: async (req, res) => {
    try {

      const role = req.payload.role;

      try {
        if (role != "user" && role != "super-user") throw "You're Cannot Access this feature";
      } catch (error) {
        return responseHelper(res, null, 404, error);
      }
      
      const id = uuidv4().toLocaleLowerCase();

      const {
        booking_fullname,
        booking_email,
        booking_phone,

        trip_status,

        users_id,
        flight_id,

        payment_midtrans_snap_token,
        payment_discount,

        passenger_count,
        passenger_title_1,
        passenger_fullname_1,
        passenger_nationality_1,
        passenger_title_2,
        passenger_fullname_2,
        passenger_nationality_2,
        passenger_title_3,
        passenger_fullname_3,
        passenger_nationality_3,
        passenger_title_4,
        passenger_fullname_4,
        passenger_nationality_4,
        passenger_title_5,
        passenger_fullname_5,
        passenger_nationality_5,
        passenger_title_6,
        passenger_fullname_6,
        passenger_nationality_6,
      } = req.body;

      const checkUsers = await bookingModel.selectUsers(users_id);

      try {
        if (checkUsers.rowCount == 0) throw "Users has not found";
      } catch (error) {
        return responseHelper(res, null, 404, error);
      }

      const checkFlight = await flightModel.selectFlight(flight_id);

      try {
        if (checkFlight.rowCount == 0) throw "Flight has not found";
      } catch (error) {
        return responseHelper(res, null, 404, error);
      }

      try {
        if (passenger_count == "" || passenger_count == "0" || passenger_count == "null" || passenger_count == undefined) throw "Passenger must include";
      } catch (error) {
        return responseHelper(res, null, 404, error);
      }

      try {
        if (trip_status == "one_way" && trip_status == "rounded_trip") throw "Trip only One-Way and Rounded-Trip";
      } catch (error) {
        return responseHelper(res, null, 404, error);
      }

      const booking_status = "pending";

      const payment_status = "pending";

      let payment_total;

      const price = parseInt(checkFlight.rows[0].price);

      const flightCapacity = parseInt(checkFlight.rows[0].capacity);

      if (flightCapacity < passenger_count) {
        return responseHelper(res, null, 404, `Only available ${flightCapacity} seat on this Flight`);
      }

      const trip_depature = checkFlight.rows[0].depature;

      let trip_arrive = ``;
      let setPaymentDiscount;

      if (payment_discount == "" || payment_discount == "0" || payment_discount == "null" || payment_discount == undefined) {
        setPaymentDiscount = 0;
      } else if (payment_discount != "" || payment_discount != "0" || payment_discount != "null" || payment_discount != undefined) {
        setPaymentDiscount = payment_discount;
      }

      if (trip_status == "one_way") {
        payment_total = price * parseInt(passenger_count) - setPaymentDiscount;
      } else if (trip_status == "rounded_trip") {
        payment_total = 2 * (price * parseInt(passenger_count)) - setPaymentDiscount;
        trip_arrive = checkFlight.rows[0].depature;
      }

      const id_users_verification = uuidv4().toLocaleLowerCase();
      const token = `${payment_midtrans_snap_token}_${id}_${crypto.randomBytes(16).toString("hex")}`;

      await usersModel.createUsersVerification(id_users_verification, users_id, token);

      await bookingModel.insertBooking(
        id,
        booking_fullname,
        booking_email,
        booking_phone,
        booking_status,

        trip_status,
        trip_depature,
        trip_arrive,

        users_id,
        flight_id,

        payment_status,
        setPaymentDiscount,
        payment_total,
        payment_midtrans_snap_token,

        passenger_count,
        passenger_title_1,
        passenger_fullname_1,
        passenger_nationality_1,
        passenger_title_2,
        passenger_fullname_2,
        passenger_nationality_2,
        passenger_title_3,
        passenger_fullname_3,
        passenger_nationality_3,
        passenger_title_4,
        passenger_fullname_4,
        passenger_nationality_4,
        passenger_title_5,
        passenger_fullname_5,
        passenger_nationality_5,
        passenger_title_6,
        passenger_fullname_6,
        passenger_nationality_6
      );

      responseHelper(res, null, 201, "New Booking Added");
    } catch (error) {
      console.log(error);
      res.send(createError(400));
    }
  },
  updateBookingAdmin: async (req, res) => {
    try {
      const id = req.params.id;

      const role = req.payload.role;

      try {
        if (role != "admin" && role != "super-user") throw "You're Cannot Access this feature";
      } catch (error) {
        return responseHelper(res, null, 404, error);
      }



      const {
        booking_fullname,
        booking_email,
        booking_phone,
        booking_status,
        trip_status,

        users_id,
        flight_id,

        payment_midtrans_snap_token,
        payment_discount,
        payment_status,

        passenger_count,
        passenger_title_1,
        passenger_fullname_1,
        passenger_nationality_1,
        passenger_title_2,
        passenger_fullname_2,
        passenger_nationality_2,
        passenger_title_3,
        passenger_fullname_3,
        passenger_nationality_3,
        passenger_title_4,
        passenger_fullname_4,
        passenger_nationality_4,
        passenger_title_5,
        passenger_fullname_5,
        passenger_nationality_5,
        passenger_title_6,
        passenger_fullname_6,
        passenger_nationality_6,
      } = req.body;

      const checkUsers = await bookingModel.selectUsers(users_id);

      try {
        if (checkUsers.rowCount == 0) throw "Users has not found";
      } catch (error) {
        return responseHelper(res, null, 404, error);
      }

      const checkFlight = await flightModel.selectFlight(flight_id);

      try {
        if (checkFlight.rowCount == 0) throw "Flight has not found";
      } catch (error) {
        return responseHelper(res, null, 404, error);
      }

      try {
        if (passenger_count == "" || passenger_count == "0" || passenger_count == "null" || passenger_count == undefined) throw "Passenger must include";
      } catch (error) {
        return responseHelper(res, null, 404, error);
      }

      try {
        if (trip_status == "one_way" && trip_status == "rounded_trip") throw "Trip only One-Way and Rounded-Trip";
      } catch (error) {
        return responseHelper(res, null, 404, error);
      }

      let payment_total;

      const price = parseInt(checkFlight.rows[0].price);

      if (trip_status == "one_way") {
        payment_total = price * parseInt(passenger_count);
      } else if (trip_status == "rounded_trip") {
        payment_total = 2 * (price * parseInt(passenger_count));
      }

      const flightCapacity = parseInt(checkFlight.rows[0].capacity);

      if (flightCapacity < passenger_count) {
        return responseHelper(res, null, 404, `Only available ${flightCapacity} seat on this Flight`);
      } else if (flightCapacity >= passenger_count) {
        let availableCapacity = parseInt(flightCapacity) - parseInt(passenger_count);
        if (payment_status == "success" && booking_status == "success") {
          await flightModel.updateCapacity(flight_id, availableCapacity);
        }
      }

      const trip_depature = parseInt(checkFlight.rows[0].depature);

      let trip_arrive = ``;
      let setPaymentDiscount;

      if (payment_discount == "" || payment_discount == "0" || payment_discount == "null" || payment_discount == undefined) {
        setPaymentDiscount = 0;
      } else if (payment_discount != "" || payment_discount != "0" || payment_discount != "null" || payment_discount != undefined) {
        setPaymentDiscount = payment_discount;
      }

      if (trip_status == "one_way") {
        payment_total = ( price * parseInt(passenger_count) - payment_discount );
      } else if (trip_status == "rounded_trip") {
        payment_total = ( (2 * (price * parseInt(passenger_count))) - payment_discount );
        trip_arrive = parseInt(checkFlight.rows[0].depature);
      }

      await bookingModel.updateBookingAdmin(
        id,
        booking_fullname,
        booking_email,
        booking_phone,
        booking_status,

        trip_status,
        trip_depature,
        trip_arrive,

        users_id,
        flight_id,

        payment_status,
        setPaymentDiscount,
        payment_total,
        payment_midtrans_snap_token,

        passenger_count,
        passenger_title_1,
        passenger_fullname_1,
        passenger_nationality_1,
        passenger_title_2,
        passenger_fullname_2,
        passenger_nationality_2,
        passenger_title_3,
        passenger_fullname_3,
        passenger_nationality_3,
        passenger_title_4,
        passenger_fullname_4,
        passenger_nationality_4,
        passenger_title_5,
        passenger_fullname_5,
        passenger_nationality_5,
        passenger_title_6,
        passenger_fullname_6,
        passenger_nationality_6
      );

      if (payment_status == "success" && booking_status == "success") {
        await usersModel.deleteUsersVerificationAdmin(users_id, id);
      }

      responseHelper(res, null, 201, "Booking Updated");
    } catch (error) {
      console.log(error);
      res.send(createError(400));
    }
  },
  deleteBooking: async (req, res) => {
    try {
      const id = req.params.id;
      const role = req.payload.role;

      try {
        if (role != "admin" && role != "super-user") throw "You're Cannot Access this feature";
      } catch (error) {
        return responseHelper(res, null, 404, error);
      }


      const checkbooking = await bookingModel.selectBooking(id);

      try {
        if (checkbooking.rowCount == 0) throw "Booking has not found";
      } catch (error) {
        return responseHelper(res, null, 404, error);
      }

      const users_id = checkbooking.rows[0].users_id;

      if (users_id) {
        await usersModel.deleteUsersVerificationAdmin(users_id, id);
      }

      await bookingModel.deleteBooking(id);

      responseHelper(res, null, 200, "Booking Deleted");
    } catch (error) {
      console.log(error);
      res.send(createError(404));
    }
  },

  updateBookingPaymentVerification: async (req, res) => {
    try {
      const id = req.query.id;
      const tokenMidTrans = req.query.token;

      try {
        if (typeof id != "string" && typeof tokenMidTrans != "string") throw "Invalid Url Credential Payment";
        if (typeof id == "string" && typeof tokenMidTrans != "string") throw "Invalid Booking Payment";
        if (typeof id != "string" && typeof tokenMidTrans == "string") throw "Invalid Token Payment";
      } catch (error) {
        return responseHelper(res, null, 403, error);
      }

      const checkBooking = await bookingModel.selectBooking(id);
      try {
        if (checkBooking.rowCount == 0) throw "Booking has not found";
      } catch (error) {
        return responseHelper(res, null, 404, error);
      }
      

      const vCheckToken = `${tokenMidTrans}_${id}`;

      const users_id = checkBooking.rows[0].users_id;

      // console.log(vCheckToken)
      
      const verificationCheck = await usersModel.checkUsersVerification(users_id, vCheckToken);
      if (verificationCheck.rowCount == 0) {
        return responseHelper(res, null, 403, "Invalid Token Credential Payment");
      }

      await bookingModel.updateBookingPaymentSuccess(id);
      await usersModel.deleteUsersVerificationAdmin(users_id, vCheckToken);

      // const resultBooking = await bookingModel.selectBookingBarcodeQRCode(id);
      const resultBooking = { 
        id : checkBooking.rows[0].id ,
        users_id : checkBooking.rows[0].users_id,
        flight_id : checkBooking.rows[0].flight_id,

      }
      const valueResultBooking = JSON.stringify(resultBooking);

      const flight_id = checkBooking.rows[0].flight_id;
      const flightCapacity = (await flightModel.selectFlight(flight_id)).rows[0].capacity;
      const passenger_count = checkBooking.rows[0].passenger_count;
     
      let availableCapacity = parseInt(flightCapacity) - parseInt(passenger_count);
      await flightModel.updateCapacity(flight_id, availableCapacity);

      bwipjs.toBuffer(
        {
          bcid: "qrcode", // Barcode type
          text: valueResultBooking, // Text to encode
          width: 100, // 3x scaling factor
          height: 100, // Bar height, in millimeters
          includetext: false, // Show human-readable text
          textxalign: "center", // Always good to set this
        },
        async (err, png) => {
          if (err) {
            console.log(err);
          } else {
            // console.log("data:image/png;base64," + png.toString("base64"));
            await bookingModel.updateBookingQRCode(id, "data:image/png;base64," + png.toString("base64"));
          }
        }
      );

      bwipjs.toBuffer(
        {
          bcid: "code128", // Barcode type
          text: id, // Text to encode
          scale: 4, // 3x scaling factor
          height: 15, // Bar height, in millimeters
          includetext: true, // Show human-readable text
          textxalign: "center", // Always good to set this
        },
        async (err, png) => {
          if (err) {
            console.log(err);
          } else {
            await bookingModel.updateBookingBarCode(id, "data:image/png;base64," + png.toString("base64"));
            // console.log("data:image/png;base64," + png.toString("base64"));
          }
        }
      );

      responseHelper(res, null, 201, "Payment Booking Success");
    } catch (error) {
      console.log(error);
      res.send(createError(400));
    }
  },

  failedBookingPayment: async (req, res) => {
    try {
      const id = req.query.id;
      const token = req.query.token;

      try {
        if (typeof id != "string" && typeof token != "string") throw "Invalid Url Credential Payment";
        if (typeof id == "string" && typeof token != "string") throw "Invalid Booking Payment";
        if (typeof id != "string" && typeof token == "string") throw "Invalid Token Payment";
      } catch (error) {
        return responseHelper(res, null, 403, error);
      }

      const checkBooking = await bookingModel.selectBooking(id);

      const users_id = checkBooking.rows[0].users_id;

      try {
        if (checkBooking.rowCount == 0) throw "Booking has not found";
      } catch (error) {
        return responseHelper(res, null, 404, error);
      }

      const verificationCheck = await usersModel.checkUsersVerification(users_id, token);

      if (verificationCheck.rowCount == 0) {
        return responseHelper(res, null, 403, "Invalid Credential Payment");
      }

      await bookingModel.updateBookingPaymentError(id);

      await usersModel.deleteUsersVerificationAdmin(users_id, token);

      responseHelper(res, null, 201, "Payment Booking Failed");
    } catch (error) {
      console.log(error);
      res.send(createError(400));
    }
  },
};

module.exports = bookingController;
