import migratorRoutes from './migrator_routes.js';
import connectionRoutes from './connection_routes.js';

const routes = app => {
	app.get('/', (req, res) => {
		res.send('Whatever you do in this life, it\'s not legendary, unless your friends are there to see it.');
	});
	app.use('/api/v1/', migratorRoutes);
	app.use('/api/v1/', connectionRoutes);
};

export default routes;
