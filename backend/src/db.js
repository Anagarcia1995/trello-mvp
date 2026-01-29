require("dotenv").config();
const { Sequelize } = require("sequelize");

/**
 * Conexión a la base de datos con Sequelize.
 * Credenciales por variables de entorno para soportar distintos entornos.
 */
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false,
  }
);

module.exports = { sequelize };
