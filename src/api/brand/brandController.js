/*****************************************************/
/* CREATED AND DEVELOPED BY MANNMOHAN */
/*****************************************************/
const dbClient = require("../../config/db");
const moment = require("moment");
const bcrypt = require("bcrypt");

// CURRENT DATE
const currentDate = new Date().toISOString();
const fDate = moment(currentDate);
const formattedDate = fDate.format("YYYY-MM-DD HH:mm:ssZ");

const addBrand = async (req, res, next) => {
  const { name } = req.body;
  try {
    dbClient.query(
      `SELECT * FROM brand WHERE brand_name = $1;`,
      [name],
      (tErr, tRes) => {
        if (tErr) {
          res.status(400).json({
            message: `Error : ${tErr}`,
            status: 0,
          });
        }
        if (tRes.rowCount > 0) {
          res.status(201).json({ message: 'Brand already exist!', data: tRes.rows });

        } else {


          dbClient.query(
            `INSERT INTO brand (brand_name)
                VALUES ($1) RETURNING id;`,
            [
              name
            ],
            (tiErr, tiRes) => {
              if (tiErr) {
                res.status(400).json({
                  message: `Error : ${tiErr}`,
                  status: 0,
                });
              }
              res.status(201).json({ message: 'Brand Added Successfully!', data: tiRes });

            }
          );
        }
      }
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Get all employees
const getBrands = (req, res, next) => {
  dbClient.query("SELECT * FROM brand", (err, response) => {
    if (err) {
      res.status(400).json({
        message: `Error: ${err.message}`,
        status: 0,
      });
    }
    console.log(formattedDate);
    res.status(200).json({
      message: "Success",
      status: 1,
      data: response.rows,
    });
  });
};


module.exports = {
  addBrand,
  getBrands
};
