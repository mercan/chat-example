const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const onlineCount = document.getElementById('onlineCount');
const messageInput = document.getElementById('msg');


// Get room from URL
const room = location.search.split('=')[1];

// https://chatsocket-example.herokuapp.com/
const socket = io.connect('https://chatsocket-example.herokuapp.com/', {
  query: {
    token: localStorage.getItem('auth_token'),
  }
});

messageInput.addEventListener('keypress', () => socket.emit('typing'));

socket.on('typingUser', ({ username }) => {
  const chat_messages = document.querySelector('.chat-messages');
  const typing = document.querySelector('.typing');

  if (typing) {
    typing.innerText = `${username} yazıyor...`;
  } else {
    const iElement = document.createElement('i');
    iElement.classList.add('typing');
    iElement.innerText = `${username} yazıyor...`;

    chat_messages.appendChild(iElement);
  }
});

// Join chatroom
socket.emit('joinRoom', { room });

socket.on('roomErrorRedirect', () => {
  location.replace('https://chatsocket-example.herokuapp.com');
});

socket.on('onlineCount', data => {
  onlineCount.innerHTML = `<i class="fas fa-users"> Users ${data.onlineCount}</i>`;
});

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUser(users);
});

// Message from server
socket.on('message', message => {
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;

  const typing = document.querySelector('.typing');

  if (typing) {
    typing.remove();
  }
});

// Message submit
chatForm.addEventListener('submit', e => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;
  
  msg = msg.trim(); // no-break space delete
  
  if (!msg) {
    return false;
  }

  // Emit message to server
  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  const p = document.createElement('p');
  const para = document.createElement('p');

  div.classList.add('message');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span> ${message.time}</span>`;
  div.appendChild(p);
  para.classList.add('text');
  para.innerText = message.message;
  div.appendChild(para);

  document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUser(usernames) {
  userList.innerHTML = '';

  usernames.forEach(username => {
    const li = document.createElement('li');
    li.innerText = username;
    userList.appendChild(li);
  });
  
}