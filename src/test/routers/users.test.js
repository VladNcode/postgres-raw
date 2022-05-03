const request = require('supertest');
const UserRepo = require('../../repos/user-repo');
const Context = require('../context');
const application = require('../../app');

let context;

beforeAll(async () => {
	context = await Context.build();
	await application.init(3001);
});

beforeEach(async () => {
	await context.reset();
});

it('creates a user', async () => {
	const startingCount = await UserRepo.countUsers();

	const res = await request(application.app)
		.post('/users')
		.send({ username: 'testuser', bio: 'test bio' })
		.expect(201);

	const finishCount = await UserRepo.countUsers();
	expect(finishCount - startingCount).toBe(1);

	await request(application.app).delete(`/users/${res.body.user.id}`).expect(204);
});

afterAll(async () => {
	await context.close();
	application.close();
});
