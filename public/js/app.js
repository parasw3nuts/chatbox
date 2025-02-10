// public/js/app.js
const socket = io();

document.getElementById('send-button').addEventListener('click', () => {
  const message = document.getElementById('message-input').value;
  if (message.trim()) {
    socket.emit('sendMessage', { content: message });
    document.getElementById('message-input').value = '';
  }
});

socket.on('receiveMessage', (data) => {
  const chatBox = document.getElementById('chat-box');
  const messageElement = document.createElement('p');
  messageElement.textContent = data.content;
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to bottom
});