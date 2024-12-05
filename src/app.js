import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import fs from "fs";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.engine("handlebars", handlebars.engine());
app.set("views", "./src/views");
app.set("view engine", "handlebars");

// Ruta del archivo donde se guardan los mensajes
const messagesFilePath = "./src/data/messages.json";

const PORT = 8080;

app.get("/", (req, res) => {
    try {
        res.status(200).render("index");
    } catch (error) {
        console.log(error);
        res.status(404).send(error.message);
    }
})

const httpServer = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
});

let messages = [];
// Cargar mensajes del archivo
messages = JSON.parse(await fs.promises.readFile(messagesFilePath, "utf-8"));


const io = new Server(httpServer);
io.on("connection", (socket) => {
    console.log(`Nuevo cliente conectado con el ID: ${socket.id}`);
    socket.on("newUser", (data) => {
        socket.broadcast.emit("newUser", data);
        io.emit("messageLogs", messages);
    })

    socket.on("message", async (data) => {
        messages.push(data);
        io.emit("messageLogs", messages);
        // Guarda los mensajes en el archivo
        try {
            await fs.promises.writeFile(messagesFilePath, JSON.stringify(messages, null, 2));
        } catch (error) {
            console.error("Error al guardar mensajes:", error);
        }
    })
})

