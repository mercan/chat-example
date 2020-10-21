const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const onlineCount = document.getElementById('onlineCount');


// Get username and room from URL
const room = location.search.split("=")[1];

// https://chatsocket-example.herokuapp.com/
const socket = io.connect('https://chatsocket-example.herokuapp.com/', {
  query: {
    token: localStorage.getItem('auth_token'),
  }
});

// Join chatroom
socket.emit('joinRoom', { room });

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

function HtmlTagsClear(input) {
  const array = [];
  let startIndex, endIndex;

  for (let i = 0; i < input.length; i++) {
    const index = input.charAt(i);

    if (index === '>') {
      startIndex = i;
    } else if (index === '<') {
      endIndex = i;
    } else if (startIndex && endIndex) {
      const value = input.slice(startIndex + 1, endIndex);
      if (!array.includes(value)) array.push(value);
      }
    }

  return array.join(' ');
}  