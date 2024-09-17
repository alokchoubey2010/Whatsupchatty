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

// Function to fetch user data from Firebase Realtime Database
function fetchUsersFromFirebase() {
  const usersRef = firebase.database().ref("/users");

  usersRef.once('value', (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const user = childSnapshot.val();
      createContact(user.name, user.email, user.profileImg);
    });
  });
}

// Function to create a contact
function createContact(name, about, profileImg) {
  const contactsDiv = document.querySelector(".chatContainer");

  const div = document.createElement("div");
  div.className = "contact";

  const img = document.createElement("img");
  img.className = "profileImg";
  img.src = profileImg;
  div.appendChild(img);

  const namePara = document.createElement("p");
  namePara.className = "name";
  namePara.innerText = name;
  div.appendChild(namePara);

  const aboutPara = document.createElement("p");
  aboutPara.className = "about";
  aboutPara.innerText = createSubstring(about, 30);
  div.appendChild(aboutPara);

  const state = document.createElement("p");
  state.className = "status";
  state.innerText = "Online";
  div.appendChild(state);

  contactsDiv.appendChild(div);
}

function createSubstring(string, maxLength) {
  if (string.length > maxLength) {
    return string.substring(0, maxLength) + "...";
  }
  return string;
}

fetchUsersFromFirebase();