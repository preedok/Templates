const pool = require("../config/db");

const productModel = {
  // get
  getAll: () => {
    return pool.query(`SELECT * FROM product`);
  },

  // get detail
  getDetail: (id) => {
    return pool.query(`SELECT * FROM product WHERE id = $1`, [id]);
  },

  // create
  create: (data) => {
    return pool.query(
      `
      INSERT INTO product (id, nama_product, harga_beli, harga_jual, stok, image) VALUES ($1, $2, $3, $4, $5, $6)
        `,
      [
        data.id,
        data.nama_product,
        data.harga_beli,
        data.harga_jual,
        data.stok,
        data.image,
      ]
    );
  },

  // update
  edit: (data) => {
    return pool.query(
      `
    UPDATE product SET
    nama_product = COALESCE($1, nama_product),
    harga_beli = COALESCE($2, harga_beli),
    harga_jual = COALESCE($3,  harga_jual),
    stok = COALESCE($4, stok),
    image = COALESCE($5, image)
    WHERE id = $6
    `,
      [
        data.nama_product,
        data.harga_beli,
        data.harga_jual,
        data.stok,
        data.image,
        data.id,
      ]
    );
  },

  // delete
  delete: (id) => {
    return pool.query(`DELETE FROM product WHERE id = $1`, [id]);
  },
};

module.exports = productModel;
