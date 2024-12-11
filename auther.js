import { getDatabase, ref, get, child, remove } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

// Get UID from URL
const urlParams = new URLSearchParams(window.location.search);
const userUID = urlParams.get('uid');

// Initialize Firebase Database and Auth
const db = getDatabase();
const auth = getAuth();

// Show loading spinner
const loadingSpinner = document.getElementById('loading-spinner');
loadingSpinner.style.display = 'block';

// Load Author Data
function loadAuthorData() {
    const dbRef = ref(db);
    get(child(dbRef, 'users/' + userUID)).then(snapshot => {
        const userData = snapshot.val();
        if (userData) {
            // Set profile information
            document.getElementById('author-name').innerText = userData.name;
            document.getElementById('author-class').innerText = `Class: ${userData.class}`;
            document.getElementById('author-pic').src = userData.profilePicture || 'default-profile-pic.jpg';

            // Load articles by the user
            loadUserArticles(userUID);
        } else {
            alert('User not found');
            loadingSpinner.style.display = 'none';
        }
    }).catch(error => {
        console.error('Error loading author data: ', error);
        loadingSpinner.style.display = 'none';
    });
}

// Load Articles by Author
function loadUserArticles(uid) {
    const dbRef = ref(db);
    get(child(dbRef, 'articles')).then(snapshot => {
        const articlesList = snapshot.val();
        const articlesContainer = document.getElementById('articles-list');

        if (articlesList) {
            Object.keys(articlesList).forEach(articleId => {
                const article = articlesList[articleId];
                if (article.author && article.author.uid === uid) {
                    const articleCard = document.createElement('div');
                    articleCard.classList.add('article-card');

                    const articleTitle = document.createElement('div');
                    articleTitle.classList.add('article-title');
                    articleTitle.innerText = article.name;

                    const deleteButton = document.createElement('button');
                    deleteButton.classList.add('delete-btn');
                    deleteButton.innerText = 'Delete';
                    deleteButton.onclick = () => deleteArticle(articleId);

                    articleCard.appendChild(articleTitle);
                    articleCard.appendChild(deleteButton);
                    articlesContainer.appendChild(articleCard);
                }
            });
        } else {
            articlesContainer.innerText = 'No articles published by this author.';
        }

        loadingSpinner.style.display = 'none';
    }).catch(error => {
        console.error('Error loading articles: ', error);
        loadingSpinner.style.display = 'none';
    });
}

// Delete an Article
function deleteArticle(articleId) {
    if (confirm('Are you sure you want to delete this article?')) {
        const dbRef = ref(db);
        remove(child(dbRef, 'articles/' + articleId))
            .then(() => {
                alert('Article deleted');
                window.location.reload(); // Refresh the page to update the article list
            })
            .catch(error => {
                alert('Error deleting article: ' + error.message);
            });
    }
}

// Load author data when the page loads
window.onload = loadAuthorData;
