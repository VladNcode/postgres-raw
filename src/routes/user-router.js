const express = require('express');
const UserController = require('../controllers/user-controller');

class UserRouter {
	constructor() {
		this.userController = UserController;
		this.router = new express.Router();
		this.bindRouter([
			{
				path: '/',
				method: 'get',
				func: this.userController.getAll,
			},
			{
				path: '/',
				method: 'post',
				func: this.userController.createOne,
			},
			{
				path: '/:id',
				method: 'get',
				func: this.userController.getOne,
			},
			{
				path: '/:id',
				method: 'patch',
				func: this.userController.updateOne,
			},
			{
				path: '/:id',
				method: 'delete',
				func: this.userController.deleteOne,
			},
		]);
	}

	bindRouter(routes) {
		for (const route of routes) {
			// console.log(`[${route.method}] [users${route.path}]`);
			const handler = route.func.bind(this);
			this.router[route.method](route.path, handler);
		}
	}
}

module.exports = new UserRouter();
