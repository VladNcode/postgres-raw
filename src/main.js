require('dotenv').config();
const app = require('./app');
const pool = require('./pool');

process.on('uncaughtException', app.uncaughtException);

async function bootstrap() {
	try {
		if (process.env.NODE_ENV !== 'test') {
			const { rows } = await pool.connect({
				user: process.env.DB_USER,
				password: process.env.DB_PASSWORD,
				port: process.env.DB_PORT,
				host: process.env.DB_HOST,
				database: process.env.TEST_DB_NAME,
			});

			rows.db = 'PROD';
			console.log(rows);
		}

		await app.init(process.env.PORT || 3000);
	} catch (error) {
		console.error(error.message);
	}
}

bootstrap();

process.on('unhandledRejection', app.unhandledRejection);
process.on('SIGTERM', app.sigTerm);
