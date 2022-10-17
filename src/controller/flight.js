const { v4: uuidv4 } = require("uuid");
const flightModel = require("../models/flight");
const airlinesModel = require("../models/airlines");
const airportModel = require("../models/airport");
const createError = require("http-errors");
const responseHelper = require("../helper/responseHelper");
// const client = require('../config/redis')

const crypto = require("crypto");

const flightController = {
  getPaginationFlight: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const search = req.query.search;
      let querysearch = "";
      if (search === undefined) {
        querysearch = `inner join airlines on flight.airlines_id = airlines.id 
                inner join airport as airport_depature on flight.airport_depature = airport_depature.id
                inner join airport as airport_arrive on flight.airport_arrive = airport_arrive.id
                `;
       
      } else {
        querysearch = `inner join airlines on flight.airlines_id = airlines.id 
                inner join airport as airport_depature on flight.airport_depature = airport_depature.id
                inner join airport as airport_arrive on flight.airport_arrive = airport_arrive.id 
                where airlines.name ilike '\%${search}\%' `;
       
      }

      const totalData = parseInt((await flightModel.selectAllSearchCount(querysearch)).rows[0].count);
      const sortby = "flight." + (req.query.sortby || "created_on");
      const sort = req.query.sort || "desc";
      const result = await flightModel.selectPaginationFlight({ limit, offset, sortby, sort, querysearch });
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
  getFlight: async (req, res) => {
    try {
      const id = req.params.id;

      const checkflight = await flightModel.selectFlight(id);

      try {
        if (checkflight.rowCount == 0) throw "Flight has not found";
      } catch (error) {
        return responseHelper(res, null, 404, error);
      }

      const result = checkflight;
      // client.setEx(`transaction/${id}`, 60 * 60, JSON.stringify(result.rows))
      responseHelper(res, result.rows, 200, null);
    } catch (error) {
      res.send(createError(404));
    }
  },
  insertFlight: async (req, res) => {
    try {
      const role = req.payload.role;

      try {
        if (role != "admin" && role != "super-user") throw "You're Cannot Access this feature";
      } catch (error) {
        return responseHelper(res, null, 404, error);
      }

     

      const {  
        airlines_id ,
        airport_depature ,
        airport_arrive ,
        depature ,
        arrive ,
        lungage ,
        reschedule ,
        refundable ,
        meal ,
        wifi ,
        price ,
        type_class ,
        capacity ,
        status ,
    
        estimate ,
        terminal_verification,

        status_transit  ,
        airport_transit_1  ,
        time_transit_1  ,
        airport_transit_2  ,
        time_transit_2  ,
        airport_transit_3  ,
        time_transit_3  ,
        airport_transit_4  ,
        time_transit_4  ,
    
        admin_id  } = req.body;

      const idHex = (crypto.randomBytes(8).toString("hex")).toLocaleUpperCase()
      const id = `${airport_depature}-${airport_arrive}-${terminal_verification}-${idHex}`  

    
      const checkAirlines = await airlinesModel.selectAirlines(airlines_id);

      try {
        if (checkAirlines.rowCount == 0) throw "Airlines has not found";
      } catch (error) {
        return responseHelper(res, null, 404, error);
      }

      const checkairportFrom = await airportModel.selectAirport(airport_depature);

      try {
        if (checkairportFrom.rowCount == 0) throw "Airport Depature has not found";
      } catch (error) {
        return responseHelper(res, null, 404, error);
      }

         
      const checkairportTo = await airportModel.selectAirport(airport_arrive);

      try {
        if (checkairportTo.rowCount == 0) throw "Airport Arrive has not found";
      } catch (error) {
        return responseHelper(res, null, 404, error);
      }



      if ( airport_transit_1 ){
      const checkairportTransit1 = await airportModel.selectAirport(airport_transit_1);

      try {
        if (checkairportTransit1.rowCount == 0) throw "Airport Transit has not found";
      } catch (error) {
        return responseHelper(res, null, 404, error);
      } }
         


      if (airport_transit_2) {
      const checkairportTransit2 = await airportModel.selectAirport(airport_transit_2);

      try {
        if (airport_transit_2 && checkairportTransit2.rowCount == 0) throw "Airport Transit has not found";
      } catch (error) {
        return responseHelper(res, null, 404, error);
      }
         }
        
         
         if (airport_transit_3) {
      const checkairportTransit3 = await airportModel.selectAirport(airport_transit_3);

      try {
        if (airport_transit_3 && checkairportTransit3.rowCount == 0) throw "Airport Transit has not found";
      } catch (error) {
        return responseHelper(res, null, 404, error);
      }
    }
    if (airport_transit_4) { 
      const checkairportTransit4 = await airportModel.selectAirport(airport_transit_4);

      try {
        if (airport_transit_4 && checkairportTransit4.rowCount == 0) throw "Airport Transit has not found";
      } catch (error) {
        return responseHelper(res, null, 404, error);
      }
    }
    
      const checkUsers = await flightModel.selectUsers(admin_id);

      try {
        if (checkUsers.rowCount == 0 && ( checkUsers.rows[0].role != "admin" && checkUsers.rows[0].role != "super-user" ) ) throw "Admin has not found";
      } catch (error) {
        return responseHelper(res, null, 404, error);
      }

      await flightModel.insertFlight(
        id  ,
        airlines_id ,
        airport_depature ,
        airport_arrive ,
        depature ,
        arrive ,
        lungage ,
        reschedule ,
        refundable ,
        meal ,
        wifi ,
        price ,
        type_class ,
        capacity ,

        estimate ,
        terminal_verification,
        
        status ,
    
        status_transit  ,
        airport_transit_1  ,
        time_transit_1  ,
        airport_transit_2  ,
        time_transit_2  ,
        airport_transit_3  ,
        time_transit_3  ,
        airport_transit_4  ,
        time_transit_4  ,
    
        admin_id );
      responseHelper(res, null, 201, "New Flight Added");
    } catch (error) {
        console.log(error)
      res.send(createError(400));
    }
  },
  updateFlight: async (req, res) => {
    try {
      const role = req.payload.role;

      try {
        if (role != "admin" && role != "super-user") throw "You're Cannot Access this feature";
      } catch (error) {
        return responseHelper(res, null, 404, error);
      }

      const id = req.params.id;

      const checkFlight = await flightModel.selectFlight(id);

      try {
        if (checkFlight.rowCount == 0) throw "Flight has not found";
      } catch (error) {
        return responseHelper(res, null, 404, error);
      }

      const {  
        airlines_id ,
        airport_depature ,
        airport_arrive ,
        depature ,
        arrive ,
        lungage ,
        reschedule ,
        refundable ,
        meal ,
        wifi ,
        price ,
        type_class ,
        capacity ,
        status ,
    
        
        estimate ,
        terminal_verification,

        status_transit  ,
        airport_transit_1  ,
        time_transit_1  ,
        airport_transit_2  ,
        time_transit_2  ,
        airport_transit_3  ,
        time_transit_3  ,
        airport_transit_4  ,
        time_transit_4  ,
    
        admin_id  } = req.body;

      const checkAirlines = await airlinesModel.selectAirlines(airlines_id);

      try {
        if (checkAirlines.rowCount == 0) throw "Airlines has not found";
      } catch (error) {
        return responseHelper(res, null, 404, error);
      }

      const checkairportFrom = await airportModel.selectAirport(airport_depature);

      try {
        if (checkairportFrom.rowCount == 0) throw "Airport Depature has not found";
      } catch (error) {
        return responseHelper(res, null, 404, error);
      }

         
      const checkairportTo = await airportModel.selectAirport(airport_arrive);

      try {
        if (checkairportTo.rowCount == 0) throw "Airport Arrive has not found";
      } catch (error) {
        return responseHelper(res, null, 404, error);
      }



      if ( airport_transit_1 ){
      const checkairportTransit1 = await airportModel.selectAirport(airport_transit_1);

      try {
        if (checkairportTransit1.rowCount == 0) throw "Airport Transit has not found";
      } catch (error) {
        return responseHelper(res, null, 404, error);
      } }
         


      if (airport_transit_2) {
      const checkairportTransit2 = await airportModel.selectAirport(airport_transit_2);

      try {
        if (airport_transit_2 && checkairportTransit2.rowCount == 0) throw "Airport Transit has not found";
      } catch (error) {
        return responseHelper(res, null, 404, error);
      }
         }
        
         
         if (airport_transit_3) {
      const checkairportTransit3 = await airportModel.selectAirport(airport_transit_3);

      try {
        if (airport_transit_3 && checkairportTransit3.rowCount == 0) throw "Airport Transit has not found";
      } catch (error) {
        return responseHelper(res, null, 404, error);
      }
    }
    if (airport_transit_4) { 
      const checkairportTransit4 = await airportModel.selectAirport(airport_transit_4);

      try {
        if (airport_transit_4 && checkairportTransit4.rowCount == 0) throw "Airport Transit has not found";
      } catch (error) {
        return responseHelper(res, null, 404, error);
      }
    }
    
      const checkUsers = await flightModel.selectUsers(admin_id);

      try {
        if (checkUsers.rowCount == 0 && ( checkUsers.rows[0].role != "admin" && checkUsers.rows[0].role != "super-user")) throw "Admin has not found";
      } catch (error) {
        return responseHelper(res, null, 404, error);
      }

      await flightModel.updateFlight(
        id,
        airlines_id,
        airport_depature,
        airport_arrive,
        depature,
        arrive,
        lungage,
        reschedule,
        refundable,
        meal,
        wifi,
        price,
        type_class,
        capacity,
        status,

        
        estimate ,
        terminal_verification,

        status_transit,
        airport_transit_1,
        time_transit_1,
        airport_transit_2,
        time_transit_2,
        airport_transit_3,
        time_transit_3,
        airport_transit_4,
        time_transit_4,

        admin_id );

   
      responseHelper(res, null, 201, "Flight Updated");
    } catch (error) {
      console.log(error);
      res.send(createError(400));
    }
  },
  deleteFlight: async (req, res) => {
    try {
      const role = req.payload.role;

      try {
        if (role != "admin" && role != "super-user") throw "You're Cannot Access this feature";
      } catch (error) {
        return responseHelper(res, null, 404, error);
      }

      const id = req.params.id;

      const checkflight = await flightModel.selectFlight(id);

      try {
        if (checkflight.rowCount == 0) throw "Flight has not found";
      } catch (error) {
        return responseHelper(res, null, 404, error);
      }

      flightModel.deleteFlight(id);
      responseHelper(res, null, 200, "Flight Deleted");
    } catch (error) {
      console.log(error);
      res.send(createError(404));
    }
  },
};

module.exports = flightController;
