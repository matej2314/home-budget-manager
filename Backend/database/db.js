const mysql = require('mysql2/promise');

const pool = mysql.createPool({
	connectionLimit: 55,
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
});

pool.on('acquire', (connection) => {
	console.log(`Połączenie nawiązane: ID połączenia - ${connection.threadId}`);
});

module.exports = pool;
