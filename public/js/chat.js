const socket = io();

let userEmail;
const messageBox = document.querySelector("#messageBox");

Swal.fire({
    title: "Quien sos?",
    input: "text",
    text: "Ingresa tu email para indentificarte",
    confirmButtonText: "Ingresar",
    inputValidator: (value) => {
        return !value && "Es necesario ingresar tu email para continuar";
    },
    allowOutsideClick: false,
}).then((result) => {
    userEmail = result.value;
});

const addNewMessage = () => {
    if(messageBox.value.trim().length > 0) {
        socket.emit("addMessageEvent", {
            userEmail,
            message: messageBox.value
        });
        messageBox.vaue = "";
    }
};

socket.on("updateMessages", (messages) => {
    let messagesDisplay = document.querySelector("#messagesDisplay");
    let content = ``;

    if(!messages || messages === 0) {
        content += `<tr><td colspan="7">No hay mensajes</td></tr>`
    } else {
        messages.forEach((message) => {
            content = `<div class="chat-message left">
                <div clss="message">
                    <small class="message-sender>
                        ${message.userEmail}
                    </small>
                    <span class="message-content">
                        ${message.message}
                    </span>
                </div>
            </div>`
        });
    }
    messagesDisplay.innerHTML = content;
});