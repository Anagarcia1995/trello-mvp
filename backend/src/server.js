require("dotenv").config();

const app = require("./app");
const { sequelize } = require("./db");

const PORT = process.env.PORT || 3000;

/**
 * Punto de arranque del servidor.
 * - Conecta a la DB
 * - Levanta Express
 */
async function start() {
  try {
    await sequelize.authenticate();
    console.log("DB connected");

    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("DB connection error:", err.message);
    process.exit(1);
  }
}

start();
