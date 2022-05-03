const pg = require('pg');

class Pool {
	_pool = null;

	connect(options) {
		this._pool = new pg.Pool(options);
		return this._pool.query('SELECT 1 + 0 AS connected_to_db;');
	}

	close() {
		return this._pool.end();
	}

	query(sql, params = []) {
		return this._pool.query(sql, params);
	}
}

module.exports = new Pool();
