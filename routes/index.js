import migratorRoutes from './migrator_routes.js';
import connectionRoutes from './connection_routes.js';

const routes = app => {
	app.use('/api/v1/', migratorRoutes);
	app.use('/api/v1/', connectionRoutes);
};

export default routes;
