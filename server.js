require('dotenv').config();
const express = require('express');
const pool = require('./server/config/database');
const mysql = require('mysql2');
const cors = require('cors');
const routers = require('./server/API/user/user.router');
const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api/users', routers);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});