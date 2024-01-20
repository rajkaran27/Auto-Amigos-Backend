const express = require('express');
const createHttpError = require('http-errors');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const { Server } = require('socket.io');
const http = require('http');
const url = process.env.NEXT_PUBLIC_FRONTEND_URL

const carRoutes = require('./api/routes/carRoutes');
const userRoutes = require('./api/routes/userRoutes');
const reviewRoutes = require('./api/routes/reviewRoutes');
const webhookRoutes = require('./api/routes/webhookRoutes');
const adminRoutes = require('./api/routes/adminRoutes');
const adminUserRoutes = require('./api/routes/adminUserRoutes');
const stripeRoutes = require('./api/routes/stripeRoutes');
const orderRoutes = require('./api/routes/orderRoutes');
const chatRoutes = require('./api/routes/chatRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: url,
        methods: ["GET", "POST"]
    }
});


io.on("connection", (socket) => {

    socket.on('join room', (chat_id) => {
        socket.join(chat_id);
    });

    socket.on('disconnect', () => {
        const rooms = Object.keys(socket.rooms);
        rooms.forEach(room => {
            socket.leave(room);
        });
    });

    socket.on('chat message', (message) => {
        io.to(message.chat_id).emit('chat message', message);
    });
});

cloudinary.config({
    secure: true
});

app.use(cors());
app.use(express.static('public'));
app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use('/api/webhook', express.raw({type: 'application/json'}), webhookRoutes);
app.use(express.json()); 
app.use('/api/admin/', adminUserRoutes);
app.use('/api', carRoutes);
app.use('/api', userRoutes);
app.use('/api', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/pay', stripeRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/chat', chatRoutes)

app.use(function (req, res, next) {
    return next(createHttpError(404, `Unknown Resource ${req.method} ${req.originalUrl}`));
});

app.use(function (err, req, res, next) {
    return res.status(err.status || 500).json({ error: err.message || 'Unknown Server Error!' });
});

module.exports = { app, server };


