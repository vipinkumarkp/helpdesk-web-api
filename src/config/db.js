/*****************************************************/
/* CREATED AND DEVELOPED BY MANNMOHAN */
/*****************************************************/

require('dotenv').config()
const { Client } = require('pg')
const fs = require('fs');
const connectionString = process.env.CONN_STR
console.log(process.env.CONN_STR);
// const client1 = new Client({
//     connectionString: connectionString,
//     host: `10.8.5.143`,
//     port:   5433,
//     database: 'helpdesk',
//     // ssl: {
//     //     rejectUnauthorized: true,
//     //     ca: fs.readFileSync('src/config/root.crt').toString()
//     // },
//     user: "admin",
//     password: "tu8M7EaUvqW0t7dXcCJAUqLD_FoIBG"



// })

const client = new Client({
    user: 'sa',
  host: 'dpg-ck0jq9u3ktkc73enct6g-a.oregon-postgres.render.com',
  database: 'helpdesk_web',
  password: 'GjL7FvEnsnwSg61JkH0D3CqpkuiLckIL',
  port: 5432, // PostgreSQL default port
  ssl: {
            rejectUnauthorized: false,
            // ca: fs.readFileSync('src/config/root.crt').toString()
}
})

module.exports = client;