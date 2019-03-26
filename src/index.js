const { Client } = require('pg');
const connectionString = 'postgresql://root:root@pg:5432/test';

// const client = new Client({    
//         user: 'root',
//         host: 'pg',
//         database: 'test',
//         password: 'root',
//         port: 5432,
// })
// client.connect();

// client.query('SELECT NOW()', (err, res) => {
//     console.log(err, res)
//     client.end()
// })
