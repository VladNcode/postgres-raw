const catchAsync = require('../utils/catchAsync');
const UserRepo = require('../repos/user-repo');

class UserController {
	constructor() {
		this.userRepo = UserRepo;
	}

	getAll = catchAsync(async (req, res) => {
		const users = await this.userRepo.findAll();

		res.status(200).json({
			status: 'success',
			users,
		});
	});

	getOne = catchAsync(async (req, res) => {
		const user = await this.userRepo.findById(req.params.id);

		if (!user) {
			return res.status(404).json({ status: 'failure', message: 'User not found' });
		}

		res.status(200).json({ status: 'success', user });
	});

	createOne = catchAsync(async (req, res) => {
		const { username, bio } = req.body;
		const user = await this.userRepo.create(username, bio);

		if (!user) {
			return res
				.status(400)
				.json({ status: 'failure', message: 'Something went wrong, please try again later' });
		}

		res.status(201).json({ status: 'success', user });
	});

	updateOne = catchAsync(async (req, res) => {
		const { username, bio } = req.body;

		if (!username || !bio) {
			return res
				.status(400)
				.json({ status: 'failure', message: 'You need to provide a username and a bio!' });
		}

		const user = await this.userRepo.updateById(username, bio, req.params.id);

		if (!user) {
			return res.status(404).json({ status: 'failure', message: 'User not found' });
		}

		res.status(200).json({ status: 'success', user });
	});

	deleteOne = catchAsync(async (req, res) => {
		const deletedUser = await this.userRepo.deleteById(req.params.id);

		if (!deletedUser) {
			return res.status(404).json({ status: 'failure', message: 'User not found' });
		}

		res.status(204).json({ status: 'success' });
	});
}

module.exports = new UserController();
