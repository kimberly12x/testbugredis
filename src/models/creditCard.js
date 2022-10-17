const Pool = require('../config/db')
const selectAll = () => {
    return Pool.query(`select * from credit_card`);
}

const selectAllSearch = (querysearch) => {
    return Pool.query(`select * from credit_card  ${querysearch} `);
}

// const selectPagination = ({ limit, offset, sortby, sort, querysearch }) => {
//     return Pool.query(`select * from credit_card  ${querysearch}  order by ${sortby} ${sort} limit ${limit} offset ${offset} `)
// }

const selectPaginationCreditCard= ({ limit, offset, sortby, sort, querysearch }) => {
    return Pool.query(`select 
    credit_card.id , 
    credit_card.cc_number , 
    credit_card.cc_vcc , 
    credit_card.cc_exp , 
    credit_card.users_id , 
    users.name  , 
    users.email , 
    users.username , 
    users.country , 
    users.city  , 
    users.address  , 
    users.postal_code  , 
    users.phone , 
    users.picture  , 
    users.created_on as users_created_on   , 
    users.updated_on  as users_updated_on   
    from credit_card   ${querysearch}  order by ${sortby} ${sort} limit ${limit} offset ${offset} `)
}

const selectCreditCard = (id) => {
    return Pool.query(`select 
    credit_card.id , 
    credit_card.cc_number , 
    credit_card.cc_vcc , 
    credit_card.cc_exp , 
    credit_card.users_id , 
    users.name  , 
    users.email , 
    users.username , 
    users.country , 
    users.city  , 
    users.address  , 
    users.postal_code  , 
    users.phone , 
    users.picture  , 
    users.created_on as users_created_on   , 
    users.updated_on  as users_updated_on   
    from credit_card inner join users on credit_card.users_id = users.id where credit_card.id='${id}'`);
}

const selectUsers = (users_id) => {
    return Pool.query(`select COUNT(*) from users where id='${users_id}'`)
}


const insertCreditCard = (
    id, cc_number, cc_vcc , cc_exp, users_id
) => {
    return Pool.query(`insert into credit_card (  id, cc_number, cc_vcc , cc_exp, users_id  ) values ('${id}', '${cc_number}', '${cc_vcc}', '${cc_exp}', '${users_id}'  )`)
}

const updateCreditCard = (
    id, cc_number, cc_vcc , cc_exp, users_id
) => {
    return Pool.query(`update credit_card set cc_number = '${cc_number}' , cc_vcc = '${cc_vcc}' , cc_exp = '${cc_exp}', users_id = '${users_id}'  WHERE id = '${id}'`)
}

const deleteCreditCard = (id) => {
    return Pool.query(`delete from credit_card where id='${id}'`)
}

const countData = () => {
    return Pool.query("SELECT COUNT(*) FROM credit_card");
};

module.exports = {
    selectAll,
    selectAllSearch,
    selectPaginationCreditCard,
    selectCreditCard,
    selectUsers,
    insertCreditCard,
    updateCreditCard,
    deleteCreditCard,
    countData
}


