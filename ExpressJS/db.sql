CREATE DATABASE products;

CREATE TABLE users (
    id UUID PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    avatar VARCHAR(256),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE product (
    id UUID PRIMARY KEY,
    nama_product VARCHAR(32) NOT NULL,
    harga_beli INTEGER NOT NULL,
    harga_jual INTEGER NOT NULL,
    stok INTEGER NOT NULL,
    image VARCHAR(256),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)