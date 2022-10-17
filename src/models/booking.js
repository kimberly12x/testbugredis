const Pool = require("../config/db");
const selectAll = () => {
  return Pool.query(`select * from booking`);
};

const selectAllSearch = (querysearch) => {
  return Pool.query(`select * from booking  ${querysearch} `);
};

const selectAllSearchCount = (querysearch) => {
  return Pool.query(`select COUNT(*) from booking  ${querysearch} `);
};
// const selectPagination = ({ limit, offset, sortby, sort, querysearch }) => {
//     return Pool.query(`select * from booking  ${querysearch}  order by ${sortby} ${sort} limit ${limit} offset ${offset} `)
// }

const selectPaginationBooking = ({ limit, offset, sortby, sort, querysearch }) => {
  return Pool.query(`select

    booking.id ,	
    booking.booking_fullname ,	
    booking.booking_email ,	
    booking.booking_phone ,	
    booking.booking_status ,
    
    booking.trip_status ,
    booking.trip_depature,	
    booking.trip_arrive,

    booking.qr_code ,
    booking.qr_code_pc ,
    booking.barcode ,
    booking.barcode_pc ,


    booking.users_id ,	
    booking.flight_id ,	

    booking.payment_status  ,	
    booking.payment_discount,
    booking.payment_total ,	
    booking.payment_midtrans_snap_token  ,	

    booking.passenger_count ,	
    booking.passenger_title_1 ,	
    booking.passenger_fullname_1 ,	
    booking.passenger_nationality_1 ,	
    booking.passenger_title_2 ,	
    booking.passenger_fullname_2 ,	
    booking.passenger_nationality_2 ,	
    booking.passenger_title_3 ,	
    booking.passenger_fullname_3 ,	
    booking.passenger_nationality_3 ,	
    booking.passenger_title_4 ,	
    booking.passenger_fullname_4 ,	
    booking.passenger_nationality_4 ,	
    booking.passenger_title_5 ,	
    booking.passenger_fullname_5 ,	
    booking.passenger_nationality_5 ,	
    booking.passenger_title_6 ,	
    booking.passenger_fullname_6 ,	
    booking.passenger_nationality_6 ,
    
    booking.created_on,
    booking.updated_on,
    
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
    flight.time_transit_4

    from booking   ${querysearch}  order by ${sortby} ${sort} limit ${limit} offset ${offset} `);
};

const selectBooking = (id) => {
  return Pool.query(`select

   
  booking.id ,	
  booking.booking_fullname ,	
  booking.booking_email ,	
  booking.booking_phone ,	
  booking.booking_status ,
  

  booking.trip_status ,
  booking.trip_depature,	
  booking.trip_arrive,	

  booking.qr_code ,
  booking.qr_code_pc ,
  booking.barcode ,
  booking.barcode_pc ,


  booking.users_id ,	
  booking.flight_id ,	

  booking.payment_status  ,	
  booking.payment_discount,
  booking.payment_total ,	
  booking.payment_midtrans_snap_token  ,	

  booking.passenger_count ,	
  booking.passenger_title_1 ,	
  booking.passenger_fullname_1 ,	
  booking.passenger_nationality_1 ,	
  booking.passenger_title_2 ,	
  booking.passenger_fullname_2 ,	
  booking.passenger_nationality_2 ,	
  booking.passenger_title_3 ,	
  booking.passenger_fullname_3 ,	
  booking.passenger_nationality_3 ,	
  booking.passenger_title_4 ,	
  booking.passenger_fullname_4 ,	
  booking.passenger_nationality_4 ,	
  booking.passenger_title_5 ,	
  booking.passenger_fullname_5 ,	
  booking.passenger_nationality_5 ,	
  booking.passenger_title_6 ,	
  booking.passenger_fullname_6 ,	
  booking.passenger_nationality_6 ,
  
  booking.created_on,
  booking.updated_on,
  
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
  flight.time_transit_4

    from booking
   
    inner join users on booking.users_id = users.id 
    inner join flight on booking.flight_id = flight.id 
    inner join airlines on flight.airlines_id = airlines.id  
    inner join airport as airport_depature on flight.airport_depature = airport_depature.id 
    inner join airport as airport_arrive on flight.airport_arrive = airport_arrive.id
                                
    where booking.id='${id}'`);
};

const selectBookingBarcodeQRCode = (id) => {
  return Pool.query(`select

    booking.id ,	
    booking.users_id ,	
    booking.flight_id 

    from booking
                                
    where booking.id='${id}'`);
};

const selectUsers = (users_id) => {
  return Pool.query(`select COUNT(*) from users where id='${users_id}'`);
};

const insertBooking = (
  id,
  booking_fullname,
  booking_email,
  booking_phone,
  booking_status,

  trip_status,
  trip_depature,
  trip_arrive,

  users_id,
  flight_id,

  payment_status,
  payment_discount,
  payment_total,
  payment_midtrans_snap_token,

  passenger_count,
  passenger_title_1,
  passenger_fullname_1,
  passenger_nationality_1,
  passenger_title_2,
  passenger_fullname_2,
  passenger_nationality_2,
  passenger_title_3,
  passenger_fullname_3,
  passenger_nationality_3,
  passenger_title_4,
  passenger_fullname_4,
  passenger_nationality_4,
  passenger_title_5,
  passenger_fullname_5,
  passenger_nationality_5,
  passenger_title_6,
  passenger_fullname_6,
  passenger_nationality_6
) => {
  let dataPassenger = ``;
  let valuePassenger = ``;

  if (passenger_count == "1") {
    dataPassenger = ` passenger_title_1,
                      passenger_fullname_1,
                      passenger_nationality_1 `;
    valuePassenger = `'${passenger_title_1}',
                      '${passenger_fullname_1}',
                      '${passenger_nationality_1}' `;
  }
  if (passenger_count == "2") {
    dataPassenger = ` passenger_title_1,
                      passenger_fullname_1,
                      passenger_nationality_1,
                      passenger_title_2,
                      passenger_fullname_2,
                      passenger_nationality_2 `;
    valuePassenger = `'${passenger_title_1}',
                      '${passenger_fullname_1}',
                      '${passenger_nationality_1}',
                      '${passenger_title_2}',
                      '${passenger_fullname_2}',
                      '${passenger_nationality_2}' `;
  }
  if (passenger_count == "3") {
    dataPassenger = `passenger_title_1,
                      passenger_fullname_1,
                      passenger_nationality_1,
                      passenger_title_2,
                      passenger_fullname_2,
                      passenger_nationality_2,
                      passenger_title_3,
                      passenger_fullname_3,
                      passenger_nationality_3 `;
    valuePassenger = `'${passenger_title_1}',
                      '${passenger_fullname_1}',
                      '${passenger_nationality_1}',
                      '${passenger_title_2}',
                      '${passenger_fullname_2}',
                      '${passenger_nationality_2}',
                      '${passenger_title_3}',
                      '${passenger_fullname_3}',
                      '${passenger_nationality_3}' `;
  }

  if (passenger_count == "4") {
    dataPassenger = ` passenger_title_1,
                      passenger_fullname_1,
                      passenger_nationality_1,
                      passenger_title_2,
                      passenger_fullname_2,
                      passenger_nationality_2,
                      passenger_title_3,
                      passenger_fullname_3,
                      passenger_nationality_3,
                      passenger_title_4,
                      passenger_fullname_4,
                      passenger_nationality_4 `;
    valuePassenger = `'${passenger_title_1}',
                      '${passenger_fullname_1}',
                      '${passenger_nationality_1}',
                      '${passenger_title_2}',
                      '${passenger_fullname_2}',
                      '${passenger_nationality_2}',
                      '${passenger_title_3}',
                      '${passenger_fullname_3}',
                      '${passenger_nationality_3}',
                      '${passenger_title_4}',
                      '${passenger_fullname_4}',
                      '${passenger_nationality_4}' `;
  }

  if (passenger_count == "5") {
    dataPassenger = ` passenger_title_1,
                      passenger_fullname_1,
                      passenger_nationality_1,
                      passenger_title_2,
                      passenger_fullname_2,
                      passenger_nationality_2,
                      passenger_title_3,
                      passenger_fullname_3,
                      passenger_nationality_3,
                      passenger_title_4,
                      passenger_fullname_4,
                      passenger_nationality_4,
                      passenger_title_5,
                      passenger_fullname_5,
                      passenger_nationality_5 `;
    valuePassenger = `'${passenger_title_1}',
                      '${passenger_fullname_1}',
                      '${passenger_nationality_1}',
                      '${passenger_title_2}',
                      '${passenger_fullname_2}',
                      '${passenger_nationality_2}',
                      '${passenger_title_3}',
                      '${passenger_fullname_3}',
                      '${passenger_nationality_3}',
                      '${passenger_title_4}',
                      '${passenger_fullname_4}',
                      '${passenger_nationality_4}',
                      '${passenger_title_5}',
                      '${passenger_fullname_5}',
                      '${passenger_nationality_5}' `;
  }

  if (passenger_count == "6") {
    dataPassenger = ` passenger_title_1,
                      passenger_fullname_1,
                      passenger_nationality_1,
                      passenger_title_2,
                      passenger_fullname_2,
                      passenger_nationality_2,
                      passenger_title_3,
                      passenger_fullname_3,
                      passenger_nationality_3,
                      passenger_title_4,
                      passenger_fullname_4,
                      passenger_nationality_4,
                      passenger_title_5,
                      passenger_fullname_5,
                      passenger_nationality_5,
                      passenger_title_6,
                      passenger_fullname_6,
                      passenger_nationality_6 `;
    valuePassenger = `'${passenger_title_1}',
                      '${passenger_fullname_1}',
                      '${passenger_nationality_1}',
                      '${passenger_title_2}',
                      '${passenger_fullname_2}',
                      '${passenger_nationality_2}',
                      '${passenger_title_3}',
                      '${passenger_fullname_3}',
                      '${passenger_nationality_3}',
                      '${passenger_title_4}',
                      '${passenger_fullname_4}',
                      '${passenger_nationality_4}',
                      '${passenger_title_5}',
                      '${passenger_fullname_5}',
                      '${passenger_nationality_5}',
                      '${passenger_title_6}',
                      '${passenger_fullname_6}',
                      '${passenger_nationality_6}' `;
  }

  return Pool.query(`
  insert into booking 
  (    
    id,
    booking_fullname,
    booking_email,
    booking_phone,
    booking_status,

    trip_status,
    
    trip_depature,
    trip_arrive,

    users_id,
    flight_id,
  
    payment_status,
    payment_discount,
    payment_total,
    payment_midtrans_snap_token,
  
    passenger_count,

    ${dataPassenger}

     ) 
  
  
  values (
    '${id}',
    '${booking_fullname}',
    '${booking_email}',
    '${booking_phone}',
    '${booking_status}',

    '${trip_status}',
    
    '${trip_depature}',
    '${trip_arrive}',

    
    '${users_id}',
    '${flight_id}',

    '${payment_status}',
    '${payment_discount}',
    '${payment_total}',
    '${payment_midtrans_snap_token}',

    '${passenger_count}',

    ${valuePassenger}

  )`);
};

const updateBookingAdmin = (
  id,
  booking_fullname,
  booking_email,
  booking_phone,
  booking_status,

  trip_status,
  trip_depature,
  trip_arrive,

  users_id,
  flight_id,

  payment_status,
  payment_discount,
  payment_total,
  payment_midtrans_snap_token,

  passenger_count,
  passenger_title_1,
  passenger_fullname_1,
  passenger_nationality_1,
  passenger_title_2,
  passenger_fullname_2,
  passenger_nationality_2,
  passenger_title_3,
  passenger_fullname_3,
  passenger_nationality_3,
  passenger_title_4,
  passenger_fullname_4,
  passenger_nationality_4,
  passenger_title_5,
  passenger_fullname_5,
  passenger_nationality_5,
  passenger_title_6,
  passenger_fullname_6,
  passenger_nationality_6
) => {
  let updateTripArrive = ``;

  if (trip_status == "one_way") {
    updateTripArrive = `trip_arrive = null ,`;
  }
  if (trip_status == "rounded_trip") {
    updateTripArrive = `trip_arrive = '${trip_arrive}' ,`;
  }

  let updatePassenger = ``;

  if (passenger_count == "1") {
    updatePassenger = ` passenger_title_1   = '${passenger_title_1}',
                        passenger_fullname_1   = '${passenger_fullname_1}',
                        passenger_nationality_1   = '${passenger_nationality_1}',
                        passenger_title_2   = null,
                        passenger_fullname_2   = null,
                        passenger_nationality_2   = null,
                        passenger_title_3   = null,
                        passenger_fullname_3   = null,
                        passenger_nationality_3   = null,
                        passenger_title_4   = null,
                        passenger_fullname_4   = null,
                        passenger_nationality_4   = null,
                        passenger_title_5   = null,
                        passenger_fullname_5   = null,
                        passenger_nationality_5   = null,
                        passenger_title_6   = null,
                        passenger_fullname_6   = null,
                        passenger_nationality_6 = null  `;
  }
  if (passenger_count == "2") {
    updatePassenger = ` passenger_title_1   = '${passenger_title_1}',
                        passenger_fullname_1   = '${passenger_fullname_1}',
                        passenger_nationality_1   = '${passenger_nationality_1}',
                        passenger_title_2   = '${passenger_title_2}',
                        passenger_fullname_2   = '${passenger_fullname_2}',
                        passenger_nationality_2   = '${passenger_nationality_2}',
                        passenger_title_3   = null,
                        passenger_fullname_3   = null,
                        passenger_nationality_3   = null,
                        passenger_title_4   = null,
                        passenger_fullname_4   = null,
                        passenger_nationality_4   = null,
                        passenger_title_5   = null,
                        passenger_fullname_5   = null,
                        passenger_nationality_5   = null,
                        passenger_title_6   = null,
                        passenger_fullname_6   = null,
                        passenger_nationality_6 = null  `;
  }
  if (passenger_count == "3") {
    updatePassenger = ` passenger_title_1   = '${passenger_title_1}',
                        passenger_fullname_1   = '${passenger_fullname_1}',
                        passenger_nationality_1   = '${passenger_nationality_1}',
                        passenger_title_2   = '${passenger_title_2}',
                        passenger_fullname_2   = '${passenger_fullname_2}',
                        passenger_nationality_2   = '${passenger_nationality_2}',
                        passenger_title_3   = '${passenger_title_3}',
                        passenger_fullname_3   = '${passenger_fullname_3}',
                        passenger_nationality_3   = '${passenger_nationality_3}',
                        passenger_title_4   = null,
                        passenger_fullname_4   = null,
                        passenger_nationality_4   = null,
                        passenger_title_5   = null,
                        passenger_fullname_5   = null,
                        passenger_nationality_5   = null,
                        passenger_title_6   = null,
                        passenger_fullname_6   = null,
                        passenger_nationality_6 =  null `;
  }

  if (passenger_count == "4") {
    updatePassenger = ` passenger_title_1   = '${passenger_title_1}',
                        passenger_fullname_1   = '${passenger_fullname_1}',
                        passenger_nationality_1   = '${passenger_nationality_1}',
                        passenger_title_2   = '${passenger_title_2}',
                        passenger_fullname_2   = '${passenger_fullname_2}',
                        passenger_nationality_2   = '${passenger_nationality_2}',
                        passenger_title_3   = '${passenger_title_3}',
                        passenger_fullname_3   = '${passenger_fullname_3}',
                        passenger_nationality_3   = '${passenger_nationality_3}',
                        passenger_title_4   = '${passenger_title_4}',
                        passenger_fullname_4   = '${passenger_fullname_4}',
                        passenger_nationality_4   = '${passenger_nationality_4}',
                        passenger_title_5   = null,
                        passenger_fullname_5   =  null,
                        passenger_nationality_5   =  null,
                        passenger_title_6   = null,
                        passenger_fullname_6   =  null,
                        passenger_nationality_6 =  null `;
  }

  if (passenger_count == "5") {
    updatePassenger = ` passenger_title_1   = '${passenger_title_1}',
                        passenger_fullname_1   = '${passenger_fullname_1}',
                        passenger_nationality_1   = '${passenger_nationality_1}',
                        passenger_title_2   = '${passenger_title_2}',
                        passenger_fullname_2   = '${passenger_fullname_2}',
                        passenger_nationality_2   = '${passenger_nationality_2}',
                        passenger_title_3   = '${passenger_title_3}',
                        passenger_fullname_3   = '${passenger_fullname_3}',
                        passenger_nationality_3   = '${passenger_nationality_3}',
                        passenger_title_4   = '${passenger_title_4}',
                        passenger_fullname_4   = '${passenger_fullname_4}',
                        passenger_nationality_4   = '${passenger_nationality_4}',
                        passenger_title_5   = '${passenger_title_5}',
                        passenger_fullname_5   = '${passenger_fullname_5}',
                        passenger_nationality_5   = '${passenger_nationality_5}',
                        passenger_title_6   = null,
                        passenger_fullname_6   = null,
                        passenger_nationality_6 = null  `;
  }

  if (passenger_count == "6") {
    updatePassenger = ` passenger_title_1   = '${passenger_title_1}',
                        passenger_fullname_1   = '${passenger_fullname_1}',
                        passenger_nationality_1   = '${passenger_nationality_1}',
                        passenger_title_2   = '${passenger_title_2}',
                        passenger_fullname_2   = '${passenger_fullname_2}',
                        passenger_nationality_2   = '${passenger_nationality_2}',
                        passenger_title_3   = '${passenger_title_3}',
                        passenger_fullname_3   = '${passenger_fullname_3}',
                        passenger_nationality_3   = '${passenger_nationality_3}',
                        passenger_title_4   = '${passenger_title_4}',
                        passenger_fullname_4   = '${passenger_fullname_4}',
                        passenger_nationality_4   = '${passenger_nationality_4}',
                        passenger_title_5   = '${passenger_title_5}',
                        passenger_fullname_5   = '${passenger_fullname_5}',
                        passenger_nationality_5   = '${passenger_nationality_5}',
                        passenger_title_6   = '${passenger_title_6}',
                        passenger_fullname_6   = '${passenger_fullname_6}',
                        passenger_nationality_6 ='${passenger_nationality_6}'  `;
  }

  return Pool.query(`
  update booking set 
  
 
  booking_fullname='${booking_fullname}',
  booking_email='${booking_email}',
  booking_phone='${booking_phone}',
  booking_status='${booking_status}',
  trip_status='${trip_status}',
  trip_depature = '${trip_depature}',
  ${updateTripArrive}
  users_id='${users_id}',
  flight_id='${flight_id}',
  payment_status='${payment_status}',
  payment_discount = '${payment_discount}',
  payment_total='${payment_total}',
  payment_midtrans_snap_token='${payment_midtrans_snap_token}',
  passenger_count='${passenger_count}',
  ${updatePassenger}

  WHERE booking.id = '${id}'`);
};

const deleteBooking = (id) => {
  return Pool.query(`delete from booking where id='${id}'`);
};

const countData = () => {
  return Pool.query("SELECT COUNT(*) FROM booking");
};

const updateBookingPaymentSuccess = (id) => {
  return Pool.query(`update booking set booking_status = 'success' , payment_status = 'success'  WHERE id = '${id}'`);
};

const updateBookingPaymentError = (id) => {
  return Pool.query(`update booking set booking_status = 'failed' , payment_status = 'failed'   WHERE id = '${id}'`);
};

const updateBookingQRCode = (id, value) => {
  return Pool.query(`update booking set qr_code =  '${value}'  WHERE id = '${id}'`);
};

const updateBookingBarCode = (id, value) => {
  return Pool.query(`update booking set barcode = '${value}'  WHERE id = '${id}'`);
};

module.exports = {
  selectAll,
  selectAllSearch,
  selectAllSearchCount,
  selectPaginationBooking,
  selectBooking,
  selectUsers,
  insertBooking,
  updateBookingAdmin,
  deleteBooking,
  countData,
  updateBookingPaymentSuccess,
  updateBookingPaymentError,
  selectBookingBarcodeQRCode,
  updateBookingQRCode,
  updateBookingBarCode,
};
