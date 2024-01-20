const pool = require("../../database");


module.exports = {
    startChat: async (req, res) => {
        const { user_id, carSeller, car_id } = req.body;
        try {
            const sqlChat = `SELECT chat_id FROM chats
                             WHERE (user1_id = $1 AND user2_id = $2)
                                OR (user1_id = $2 AND user2_id = $1)
                             LIMIT 1;`;
            const chatRes = await pool.query(sqlChat, [user_id, carSeller]);
            let chatId;
            let message;
            if (chatRes.rows.length === 0) {
                const insertChat = `INSERT INTO chats (user1_id, user2_id,car_id) VALUES ($1, $2,$3) RETURNING chat_id;`;
                const insertRes = await pool.query(insertChat, [user_id, carSeller, car_id]);
                chatId = insertRes.rows[0].chat_id;
                message = "New Chat started";
            } else {
                chatId = chatRes.rows[0].chat_id;
                message = "Chat already exists";
            }

            res.json({ chatId, message });
        } catch (error) {
            console.error('Error starting chat:', error);
            res.status(500).send("Internal Server Error");
        }
    },
    retrieveAllChats: async (req, res) => {

        const user_id = req.params.userId;

        try {
            //     const sql = `
            //     SELECT 
            //         c.chat_id,c.car_id,
            //         CASE 
            //             WHEN c.user1_id = $1 THEN u2.username
            //             ELSE u1.username
            //         END AS chat_partner_username,
            //         CASE 
            //             WHEN c.user1_id = $1 THEN c.user2_id
            //             ELSE c.user1_id
            //         END AS chat_partner_id
            //     FROM 
            //         chats c
            //     LEFT JOIN users u1 ON c.user1_id = u1.user_id
            //     LEFT JOIN users u2 ON c.user2_id = u2.user_id
            //     WHERE 
            //         c.user1_id = $1 OR c.user2_id = $1;
            // `;
            const sql = `
        SELECT 
                c.chat_id,c.car_id,cars.model,i.image_url,
                CASE 
                    WHEN c.user1_id = $1 THEN u2.username
                    ELSE u1.username
                END AS chat_partner_username,
                CASE 
                    WHEN c.user1_id = $1 THEN c.user2_id
                    ELSE c.user1_id
                END AS chat_partner_id
            FROM 
                chats c
            LEFT JOIN users u1 ON c.user1_id = u1.user_id
            LEFT JOIN users u2 ON c.user2_id = u2.user_id
            join cars on c.car_id=cars.car_id
            join images i on c.car_id=i.car_id
            WHERE 
                c.user1_id = $1 OR c.user2_id = $1;
        `
            const chats = await pool.query(sql, [user_id]);
            res.json(chats.rows);
        } catch (error) {
            console.error('Error retrieving chats:', error);
            res.status(500).send("Internal Server Error");
        }

    },
    sendMessage: async (req, res) => {
        const { chat_id, author_id, message } = req.body;
        try {
            const sql = `INSERT INTO messages (chat_id, author_id, message) VALUES ($1, $2, $3);`;
            await pool.query(sql, [chat_id, author_id, message]);
            res.json({ message: "Message sent" });
        } catch (error) {
            console.error('Error sending message:', error);
            res.status(500).send("Internal Server Error");
        }

    },
    retrieveAllMessages: async (req, res) => {
        const chat_id = req.params.chatId;

        try {
            const sql = `SELECT * FROM messages WHERE chat_id = $1;`;
            const messages = await pool.query(sql, [chat_id]);
            res.json(messages.rows);
        } catch (error) {
            console.error('Error retrieving messages:', error);
            res.status(500).send("Internal Server Error");
        }

    },
    retrieveChatCar: async (req, res) => {
        const chat_id = req.params.chatId;

        try {
            const sql = `SELECT c.car_id,cars.model,i.image_url FROM chats c join cars on c.car_id=cars.car_id JOIN images i on c.car_id=i.car_id WHERE c.chat_id = $1;`;
            const car = await pool.query(sql, [chat_id]);
            res.json(car.rows)
        } catch (error) {
            console.error('Error retrieving car for chat:', error);
            res.status(500).send("Internal Server Error");
        }

    }
}