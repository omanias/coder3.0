const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const PORT = 3000;

// Crear el servidor HTTP
const server = http.createServer(app);

// Configurar Socket.IO
const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));

let messages = [];

// Configuración de Socket.IO
io.on("connection", (socket) => {
    console.log("Nuevo cliente se ha conectado");

    // Enviar la lista de mensajes al cliente recién conectado
    socket.emit("messageList", messages);

    // Escuchar nuevos mensajes y transmitirlos a todos los clientes
    socket.on("newMessage", (message) => {
        messages.push(message);
        io.emit("newMessage", {
            socketId: socket.id,
            message: message,
        });
    });
});

// Iniciar el servidor
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
