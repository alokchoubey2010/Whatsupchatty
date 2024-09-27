const firebaseConfig = {
  apiKey: "AIzaSyBtNChab23CAv6HmiJnMmyKb5ALQSOIn4s",
  authDomain: "group-chat-neuron-nerds.firebaseapp.com",
  databaseURL: "https://group-chat-neuron-nerds-default-rtdb.firebaseio.com",
  projectId: "group-chat-neuron-nerds",
  storageBucket: "group-chat-neuron-nerds.appspot.com",
  messagingSenderId: "900309631047",
  appId: "1:900309631047:web:583c5dce923fd4d43ff162"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

function showCreateRoomForm(){
  // window.location.assign("./chat.html?action=create-room")
  confirm = confirm(`Do you want to create a room with ${localStorage.getItem("selectedContact")}?`)
  if(confirm){
    alert(`Room already exists !`)
  }else{
    alert("Operation cancelled by User!")
  }
}

document.querySelector(".inputMessage").addEventListener("input", () => {
  document.querySelector(".send").style.display = "block";
})

function sendMessage(){
  input = document.querySelector(".inputMessage");
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      msg = input.value;
      sender = user.displayName;
      time = new Date();
      saveMessage(msg,sender);
      chatBox = document.querySelector(".chatBox");
      chatBox.innerHTML = '';
      retriveAndDisplayMessage();
    } else {
      alert(`An authentication error has occured make sure you are signed in!`)
    }
  });
}

document.querySelector(".name").innerHTML = localStorage.getItem("selectedContact");


function saveMessage(messageText, senderName) {
  currentRoom = localStorage.getItem("currentRoom");
  const messagesRef = firebase.database().ref(`rooms/${currentRoom}/${messageText}`);
  // Creating the message object
  const messageData = {
    message: messageText,
    sender: senderName,
    time: Date.now()
  };
  messagesRef.set(messageData);
}


function retriveAndDisplayMessage(){
  currentRoom = localStorage.getItem("currentRoom");
  messageRef = firebase.database().ref(`rooms/${currentRoom}`).orderByChild('time');
  messageRef.once('value', (snapshot) => {
  snapshot.forEach((childSnapshot) => {
    const data = childSnapshot.val();
    selectedContact = localStorage.getItem("selectedContact");
    if(data.sender === selectedContact){
      displaySend(data.message,"recieved",convertTimestampTo24HourFormat(data.time));
    }else{
      displaySend(data.message,"sent",convertTimestampTo24HourFormat(data.time));
    }
  });
});
}

retriveAndDisplayMessage();


function displaySend(msg,className,time){
  div = document.createElement("div");
  chatBox = document.querySelector(".chatBox");
  div.className = 'holder';
  p = document.createElement("p");
  p.className = className;
  sub = document.createElement("sub");
  sub.innerHTML = time;
  p.innerHTML = msg;
  p.appendChild(sub);
  div.appendChild(p);
  chatBox.appendChild(div);
  document.querySelector(".inputMessage").value = '';
}


function convertTimestampTo24HourFormat(timestamp) {
  // Create a Date object from the timestamp
  const date = new Date(timestamp);

  // Use toLocaleTimeString to convert to 24-hour format
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false // Ensure 24-hour format
  });
}


function updateProfilePicure(){
  selectedContact = localStorage.getItem("selectedContact");
  ref = firebase.database().ref(`users/${selectedContact}`);
  ref.on('value',function(snapshot){
    data = snapshot.val();
    profileImg = document.querySelector(".profileImg");
    profileImg.src = data.profileImg;
  })
}

updateProfilePicure();

function handleNewMessage(snapshot) {
    const data = snapshot.val();
    console.log('New message added:', newMessage);
    if(data.sender === selectedContact){
      displaySend(data.message,"recieved",convertTimestampTo24HourFormat(data.time));
    }else{
      displaySend(data.message,"sent",convertTimestampTo24HourFormat(data.time));
    }
}

currentRoom = localStorage.getItem("currentRoom");
messagesRef = firebase.database().ref(`rooms/${currentRoom}`);
messagesRef.on('child_added', handleNewMessage);
