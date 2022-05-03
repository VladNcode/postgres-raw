const pool = require('../pool');
const toCamelCase = require('../utils/toCamelCase');

class UserRepo {
	static async findAll() {
		const { rows } = await pool.query(`SELECT * FROM users;`);

		return toCamelCase(rows);
	}

	static async create(username, bio) {
		// await pool.query(`INSERT INTO users (username, bio) VALUES ($1, $2) RETURNING *;`, [username, bio]);
		await pool.query(`INSERT INTO users (username, bio) VALUES ($1, $2);`, [username, bio]);
		return await this.findByUsername(username);
	}

	static async findByUsername(username) {
		const { rows } = await pool.query(`SELECT * FROM users WHERE username = $1;`, [username]);
		return toCamelCase(rows)[0];
	}

	static async findById(id) {
		const { rows } = await pool.query(`SELECT * FROM users WHERE id = $1;`, [id]);
		return toCamelCase(rows)[0];
	}

	static async updateById(username, bio, id) {
		await pool.query('UPDATE users SET username = $1, bio = $2 WHERE id = $3;', [
			username,
			bio,
			id,
		]);

		return await this.findById(id);
	}

	static async deleteById(id) {
		const deletedUser = await pool.query('DELETE FROM users WHERE id = $1;', [id]);
		return deletedUser.rowCount > 0 ? true : false;
	}

	static async countUsers() {
		const { rows } = await pool.query('SELECT COUNT(*) FROM users');
		return +rows[0].count;
	}
}

module.exports = UserRepo;
