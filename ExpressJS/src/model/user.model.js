const pool = require("../config/db");

const userModel = {
  // auth
  register: (data) => {
    return pool.query(
      `
            INSERT INTO users (id, email, password, full_name)
            VALUES ($1, $2, $3, $4)
            `,
      [data.id, data.email, data.password, data.full_name]
    );
  },
  // get all user
  userAll: () => {
    return pool.query(`SELECT * FROM users`);
  },

  // get user detail
  userDetail: (id) => {
    return pool.query(`SELECT * FROM users where id = $1`, [id]);
  },

  emailCheck: (email) => {
    return pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
  },

  //update user
  updateUser: (data) => {
    return pool.query(
      `
    UPDATE users SET
    email = COALESCE($1, email),
    full_name = COALESCE($2, full_name),
    avatar = COALESCE($3, avatar)
    WHERE id = $4
    `,
      [data.email, data.full_name, data.file, data.id]
    );
  },

  //delete
  removed: (id) => {
    return pool.query(`DELETE FROM users WHERE id = $1`, [id]);
  },
};

module.exports = userModel;
