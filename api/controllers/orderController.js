const pool = require("../../database");


module.exports = {
    uploadOrder: function (req) {
        return new Promise(async function (resolve, reject) {
            const { car_id, user_id, price, id, status } = req.body

            const currentDate = new Date();

            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based
            const day = String(currentDate.getDate()).padStart(2, '0');

            const date = `${year}-${month}-${day}`;

            try {
                const sql = `INSERT INTO orders (car_id,user_id,totalprice,date,paymentintent,orderstatus) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`

                result = await pool.query(sql, [car_id, user_id, price, date, id, status]);
                resolve(result.rows[0])

            } catch (error) {
                reject({ error: "Internal server error" });
                console.error(error);
            }

        })
    },
    getOrderByID: function (req) {
        return new Promise(async function (resolve, reject) {
            const user_id = req.params.id

            try {
                const sql = `select o.*,c.*,i.image_url from orders o join cars c on o.car_id=c.car_id join images i on c.car_id=i.car_id where o.user_id=$1`
                result = await pool.query(sql, [user_id]);
                resolve(result.rows)

            } catch (error) {
                reject({ error: "Internal server error" });
                console.error(error);
            }

        })
    },
    cancelOrderByID: function (req) {
        return new Promise(async function (resolve, reject) {
            const order_id = req.params.id
            try {
                const sql = `UPDATE orders SET orderstatus = 'Cancelled By User' WHERE order_id = $1`
                result = await pool.query(sql, [order_id]);
                resolve(result.rows)

            } catch (error) {
                reject({ error: "Internal server error" });
                console.error(error);
            }
        })
    },
    getAllOrdersWithUsers: function (req) {
        //admin function
        return new Promise(async function (resolve, reject) {
            try {
                const sql = `SELECT orders.*,users.firstname,users.lastname FROM orders JOIN users ON orders.user_id = users.user_id`
                result = await pool.query(sql);
                resolve(result.rows)

            } catch (error) {
                reject({ error: "Internal server error" });
                console.error(error);
            }
        })
    },
    updateOrderStatus: function (req) {
        //admin function
        return new Promise(async function (resolve, reject) {
            const { order_id, orderstatus } = req.body
            try {
                const sql = `UPDATE orders SET orderstatus = $1 WHERE order_id = $2`
                result = await pool.query(sql, [orderstatus, order_id]);
                resolve(result.rows)

            } catch (error) {
                reject({ error: "Internal server error" });
                console.error(error);
            }
        })
    },
    weeklySalesGraph: function (req) {
        return new Promise(async function (resolve, reject) {
            try {
                const sql = `SELECT date, totalprice FROM orders`
                result = await pool.query(sql);
                resolve(result.rows)
            } catch (error) {
                reject({ error: "Internal server error" });
                console.error(error);
            }
        })
    },
    // pranjal
    UserIDandCarIDCheck: function (req) {
        return new Promise(async function (resolve, reject) {
            const car_id = req.params.carid;
            const user_id = req.params.userid;
            try {
                const sql = `SELECT EXISTS (
                    SELECT 1
                    FROM orders
                    WHERE user_id = $1 AND car_id = $2
                );`
                result = await pool.query(sql, [user_id, car_id]);
                resolve(result.rows[0].exists)
            } catch (error) {
                reject({ error: "Internal server error" });
                console.error(error);
            }
        })
    },
    salesByBrandGraph: function (req) {
        return new Promise(async function (resolve, reject) {
            try {
                const sql = `SELECT brand.brand_name, SUM(orders.totalprice) FROM orders JOIN cars ON orders.car_id = cars.car_id JOIN brand ON cars.brand_id=brand.brand_id GROUP BY brand.brand_name`
                result = await pool.query(sql);
                resolve(result.rows)
            } catch (error) {
                reject({ error: "Internal server error" });
                console.error(error);
            }
        })
    },
    getTopSpender: function (req) {
        return new Promise(async function (resolve, reject) {
            try {
                const sql = `select concat(users.firstname,' ',users.lastname) as fullname, sum(orders.totalprice) as amountspent from orders join users on orders.user_id=users.user_id group by concat(users.firstname,' ',users.lastname) order by amountspent desc limit 1`
                result = await pool.query(sql);
                resolve(result.rows)
            } catch (error) {
                reject({ error: "Internal server error" });
                console.error(error);
            }
        })
    },
    getTotalRevenue: function (req) {
        return new Promise(async function (resolve, reject) {
            try {
                const sql = `SELECT SUM(totalprice) as revenue FROM orders`
                result = await pool.query(sql);
                resolve(result.rows)
            } catch (error) {
                reject({ error: "Internal server error" });
                console.error(error);
            }
        })
    }
}