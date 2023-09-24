/*****************************************************/
/* CREATED AND DEVELOPED BY MANNMOHAN */
/*****************************************************/
const _dbClient = require('../../config/db')

// Get Profile by ID
const getProfile = (req, res, next) => {
    var _id = req.params.id;
    console.log("_id: " , _id);
    _dbClient.query(
        `select name, email, emp_id, verify_status, phone from users where id = $1`, [_id], (err, resp) => {
            if (err) {
                res.status(400).json({
                    message: "Something went wrong!"
                });
            }

            res.status(200).json({
                message: "Success",
                data: resp.rows[0]
            })
        }
    )
}

// Get My Tickets
const getMyTickets = (req, res, next) => {
    var _id = req.params.assignee;
    var id = parseInt(_id)
    console.log(id);
    console.log(typeof(id));
    _dbClient.query(
        `select * from tickets where assigned_to = $1`, [id], (err, resp) => {
            if (err) {
                res.status(400).json({
                    message: "Something went wrong!"
                });
            }
            
            res.status(200).json({
                message: "Success",
                data: resp.rows
            })
        }
    )
}

module.exports = {
    getProfile,
    getMyTickets,
}