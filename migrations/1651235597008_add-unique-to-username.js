/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
	pgm.sql(`
		ALTER TABLE users ADD CONSTRAINT username_is_unique UNIQUE (username);
	`);
};

exports.down = pgm => {
	pgm.sql(`
		ALTER TABLE users DROP CONSTRAINT username_is_unique
	`);
};
