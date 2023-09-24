/*****************************************************/
/* CREATED AND DEVELOPED BY MANNMOHAN */
/*****************************************************/
const jwt = require("jsonwebtoken");
const dbClient = require("../../config/db");

const loginUser = (req, res, next) => {
  var empId = req.body.emp_id,
    pwd = req.body.password;


  if (empId === "" || pwd === "") {
    res.status(400).json({
      message: "Employee ID or Password is incorrect",
    });
  }

  dbClient.query(
    `SELECT * FROM users WHERE emp_id = $1;`,
    [empId],
    (err, result) => {
      if (err) {
        console.log("Error:", err);
      }

      if (result.rows[0].password === pwd) {
        if (result.rows[0].user_type === '1') {
          let token = jwt.sign({ name: result.rows[0].phone }, "admin", {
            expiresIn: "1h",
          });
          dbClient.query(
            `UPDATE users set api_token = $1 WHERE emp_id = $2`,
            [token, empId],
            (error, response) => {
              if (error) {
                console.log(error);
              }
              console.log(response.command);
              if (response.command === "UPDATE") {
                dbClient.query(
                  `SELECT * FROM users WHERE emp_id = $1`,
                  [empId],
                  (e, updtResp) => {
                    if (e) {
                      console.log(e);
                    }

                    res.status(200).json({
                      message: "Login successfull with ADMIN role",
                      status:1,
                      data: {
                        userID: updtResp.rows[0].id,
                        empID: updtResp.rows[0].emp_id,
                        token: updtResp.rows[0].api_token,
                        user_role: result.rows[0].user_type,
                      },
                    });
                  }
                );
              } else {
                res.status(400).json({
                  message: "Somthing went wrong!",
                });
              }
            }
          );
        } else if (result.rows[0].user_type === '2') {
          let token = jwt.sign({ name: result.rows[0].phone }, "user", {
            expiresIn: "1h",
          });
          dbClient.query(
            `UPDATE users set api_token = $1 WHERE emp_id = $2`,
            [token, empId],
            (error, response) => {
              if (error) {
                console.log(error);
              }
              console.log(response.command);
              if (response.command === "UPDATE") {
                dbClient.query(
                  `SELECT * FROM users WHERE emp_id = $1`,
                  [empId],
                  (e, updtResp) => {
                    if (e) {
                      console.log(e);
                    }

                    res.status(200).json({
                      message: "Login successfull with USER role",
                      status:1,
                      data: {
                        userID: updtResp.rows[0].id,
                        empID: updtResp.rows[0].emp_id,
                        token: updtResp.rows[0].api_token,
                        user_role: result.rows[0].user_type,
                      },
                    });
                  }
                );
              } else {
                res.status(400).json({
                  message: "Somthing went wrong!",
                });
              }
            }
          );
        } else if (result.rows[0].user_type === '3') {
          let token = jwt.sign({ name: result.rows[0].phone }, "technician", {
            expiresIn: "1h",
          });
          dbClient.query(
            `UPDATE users set api_token = $1 WHERE emp_id = $2`,
            [token, empId],
            (error, response) => {
              if (error) {
                console.log(error);
              }
              console.log(response.command);
              if (response.command === "UPDATE") {
                dbClient.query(
                  `SELECT * FROM users WHERE emp_id = $1`,
                  [empId],
                  (e, updtResp) => {
                    if (e) {
                      console.log(e);
                    }

                    res.status(200).json({
                      message: "Login successfull with TECHNICIAN role",
                      status:1,
                      data: {
                        userID: updtResp.rows[0].id,
                        empID: updtResp.rows[0].emp_id,
                        token: updtResp.rows[0].api_token,
                        user_role: result.rows[0].user_type,
                      },
                    });
                  }
                );
              } else {
                res.status(400).json({
                  message: "Somthing went wrong!",
                  status:0
                });
              }
            }
          );
        }
      } else {
        res.status(400).json({
          message: "ERROR! Password is incorrect",
          status:0
        });
      }
    }
  );
};

const forgetPassword = (req, res, next) => {
  var userEmail = req.body.email;

  dbClient.query(
    `SELECT * FROM users WHERE email = $1`,
    [userEmail],
    (err, result) => {
      if (err) {
        res.status(400).json({
          message: "Error",
          err,
        });
      }

      res.status(200).json({
        message: "Success",
        data: {
          userId: result.rows[0].id,
          name: result.rows[0].name,
          password: result.rows[0].password,
        },
      });
    }
  );
};

const changePassword = (req, res, next) => {
  var _empId = req.body.emp_id,
    _prev_pass = req.body.prev_pass,
    _new_pass = req.body.new_pass;

  dbClient.query(
    `SELECT * FROM users where emp_id = $1`,
    [_empId],
    (err, resp) => {
      if (err) {
        res.status(400).json({
          message: "Something went wrong!",
        });
      }

      if (resp.rows[0].password === _prev_pass) {
        dbClient.query(
          `UPDATE users SET password = $2 WHERE emp_id = $3`,
          [_new_pass, _empId],
          (err, updtResp) => {
            if (err) {
              res.status(400).json({
                message: "Something went wrong!",
              });
            }

            res.status(200).json({
              message: "Password changed successfully!",
            });
          }
        );
      } else {
        res.status(400).json({
          message: "Password doesn't match!",
        });
      }
    }
  );
};

module.exports = {
  loginUser,
  forgetPassword,
  changePassword,
};
