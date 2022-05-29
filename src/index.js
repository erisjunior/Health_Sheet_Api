require('dotenv').config()

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');

const db = require('./models');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/files', express.static(path.resolve(__dirname, '..', 'temp', 'uploads')));

db.sequelize.sync();

// db.sequelize.sync({ force: true })

require('./routes/user.routes')(app);
require('./routes/procedure.routes')(app);

app.listen(process.env.PORT || 8080);
