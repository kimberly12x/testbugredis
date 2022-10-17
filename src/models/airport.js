const Pool = require("../config/db");
const selectAll = () => {
  return Pool.query(`select * from airport`);
};

const selectAllSearch = (querysearch) => {
  return Pool.query(`select * from airport  ${querysearch} `);
};


const selectAllSearchCount = (querysearch) => {
  return Pool.query(`select  COUNT(*) from airport  ${querysearch} `);
};

const selectPaginationAirport = ({ limit, offset, sortby, sort, querysearch }) => {
  return Pool.query(`select *
    from airport   ${querysearch}  order by ${sortby} ${sort} limit ${limit} offset ${offset} `);
};

const selectAirport = (id) => {
  return Pool.query(`select *
    from airport where airport.id='${id}'`);
};

const selectUsers = (users_id) => {
  return Pool.query(`select COUNT(*) from users where id='${users_id}'`);
};

const insertAirport = (id, city, country, country_code, name, iata, support) => {
  return Pool.query(`insert into airport 
    ( id, city, country, country_code, name, iata, support ) 
    values 
    ('${id}', '${city}', '${country}', '${country_code}', '${name}', '${iata}', '${support}'  )`);
};

const updateAirport = (id, city, country, country_code, name, iata, support) => {
  return Pool.query(`update airport set 
    city = '${city}' , 
    country = '${country}' , 
    country_code = '${country_code}', 
    name = '${name}',
    iata = '${iata}', 
    support = '${support}' 
    WHERE airport.id = '${id}'`);
};

const deleteAirport = (id) => {
  return Pool.query(`delete from airport where id='${id}'`);
};

const countData = () => {
  return Pool.query("SELECT COUNT(*) FROM airport");
};

module.exports = {
  selectAll,
  selectAllSearch,
  selectAllSearchCount,
  selectPaginationAirport,
  selectAirport,
  selectUsers,
  insertAirport,
  updateAirport,
  deleteAirport,
  countData,
};
