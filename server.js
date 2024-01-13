// require('dotenv').config();
// const app = require('./app');

// const port = process.env.PORT || 3001;
// app.listen(port, function () {
//     // eslint-disable-next-line no-console
//     console.log(`App listening on port ${port}`);
// });
require('dotenv').config();
const { app, server } = require('./app');

const port = process.env.PORT || 3001;
server.listen(port, function () {
    console.log(`Server and Socket.IO listening on port ${port}`);
});
