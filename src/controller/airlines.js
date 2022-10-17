const { v4: uuidv4 } = require("uuid");
const airlinesModel = require("../models/airlines");
const createError = require("http-errors");
const responseHelper = require("../helper/responseHelper");
// const client = require('../config/redis')

const { authenticateGoogle, uploadToGoogleDrive, deleteFromGoogleDrive } = require("../middlewares/GoogleCloudServices");

const airlinesController = {
  getPaginationAirlines: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const search = req.query.search;
      let querysearch = "";
      if (search === undefined) {
        querysearch = ``;
      } else {
        // eslint-disable-next-line no-useless-escape
        querysearch = ` where airlines.name ilike '\%${search}\%' `;
  
      }
      
      const totalData  = parseInt((await airlinesModel.selectAllSearchCount(querysearch)).rows[0].count);
     
      const sortby = "airlines." + (req.query.sortby || "created_on");
      const sort = req.query.sort || "desc";
      const result = await airlinesModel.selectPaginationAirlines({ limit, offset, sortby, sort, querysearch });
      const totalPage = Math.ceil(totalData / limit);
      const pagination = {
        currentPage: page,
        limit: limit,
        totalData: totalData,
        totalPage: totalPage,
      };
      responseHelper(res, result.rows, 200, null, pagination);
    } catch (error) {
      res.send(createError(404));
    }
  },
  getAirlines: async (req, res) => {
    try {
      const id = req.params.id;

      const checkAirlines = await airlinesModel.selectAirlines(id);

      try {
        if (checkAirlines.rowCount == 0) throw "Airlines has not found";
      } catch (error) {
        return responseHelper(res, null, 404, error);
      }

      const result = checkAirlines;
      // client.setEx(`transaction/${id}`, 60 * 60, JSON.stringify(result.rows))
      responseHelper(res, result.rows, 200, null);
    } catch (error) {
      res.send(createError(404));
    }
  },
  insertAirlines: async (req, res) => {
    try {
      const id = uuidv4().toLocaleLowerCase();
      const role = req.payload.role;

      try {
        if (role != "super-user") throw "You're Cannot Access this feature";
      } catch (error) {
        return responseHelper(res, null, 404, error);
      }

      if (req.file) {
        const auth = authenticateGoogle();

        // Upload to Drive
        const response = await uploadToGoogleDrive(req.file, auth);
        const logo = `https://drive.google.com/thumbnail?id=${response.data.id}&sz=s1080`;

        const { name, description, support } = req.body;

        await airlinesModel.insertAirlines(id, name, description, support, logo);

        responseHelper(res, null, 201, "New Airlines has been added");
      } else {
        const { name, description, support } = req.body;

        await airlinesModel.insertAirlinesNoLogo(id, name, description, support);

        responseHelper(res, null, 201, "New Airlines has been added");
      }
    } catch (error) {
      res.send(createError(400));
    }
  },
  updateAirlines: async (req, res) => {
    try {
      const id = req.params.id;
      const role = req.payload.role;

      try {
        if (role != "super-user") throw "You're Cannot Access this feature";
      } catch (error) {
        return responseHelper(res, null, 404, error);
      }

      const checkAirlines = await airlinesModel.selectAirlines(id);

      try {
        if (checkAirlines.rowCount == 0) throw "Airlines has not found";
      } catch (error) {
        return responseHelper(res, null, 404, error);
      }

      if (req.file) {
        const auth = authenticateGoogle();

        if (checkAirlines.rows[0].logo != null || checkAirlines.rows[0].logo != undefined) {
          await deleteFromGoogleDrive(checkAirlines.rows[0].logo, auth);
        }

        // Upload to Drive
        const response = await uploadToGoogleDrive(req.file, auth);
        const logo = `https://drive.google.com/thumbnail?id=${response.data.id}&sz=s1080`;

        const { name, description, support } = req.body;

        await airlinesModel.updateAirlines(id, name, description, support, logo);

        responseHelper(res, null, 201, "Airlines has been updated");
      } else {
        const { name, description, support } = req.body;

        await airlinesModel.updateAirlinesNoLogo(id, name, description, support);

        responseHelper(res, null, 201, "Airlines has been updated");
      }
    } catch (error) {
      console.log(error);
      res.send(createError(400));
    }
  },
  deleteAirlines: async (req, res) => {
    try {
      const id = req.params.id;

      const role = req.payload.role;

      try {
        if (role != "super-user") throw "You're Cannot Access this feature";
      } catch (error) {
        return responseHelper(res, null, 404, error);
      }

      const checkairlines = await airlinesModel.selectAirlines(id);

      try {
        if (checkairlines.rowCount == 0) throw "Airlines has not found";
      } catch (error) {
        return responseHelper(res, null, 404, error);
      }

      airlinesModel.deleteAirlines(id);
      responseHelper(res, null, 200, "Airlines Deleted");
    } catch (error) {
      console.log(error);
      res.send(createError(404));
    }
  },
};

module.exports = airlinesController;
