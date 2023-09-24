/*****************************************************/
/* CREATED AND DEVELOPED BY MANNMOHAN */
/*****************************************************/
const _dbClient = require('../../config/db')

// Get all Members
const getMembers = (req, res, next) => {
    try {
        _dbClient.query(
            `SELECT * FROM users;`, (err, resp) => {
                if (err) {
                    res.status(400).json({
                        message: "Something went wrong!"
                    })
                }

                res.status(200).json({
                    message: "Success",
                    count: resp.rows.length,
                    data: resp.rows
                })
            }
        )
    } catch (error) {
        res.status(400).json({
            error
        })
    }
}

// Get all ADMINS
const getAdmins = (req, res, next) => {
    try {
        _dbClient.query(
            `SELECT * FROM users WHERE user_type = ${1};`, (err, resp) => {
                if (err) {
                    res.status(400).json({
                        message: "Something went wrong"
                    })
                }

                res.status(200).json({
                    message: "Success",
                    count: resp.rows.length,
                    data: resp.rows
                })
            }
        )
    } catch (error) {
        res.status(400).json({
            error
        })
    }
}

// Create Staff
const createStaff = (req, res, next) => {
    var _emp_name = req.body.emp_name,
        _emp_email = req.body.emp_email,
        _emp_id = req.body.emp_id,
        _emp_pass = req.body.emp_pass,
        _emp_type = req.body.emp_type,
        _emp_phone = req.body.emp_phone,
        _emp_doj = req.body.doj,
        emp_id,
        user_status = 0,
        login_status = 0,
        verify_status = 0;
    try {
        switch (_emp_id.length) {
            case 1:
                emp_id = `EMP000${_emp_id}`
                break;
            case 2:
                emp_id = `EMP00${_emp_id}`
                break;  
            case 3:
                emp_id = `EMP0${_emp_id}`
                break;      
            case 4:
                emp_id = `EMP${_emp_id}`
                break;
            default:
                break;
        }

        _dbClient.query(
            `INSERT INTO users (name, email, emp_id, password, user_type, user_status, verify_status, login_status, phone, doj)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`, 
            [_emp_name, _emp_email, emp_id, _emp_pass, _emp_type, user_status, verify_status, login_status, _emp_phone, _emp_doj],
            (err, resp) => {
                if (err) {
                    res.status(400).json({
                        message: "Something went wrong!",
                        error: err.message
                    })
                }

                if (_emp_type === '3') {
                    _dbClient.query(
                        `SELECT * FROM users WHERE phone = $1`, [_emp_phone], (err, user_resp) => {
                            if (err) {
                                res.status(200).json({
                                    message: "Fetching user info got failed!",
                                    error: err
                                })
                            }

                            if (user_resp.rows.length > 0 && user_resp.rows.length <= 1) {
                                _dbClient.query(
                                    `INSERT INTO technicians (tech_id, tech_empId, tech_name, tech_email, tech_phone, tech_status, tech_verify, tech_dob, tech_doj)
                                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                                    [user_resp.rows[0].id, user_resp.rows[0].emp_id, user_resp.rows[0].name, user_resp.rows[0].email, user_resp.rows[0].phone, user_resp.rows[0].user_status, user_resp.rows[0].verify_status, user_resp.rows[0].dob, user_resp.rows[0].doj],
                                    (err, techResp) => {
                                        if (err) {
                                            res.status(200).json({
                                                message: "Something went wrong!",
                                                error:err
                                            })
                                        }

                                        res.status(200).json({
                                            message: "Success",
                                            data: "Added successfully!"
                                        })
                                    }
                                )
                            }
                        }
                    )
                } else {
                    res.status(200).json({
                        message: "Success",
                        data: "Added successfully"
                    })
                }

                
            }
        )
    } catch (error) {
        res.status(400).json({
            error
        })
    }
}

module.exports = {
    getMembers,
    getAdmins,
    createStaff
}