module.exports = function toCamelCase(rows) {
	return rows.map(row => {
		const camelCasedObj = {};

		for (key in row) {
			const camelCasedKey = key.replace(/([-_][a-z])/gi, el => el.toUpperCase().replace('_', ''));
			camelCasedObj[camelCasedKey] = row[key];
		}

		return camelCasedObj;
	});
};
