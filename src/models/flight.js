const Pool = require("../config/db");
const selectAll = () => {
  return Pool.query(`select * from flight`);
};

const selectAllSearch = (querysearch) => {
  return Pool.query(`select * from flight  ${querysearch} `);
};
const selectAllSearchCount = (querysearch) => {
  return Pool.query(`select COUNT(*) from flight  ${querysearch} `);
};

const selectPaginationFlight = ({ limit, offset, sortby, sort, querysearch }) => {
  return Pool.query(`select
    flight.id ,
    flight.airlines_id,
    airlines.name as airlines_name,
    airlines.logo as airlines_logo,
    airlines.description as airlines_description,
    airlines.support as airlines_support,


    flight.airport_depature,
    airport_depature.city as airport_depature_city ,
    airport_depature.country as airport_depature_country ,

    airport_depature.country_code as airport_depature_country_code,
    airport_depature.name as airport_depature_name,
    airport_depature.iata as airport_depature_iata,
    airport_depature.support as airport_depature_support,


    flight.airport_arrive,

    airport_arrive.city as airport_arrive_city ,
    airport_arrive.country as airport_arrive_country ,

    airport_arrive.country_code as airport_arrive_country_code,
    airport_arrive.name as airport_arrive_name,
    airport_arrive.iata as airport_arrive_iata,
    airport_arrive.support as airport_arrive_support,


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

    flight.estimate  ,
    flight.terminal_verification ,


    flight.status ,

    flight.status_transit ,
    flight.airport_transit_1,
    flight.time_transit_1,

    flight.airport_transit_2,
    flight.time_transit_2,
    
    flight.airport_transit_3,
    flight.time_transit_3,
    
    flight.airport_transit_4,
    flight.time_transit_4,
    
    flight.admin_id,
    flight.created_on,
    flight.updated_on
    
    from flight  ${querysearch}  order by ${sortby} ${sort} limit ${limit} offset ${offset} `);
};

const selectFlight = (id) => {
  return Pool.query(`select
    flight.id ,
    flight.airlines_id,
    airlines.name as airlines_name,
    airlines.logo as airlines_logo,
    airlines.description as airlines_description,
    airlines.support as airlines_support,


    flight.airport_depature,
    airport_depature.city as airport_depature_city ,
    airport_depature.country as airport_depature_country ,

    airport_depature.country_code as airport_depature_country_code,
    airport_depature.name as airport_depature_name,
    airport_depature.iata as airport_depature_iata,
    airport_depature.support as airport_depature_support,


    flight.airport_arrive,

    airport_arrive.city as airport_arrive_city ,
    airport_arrive.country as airport_arrive_country ,

    airport_arrive.country_code as airport_arrive_country_code,
    airport_arrive.name as airport_arrive_name,
    airport_arrive.iata as airport_arrive_iata,
    airport_arrive.support as airport_arrive_support,


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

    flight.estimate  ,
    flight.terminal_verification ,


    flight.status ,

    flight.status_transit ,
    flight.airport_transit_1,
    flight.time_transit_1,

    flight.airport_transit_2,
    flight.time_transit_2,
    
    flight.airport_transit_3,
    flight.time_transit_3,
    
    flight.airport_transit_4,
    flight.time_transit_4,
    
    flight.admin_id,
    flight.created_on,
    flight.updated_on
    from flight  
    inner join airlines on flight.airlines_id = airlines.id 
    inner join airport as airport_depature on flight.airport_depature = airport_depature.id
    inner join airport as airport_arrive on flight.airport_arrive = airport_arrive.id
    where flight.id='${id}'`);
};

const selectUsers = (users_id) => {
  return Pool.query(`select COUNT(*) from users where id='${users_id}'`);
};

const insertFlight = (
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

  admin_id
) => {
  let dataTransit = ``;
  let valueTransit = ``;

  if (status_transit != "direct") {
    if (
      airport_transit_1 != "" ||
      airport_transit_1 != null ||
      (airport_transit_1 != undefined && airport_transit_2 == "") ||
      airport_transit_2 == null ||
      (airport_transit_2 == undefined && airport_transit_3 == "") ||
      airport_transit_3 == null ||
      (airport_transit_3 == undefined && airport_transit_4 == "") ||
      airport_transit_4 == null ||
      airport_transit_4 == undefined
    ) {
      dataTransit = `airport_transit_1  ,
                            time_transit_1  ,`;
      valueTransit = `'${airport_transit_1}',
                            '${time_transit_1}',`;
    }
    if (
      airport_transit_1 != "" ||
      airport_transit_1 != null ||
      (airport_transit_1 != undefined && airport_transit_2 != "") ||
      airport_transit_2 != null ||
      (airport_transit_2 != undefined && airport_transit_3 == "") ||
      airport_transit_3 == null ||
      (airport_transit_3 == undefined && airport_transit_4 == "") ||
      airport_transit_4 == null ||
      airport_transit_4 == undefined
    ) {
      dataTransit = `airport_transit_1  ,
                            time_transit_1  ,
                            airport_transit_2  ,
                            time_transit_2  ,`;
      valueTransit = `'${airport_transit_1}',
                            '${time_transit_1}',
                            '${airport_transit_2}',
                            '${time_transit_2}',`;
    }
    if (
      airport_transit_1 != "" ||
      airport_transit_1 != null ||
      (airport_transit_1 != undefined && airport_transit_2 != "") ||
      airport_transit_2 != null ||
      (airport_transit_2 != undefined && airport_transit_3 != "") ||
      airport_transit_3 != null ||
      (airport_transit_3 != undefined && airport_transit_4 == "") ||
      airport_transit_4 == null ||
      airport_transit_4 == undefined
    ) {
      dataTransit = `airport_transit_1  ,
                            time_transit_1  ,
                            airport_transit_2  ,
                            time_transit_2  ,
                            airport_transit_3  ,
                            time_transit_3  ,`;
      valueTransit = `'${airport_transit_1}',
                            '${time_transit_1}',
                            '${airport_transit_2}',
                            '${time_transit_2}',
                            '${airport_transit_3}',
                            '${time_transit_3}',`;
    }
    if (
      airport_transit_1 != "" ||
      airport_transit_1 != null ||
      (airport_transit_1 != undefined && airport_transit_2 != "") ||
      airport_transit_2 != null ||
      (airport_transit_2 != undefined && airport_transit_3 != "") ||
      airport_transit_3 != null ||
      (airport_transit_3 != undefined && airport_transit_4 != "") ||
      airport_transit_4 != null ||
      airport_transit_4 != undefined
    ) {
      dataTransit = `airport_transit_1  ,
                            time_transit_1  ,
                            airport_transit_2  ,
                            time_transit_2  ,
                            airport_transit_3  ,
                            time_transit_3  ,
                            airport_transit_4  ,
                            time_transit_4  ,`;
      valueTransit = `'${airport_transit_1}',
                            '${time_transit_1}',
                            '${airport_transit_2}',
                            '${time_transit_2}',
                            '${airport_transit_3}',
                            '${time_transit_3}',
                            '${airport_transit_4}',
                            '${time_transit_4}',`;
    }
  }

  return Pool.query(`insert into flight ( 
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
        ${dataTransit}

        admin_id 

         ) values (
            '${id}',
            '${airlines_id}',
            '${airport_depature}',
            '${airport_arrive}',
            '${depature}',
            '${arrive}',
            '${lungage}',
            '${reschedule}',
            '${refundable}',
            '${meal}',
            '${wifi}',
            '${price}',
            '${type_class}',
            '${capacity}',
            '${estimate}' ,
            '${terminal_verification}' ,
            '${status}',
            '${status_transit}',
             ${valueTransit}
            '${admin_id}'
        )`);
};

const updateFlight = (
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

  admin_id
) => {
  let updateTransit = ``;

  if (status_transit != "direct") {
    if (
      airport_transit_1 != "" ||
      airport_transit_1 != null ||
      (airport_transit_1 != undefined && airport_transit_2 == "") ||
      airport_transit_2 == null ||
      (airport_transit_2 == undefined && airport_transit_3 == "") ||
      airport_transit_3 == null ||
      (airport_transit_3 == undefined && airport_transit_4 == "") ||
      airport_transit_4 == null ||
      airport_transit_4 == undefined
    ) {
      updateTransit = `airport_transit_1='${airport_transit_1}',
                                time_transit_1='${time_transit_1}',
                                airport_transit_2=null,
                                time_transit_2=null,
                                airport_transit_3=null,
                                time_transit_3=null,
                                airport_transit_4=null,
                                time_transit_4=null,`;
    }
    if (
      airport_transit_1 != "" ||
      airport_transit_1 != null ||
      (airport_transit_1 != undefined && airport_transit_2 != "") ||
      airport_transit_2 != null ||
      (airport_transit_2 != undefined && airport_transit_3 == "") ||
      airport_transit_3 == null ||
      (airport_transit_3 == undefined && airport_transit_4 == "") ||
      airport_transit_4 == null ||
      airport_transit_4 == undefined
    ) {
      updateTransit = `airport_transit_1='${airport_transit_1}',
                                time_transit_1='${time_transit_1}',
                                airport_transit_2='${airport_transit_2}',
                                time_transit_2='${time_transit_2}',
                                airport_transit_3=null,
                                time_transit_3=null,
                                airport_transit_4=null,
                                time_transit_4=null,`;
    }
    if (
      airport_transit_1 != "" ||
      airport_transit_1 != null ||
      (airport_transit_1 != undefined && airport_transit_2 != "") ||
      airport_transit_2 != null ||
      (airport_transit_2 != undefined && airport_transit_3 != "") ||
      airport_transit_3 != null ||
      (airport_transit_3 != undefined && airport_transit_4 == "") ||
      airport_transit_4 == null ||
      airport_transit_4 == undefined
    ) {
      updateTransit = `airport_transit_1='${airport_transit_1}',
                                time_transit_1='${time_transit_1}',
                                airport_transit_2='${airport_transit_2}',
                                time_transit_2='${time_transit_2}',
                                airport_transit_3='${airport_transit_3}',
                                time_transit_3='${time_transit_3}',
                                airport_transit_4=null,
                                time_transit_4=null,`;
    }
    if (
      airport_transit_1 != "" ||
      airport_transit_1 != null ||
      (airport_transit_1 != undefined && airport_transit_2 != "") ||
      airport_transit_2 != null ||
      (airport_transit_2 != undefined && airport_transit_3 != "") ||
      airport_transit_3 != null ||
      (airport_transit_3 != undefined && airport_transit_4 != "") ||
      airport_transit_4 != null ||
      airport_transit_4 != undefined
    ) {
      updateTransit = `airport_transit_1='${airport_transit_1}',
                                time_transit_1='${time_transit_1}',
                                airport_transit_2='${airport_transit_2}',
                                time_transit_2='${time_transit_2}',
                                airport_transit_3='${airport_transit_3}',
                                time_transit_3='${time_transit_3}',
                                airport_transit_4='${airport_transit_4}',
                                time_transit_4='${time_transit_4}',`;
    }
  } else {
    updateTransit = `airport_transit_1=null,
                            time_transit_1=null,
                            airport_transit_2=null,
                            time_transit_2=null,
                            airport_transit_3=null,
                            time_transit_3=null,
                            airport_transit_4=null,
                            time_transit_4=null,`;
  }

  return Pool.query(`update flight set 
        airlines_id = '${airlines_id}',
        airport_depature = '${airport_depature}',
        airport_arrive = '${airport_arrive}',
        depature = '${depature}',
        arrive = '${arrive}',
        lungage = '${lungage}',
        reschedule = '${reschedule}',
        refundable = '${refundable}',
        meal = '${meal}',
        wifi = '${wifi}',
        price = '${price}',
        type_class = '${type_class}',
        capacity = '${capacity}',
        status = '${status}',
        
        estimate = '${estimate}',
        terminal_verification = '${terminal_verification}',
        status_transit = '${status_transit}',
        ${updateTransit}
        admin_id = '${admin_id}'
        
        WHERE id = '${id}'
        `);
};

const deleteFlight = (id) => {
  return Pool.query(`delete from flight where id='${id}'`);
};

const updateCapacity = (id , value) => {
  return Pool.query(`update flight set capacity = ${value} where id='${id}'`);
};

const countData = () => {
  return Pool.query("SELECT COUNT(*) FROM flight");
};

module.exports = {
  selectAll,
  selectAllSearch,
  selectPaginationFlight,
  selectFlight,
  selectUsers,
  insertFlight,
  updateFlight,
  deleteFlight,
  countData,
  selectAllSearchCount,
  updateCapacity,
};
