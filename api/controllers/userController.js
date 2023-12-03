//karl
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { jwtSecret } = require("../../config");
const pool = require("../../database");

module.exports = {
  // Updated loginUser function with concurrent request
  loginUser: async function (req, res) {
    try {
      const { email, password } = req.body;

      // Function to check if a user exists
      const checkUserExists = async (email) => {
        try {
          const query =
            "SELECT EXISTS (SELECT 1 FROM users WHERE email = $1) AS user_exists";
          const result = await pool.query(query, [email]);
          return result.rows[0].user_exists;
        } catch (error) {
          console.error("Error checking user existence:", error.message);
        }
      };

      // Function to check if a user is blacklisted
      const checkUserBlacklisted = async (email) => {
        try {
          const query = "SELECT is_blacklisted FROM users WHERE email = $1";
          const result = await pool.query(query, [email]);

          if (result.rows.length === 0) {
            throw new Error("User not found.");
          }

          return result.rows[0].is_blacklisted;
        } catch (error) {
          console.error("Error checking user blacklist status:", error.message);
        }
      };

      // Runs both functions concurrently using Promise.all
      const [userExists, isBlacklisted] = await Promise.all([
        checkUserExists(email),
        checkUserBlacklisted(email),
      ]);

      if (!userExists) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      if (isBlacklisted) {
        return res.status(401).json({ error: "User is blacklisted" });
      }

      // User exists and is not blacklisted, continue with login
      const user = await pool.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);

      const hashedPassword = user.rows[0].password;
      const passwordMatch = await bcrypt.compare(password, hashedPassword);

      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Password matches, generate a JWT with additional user info
      const token = jwt.sign(
        {
          userId: user.rows[0].user_id,
          username: user.rows[0].username,
          email: user.rows[0].email,
          phonenumber: user.rows[0].phonenumber,
          is_admin: user.rows[0].is_admin,
        },
        jwtSecret,
        { expiresIn: "1h" }
        // { expiresIn: "20s" } // 20 seconds for testing
      );

      res.json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  registerUser: async function (req, res) {
    try {
      const {
        username,
        email,
        password,
        firstname,
        lastname,
        phonenumber,
        gender,
        DoB,
      } = req.body;

      // Function to check if the user already exists
      const checkUserExists = async (email) => {
        const existingUser = await pool.query(
          "SELECT * FROM users WHERE email = $1",
          [email]
        );
        return existingUser.rows.length > 0;
      };

      // Function to check if the user is older than 18
      const calculateAge = (DoB) => {
        const today = new Date();
        const birthDate = new Date(DoB);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        // console.log("User age is: " + age);
        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
          age--;
        }

        return age;
      };

      // Check if the email is already registered and user is older than 18
      const [userExists, isOver18] = await Promise.all([
        checkUserExists(email),
        calculateAge(DoB) >= 18,
      ]);

      if (userExists) {
        return res
          .status(400)
          .json({
            error: "EMAIL_ALREADY_REGISTERED",
            message: "Email is already registered",
          });
      }

      if (!isOver18) {
        return res
          .status(400)
          .json({
            error: "USER_NOT_OLD_ENOUGH",
            message: "User must be 18 or older",
          });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert the new user into the database
      const newUser = await pool.query(
        "INSERT INTO users (username, email, password, firstname, lastname, phonenumber, created_at, gender, DoB) VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7, $8) RETURNING *",
        [
          username,
          email,
          hashedPassword,
          firstname,
          lastname,
          phonenumber,
          gender,
          DoB,
        ]
      );

      // Generate a token for the new user
      const token = jwt.sign(
        {
          userId: newUser.rows[0].user_id,
          username: newUser.rows[0].username,
          email: newUser.rows[0].email,
          phonenumber: newUser.rows[0].phonenumber,
          is_admin: newUser.rows[0].is_admin,
        },
        jwtSecret,
        { expiresIn: "1h" }
        // { expiresIn: 20000 } //20 sec for testing
      );

      res.json({ token, message: "User registered successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Controller function to get user data by ID
  getUserById: async function (req, res) {
    try {
      // console.log("Request Headers:", req.headers);
      const userId = req.params.userId;
      // console.log("ID:", userId);
      // Query the database to get user data
      const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [
        userId,
      ]);

      // Check if the user exists
      if (user.rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      // Return the user data
      res.json(user.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  //(TODO)send another check if this user has this account for server validation
  // Controller function to update user profile
  updateProfile: async function (req, res) {
    try {
      // console.log("Request headers:", req.headers);
      const userId = req.params.userId;
      const {
        username,
        email,
        password,
        firstname,
        lastname,
        phonenumber,
        gender,
      } = req.body;

      // Hash the password before updating
      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await pool.query(
        `UPDATE users 
         SET username = $1, email = $2, password = $3, firstname = $4, lastname = $5, phonenumber = $6, gender = $7
         WHERE user_id = $8 
         RETURNING *`,
        [
          username,
          email,
          hashedPassword,
          firstname,
          lastname,
          phonenumber,
          gender,
          userId,
        ]
      );

      const updatedUser = result.rows[0];

      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  //controller to delete user (profile)
  deleteUser: async function (req, res) {
    const userId = req.params.id;

    try {
      // Find the user by ID and delete
      const deletedUser = await pool.query(
        "DELETE FROM users WHERE user_id = $1 RETURNING *",
        [userId]
      );

      if (deletedUser.rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Middleware to verify JWT
  verifyToken: function (req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      req.userId = decoded.userId;
      next();
    });
  },

  saveUserAddress: function (req) {
    return new Promise(async function (resolve, reject) {
      try {
        const { userId, address1, address2, town, postalCode } = req.body;

        // Check if user already has an address
        const checkSql = "SELECT * FROM address WHERE user_id = $1";
        const existingAddress = await pool.query(checkSql, [userId]);

        let result;

        if (existingAddress.rows.length > 0) {
          // Update existing address
          const updateSql = `
            UPDATE address
            SET address1 = $2, address2 = $3, town = $4, postalcode = $5
            WHERE user_id = $1
            RETURNING *
          `;
          result = await pool.query(updateSql, [
            userId,
            address1,
            address2,
            town,
            postalCode,
          ]);
        } else {
          // Insert new address
          const insertSql = `
            INSERT INTO address (user_id, address1, address2, town, postalcode)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
          `;
          result = await pool.query(insertSql, [
            userId,
            address1,
            address2,
            town,
            postalCode,
          ]);
        }

        resolve(result.rows[0]);
      } catch (error) {
        reject({ error: "Internal server error" });
        console.error(error);
      }
    });
  },

  getUserAddress: function (req) {
    return new Promise(async function (resolve, reject) {
      try {
        const userId = req.params.userId;
        const sql = "SELECT * FROM address WHERE user_id = $1";
        const address = await pool.query(sql, [userId]);
        resolve(address.rows[0]);
      } catch (error) {
        reject({ error: "Internal server error" });
        console.error(error);
      }
    });
  },
};
