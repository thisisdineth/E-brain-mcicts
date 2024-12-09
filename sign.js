
const firebaseConfig = {
    apiKey: "AIzaSyA-M8XsFZaZPu_lBIx0TbqcmzhTXeHRjQM",
    authDomain: "ecommerceapp-dab53.firebaseapp.com",
    databaseURL: "https://ecommerceapp-dab53-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "ecommerceapp-dab53",
    storageBucket: "ecommerceapp-dab53.appspot.com",
    messagingSenderId: "429988301014",
    appId: "1:429988301014:web:4f09bb412b6cf0b4a82177"
  };
  
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

// Show Sign Up Form
function showSignUp() {
    document.getElementById('sign-up-form').style.display = 'block';
    document.getElementById('sign-in-form').style.display = 'none';
}

// Show Sign In Form
function showSignIn() {
    document.getElementById('sign-up-form').style.display = 'none';
    document.getElementById('sign-in-form').style.display = 'block';
}

// Display Loader
function showLoader(show) {
    document.getElementById('loader').style.display = show ? 'block' : 'none';
}

// Display Error Message
function showError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.innerText = message;
    errorDiv.style.display = 'block';
    setTimeout(() => errorDiv.style.display = 'none', 5000);
}

// Validation
function isValidClass(classInput) {
    return /^[A-Z0-9]+$/.test(classInput); // Only uppercase letters and numbers
}

function isValidWhatsapp(number) {
    return /^[0-9]{10}$/.test(number); // Exactly 10 digits
}

function signUp() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const schoolID = document.getElementById('schoolID').value;
    const classInput = document.getElementById('class').value;
    const whatsapp = document.getElementById('whatsapp').value;
    const birthday = document.getElementById('birthday').value;
    const fileInput = document.getElementById('profilePicture');
    const file = fileInput.files[0];

    if (!isValidClass(classInput)) {
        showError("Class can only contain uppercase letters and numbers.");
        return;
    }
    if (!isValidWhatsapp(whatsapp)) {
        showError("WhatsApp number must be exactly 10 digits.");
        return;
    }

    showLoader(true);

    auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            const user = userCredential.user;
            const userData = {
                name,
                email,
                schoolID,
                class: classInput,
                whatsapp,
                birthday
            };

            return db.ref('users/' + user.uid).set(userData).then(() => {
                if (file) {
                    const storageRef = firebase.storage().ref();
                    const profilePicRef = storageRef.child('profilePictures/' + user.uid + '/' + file.name);

                    return profilePicRef.put(file).then(snapshot => {
                        return snapshot.ref.getDownloadURL().then(downloadURL => {
                            return db.ref('users/' + user.uid).update({
                                profilePicture: downloadURL
                            });
                        });
                    });
                }
            });
        })
        .then(() => {
            showLoader(false);
            window.location.href = "./app.html";
        })
        .catch(error => {
            showLoader(false);
            showError(error.message);
        });
}

// Sign In Function
function signIn() {
    showLoader(true);
    const email = document.getElementById('signInEmail').value;
    const password = document.getElementById('signInPassword').value;

    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            showLoader(false);
            window.location.href = "./app.html";
        })
        .catch(error => {
            showLoader(false);
            showError(error.message);
        });
}

// Forgot Password Function
function forgotPassword() {
    const email = document.getElementById('signInEmail').value;
    auth.sendPasswordResetEmail(email)
        .then(() => alert('Password reset link sent to your email'))
        .catch(error => showError(error.message));
}
