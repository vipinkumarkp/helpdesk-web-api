/*****************************************************/
/* CREATED AND DEVELOPED BY MANNMOHAN */
/*****************************************************/
const dbClient = require("../../config/db");
const moment = require("moment");

// CURRENT DATE
const currentDate = new Date().toISOString();
const fDate = moment(currentDate);
const formattedDate = fDate.format("YYYY-MM-DD HH:mm:ssZ");

// Get all Categories
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

// Get My Tickets
const getMyTickets = (req, res, next) => {
  var _userId = req.params.id;
  dbClient.query(
    `SELECT * FROM tickets WHERE raised_by = $1;`,
    [_userId],
    (err, response) => {
      if (err) {
        res.status(400).json({
          message: "ERROR",
          err,
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

// Ticket Creation
const createTicket = (req, res, next) => {
  var raised_by = req.body.user_id,
    sc_id = req.body.sc_id,
    title = req.body.title,
    dscrptn = req.body.desc,
    created_at = req.body.created_at,
    t_status = "OPEN",
    updated_at = created_at;

  /****** CHECKING FOR VALUES ******/
  if (
    raised_by === null ||
    sc_id === null ||
    title === "" ||
    dscrptn === "" ||
    created_at === ""
  ) {
    res.status(400).json({
      message: "Check all inputs!",
      status: 0,
    });
  } else {
    /****** FETCHING DATA FROM sub_categories *******/
    dbClient.query(
      `SELECT * FROM sub_categories WHERE id = $1;`,
      [sc_id],
      (err, sRes) => {
        if (err) {
          res.status(400).json({
            message: `Error : ${err}`,
            status: 0,
          });
        }
        /******** FETCHING DATA FROM technicians *******/
        dbClient.query(
          `SELECT * FROM technicians WHERE tech_categ = $1;`,
          [sRes.rows[0]["c_id"]],
          (tErr, tRes) => {
            if (tErr) {
              res.status(400).json({
                message: `Error : ${tErr}`,
                status: 0,
              });
            }
            if (tRes.rowCount > 0) {
              // IF ONLY ONE TECHNICIAN
              if (tRes.rowCount === 1) {
                // INSERT VALUES INTO TICKETS
                dbClient.query(
                  `INSERT INTO tickets (sc_id, title, description, raised_by, assigned_to, created_at, updated_at, ticket_status)
                  VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
                  [
                    sc_id,
                    title,
                    dscrptn,
                    raised_by,
                    tRes.rows[0]["id"],
                    created_at,
                    updated_at,
                    t_status,
                  ],
                  (tiErr, tiRes) => {
                    if (tiErr) {
                      res.status(400).json({
                        message: `Error : ${tiErr}`,
                        status: 0,
                      });
                    }
                    if (tiRes.command === "INSERT") {
                      dbClient.query(
                        `SELECT * FROM tickets WHERE created_at = $1;`,
                        [formattedDate],
                        (cuErr, cuRes) => {
                          if (cuErr) {
                            res.status(400).json({
                              message: `Error : ${err}`,
                              status: 0,
                            });
                          }
                          dbClient.query(
                            `INSERT INTO tech_tickets (tech_id, ticket_id, ticket_status) 
                                    VALUES ($1, $2, $3);`,
                            [
                              tRes.rows[0]["id"],
                              cuRes.rows[0]["id"],
                              cuRes.rows[0]["ticket_status"],
                            ],
                            (ttErr, ttRes) => {
                              if (ttErr) {
                                res.status(400).json({
                                  message: `Error: ${ttErr}`,
                                  status: 0,
                                });
                              }
                              if (ttRes.command === "INSERT") {
                                dbClient.query(
                                  `SELECT * FROM tech_tickets WHERE tech_id = $1;`,
                                  [tRes.rows[0]["id"]],
                                  (techError, techResult) => {
                                    if (techError) {
                                      res.status(400).json({
                                        message: `Error: ${techError}`,
                                        status: 0,
                                      });
                                    }
                                    dbClient.query(
                                      `UPDATE technicians SET ticket_count = $1 WHERE id = $2`,
                                      [techResult.rowCount, tRes.rows[0]["id"]],
                                      (error, updateRes) => {
                                        if (error) {
                                          res.status(400).json({
                                            message: `Error: ${techError}`,
                                            status: 0,
                                          });
                                        }
                                        res.status(200).json({
                                          message: "Success",
                                          status: 1,
                                        });
                                      }
                                    );
                                  }
                                );
                              } else {
                                res.status(400).json({
                                  message: `Something went wrong!`,
                                  status: 0,
                                });
                              }
                            }
                          );
                        }
                      );
                    }
                  }
                );
              } else {
                // IF MORETHAN ONE TECHNICIAN
                for (let i = 0; i < tRes.rows.length; i++) {
                  const element = tRes.rows[i];
                  if (element.ticket_count === 0) {
                    dbClient.query(
                      `INSERT INTO tickets (sc_id, title, description, raised_by, assigned_to, created_at, updated_at, ticket_status)
                  VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
                      [
                        sc_id,
                        title,
                        dscrptn,
                        raised_by,
                        element.id,
                        created_at,
                        updated_at,
                        t_status,
                      ],
                      (tiErr, tiRes) => {
                        if (tiErr) {
                          res.status(400).json({
                            message: `Error TI: ${tiErr}`,
                            status: 0,
                          });
                        }
                        if (tiRes.command === "INSERT") {
                          dbClient.query(
                            `SELECT * FROM tickets WHERE created_at = $1;`,
                            [formattedDate.slice(0, -1)],
                            (cuErr, cuRes) => {
                              if (cuErr) {
                                res.status(400).json({
                                  message: `Error : ${err}`,
                                  status: 0,
                                });
                              }
                              console.log(cuRes.rows);
                              dbClient.query(
                                `INSERT INTO tech_tickets (tech_id, ticket_id, ticket_status) 
                                        VALUES ($1, $2, $3);`,
                                [
                                  tRes.rows[0]["id"],
                                  cuRes.rows[0]["id"],
                                  cuRes.rows[0]["ticket_status"],
                                ],
                                (ttErr, ttRes) => {
                                  if (ttErr) {
                                    res.status(400).json({
                                      message: `Error: ${ttErr}`,
                                      status: 0,
                                    });
                                  }
                                  if (ttRes.command === "INSERT") {
                                    dbClient.query(
                                      `SELECT * FROM tech_tickets WHERE tech_id = $1;`,
                                      [element.id],
                                      (techError, techResult) => {
                                        if (techError) {
                                          res.status(400).json({
                                            message: `Error: ${techError}`,
                                            status: 0,
                                          });
                                        }
                                        dbClient.query(
                                          `UPDATE technicians SET ticket_count = $1 WHERE id = $2`,
                                          [techResult.rowCount, element.id],
                                          (error, updateRes) => {
                                            if (error) {
                                              res.status(400).json({
                                                message: `Error: ${techError}`,
                                                status: 0,
                                              });
                                            }
                                            res.status(200).json({
                                              message: "Success",
                                              status: 1,
                                            });
                                          }
                                        );
                                      }
                                    );
                                  } else {
                                    res.status(400).json({
                                      message: `Something went wrong!`,
                                      status: 0,
                                    });
                                  }
                                }
                              );
                            }
                          );
                        }
                      }
                    );
                    break;
                  } else if (element.ticket_count < 5) {
                    dbClient.query(
                      `INSERT INTO tickets (sc_id, title, description, raised_by, assigned_to, created_at, updated_at, ticket_status)
                      VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
                      [
                        sc_id,
                        title,
                        dscrptn,
                        raised_by,
                        element.id,
                        created_at,
                        updated_at,
                        t_status,
                      ],
                      (tiErr, tiRes) => {
                        if (tiErr) {
                          res.status(400).json({
                            message: `Error : ${tiErr}`,
                            status: 0,
                          });
                        }
                        if (tiRes.command === "INSERT") {
                          dbClient.query(
                            `SELECT * FROM tickets WHERE created_at = $1;`,
                            [formattedDate],
                            (cuErr, cuRes) => {
                              if (cuErr) {
                                res.status(400).json({
                                  message: `Error : ${err}`,
                                  status: 0,
                                });
                              }
                              dbClient.query(
                                `INSERT INTO tech_tickets (tech_id, ticket_id, ticket_status) 
                                        VALUES ($1, $2, $3);`,
                                [
                                  element.id,
                                  cuRes.rows[0]["id"],
                                  cuRes.rows[0]["ticket_status"],
                                ],
                                (ttErr, ttRes) => {
                                  if (ttErr) {
                                    res.status(400).json({
                                      message: `Error: ${ttErr}`,
                                      status: 0,
                                    });
                                  }
                                  if (ttRes.command === "INSERT") {
                                    dbClient.query(
                                      `SELECT * FROM tech_tickets WHERE tech_id = $1;`,
                                      [element.id],
                                      (techError, techResult) => {
                                        if (techError) {
                                          res.status(400).json({
                                            message: `Error: ${techError}`,
                                            status: 0,
                                          });
                                        }
                                        dbClient.query(
                                          `UPDATE technicians SET ticket_count = $1 WHERE id = $2`,
                                          [techResult.rowCount, element.id],
                                          (error, updateRes) => {
                                            if (error) {
                                              res.status(400).json({
                                                message: `Error: ${techError}`,
                                                status: 0,
                                              });
                                            }
                                            res.status(200).json({
                                              message: "Success",
                                              status: 1,
                                            });
                                          }
                                        );
                                      }
                                    );
                                  } else {
                                    res.status(400).json({
                                      message: `Something went wrong!`,
                                      status: 0,
                                    });
                                  }
                                }
                              );
                            }
                          );
                        }
                      }
                    );
                    break;
                  } else {
                    dbClient.query(
                      `INSERT INTO tickets (sc_id, title, description, raised_by, assigned_to, created_at, updated_at, ticket_status)
                      VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
                      [
                        sc_id,
                        title,
                        dscrptn,
                        raised_by,
                        tRes.rows[i + 1]["id"],
                        created_at,
                        updated_at,
                        t_status,
                      ],
                      (tiErr, tiRes) => {
                        if (tiErr) {
                          res.status(400).json({
                            message: `Error : ${tiErr}`,
                            status: 0,
                          });
                        }
                        if (tiRes.command === "INSERT") {
                          dbClient.query(
                            `SELECT * FROM tickets WHERE created_at = $1;`,
                            [formattedDate],
                            (cuErr, cuRes) => {
                              if (cuErr) {
                                res.status(400).json({
                                  message: `Error : ${err}`,
                                  status: 0,
                                });
                              }
                              dbClient.query(
                                `INSERT INTO tech_tickets (tech_id, ticket_id, ticket_status) 
                                        VALUES ($1, $2, $3);`,
                                [
                                  tRes.rows[i + 1]["id"],
                                  cuRes.rows[0]["id"],
                                  cuRes.rows[0]["ticket_status"],
                                ],
                                (ttErr, ttRes) => {
                                  if (ttErr) {
                                    res.status(400).json({
                                      message: `Error: ${ttErr}`,
                                      status: 0,
                                    });
                                  }
                                  if (ttRes.command === "INSERT") {
                                    dbClient.query(
                                      `SELECT * FROM tech_tickets WHERE tech_id = $1;`,
                                      [tRes.rows[i + 1]["id"]],
                                      (techError, techResult) => {
                                        if (techError) {
                                          res.status(400).json({
                                            message: `Error: ${techError}`,
                                            status: 0,
                                          });
                                        }
                                        dbClient.query(
                                          `UPDATE technicians SET ticket_count = $1 WHERE id = $2`,
                                          [
                                            techResult.rowCount,
                                            tRes.rows[i + 1]["id"],
                                          ],
                                          (error, updateRes) => {
                                            if (error) {
                                              res.status(400).json({
                                                message: `Error: ${techError}`,
                                                status: 0,
                                              });
                                            }
                                            res.status(200).json({
                                              message: "Success",
                                              status: 1,
                                            });
                                          }
                                        );
                                      }
                                    );
                                  } else {
                                    res.status(400).json({
                                      message: `Something went wrong!`,
                                      status: 0,
                                    });
                                  }
                                }
                              );
                            }
                          );
                        }
                      }
                    );
                  }
                }
              }
            }
          }
        );
      }
    );
  }
};

// Close Ticket
const closeTicket = (req, res, next) => {
  var _userId = req.body.user_id,
    _ticketId = req.body.ticket_id,
    _reason = req.body.reason;

  /**** Checking if all inputs are available ****/
  if (_userId === null || _ticketId === null || _reason === "") {
    res.status(400).json({
      message: "Values are missing",
      status: 0,
    });
  } else {
    dbClient.query(
      `UPDATE tickets SET ticket_status = $1, reason = $2, closed_by = $3 WHERE id = $4;`,
      ["CLOSED", _reason, _userId, _ticketId],
      (closeError, closeResponse) => {
        if (closeError) {
          res.status(400).json({
            message: closeError,
            status: 0,
          });

          if (closeResponse.command === "UPDATE") {
            dbClient.query(
              `SELECT * FROM tickets WHERE id = $1;`,
              [_ticketId],
              (e, t) => {
                if (e) {
                  res.status(400).json({
                    message: e,
                    status: 0,
                  });

                  dbClient.query(
                    `UPDATE tech_tickets SET ticket_status = $1 WHERE tech_id = $2;`,
                    [t.rows[0]["ticket_status"], t.rows[0]["assigned_to"]],
                    (techError, techResponse) => {
                      if (techError) {
                        res.status(400).json({
                          message: techError,
                          status: 0,
                        });
                      }

                      if (techResponse.command === "UPDATE") {
                        dbClient.query(
                          `SELECT * FROM tech_tickets WHERE tech_id = $1 and ticket_status = $2 or ticket_status = $3;`,
                          [t.rows[0]["assigned_to"], "OPEN", "IN PROGRESS"],
                          (er, resp) => {
                            if (er) {
                              res.status(400).json({
                                message: er,
                                status: 0,
                              });
                            }

                            dbClient.query(
                              `UPDATE technicians SET ticket_count = $1 WHERE id = $2;`,
                              [resp.rowCount, t.rows[0]["assigned_to"]],
                              (finalE, finalResp) => {
                                if (finalE) {
                                  res.status(400).json({
                                    message: finalE,
                                    status: 0,
                                  });
                                }

                                if (finalResp.command === "UPDATE") {
                                  res.status(200).json({
                                    message: "Ticket closed successfully!",
                                    status: 1,
                                  });
                                } else {
                                  res.status(400).json({
                                    message: "Something went wrong!",
                                    status: 0,
                                  });
                                }
                              }
                            );
                          }
                        );
                      }
                    }
                  );
                }
              }
            );
          }
        }
      }
    );
  }
};

// Chat with Technician
const sendChat = (req, res, next) => {
  var sender = req.body.user_id,
    receiver = req.body.send_to,
    content = req.body.message,
    ticket_id = req.body.ticket_id,
    created_at = req.body.created_at,
    updated_at = created_at;

  dbClient.query(
    `insert into messages (sender_id, receiver_id, ticket_id, message, created_at, updated_at)
        values ($1, $2, $3, $4, $5, $6)`,
    [sender, receiver, ticket_id, content, created_at, updated_at],
    (err, response) => {
      if (err) {
        res.status(200).json({
          message: "Something went wrong!",
          err,
          status: 0,
        });
      }
      if (response.command === "INSERT") {
        res.status(200).json({
          message: "Message sent successfully!",
          status: 1,
        });
      }
    }
  );
};

// Get all chat
const getChat = (req, res, next) => {
  ticketId = req.params.ticket_id;
  dbClient.query(
    `select * from messages where ticket_id = $1`,
    [ticketId],
    (err, response) => {
      if (err) {
        res.status(400).json({
          message: "Something went wrong",
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

// Get User Profile
const getProfileDetails = (req, res, next) => {
  var _user_d = req.params.id;

  dbClient.query(
    `select name, email, emp_id, verify_status, phone from users where id = $1`,
    [_user_d],
    (err, resp) => {
      if (err) {
        res.status(400).json({
          message: "Something went wrong!",
          status: 0,
        });
      }

      res.status(200).json({
        message: "Success",
        status: 1,
        data: resp.rows[0],
      });
    }
  );
};

module.exports = {
  getCategories,
  getSubCategories,
  getMyTickets,
  createTicket,
  sendChat,
  getChat,
  getProfileDetails,
};
