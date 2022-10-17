const Pool = require("../config/db");
const selectAll = () => {
  return Pool.query(`select * from review`);
};

const selectAllSearch = (querysearch) => {
  return Pool.query(`select * from review  ${querysearch} `);
};

// const selectPagination = ({ limit, offset, sortby, sort, querysearch }) => {
//     return Pool.query(`select * from review  ${querysearch}  order by ${sortby} ${sort} limit ${limit} offset ${offset} `)
// }

const selectPaginationReview = ({ limit, offset, sortby, sort, querysearch }) => {
  return Pool.query(`select

    review.id,
    review.flight_id,
    review.content,
    review.rating,
    review.users_id,
    review.created_on,

    
    users.email  as  users_email  ,
    users.username  as  users_username  ,
    users.name  as  users_name  ,
    users.country  as  users_country  ,
    users.city  as  users_city  ,
    users.address  as  users_address  ,
    users.postal_code  as  users_postal_code  ,
    users.phone  as  users_phone  ,
    users.picture  as  users_picture  ,




    flight.airlines_id,
    airlines.name as airlines_name,
    airlines.logo as airlines_logo,
    airlines.description as airlines_description,
    airlines.support as airlines_support,
    flight.airport_depature,
    airport_depature.city as airport_depature_city ,
    airport_depature.country as airport_depature_country ,
    airport_depature.airport as airport_depature_airport ,
    airport_depature.terminal as airport_depature_terminal ,
    flight.airport_arrive,
    airport_arrive.city as airport_arrive_city ,
    airport_arrive.country as airport_arrive_country ,
    airport_arrive.airport as airport_arrive_airport ,
    airport_arrive.terminal as airport_arrive_terminal ,
    flight.depature,
    flight.arrive,
    flight.lungage ,
    flight.reschedule ,
    flight.refundable ,
    flight.meal ,
    flight.wifi ,
    flight.price ,
    flight.type_class ,
    flight.capacity ,
    flight.status ,
    flight.status_transit ,
    flight.airport_transit_1,
    flight.time_transit_1,
    flight.airport_transit_2,
    flight.time_transit_2,
    flight.airport_transit_3,
    flight.time_transit_3,
    flight.airport_transit_4,
    flight.time_transit_4

    from review   ${querysearch}  order by ${sortby} ${sort} limit ${limit} offset ${offset} `);
};

const selectReview = (id) => {
  return Pool.query(`select

    review.id,
    review.flight_id,
    review.content,
    review.rating,
    review.users_id,
    review.created_on,

    
    users.email  as  users_email  ,
    users.username  as  users_username  ,
    users.name  as  users_name  ,
    users.country  as  users_country  ,
    users.city  as  users_city  ,
    users.address  as  users_address  ,
    users.postal_code  as  users_postal_code  ,
    users.phone  as  users_phone  ,
    users.picture  as  users_picture  ,




    flight.airlines_id,
    airlines.name as airlines_name,
    airlines.logo as airlines_logo,
    airlines.description as airlines_description,
    airlines.support as airlines_support,
    flight.airport_depature,
    airport_depature.city as airport_depature_city ,
    airport_depature.country as airport_depature_country ,
    airport_depature.airport as airport_depature_airport ,
    airport_depature.terminal as airport_depature_terminal ,
    flight.airport_arrive,
    airport_arrive.city as airport_arrive_city ,
    airport_arrive.country as airport_arrive_country ,
    airport_arrive.airport as airport_arrive_airport ,
    airport_arrive.terminal as airport_arrive_terminal ,
    flight.depature,
    flight.arrive,
    flight.lungage ,
    flight.reschedule ,
    flight.refundable ,
    flight.meal ,
    flight.wifi ,
    flight.price ,
    flight.type_class ,
    flight.capacity ,
    flight.status ,
    flight.status_transit ,
    flight.airport_transit_1,
    flight.time_transit_1,
    flight.airport_transit_2,
    flight.time_transit_2,
    flight.airport_transit_3,
    flight.time_transit_3,
    flight.airport_transit_4,
    flight.time_transit_4

    from review
   
    inner join users on review.users_id = users.id 
    inner join flight on review.flight_id = flight.id 
    inner join airlines on flight.airlines_id = airlines.id  
    inner join airport as airport_depature on flight.airport_depature = airport_depature.id 
    inner join airport as airport_arrive on flight.airport_arrive = airport_arrive.id
                                
    where review.id='${id}'`);
};

const selectUsers = (users_id) => {
  return Pool.query(`select COUNT(*) from users where id='${users_id}'`);
};

const insertReview = (id, flight_id, content, rating, users_id) => {
  return Pool.query(`insert into review (  id, flight_id , content , rating , users_id ) values ('${id}', '${flight_id}', '${content}', '${rating}', '${users_id}'  )`);
};

const updateReview = (id, flight_id, content, rating, users_id) => {
  return Pool.query(`update review set flight_id = '${flight_id}' , content = '${content}' , rating = '${rating}', users_id = '${users_id}'  WHERE id = '${id}'`);
};

const deleteReview = (id) => {
  return Pool.query(`delete from review where id='${id}'`);
};

const countData = () => {
  return Pool.query("SELECT COUNT(*) FROM review");
};

module.exports = {
  selectAll,
  selectAllSearch,
  selectPaginationReview,
  selectReview,
  selectUsers,
  insertReview,
  updateReview,
  deleteReview,
  countData,
};
