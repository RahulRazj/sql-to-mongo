import migratorRoutes from './migrator_routes.js';

const routes = app => {
  app.use('/api/', migratorRoutes);
};

export default routes;
