const Pool = require("../config/db");
const selectAll = () => {
  return Pool.query(`select * from airlines`);
};

const selectAllSearch = (querysearch) => {
  return Pool.query(`select * from airlines  ${querysearch} `);
};

const selectAllSearchCount = (querysearch) => {
  return Pool.query(`select COUNT(*) from airlines  ${querysearch} `);
};


const selectPaginationAirlines = ({ limit, offset, sortby, sort, querysearch }) => {
  return Pool.query(`select *
    from airlines   ${querysearch}  order by ${sortby} ${sort} limit ${limit} offset ${offset} `);
};

const selectAirlines = (id) => {
  return Pool.query(`select *
    from airlines  where airlines.id='${id}'`);
};

const selectUsers = (users_id) => {
  return Pool.query(`select COUNT(*) from users where id='${users_id}'`);
};

const insertAirlines = (id,  name, description , support  , logo) => {
  return Pool.query(`insert into airlines ( id,  name , description , support  , logo  ) values ('${id}', '${name}', '${description}', '${support}', '${logo}'  )`);
};

const insertAirlinesNoLogo = (id,  name, description , support  ) => {
  return Pool.query(`insert into airlines (  id,  name , description , support    ) values ('${id}', '${name}', '${description}', '${support}' )`);
};

const updateAirlines = (id, name, description, support, logo) => {
  return Pool.query(`update airlines set name = '${name}' , description = '${description}' , support = '${support}', logo = '${logo}'  WHERE airlines.id = '${id}'`);
};

const updateAirlinesNoLogo = (id, name, description, support ) => {
    return Pool.query(`update airlines set name = '${name}' , description = '${description}' , support = '${support}'  WHERE airlines.id = '${id}'`);
  };

const deleteAirlines = (id) => {
  return Pool.query(`delete from airlines where id='${id}'`);
};

const countData = () => {
  return Pool.query("SELECT COUNT(*) FROM airlines");
};

module.exports = {
  selectAll,
  selectAllSearchCount,
  selectAllSearch,
  selectPaginationAirlines,
  selectAirlines,
  selectUsers,
  insertAirlines,insertAirlinesNoLogo,
  updateAirlines,updateAirlinesNoLogo,
  deleteAirlines,
  countData,
};
