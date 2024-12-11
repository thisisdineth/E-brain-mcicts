// Import Firebase SDK components from the modular Firebase v9+ library
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";

// Firebase Configuration
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
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);

// Get the ARTICLEID from the URL
const urlParams = new URLSearchParams(window.location.search);
const articleId = urlParams.get('ARTICLEID');

if (!articleId) {
    window.location.href = 'index.html'; // Redirect if no ARTICLEID is provided
}

// Fetch the article data from Firebase
get(ref(db, 'users')).then(snapshot => {
    snapshot.forEach(userSnapshot => {
        const userId = userSnapshot.key;
        const articles = userSnapshot.val().articles;

        if (articles && articles[articleId]) {
            const article = articles[articleId];
            const user = userSnapshot.val();
            
            // Display article details
            document.getElementById('article-title').innerText = article.name;
            document.getElementById('article-thumbnail').src = article.image;
            document.getElementById('article-pdf').src = article.pdf;

            // Display author information
            document.getElementById('author-name').innerText = user.name || 'Anonymous';
            document.getElementById('author-pic').src = user.profilePicture || './img/user.png';
        }
    });
}).catch(error => {
    console.error("Error loading article:", error);
    document.getElementById('article-container').innerHTML = '<p>Error loading article.</p>';
});
