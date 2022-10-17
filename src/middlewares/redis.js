const client = require('../config/redis')
const responseHelper  = require('../helper/responseHelper')

// const hitCacheProductDetail = async (req, res, next) => {
//     const idProduct = req.params.id
//     const product = await client.get(`product/${idProduct}`)
//     if (product) {
//         return response(res, JSON.parse(product), 200, 'get data success from redis')
//     }
//     next()
// }

// const clearCacheProductDetail = (req, res, next) => {
//     const idProduct = req.params.id
//     client.del(`product/${idProduct}`)
//     next()
// }

// const hitCacheTransactionDetail = async (req, res, next) => {
//     const idTransaction = req.params.id
//     const transaction = await client.get(`transaction/${idTransaction}`)

//     if (transaction) {
//         return response(res, JSON.parse(transaction), 200, 'Get data from redis success')
//     }
//     next()
// }

// const clearCacheTransactionDetail = (req, res, next) => {
//     const idTransaction = req.params.id
//     client.del(`transaction/${idTransaction}`)
//     client.del(`transaction/invoice/${idTransaction}`)
//     next()
// }

// const hitCacheTransactionInvoice = async (req, res, next) => {
//     const idTransaction = req.params.id
//     const transactionInvoice = await client.get(`transaction/invoice/${idTransaction}`)
//     if (transactionInvoice) {
//         return response(res, JSON.parse(transactionInvoice), 200, 'Get data from redis success')
//     }
//     next()
// }

// const clearCacheTransactionInvoice = (req, res, next) => {
//     const idTransaction = req.params.id
//     client.del(`transaction/invoice/${idTransaction}`)
//     next()
// }


const hitCacheGetProfileUsers = async (req, res, next) => {
    // const email = req.query
    const email = req.payload.email;
    const getProfileUsers = await client.get(`users/${email}`)
    // console.log(client.get())
    console.log(getProfileUsers)
    if (getProfileUsers) {
        return responseHelper(res, JSON.parse(getProfileUsers), 200, 'get data success from redis')
    }
    next()
}

const deleteCacheProfileUsers = (req, res, next) => {
    const email = req.payload.email;
    client.del(`users/${email}`)
    next()
}



module.exports = {
    // hitCacheProductDetail,
    // clearCacheProductDetail,
    // hitCacheTransactionDetail,
    // clearCacheTransactionDetail,
    // hitCacheTransactionInvoice,
    
    // clearCacheTransactionInvoice
    // hitCacheGetPaginationAirlines,
    hitCacheGetProfileUsers,
    deleteCacheProfileUsers,
}