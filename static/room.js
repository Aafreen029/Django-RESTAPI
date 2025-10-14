console.log("Sanity check from room.js.");

const roomName = JSON.parse(document.getElementById('roomName').textContent);

const socket = new WebSocket(`ws://${window.location.host}/ws/chat/${roomName}/`);
socket.onopen = function() {
    console.log("✅ WebSocket connected");
};
socket.onmessage = function(event) {
    const data = JSON.parse(event.data);
    const message = `${data.sender || "Anonymous"}: ${data.message}\n`;
    chatLog.value += message;
    chatLog.scrollTop = chatLog.scrollHeight;
};

socket.onclose = function() {
    console.log("🔌 WebSocket disconnected");
};

socket.onerror = function(error) {
    console.error("❌ WebSocket error:", error);
};

let chatLog = document.querySelector("#chatLog");
let chatMessageInput = document.querySelector("#chatMessageInput");
let chatMessageSend = document.querySelector("#chatMessageSend");
let onlineUsersSelector = document.querySelector("#onlineUsersSelector");

// adds a new option to 'onlineUsersSelector'
function onlineUsersSelectorAdd(value) {
    if (document.querySelector("option[value='" + value + "']")) return;
    let newOption = document.createElement("option");
    newOption.value = value;
    newOption.innerHTML = value;
    onlineUsersSelector.appendChild(newOption);
}

// removes an option from 'onlineUsersSelector'
function onlineUsersSelectorRemove(value) {
    let oldOption = document.querySelector("option[value='" + value + "']");
    if (oldOption !== null) oldOption.remove();
}

// focus 'chatMessageInput' when user opens the page
chatMessageInput.focus();

// submit if the user presses the enter key
chatMessageInput.onkeyup = function(e) {
    if (e.keyCode === 13) {  // enter key
        chatMessageSend.click();
    }
};

//  Send message to WebSocket
chatMessageSend.onclick = function() {
    const message = chatMessageInput.value.trim();
    if (message.length === 0) return;

    if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ message }));
    chatMessageInput.value = "";
    } else {
        console.warn("❌ Cannot send: WebSocket not open");
    }
};