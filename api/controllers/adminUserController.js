// pranjal & karl
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { jwtSecret } = require("../../config");
const pool = require("../../database");

module.exports = {
  // function to get all users with displayCount and option for all/whitelisted/blacklisted for data manipulation
  getAllUsers: async (req, res) => {
    try {
      const { type = "all", count = 10 } = req.query;
      let query;

      if (type === "all") {
        query = "SELECT * FROM users";
      } else if (type === "whitelisted") {
        query = "SELECT * FROM users WHERE is_blacklisted = false";
      } else if (type === "blacklisted") {
        query = "SELECT * FROM users WHERE is_blacklisted = true";
      } else {
        return res.status(400).json({ error: "Invalid user type" });
      }

      // Add LIMIT to the query based on count
      query += ` ORDER BY user_id ASC LIMIT ${count}`;

      const result = await pool.query(query);

      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error retrieving users:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  getAll: async (req, res) => {
    try {
      // Fetch data from users and users_external tables based on created_at
      const userData = await pool.query(
        "SELECT * FROM users ORDER BY created_at"
      );
      const externalUserData = await pool.query(
        "SELECT * FROM users_external ORDER BY created_at"
      );

      // Combine and send the data as the API response
      const combinedData = { userData, externalUserData };
      res.status(200).json(combinedData);
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // admin updates user data (can only update username, firstname, lastname, phonenumber, is_admin, is_blacklisted, gender)
  updateProfile: async function (req, res) {
    try {
      const userId = req.params.userId;
      const {
        username,
        firstname,
        lastname,
        phonenumber,
        is_admin,
        is_blacklisted,
        gender,
      } = req.body;

      const result = await pool.query(
        `UPDATE users 
       SET 
         username = COALESCE($1, username),
         firstname = COALESCE($2, firstname),
         lastname = COALESCE($3, lastname),
         phonenumber = COALESCE($4, phonenumber),
         is_admin = COALESCE($5, is_admin),
         is_blacklisted = COALESCE($6, is_blacklisted),
         gender = COALESCE($7, gender)
       WHERE user_id = $8 
       RETURNING *`,
        [
          username,
          firstname,
          lastname,
          phonenumber,
          is_admin,
          is_blacklisted,
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
};
