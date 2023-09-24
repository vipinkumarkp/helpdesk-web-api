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

const addCategory = async (req, res, next) => {
  const { name, status } = req.body;
  try {
    dbClient.query(
      `SELECT * FROM categories WHERE c_name = $1;`,
      [name],
      (tErr, tRes) => {
        if (tErr) {
          res.status(400).json({
            message: `Error : ${tErr}`,
            status: 0,
          });
        }
        if (tRes.rowCount > 0) {
          res.status(201).json({ message: 'Category already exist!', data: tRes.rows });

        } else {


          dbClient.query(
            `INSERT INTO categories (c_name)
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
              res.status(201).json({ message: 'Category Added Successfully!', data: tiRes });

            }
          );
        }
      }
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


const addSubCategory = async (req, res, next) => {
  const { categoryId, name, status } = req.body;
  try {
    // Hash password
    // name, email,emp_id, password, user_type, dob, doj,phone
    dbClient.query(
      `SELECT * FROM sub_categories WHERE s_name = $1 and c_id = $2;`,
      [name, categoryId],
      (tErr, tRes) => {
        if (tErr) {
          res.status(400).json({
            message: `Error : ${tErr}`,
            status: 0,
          });
        }
        if (tRes && tRes.rowCount > 0) {
          res.status(201).json({ message: 'Sub Category already exist!', data: tRes.rows });

        } else {


          dbClient.query(
            `INSERT INTO sub_categories (c_id,s_name, status,created_at, updated_at)
                VALUES ($1, $2, $3, $4, $5) RETURNING id;`,
            [
              categoryId, name, status,
              moment(currentDate).format("YYYY-MM-DD HH:mm:ssZ"),
              moment(currentDate).format("YYYY-MM-DD HH:mm:ssZ")
            ],
            (tiErr, tiRes) => {
              if (tiErr) {
                res.status(400).json({
                  message: `Error : ${tiErr}`,
                  status: 0,
                });
              }
              res.status(201).json({ message: 'Sub Category Added Successfully!' });

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
const getCategories = (req, res, next) => {
  dbClient.query("SELECT * FROM categories", (err, response) => {
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



const updateEmployeeStatus = (req, res, next) => {
  const { id, status } = req.body;
  dbClient.query("UPDATE hd_users SET user_status= $2 WHERE id = $1", [id, status], (err, response) => {
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

// Get sub categories by category id
const getSubCategories = (req, res, next) => {
  var _categ_id = req.params.c_id;
  dbClient.query(
    "SELECT * FROM sub_categories WHERE c_id = $1",
    [_categ_id],
    (err, response) => {
      if (err) {
        res.status(400).json({
          message: `Error: ${err.message}`,
          status: 0,
        });
      }

      res.status(200).json({
        message: "Success",
        status: 1,
        data: response.rows,
      });
    }
  );
};

module.exports = {
  addCategory,
  addSubCategory,
  getSubCategories,
  getCategories
};
