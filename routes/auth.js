const jwt = require("jsonwebtoken");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const router = require("express").Router();
const dotenv = require("dotenv");

dotenv.config();

//DB Connection
const connection = mysql.createConnection({
  host: "localhost",
  port: "3306",
  user: "root",
  password: process.env.DB_PASSWORD,
  database: process.env.DB,
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Database Connected!");
});

//create a new user from /register api with user_id as int and password
router.post("/register", async (req, res) => {
  var user_id = req.body.user_id;
  console.log(req.body.user_id);
  //var password=req.body.password;

  //Hash password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  var sql =
    "INSERT INTO user(user_id,password) VALUES('" +
    user_id +
    "','" +
    hashPassword +
    "')";

  connection
    .query(sql, function (error, result, fields) {
      if (error) {
        console.log(error);
      } else {
        console.log("user created");
        res.json("user created");
      }
    })
    .on("error", function (err) {
      console.log("row not created", err);
    });
});

//login user based on username and password from mysql database
router.post("/login", async (req, res) => {
  var user_id = req.body.user_id;
  var password = req.body.password;
  //console.log(user_id+" "+password)
  //Hash password
  // const salt=await bcrypt.genSalt(10);
  // const hashPassword=await bcrypt.hash(req.body.password,salt);

  var sql = "SELECT user_id FROM user WHERE user_id=" + "'" + user_id + "'";

  connection
    .query(sql, function (error, result, fields) {
      if (error) console.log(error);

      if (result.length > 0) {
        if (result[0].user_id === user_id) {
          //&&result[0].password==password)
          //connection.end();
          sql =
            "SELECT password FROM user WHERE user_id=" + "'" + user_id + "'";

          connection
            .query(sql, async function (error, result, fields) {
              //look for given username password
              if (error) console.log(error);

              if (result.length > 0) {
                await bcrypt.compare(
                  password,
                  result[0].password,
                  function (err, b_res) {
                    // res == true
                    if (b_res) {
                      //if password and username matches
                      console.log("verified");
                      const token = jwt.sign(
                        { user_id: user_id },
                        process.env.TOKEN_SECRET
                      );

                      res.json({
                        type: true,
                        token: token,
                      });
                      //res.header('auth-token',token).send(token);
                      //console.log(token);
                    } else {
                      //user password do not match
                      res.json({
                        type: true,
                        token: "invalid",
                      });
                      console.log("password not verified"); //if password donot match
                      return;
                    }
                  }
                );
              }
            })
            .on("error", function (err) {
              console.log("[mysql error]", err);
            });
          //connection.destroy();
        } else {
          //username not found
          res.json({
            type: true,
            token: "invalid",
          });
          console.log("User doesnot exist");
        }
      } else {
        res.json({
          type: true,
          token: "invalid",
        });
        console.log("User name wrong");
      }
    })
    .on("error", function (err) {
      console.log("user not found", err);
    });
});

module.exports = router;
