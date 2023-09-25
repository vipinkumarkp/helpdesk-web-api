/*****************************************************/
/* CREATED AND DEVELOPED BY VIPINKUMAR KP */
/*****************************************************/

// DB required variables
const dbClient    = require("../../config/db");
const moment      = require("moment");

// Date required variables and formated the date
const currentDate   = new Date().toISOString();
const fDate         = moment(currentDate);
const formattedDate = fDate.format("YYYY-MM-DD HH:mm:ssZ");

// Add Knowledge Base
const addKnowledge_Base = async (req, res, next) => {
     const { title, description, status } = req.body;
  try {
    dbClient.query(
      `SELECT * FROM knowledge_Base WHERE title = $1;`,
      [title],
      (tErr, tRes) => {
        if (tErr) {
          res.status(400).json({
            message: `Error : ${tErr}`,
            status: 0,
          });
        }
        if (tRes.rowCount > 0) {
          res.status(201).json({ message: 'The knowledge base entry is already exist!', data: tRes.rows });

        } else {


            dbClient.query(
            `INSERT INTO knowledge_Base (title, description, status)
                VALUES ($1, $2, $3) RETURNING id;`,
            [
                title, 
                description, 
                status
            ],
            (tiErr, tiRes) => {
              if (tiErr) {
                res.status(400).json({
                  message: `Error : ${tiErr}`,
                  status: 0,
                });
              }
              res.status(201).json({ message: 'The knowledge_Base Added Successfully!', data: tiRes });

            }
          );
        }
      }
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Get all Knowledge Bases
const getKnowledge_Bases = (req, res, next) => {
    dbClient.query("SELECT * FROM knowledge_Base", (err, response) => {
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
  addKnowledge_Base,
  getKnowledge_Bases
};
