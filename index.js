const express = require("express");
const mysql = require("mysql");
const req = require("express/lib/request");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const app = express();
const port = 3000;

const db = mysql.createConnection({
  user: "verdaxxed_node",
  host: "159.203.143.52",
  password: "Amina@1218",
  database: "SocialAccount",
});

app.use(express.json());

app.get("/getUsers", (req, res) => {
  db.query("SELECT * FROM User", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});
app.post("/createAccount", (req, res) => {
  const user_name = req.body.user_name;
  const last_name = req.body.last_name;
  const first_name = req.body.first_name;
  const dob = req.body.dob;
  const gender = req.body.gender;
  const email_address = req.body.email_address;
  const password = req.body.password;

  const passwordPattern =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!passwordPattern.test(password)) {
    return res
      .status(400)
      .send(
        "Password must be at least 8 characters and include a special character."
      );
  }

  bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error hashing the password.");
    }

    db.query(
      "INSERT INTO User (user_name, last_name, first_name, dob, gender, email_address, password) VALUES (?,?,?,?,?,?,?)",
      [
        user_name,
        last_name,
        first_name,
        dob,
        gender,
        email_address,
        hashedPassword,
      ],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Error creating the account.");
        } else {
          res.status(200).send("Account created successfully.");
        }
      }
    );
  });
});

app.put("/updateEmail", (req, res) => {
  const user_name = req.body.user_name;
  const email_address = req.body.email_address;
  const password = req.body.password;

  db.query(
    "SELECT password FROM User WHERE user_name = ?",
    [user_name],
    (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error verifying password.");
      }

      if (results.length === 0) {
        return res.status(404).send("User not found.");
      }

      const storedPasswordHash = results[0].password;

      bcrypt.compare(password, storedPasswordHash, (bcryptErr, isMatch) => {
        if (bcryptErr) {
          console.log(bcryptErr);
          return res.status(500).send("Error comparing passwords.");
        }

        if (!isMatch) {
          return res
            .status(401)
            .send("Incorrect password. Email address update failed.");
        }

        db.query(
          "UPDATE User SET email_address = ? WHERE user_name = ?",
          [email_address, user_name],
          (updateErr, result) => {
            if (updateErr) {
              console.log(updateErr);
              return res.status(500).send("Error updating email address.");
            }

            console.log("Email Address Updated Successfully.");
            res.status(200).send("Email Updated Successfully.");
          }
        );
      });
    }
  );
});

app.put("/updateUserName", (req, res) => {
  const user_name = req.body.user_name;
  const email_address = req.body.email_address;
  const password = req.body.password;

  db.query(
    "SELECT password FROM User WHERE user_name = ?",
    [user_name],
    (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error verifying password.");
      }

      if (results.length === 0) {
        return res.status(404).send("User not found.");
      }

      const storedPasswordHash = results[0].password;

      bcrypt.compare(password, storedPasswordHash, (bcryptErr, isMatch) => {
        if (bcryptErr) {
          console.log(bcryptErr);
          return res.status(500).send("Error comparing passwords.");
        }

        if (!isMatch) {
          return res
            .status(401)
            .send("Incorrect password. Username update failed.");
        }

        db.query(
          "UPDATE User SET user_name = ? WHERE email_address = ?",
          [user_name, email_address],
          (updateErr, result) => {
            if (updateErr) {
              console.log(updateErr);
              return res.status(500).send("Error updating username.");
            }

            console.log("Username Updated Successfully.");
            res.status(200).send("Username Updated Successfully.");
          }
        );
      });
    }
  );
});

app.post("/updateBio", (req, res) => {
    const user_name = req.body.user_name;
    const bio = req.body.bio;

    if(bio.length > 255){
        return res.status(500).send("Please Limit Bio to 255 characters");
    }

    db.query(
        "UPDATE User SET bio = ? WHERE user_name = ? ",
        [bio, user_name],
        (err, result) =>
        {
            if(err) {
                console.log(err);
                return res.status(500).send("Error updating Bio.");
            }
            else{
                console.log("Bio Updated Successfully.");
                res.status(200).send("Bio updated successfully.");
            }
        }
    )


})
app.delete("/deleteAccount", (req, res) => {
  const email_address = req.body.email_address;
  const password = req.body.password;

  db.query(
    "SELECT password FROM User WHERE email_address = ?",
    [email_address],
    (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error Verifying Password.");
      }
      if (results.length === 0) {
        return res.status(404).send("User Not Found");
      }
      const storedPasswordHash = results[0].password;

      bcrypt.compare(password, storedPasswordHash, (bcryptErr, isMatch) => {
        if (bcryptErr) {
          console.log(bcryptErr);
          return res.status(500).send("Error comparing Passwords");
        }
        if (!isMatch) {
          return res
            .status(401)
            .send("Incorrect Password. Account Deletion Failed");
        }
        db.query(
          "DELETE FROM User WHERE email_address = ?",
          [email_address],
          (deleteErr, result) => {
            if (deleteErr) {
              console.log(deleteErr);
              return res.status(500).send("Error Deleting the account.");
            } else {
              console.log("Account Deleted Successfully.");
              return res.status(200).send("Account Deleted Successfully.");
            }
          }
        );
      });
    }
  );
});

app.listen(port, () => {
  console.log("Server has Started on Port:" + port);
});