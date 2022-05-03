require('dotenv').config();
const { randomBytes } = require('crypto');
const { default: migrate } = require('node-pg-migrate');
const format = require('pg-format');
const pool = require('../pool');

const ROOT_USER = {
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	port: process.env.DB_PORT,
	host: process.env.DB_HOST,
	database: process.env.TEST_DB_NAME,
};

class Context {
	static async build() {
		// Randomly generating a role name to connect to PG as
		const roleName = 'a' + randomBytes(4).toString('hex');

		const TEST_USER = {
			user: roleName,
			password: roleName,
			port: process.env.DB_PORT,
			host: process.env.DB_HOST,
			database: process.env.TEST_DB_NAME,
		};

		// Connect to PG as usual
		await pool.connect(ROOT_USER);

		// Create a new role
		await pool.query(format('CREATE ROLE %I WITH LOGIN PASSWORD %L;', roleName, roleName));

		// Create a schema with the same name
		await pool.query(format('CREATE SCHEMA %I AUTHORIZATION %I', roleName, roleName));

		// Disconnect entirely from PG
		await pool.close();

		// Run migrations inside new schema
		await migrate({
			schema: roleName,
			direction: 'up',
			log: () => {},
			noLock: true,
			dir: 'migrations',
			databaseUrl: TEST_USER,
		});

		// Connect to PG as the newly created role
		await pool.connect(TEST_USER);
		return new Context(roleName);
	}

	constructor(roleName) {
		this.roleName = roleName;
	}

	async reset() {
		return pool.query(`
			DELETE FROM users;
		`);
	}

	async close() {
		// Disconnect from PG
		await pool.close();

		// Reconnect as our root user
		await pool.connect(ROOT_USER);

		// Delete the role and schema we created
		await pool.query(format('DROP SCHEMA %I CASCADE;', this.roleName));
		await pool.query(format('DROP ROLE %I;', this.roleName));

		// Disconnect
		await pool.close();
	}
}

module.exports = Context;
