
require("dotenv").config();

const axios = require("axios");

async function Log(stack, level, packageName, message) {
  try {
    const response = await axios.post(
      process.env.LOG_URL,
      {
        stack,
        level,
        package: packageName,
        message
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Logging failed:",
      error.response?.data || error.message
    );

    return null;
  }
}

module.exports = Log;