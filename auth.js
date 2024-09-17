// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBtNChab23CAv6HmiJnMmyKb5ALQSOIn4s",
  authDomain: "group-chat-neuron-nerds.firebaseapp.com",
  databaseURL: "https://group-chat-neuron-nerds-default-rtdb.firebaseio.com",
  projectId: "group-chat-neuron-nerds",
  storageBucket: "group-chat-neuron-nerds.appspot.com",
  messagingSenderId: "900309631047",
  appId: "1:900309631047:web:583c5dce923fd4d43ff162"
};

firebase.initializeApp(firebaseConfig);

// Open email form
function openEmailForm() {
  const lander = document.querySelector(".lander");
  lander.style.display = 'none';
  const email_form = document.querySelector(".email_form");
  email_form.style.display = 'flex';
}

// Handle user login
function login() {
  const auth = firebase.auth();
  const email = document.getElementById("emailbx").value;
  const password = document.getElementById("password").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then((result) => {
      const user = result.user;
      console.log("User signed in: ", user);
      updateToDatabase(user);
      window.location.assign('home.html'); // Corrected typo
    })
    .catch((error) => {
      alert("Error during sign-in: " + error.code + " - " + error.message + " Try again!");
    });
}

// Show sign-up form
function showSignupForm() {
  const bodyText = document.querySelector(".bodyText");
  bodyText.innerHTML = "Sign up and get started for free";
}

// Handle Google Sign-In
function showGoogleForm() {
  const provider = new firebase.auth.GoogleAuthProvider();

  firebase.auth().signInWithRedirect(provider)
    .then((user) => {
      // updateProfile(user);
      updateToDatabase(user);
      window.location.assign("home.html");
    })
    .catch((error) => {
      alert("Google sign-in failed: " + error.message);
    });
}

function updateProfile(user){
  name = user.displayName;
  email = user.email;
  photoURL = user.photoURL;
  document.getElementById("name").innerHTML = name;
  document.getElementById("emaildisp").innerHTML = email;
  document.getElementById("imgDisplay").src  = photoURL;
}

function showQuickLoginIfPossible(){
  // Listen for auth state changes
  firebase.auth().onAuthStateChanged((user) => {
    if (user){
      name = user.displayName;
      updateToDatabase(user);
      if(name === 'null'){
      }
      else{
        console.log("User is signed in:", user);
        document.querySelector(".oneClickLogin").style.display = 'block';
        updateProfile(user);
        document.querySelector('.oneClickLogin').onclick = function() {
          updateToDatabase(user);
          window.location.assign("home.html");
        }
      }
    } else {
      console.log("No user is signed in.");
    }
  });
}

showQuickLoginIfPossible();

function updateToDatabase(user){
  database = firebase.database();
  userName = user.displayName;
  userEmail = user.email;
  profileImg = user.photoURL;
  database.ref("users/" + userName).set({
    name: userName,
    email: userEmail,
    profileImg: profileImg,
    lastLogin: 'null',
    lastLogout: 'null'
  })
}
