const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.mysql_Db,
  connectionLimit: 10,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected to MySQL");
  }
});

let registration = `CREATE TABLE IF NOT EXISTS  registration(
 user_id INT AUTO_INCREMENT,
 user_name VARCHAR(255) NOT NULL,
user_email VARCHAR(255) NOT NULL,
user_password VARCHAR(255) NOT NULL,
PRIMARY KEY(user_id)
)`;

let profile = `CREATE TABLE IF NOT EXISTS profile(
  user_profile_id INT AUTO_INCREMENT,
  user_id INT NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  primary key(user_profile_id),
    FOREIGN KEY(user_id) REFERENCES registration(user_id)
)`;

let question = `CREATE TABLE IF NOT EXISTS question(
question_id INT AUTO_INCREMENT,
question VARCHAR(255) NOT NULL,
question_discription VARCHAR(255),
question_code_block VARCHAR(255),
tags VARCHAR(255),
post_id varchar(255) NOT NULL,
user_id INT NOT NULL,
PRIMARY KEY(question_id),
unique(post_id),
FOREIGN KEY(user_id) REFERENCES registration(user_id)
)`;

let answer= `CREATE TABLE IF NOT EXISTS answer (
    answer_id INT AUTO_INCREMENT,
    answer VARCHAR(255) NOT NULL,
    answer_code_block VARCHAR(255),
    question_id INT NOT NULL,
    user_id INT NOT NULL,  -- Added user_id column
    PRIMARY KEY (answer_id),
    FOREIGN KEY (user_id) REFERENCES registration(user_id),
    FOREIGN KEY (question_id) REFERENCES question(question_id)
)`;


pool.query(registration, (err, result) => {
    if (err) {
        console.log(err);
    } else {
        console.log("registration table created");
    }
});
pool.query(profile ,(err, result) => {
    if(err){
        console.log(err);
    }else{
        console.log("profile table created");
    }
});
pool.query(question, (err, result) => {
    if(err){
        console.log(err);
    }else{
        console.log("question table created");
    }
});
pool.query(answer, (err, result) => {
    if(err){
        console.log(err);
    }else{
        console.log("answer table created");
    }
});
module.exports = pool;