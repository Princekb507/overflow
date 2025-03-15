const {
  registration,
  getAllUsers,
  userById,
  getUserByEmail,
  profile,
} = require("./user.service");
const pool = require("../../config/database");
const bcrypt = require("bcryptjs");
const JWS = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
  createUser: (req, res) => {
    const { userName, firstName, lastName, email, password } = req.body;

    if (!userName || !firstName || !lastName || !email || !password) {
      return res.status(400).json({ msg: "not all fields have been provided" });
    }
    if (password.length < 8)
      return res
        .status(400)
        .json({ msg: "password must be at least 8 character" });

    pool.query(
      "SELECT * FROM registration WHERE user_email=?",
      [email],
      (err, results) => {
        if (err) {
          return res.status(err).json({ msg: "db connection error" });
        }

        if (results.length > 0) {
          return res
            .status(400)
            .json({ msg: "an account with this email already exists" });
        } else {
          const salt = bcrypt.genSaltSync();
          req.body.password = bcrypt.hashSync(password, salt);

          registration(req.body, (err, result) => {
            if (err) {
              console.log(err);
              return res.status(500).json({ msg: "db connection error" });
            }
            pool.query(
              "SELECT * FROM registration WHERE user_email=?",
              [email],
              (err, result) => {
                if (err) {
                  return res.status(err).json({ msg: "db connection  err" });
                }
                req.body.userId = result[0].user_id;
                console.log(req.body);

                profile(req.body, (req, result) => {
                  if (err) {
                    console.log(err);
                    return res.status(500).json({ msg: "db connection err" });
                  }
                  return res.status(200).json({
                    msg: "new user added successfully",
                    data: result,
                  });
                });
              }
            );
          });
        }
      }
    );
  },
  getUsers: (req, res) => {
    getAllUsers((err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ msg: "db connection err" });
      }
      return res.status(200).json({ data: results });
    });
  },
  getUserById: (req, res) => {
    // const id = req.params.id;
    // console.log ("id===>"id,"user===>",req.id)

    userById(req.id, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ msg: "db connection err" });
      }
      if (!result) {
        return res.status(400).json({ msg: "record not found" });
      }
      return res.status(200).json({ data: results });
    });
  },
  login: (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: "not all fields have been provide!" });
      getUserByEmail(email, (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).json({ msg: "db connection err" });
        }
        if (!result) {
          return res
            .status(404)
            .json({ msg: "no account with this email has been Registration" });
        }
        const isMatch = bcrypt.compareSync(password, result.user_password);
        if (!isMatch)
          return res.status(404).json({ msg: "invalid Credential" });

        const token = JWS.sign({ id: result.user_id }, process.env.JWT_SECRET, {
          expiresIn: "1hr",
        });
        return res.json({
          token,
          user: {
            id: result.user_id,
            display_name: result.user_name,
          },
        });
      });
    }
  },
};
