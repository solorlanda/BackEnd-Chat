
const socket = io();

let user;

let chatBox = document.getElementById("chatBox");
let sendButton = document.getElementById("sendButton");

Swal.fire({
    title: "Bienvenido al chat",
    input: "text",
    text: "Ingrese su usuario",
    inputValidator: (value) => {
        return !value && "Por favor ingrese su nombre de usuario."
    },
    allowOutsideClick: false
}).then((result) => {
    user = result.value;

    socket.emit("newUser", user);
})

// Evento para enviar mensaje con Enter
chatBox.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        sendMessage();
    }
});

// Evento para enviar mensaje cuando hago click en el boton
sendButton.addEventListener("click", () => {
    sendMessage();
});

// Funcion para enviar mensaje
function sendMessage() {
    if (chatBox.value.trim().length > 0) {
        socket.emit("message", { user: user, message: chatBox.value });
        chatBox.value = "";
    }
}

//recibimos los mensajes del chat
socket.on("messageLogs", (data) => {
    let messagesLogs = document.getElementById("messageLogs");
    let messages = "";

    data.forEach((messageLog) => {
        messages = messages + `${messageLog.user} dice: ${messageLog.message} </br>`
    });

    messagesLogs.innerHTML = messages;
});

socket.on("newUser", (data) => {
    Swal.fire({
        text: `${data} esta en linea`,
        toast: true,
        position: "bottom-right",
        timer: 2500
    })
})