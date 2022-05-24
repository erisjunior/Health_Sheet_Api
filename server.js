require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));

const db = require('./app/models');
db.sequelize.sync();

// db.sequelize.sync({ force: true }).then(() => {
//   console.log('Drop and re-sync db.');
// });

require('./app/routes/user.routes')(app);
require('./app/routes/procedure.routes')(app);

app.listen(process.env.PORT || 8080);
