const { v4: uuidv4 } = require("uuid");
const reviewModel = require("../models/review");
const flightModel = require("../models/flight");
const createError = require("http-errors");
const responseHelper = require("../helper/responseHelper");
// const client = require('../config/redis')

const reviewController = {
  getPaginationReview: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const search = req.query.search;
      let querysearch = "";
      let totalData = "";
      if (search === undefined) {
        querysearch = `inner join users on review.users_id = users.id 
                                inner join flight on review.flight_id = flight.id 
                                inner join airlines on flight.airlines_id = airlines.id  
                                inner join airport as airport_depature on flight.airport_depature = airport_depature.id 
                                inner join airport as airport_arrive on flight.airport_arrive = airport_arrive.id 
                `;
        totalData = parseInt((await reviewModel.selectAllSearch(querysearch)).rowCount);
      } else {
        querysearch = `inner join users on review.users_id = users.id 
                                inner join flight on review.flight_id = flight.id 
                                inner join airlines on flight.airlines_id = airlines.id  
                                inner join airport as airport_depature on flight.airport_depature = airport_depature.id 
                                inner join airport as airport_arrive on flight.airport_arrive = airport_arrive.id 
                                where users.name ilike '\%${search}\%' `;
        totalData = parseInt((await reviewModel.selectAllSearch(querysearch)).rowCount);
      }
      const sortby = "review." + (req.query.sortby || "created_on");
      const sort = req.query.sort || "desc";
      const result = await reviewModel.selectPaginationReview({ limit, offset, sortby, sort, querysearch });
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
  getReview: async (req, res) => {
    try {
      const id = req.params.id;

      const checkreview = await reviewModel.selectReview(id);

      try {
        if (checkreview.rowCount == 0) throw "Review has not found";
      } catch (error) {
        return responseHelper(res, null, 404, error);
      }

      const result = checkreview;
      // client.setEx(`transaction/${id}`, 60 * 60, JSON.stringify(result.rows))
      responseHelper(res, result.rows, 200, null);
    } catch (error) {
      res.send(createError(404));
    }
  },
  insertReview: async (req, res) => {
    try {
      const id = uuidv4().toLocaleLowerCase();

      const { flight_id, content, rating, users_id } = req.body;

      const checkUsers = await reviewModel.selectUsers(users_id);

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

      await reviewModel.insertReview(id, flight_id, content, rating, users_id);
      responseHelper(res, null, 201, "New Review Added");
    } catch (error) {
      res.send(createError(400));
    }
  },
  updateReview: async (req, res) => {
    try {
      const id = req.params.id;

      const { flight_id, content, rating, users_id } = req.body;

      const checkreview = await reviewModel.selectReview(id);

      try {
        if (checkreview.rowCount == 0) throw "Review has not found";
      } catch (error) {
        return responseHelper(res, null, 404, error);
      }

      const checkUsers = await reviewModel.selectUsers(users_id);

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

      await reviewModel.updateReview(id, flight_id, content, rating, users_id);
      responseHelper(res, null, 201, "Review Updated");
    } catch (error) {
      console.log(error);
      res.send(createError(400));
    }
  },
  deleteReview: async (req, res) => {
    try {
      const id = req.params.id;

      const checkreview = await reviewModel.selectReview(id);

      try {
        if (checkreview.rowCount == 0) throw "Review has not found";
      } catch (error) {
        return responseHelper(res, null, 404, error);
      }

      reviewModel.deleteReview(id);
      responseHelper(res, null, 200, "Review Deleted");
    } catch (error) {
      console.log(error);
      res.send(createError(404));
    }
  },
};

module.exports = reviewController;
