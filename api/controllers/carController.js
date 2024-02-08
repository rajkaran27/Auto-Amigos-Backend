const pool = require("../../database");
//raj and lexuan

module.exports = {
  getCarBrands: async (req, res) => {
    try {
      const cars = await pool.query("SELECT * FROM brand");
      res.json(cars.rows);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
  getCarCapacity: async (req, res) => {
    try {
      const cars = await pool.query("SELECT * from car_capacity");
      res.json(cars.rows);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
  getCarTrans: async (req, res) => {
    try {
      const cars = await pool.query("SELECT * from car_transmission");
      res.json(cars.rows);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
  createBrand: async (req, res) => {
    const brand_name = req.body.brand_name;
    // console.log(brand_name);
    try {
      const cars = await pool.query(
        "INSERT INTO brand (brand_name) VALUES ($1)",
        [brand_name]
      );
      res.json(cars.rows);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
  getCarsByCondition: async (req, res) => {
    try {
      const car_condition = req.params.condition;
      const sql = `SELECT c.car_id,c.model,c.year,c.price,c.description, i.image_url, category.category_name, brand.*,car_capacity.capacity,car_transmission.transmission, car_condition.condition
            FROM cars c
            INNER JOIN images i ON c.car_id = i.car_id
            INNER JOIN category ON c.category_id = category.category_id 
            Inner JOIN brand on c.brand_id=brand.brand_id 
            inner join car_capacity on c.capacity=car_capacity.id 
            inner join car_transmission on c.transmission=car_transmission.id 
            inner join car_condition on c.condition=car_condition.condition_id where car_condition.condition=$1 AND c.carStatus = 'active'`;
      const cars = await pool.query(sql, [car_condition]);
      // console.log(cars.rows);
      res.json(cars.rows);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
  getRecommendedNewCar: async (req, res) => {
    try {
      const sql = `SELECT c.*, i.image_url, category.category_name, brand.*,car_condition.condition
            FROM cars c
            INNER JOIN images i ON c.car_id = i.car_id
            INNER JOIN category ON c.category_id = category.category_id
            INNER JOIN brand ON c.brand_id = brand.brand_id
            INNER JOIN car_condition ON c.condition = car_condition.condition_id
            WHERE car_condition.condition = 'New' AND c.carStatus = 'active'
            ORDER BY RANDOM()
            LIMIT 6;`;
      const cars = await pool.query(sql);
      res.json(cars.rows);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
  getCategory: async (req, res) => {
    try {
      const sql = `SELECT * FROM category;`;
      const cars = await pool.query(sql);
      res.json(cars.rows);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
  getCarByID: async (req, res) => {
    try {
      const car_id = req.params.id;
      const sql = `
            SELECT c.car_id, c.model, c.year, c.price, c.description, i.image_url, 
                   category.category_name, brand.*, car_capacity.capacity, 
                   car_transmission.transmission,car_condition.condition as condition
            FROM cars c
             JOIN images i ON c.car_id = i.car_id
             JOIN category ON c.category_id = category.category_id 
             JOIN brand ON c.brand_id = brand.brand_id 
             JOIN car_capacity ON c.capacity = car_capacity.id 
             JOIN car_transmission ON c.transmission = car_transmission.id 
             JOIN car_condition ON c.condition = car_condition.condition_id
            WHERE c.car_id = $1;
          `;
      const cars = await pool.query(sql, [car_id]);
      res.json(cars.rows);
    } catch (error) {
      console.error("Error in getCarByID:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  getOldCarProductCard: async (req, res) => {
    try {
      const sql = `SELECT c.car_id,c.model,c.year,c.price,c.description, i.image_url, category.category_name, brand.*,car_capacity.capacity,car_transmission.transmission
            FROM cars c
            INNER JOIN images i ON c.car_id = i.car_id
            INNER JOIN category ON c.category_id = category.category_id Inner JOIN brand on c.brand_id=brand.brand_id inner join car_capacity on c.capacity=car_capacity.id inner join car_transmission on c.transmission=car_transmission.id where c.condition=2;`;
      const cars = await pool.query(sql);
      res.json(cars.rows);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
  getCarsByFilter: async (req, res) => {
    try {
      const carCondition = "New"; // Fixed to filter only NEW cars
      const categoryFilter = req.body.selectedCategoryIds || null;
      const brandFilter = req.body.selectedBrandIds || null;
      const capacityFilter = req.body.selectedCapacityIds || null;
      const transmissionFilter = req.body.selectedTransIds || null;

      let sql = `
                SELECT c.car_id, c.model, c.year, c.price, c.description, i.image_url,
                category.category_name, brand.brand_name, car_capacity.capacity, car_transmission.transmission, car_condition.condition,brand.brand_image
                FROM cars c
                INNER JOIN images i ON c.car_id = i.car_id
                INNER JOIN category ON c.category_id = category.category_id 
                INNER JOIN brand ON c.brand_id = brand.brand_id 
                INNER JOIN car_capacity ON c.capacity = car_capacity.id 
                INNER JOIN car_transmission ON c.transmission = car_transmission.id 
                INNER JOIN car_condition ON c.condition = car_condition.condition_id 
                WHERE car_condition.condition = $1 AND c.carStatus = 'active'
            `;

      const params = [carCondition];
      const filters = [];

      const addFilter = (filter, tableName) => {
        if (filter && filter.length > 0) {
          filters.push(
            `${tableName} IN (${filter
              .map((_, index) => "$" + (params.length + index + 1))
              .join(",")})`
          );
          params.push(...filter);
        }
      };

      addFilter(categoryFilter, "category.category_id");
      addFilter(brandFilter, "brand.brand_id");
      addFilter(capacityFilter, "car_capacity.id");
      addFilter(transmissionFilter, "car_transmission.id");

      if (filters.length > 0) {
        sql += " AND " + filters.join(" AND ");
      }

      const cars = await pool.query(sql, params);
      res.json(cars.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  getListedCarsUsingID: async (req, res) => {
    try {
      const user_id = req.params.id;
      const limit = parseInt(req.query.limit) || 9; // Default limit to 9 if not provided
      const offset = parseInt(req.query.offset) || 0; // Default offset to 0 if not provided

      const sql = `SELECT c.car_id,c.model,c.year,c.price,c.description, i.image_url, cat.category_name, b.*,cc.capacity,ct.transmission
            FROM cars c
            INNER JOIN cars_seller cs ON c.car_id = cs.car_id
            INNER JOIN images i ON c.car_id = i.car_id
            INNER JOIN category cat ON c.category_id = cat.category_id
            INNER JOIN brand b ON c.brand_id = b.brand_id
            INNER JOIN car_capacity cc ON c.capacity = cc.id
            INNER JOIN car_transmission ct ON c.transmission = ct.id
            WHERE cs.user_id = $1 and c.carstatus = 'active'
            ORDER BY c.car_id DESC
            LIMIT $2 OFFSET $3;`; // Use LIMIT and OFFSET clauses

      const cars = await pool.query(sql, [user_id, limit, offset]);
      res.json(cars.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  getSearchedCar: async (req, res) => {
    try {
      const carSearch = req.params.search;
      const sql = `SELECT c.*, i.image_url, category.category_name, brand.*,car_condition.condition
            FROM cars c
            INNER JOIN images i ON c.car_id = i.car_id
            INNER JOIN category ON c.category_id = category.category_id
            INNER JOIN brand ON c.brand_id = brand.brand_id
            INNER JOIN car_condition ON c.condition = car_condition.condition_id
            WHERE c.carStatus = 'active' AND c.model ILIKE $1;`;
      const cars = await pool.query(sql, [`%${carSearch}%`]);
      res.json(cars.rows);
      // console.log(cars.rows);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },

  uploadCar: async (req, res) => {
    try {
      const {
        name,
        brand_id,
        category,
        description,
        capacity,
        transmission,
        price,
        year,
        user_id,
      } = req.body;

      const result = await pool.query(
        "INSERT INTO cars (brand_id, category_id, model, year, price, description, condition, transmission, capacity,carStatus) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9,'active') RETURNING car_id",
        [
          brand_id,
          category,
          name,
          year,
          price,
          description,
          2,
          transmission,
          capacity,
        ]
      );

      const carId = result.rows[0].car_id;

      await pool.query(
        "INSERT INTO cars_seller (car_id, user_id) VALUES ($1, $2)",
        [carId, user_id]
      );

      res.json(result.rows[0].car_id);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  uploadingImage: async (req, res) => {
    try {
      const { car_id, image_url } = req.body;

      const result = await pool.query(
        "INSERT INTO images (image_url, car_id) VALUES ($1, $2)",
        [image_url, car_id]
      );

      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  getCarByID2: (req, res) => {
    return new Promise(async (resolve, reject) => {
      try {
        // console.log(req.params.id);
        const car_id = req.params.id;
        const sql = `SELECT c.car_id,c.model,c.year,c.price,c.description, i.image_url, category.category_name,category.category_id, brand.*,car_capacity.capacity,car_capacity.id as capacity_id,car_transmission.transmission,car_transmission.id as transmission_id
                FROM cars c
                INNER JOIN images i ON c.car_id = i.car_id
                INNER JOIN category ON c.category_id = category.category_id 
                INNER JOIN brand on c.brand_id=brand.brand_id 
                INNER JOIN car_capacity on c.capacity=car_capacity.id 
                INNER JOIN car_transmission on c.transmission=car_transmission.id 
                WHERE c.car_id=$1;`;
        const cars = await pool.query(sql, [car_id]);
        console.log(cars.rows);
        resolve(cars.rows);
      } catch (error) {
        reject({ error: "Internal server error" });
      }
    });
  },
  updateCarUser: async (req, res) => {
    try {
      const {
        car_id,
        model,
        desc,
        brand_id,
        year,
        price,
        capacity_id,
        transmission_id,
        category_id,
      } = req.body;

      const sql = `UPDATE cars
                SET model = $1, description = $2, brand_id = $3, category_id = $4,
                year = $5, price = $6, transmission = $7, capacity = $8
                WHERE car_id = $9;`;

      await pool.query(sql, [
        model,
        desc,
        brand_id,
        category_id,
        year,
        price,
        transmission_id,
        capacity_id,
        car_id,
      ]);

      res.status(200).json({ message: "Car updated successfully" });
    } catch (error) {
      console.error("Error updating car:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  checkUserCar: async (req, res) => {
    try {
      const car_id = req.params.id;
      const user_id = req.params.user;
      const sql = `SELECT * FROM cars_seller WHERE car_id = $1 AND user_id = $2`;
      const result = await pool.query(sql, [car_id, user_id]);

      if (result.rows.length === 1) {
        res.status(200).json({ message: "User owns the car" });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      console.error("Error checking user car:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  deleteCarUser: async (req, res) => {
    try {
      const car_id = req.params.id;
      const sql = `UPDATE cars set carStatus = 'deleted' WHERE car_id = $1`;
      const result = await pool.query(sql, [car_id]);
      if (result.rowCount === 1) {
        res.status(200).json({ message: "Car deleted successfully" });
      } else {
        res.status(404).json({ error: "Car not found" });
      }
    } catch (error) {
      console.error("Error deleting car:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  getCarSellerByCarID: async (req, res) => {
    try {
      const car_id = req.params.carId;
      const sql = `select user_id from cars_seller where car_id=$1`;
      const result = await pool.query(sql, [car_id]);
      res.json(result.rows);
    } catch (error) {
      console.error("Error getting car seller:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  getCarByQuiz: async (req, res) => {
    try {
      // Extract necessary parameters from the request
      const catID = req.body.category;
      const brandID = req.body.brand_id;
      const capID = req.body.capacity;
      const transID = req.body.transmission;

      // Construct the SQL query
      const sql = `SELECT c.*, i.image_url, category.category_name, brand.*,car_condition.condition
      FROM cars c
      INNER JOIN images i ON c.car_id = i.car_id
      INNER JOIN category ON c.category_id = category.category_id
      INNER JOIN brand ON c.brand_id = brand.brand_id
      INNER JOIN car_condition ON c.condition = car_condition.condition_id
      WHERE c.carStatus = 'active' 
      AND c.category_id = $1
      AND c.brand_id = $2
      AND c.capacity = $3
      AND c.transmission = $4`;

      // Execute the query
      const result = await pool.query(sql, [catID, brandID, capID, transID]);

      // Return the results
      res.json(result.rows);
    } catch (error) {
      console.error("Error getting cars by quiz:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  UploadRentalRecord: async (req, res) => {
    try {
      console.log(req.body.from, req.body.to, req.body.price);
      const { car_id, user_id, from, to, price } = req.body;

      const sql = `INSERT INTO rental_records (car_id, user_id, rental_price, date_from, date_to) VALUES ($1, $2, $3, $4, $5)`;
      await pool.query(sql, [
        car_id,
        user_id,
        price,
        new Date(parseInt(from)),
        new Date(parseInt(to)),
      ]); // Execute the SQL query
      return res.status(200).json(); // Return success status
    } catch (error) {
      console.error("Error occurred during API call:", error);
      return res.status(500).json(); // Return error status
    }
  },
  getRentalRecordByUserID: async (req, res) => {
    try {
      const user_id = req.params.id;
      const sql = `SELECT * FROM rental_records rr
            JOIN cars c ON c.car_id = rr.car_id
            JOIN images i ON c.car_id = i.car_id
            JOIN category ON c.category_id = category.category_id 
            JOIN brand ON c.brand_id = brand.brand_id 
            JOIN car_capacity ON c.capacity = car_capacity.id 
            JOIN car_transmission ON c.transmission = car_transmission.id 
            JOIN car_condition ON c.condition = car_condition.condition_id
            where user_id = $1;`;
      const result = await pool.query(sql, [user_id]);
      res.json(result.rows);
    } catch (error) {
      console.error("Error getting rental records:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  deleteRentalRecord: async (req, res) => {
    try {
      const user_id = req.params.id;
      const car_id = req.params.car_id;
      const sql = `DELETE FROM rental_records WHERE user_id = $1 AND car_id = $2`;
      const result = await pool.query(sql, [user_id, car_id]);
      if (result.rowCount === 1) {
        res.status(200).json({ message: "Rental record deleted successfully" });
      } else {
        res.status(404).json({ error: "Rental record not found" });
      }
    } catch (error) {
      console.error("Error deleting rental record:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};
