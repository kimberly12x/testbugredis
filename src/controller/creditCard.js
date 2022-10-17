const { v4: uuidv4 } = require("uuid");
const creditCardModel = require("../models/creditCard");
const createError = require("http-errors");
const responseHelper = require("../helper/responseHelper");
// const client = require('../config/redis')

const creditCardController = {
    getPaginationCreditCard: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;
            const search = req.query.search;
            let querysearch = "";
            let totalData = "";
            if (search === undefined) {
                querysearch = `inner join users on credit_card.users_id = users.id`;
                totalData = parseInt((await creditCardModel.selectAllSearch(querysearch)).rowCount);
            } else {
                querysearch = `inner join users on credit_card.users_id = users.id where users.name ilike '\%${search}\%' `;
                totalData = parseInt((await creditCardModel.selectAllSearch(querysearch)).rowCount);
            }
            const sortby = "credit_card." + ( req.query.sortby || "created_on" );
            const sort = req.query.sort || "desc";
            const result = await creditCardModel.selectPaginationCreditCard({ limit, offset, sortby, sort, querysearch });
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
    getCreditCard: async (req, res) => {
        try {
            const id = req.params.id;

            const checkcreditCard = await creditCardModel.selectCreditCard(id);

            try {
                if (checkcreditCard.rowCount == 0) throw "CreditCard has not found";
            } catch (error) {
                return responseHelper(res, null, 404, error);
            }

            const result = checkcreditCard;
            // client.setEx(`transaction/${id}`, 60 * 60, JSON.stringify(result.rows))
            responseHelper(res, result.rows, 200, null);
        } catch (error) {
            res.send(createError(404));
        }
    },
    insertCreditCard: async (req, res) => {
        try {
            const id = uuidv4().toLocaleLowerCase();

            const { cc_number, cc_vcc , cc_exp, users_id } = req.body;

            const checkUsers = await creditCardModel.selectUsers(users_id);

            try {
                if (checkUsers.rowCount == 0) throw "Users has not found";
            } catch (error) {
                return responseHelper(res, null, 404, error);
            }

            await creditCardModel.insertCreditCard( id, cc_number, cc_vcc , cc_exp, users_id  );
            responseHelper(res, null, 201, "New Credit Card Added");
            
        } catch (error) {
            res.send(createError(400));
        }
    },
    updateCreditCard: async (req, res) => {
        try {
            const id = req.params.id;

            const { cc_number, cc_vcc , cc_exp, users_id  } = req.body;

            const checkcreditCard = await creditCardModel.selectCreditCard(id);

            try {
                if (checkcreditCard.rowCount == 0) throw "Credit Card has not found";
            } catch (error) {
                return responseHelper(res, null, 404, error);
            }

            const checkUsers = await creditCardModel.selectUsers(users_id);

            try {
                if (checkUsers.rowCount == 0) throw "Users has not found";
            } catch (error) {
                return responseHelper(res, null, 404, error);
            }

        
            await creditCardModel.updateCreditCard( id, cc_number, cc_vcc , cc_exp, users_id);
            responseHelper(res, null, 201, "Credit Card Updated");
        } catch (error) {
            console.log(error)
            res.send(createError(400));
        }
    },
    deleteCreditCard: async (req, res) => {
        try {
            const id = req.params.id;

            const checkcreditCard = await creditCardModel.selectCreditCard(id);

            try {
                if (checkcreditCard.rowCount == 0) throw "Credit Card has not found";
            } catch (error) {
                return responseHelper(res, null, 404, error);
            }

            creditCardModel.deleteCreditCard(id);
            responseHelper(res, null, 200, "Credit Card Deleted");
        } catch (error) {
            console.log(error)
            res.send(createError(404));
        }
    },
    
};

module.exports = creditCardController;
