var socket;

// chat start on enter button pressed
$(document).ready(function () {
  $('.submit_on_enter').keydown(function(event) {
    if (event.keyCode == 13) {
      event.preventDefault();
      sendMessage();

      return false;
    }
  });
});

function initChat(inputSocket) {
  socket = inputSocket;

  socket.on('chat_received', sendChatMessage);
  socket.on('user_entered_chat', sendChatSystemMessage);
  socket.on('user_left_chat', sendChatSystemMessage);
}

function sendMessage() {
  var message = document.getElementById("chat-input").value;

  message = document.getElementById("target").value + " " + message;
  document.getElementById("chat-input").value = "";

  socket.emit('chat_sent', message);
}

function sendChatMessage(message) {
  var liNode, liText, ulMessages, chat_box;

  chat_box = document.getElementById("chat-box");
  ulMessages = document.getElementById("messages");

  liNode = document.createElement("LI");
  liText = document.createTextNode(message);
  liNode.appendChild(liText);

  ulMessages.appendChild(liNode);

  chat_box.scrollTop = chat_box.scrollHeight; 
}

function sendChatSystemMessage(message) {
  var liNode, liText, ulMessages, chat_box;

  chat_box = document.getElementById("chat-box");
  ulMessages = document.getElementById("messages");

  liNode = document.createElement("LI");
  liText = document.createTextNode(message);
  liNode.setAttribute("style", "font-style: italic");
  liNode.appendChild(liText);

  ulMessages.appendChild(liNode);

  chat_box.scrollTop = chat_box.scrollHeight; 
}
