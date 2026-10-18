const jsonServer = require('json-server');
const civicServer = jsonServer.create();
const router = jsonServer.router('db.json');
const middleware = jsonServer.defaults();

// Render / other hosts give a PORT, locally we use 3000
const PORT = process.env.PORT || 3000;

civicServer.use(middleware);
civicServer.use(router);
civicServer.listen(PORT, () => {
  console.log(`Civic Server is running on port ${PORT} successfully`);
});
