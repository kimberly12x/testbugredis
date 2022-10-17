const Pool = require("../config/db");

const findEmail = (email) => {
  return Pool.query(`SELECT * FROM users WHERE email='${email}'`);
};

const findUsername = (username) => {
  return Pool.query(`select * from users where username='${username}'`);
};

const findId = (id) => {
  return Pool.query(`select * from users where id='${id}'`);
};

const create = (id, email, passwordHash, name, role, verify) => {
  return Pool.query(`insert into users ( id , email , password , name , role  , verify ) values ( '${id}' , '${email}' , '${passwordHash}' , '${name}' , '${role}' ,'${verify}') `);
};

const createUsersVerification = (id, users_id, token) => {
  return Pool.query(`insert into users_verification ( id , users_id , token ) values ( '${id}' , '${users_id}' , '${token}' )`);
};

const checkUsersVerification = (queryUsersId, queryToken) => {
  return Pool.query(`select * from users_verification where users_id='${queryUsersId}' and token ilike '%${queryToken}%'`);
};

const deleteUsersVerification = (queryUsersId, queryToken) => {
  return Pool.query(`delete from users_verification  where users_id='${queryUsersId}' and token ilike '%${queryToken}%' `);
};

const deleteUsersVerificationAdmin = (users_id,id) => {
    return Pool.query(`delete from users_verification  where users_id='${users_id}' and token ilike '%${id}%'`);
};
  
const updateAccountVerification = (queryUsersId) => {
  return Pool.query(`update users set verify='true' where id='${queryUsersId}' `);
};

const updateAccount = (email, username ,name, country , city , address , postal_code, phone , picture) => {
  return Pool.query(
    `update users set name='${name}',  username='${username}', phone='${phone}', country='${country}', picture='${picture}', city = '${city}',  address = '${address}',  postal_code = '${postal_code}' where email='${email}'`
  );
};

const updateNoPict = (email, username ,name, country , city , address , postal_code, phone ) => {
  return Pool.query(
    `update users set name='${name}',  username='${username}', phone='${phone}', country='${country}' , city = '${city}',  address = '${address}',  postal_code = '${postal_code}' where email='${email}'`
  );
};

const changeEmailAccount = (email, emailBody) => {
  return Pool.query(`update users set email='${emailBody}' where email='${email}'`);
};

const changePassword = (email, passwordNewHash) => {
  return Pool.query(`update users set password='${passwordNewHash}' where email='${email}'`);
};

const deleteAccount = (email) => {
  return Pool.query(`delete from users where email='${email}'`);
};

const createRecruiterOnRegister = (recruiter_id, users_id, position, company) => {
  return Pool.query(`insert into recruiter ( id, users_id , position, company )  values ( '${recruiter_id}' , '${users_id}' , '${position}', '${company}' ) `);
};

module.exports = {
  findEmail,
  findUsername,
  findId,
  create,
  createUsersVerification,
  checkUsersVerification,
  deleteUsersVerification,deleteUsersVerificationAdmin,
  updateAccountVerification,
  updateAccount,
  updateNoPict,
  changeEmailAccount,
  changePassword,
  deleteAccount,
  createRecruiterOnRegister,
};
