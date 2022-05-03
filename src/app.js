const express = require('express');
const UserRouter = require('./routes/user-router');

class App {
	constructor() {
		this.app = express();
		this.userRouter = UserRouter.router;
	}

	useMiddleWare() {
		this.app.use(express.json({ limit: '10kb' }));
	}

	useRoutes() {
		this.app.use('/users', this.userRouter);
	}

	useExceptionFilters() {
		this.app.use('*', (err, req, res, next) => {
			console.log(`💥💥💥 ${err.message} 💥💥💥`);
			res.status(400).json({ status: 'error', message: err.message });
		});
	}

	async init(port) {
		this.useMiddleWare();
		this.useRoutes();
		this.useExceptionFilters();
		this.server = this.app.listen(port);

		console.log(`Listening on port ${port}...`);
	}

	uncaughtException(err) {
		console.log(err.name, err.message);
		console.log('UNCAUGHT EXCEPTION 💥 REJECTED REJECTED REJECTED');
		process.exit(1);
	}
	unhandledRejection(err) {
		console.log(err.name, err.message);
		console.log('UNHANDLED REJECTION 💥 REJECTED REJECTED REJECTED');
		this.server.close(() => {
			process.exit(1);
		});
	}

	sigTerm() {
		console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
		server.close(() => {
			console.log('💥 Process terminated');
		});
	}

	close() {
		this.server.close();
	}
}

module.exports = new App();
