import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js"; // Import initializeApp
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { getStorage, getDownloadURL, ref as storageRef } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";

// Firebase configuration and initialization
const firebaseConfig = {
    apiKey: "AIzaSyA-M8XsFZaZPu_lBIx0TbqcmzhTXeHRjQM",
    authDomain: "ecommerceapp-dab53.firebaseapp.com",
    databaseURL: "https://ecommerceapp-dab53-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "ecommerceapp-dab53",
    storageBucket: "ecommerceapp-dab53.appspot.com",
    messagingSenderId: "429988301014",
    appId: "1:429988301014:web:4f09bb412b6cf0b4a82177"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);

// Get the article ID from URL
const urlParams = new URLSearchParams(window.location.search);
const articleId = urlParams.get('ARTICLEID');
const loadingSpinner = document.getElementById('loading-spinner');
const articleContainer = document.getElementById('article-container');

// Show loading spinner
loadingSpinner.style.display = 'block';

// Fetch the article data
get(ref(db, 'users')).then(snapshot => {
    snapshot.forEach(userSnapshot => {
        const userId = userSnapshot.key;
        const articles = userSnapshot.val().articles;

        if (articles && articles[articleId]) {
            const article = articles[articleId];
            const user = userSnapshot.val();

            // Set article data
            document.getElementById('article-title').innerText = article.name;
            document.getElementById('article-thumbnail').src = article.image;
            document.getElementById('article-pdf').src = article.pdf;

            // Set author info
            document.getElementById('author-name').innerText = user.name || 'Anonymous';
            document.getElementById('author-name').href = `author.html?UID=${userId}`;
            document.getElementById('author-pic').src = user.profilePicture || './img/user.png';
            document.getElementById('author-pic').onclick = () => window.location.href = `author.html?UID=${userId}`;

            // Hide loading spinner and show article content
            loadingSpinner.style.display = 'none';
            articleContainer.style.display = 'block';
        }
    });
}).catch(error => {
    console.error("Error loading article:", error);
    document.getElementById('article-container').innerHTML = '<p>Error loading article.</p>';
    loadingSpinner.style.display = 'none';
});
