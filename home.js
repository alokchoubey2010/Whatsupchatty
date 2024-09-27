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
      createProfileNavDisplay(user.profileImg,user.name);
    });
  });
}

// Function to create a contact
function createContact(name, about, profileImg) {
  const contactsDiv = document.querySelector(".contacts");

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

  // Add click event listener to each contact div
  div.onclick = function() {
    localStorage.setItem('selectedContact', name); 
    firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    name1 = user.displayName;
    name2 = localStorage.getItem("selectedContact");
    createChat(name1, name2);
    window.location.assign("chat.html")
  } else {
    alert("An unexpected authentication error occured make sure you have signed in!")
  }
});
  }
}

function createSubstring(string, maxLength) {
  if (string.length > maxLength) {
    return string.substring(0, maxLength) + "...";
  }
  return string;
}

fetchUsersFromFirebase();

// Function to create profile nav display
function createProfileNavDisplay(profileImg, name) {
  const profileHolder = document.querySelector(".profileHolder");
  const profile = document.createElement("div");
  profile.className = 'profile';

  const img = document.createElement("img");
  img.className = 'profileImgNav';
  img.src = profileImg;
  profile.appendChild(img);

  const p = document.createElement("p");
  p.className = "nameLabel";
  p.innerText = createSubstring(name, 5);
  profile.appendChild(p);

  profileHolder.appendChild(profile);
}

function toLowerCaseNoSpaces(str) {
  // Convert the string to lowercase and remove all spaces
  return str.toLowerCase().replace(/\s+/g, '');
}


database = firebase.database();

function createChat(user1, user2) {
  // Sort the usernames alphabetically
  let sortedUsers = [user1, user2].sort(); // This will make sure the room name is consistent
  let strs = sortedUsers[0] + sortedUsers[1];
  let chat = toLowerCaseNoSpaces(strs); // Use lowercase and remove spaces

  localStorage.setItem("currentRoom", chat);

  if (checkForNode(chat)) {
    console.log("Room already exists.");
  } else {
    // Room doesn't exist, create a new one
    database.ref(`rooms/${chat}/New Chat Started`).set({
      message: "New Chat Started!",
      time: Date.now()
    });
    console.log("New room created.");
  }
}


function checkForNode(nodeName){
  const dbRef = firebase.database().ref('rooms/' + nodeName);
  dbRef.get().then((snapshot) => {
    if (snapshot.exists()) {
      return true;
    } else {
      return false;
    }
  }).catch((error) => {
    alert("Error fetching node:", error);
  });
}

function showOptions(){
  settingsOption = document.querySelector(".settingsOption");
  settingsOption.classList.add("active");
}

function autocompleteSearch() {
  const searchInput = document.getElementById('searchInput').value;
  const autocompleteList = document.querySelector('.contacts');
  autocompleteList.innerHTML = '';
  getNameArray((nameArray) => {
  console.log(nameArray)
  if (nameArray.includes(searchInput.toLowerCase())) {
    card = createContact(searchInput);
    autocompleteList.appendChild(card);
  } else {
    autocompleteList.innerHTML = "No Contacts Found! Refresh the page."
  }
});
}


// Function to get name data from Firebase and store it in an array
function getNameArray(callback) {
  // Reference to users in Firebase
  const usersRef = database.ref('users');

  // Create an empty array to store the names
  let nameArray = [];

  // Fetch the users from Firebase
  usersRef.once('value', (snapshot) => {
    const users = snapshot.val();

    // Loop through the users object and extract the Name property
    for (const key in users) {
      if (users[key].name) {
        nameArray.push(users[key].name.toLowerCase()); // Extracting the "Name" property
      }
    }

    // Call the callback function with the nameArray
    callback(nameArray);
  });
}
