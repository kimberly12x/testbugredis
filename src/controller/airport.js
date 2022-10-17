// const { v4: uuidv4 } = require("uuid");
const airportModel = require("../models/airport");
const createError = require("http-errors");
const responseHelper = require("../helper/responseHelper");
const client = require('../config/redis')

const airportController = {
  getPaginationAirport: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const search = req.query.search;
      const searchBy = req.query.searchby || "country";
      let querysearch = "";
      if (search === undefined) {
        querysearch = ``;
      } else {
        // eslint-disable-next-line no-useless-escape
        querysearch = ` where airport.${searchBy} ilike '\%${search}\%' `;
      }
      const totalData  = parseInt((await airportModel.selectAllSearchCount(querysearch)).rows[0].count);
      const sortby = "airport." + (req.query.sortby || "created_on");
      const sort = req.query.sort || "desc";
      const result = await airportModel.selectPaginationAirport({ limit, offset, sortby, sort, querysearch });
      const totalPage = Math.ceil(totalData / limit);
      const pagination = {
        currentPage: page,
        limit: limit,
        totalData: totalData,
        totalPage: totalPage,
      };
      // client.setEx(`getPaginationAirport/${req.query}`, 60 * 60 * 3, JSON.stringify(result.rows))
      responseHelper(res, result.rows, 200, null, pagination);
    } catch (error) {
      console.log(error)
      res.send(createError(404));
    }
  },
  getAirport: async (req, res) => {
    try {
      const id = req.params.id;

      const checkairport = await airportModel.selectAirport(id);

      try {
        if (checkairport.rowCount == 0) throw "Airport has not found";
      } catch (error) {
        return responseHelper(res, null, 404, error);
      }

      const result = checkairport;
      client.setEx(`getAirport/${id}`, 60 * 60, JSON.stringify(result.rows))
      responseHelper(res, result.rows, 200, null);
    } catch (error) {
      res.send(createError(404));
    }
  },
  insertAirport: async (req, res) => {
    try {
      // const id = uuidv4().toLocaleLowerCase();
      const role = req.payload.role;

      try {
        if (role != "super-user") throw "You're Cannot Access this feature";
      } catch (error) {
        return responseHelper(res, null, 404, error);
      }
      const { city, country,country_code, name,iata ,support  } = req.body;

      const id = country_code+iata;

      const checkairport = await airportModel.selectAirport(id);

      try {
        if (checkairport.rowCount == 1) throw "Airport has created before";
      } catch (error) {
        return responseHelper(res, null, 404, error);
      }


      await airportModel.insertAirport(id, city, country,country_code, name,iata ,support);
      responseHelper(res, null, 201, "New Airport Added");
    } catch (error) {
      res.send(createError(400));
    }
  },
  updateAirport: async (req, res) => {
    try {
      const id = req.params.id;
      const role = req.payload.role;

      try {
        if (role != "super-user") throw "You're Cannot Access this feature";
      } catch (error) {
        return responseHelper(res, null, 404, error);
      }
      const { city, country,country_code, name,iata ,support  } = req.body;
    
      const checkairport = await airportModel.selectAirport(id);

      try {
        if (checkairport.rowCount == 0) throw "Airport has not found";
      } catch (error) {
        return responseHelper(res, null, 404, error);
      }

      await airportModel.updateAirport(id, city, country,country_code, name,iata ,support);
      responseHelper(res, null, 201, "Airport Updated");
    } catch (error) {
      console.log(error);
      res.send(createError(400));
    }
  },
  deleteAirport: async (req, res) => {
    try {
      const id = req.params.id;
      const role = req.payload.role;

      try {
        if (role != "super-user") throw "You're Cannot Access this feature";
      } catch (error) {
        return responseHelper(res, null, 404, error);
      }

      const checkairport = await airportModel.selectAirport(id);

      try {
        if (checkairport.rowCount == 0) throw "Airport has not found";
      } catch (error) {
        return responseHelper(res, null, 404, error);
      }

      airportModel.deleteAirport(id);
      responseHelper(res, null, 200, "Airport Deleted");
    } catch (error) {
      console.log(error);
      res.send(createError(404));
    }
  },
};

module.exports = airportController;
