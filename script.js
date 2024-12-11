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
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

// DOM Elements
const authStatus = document.getElementById('auth-status');
const articlesContainer = document.getElementById('articles-container');
const searchBar = document.getElementById('search-bar');

// Load Articles
function loadArticles() {
  db.ref('users').once('value').then(snapshot => {
      articlesContainer.innerHTML = '';
      snapshot.forEach(userSnapshot => {
          const userId = userSnapshot.key;
          const articles = userSnapshot.val().articles;
          for (const articleId in articles) {
              const article = articles[articleId];
              renderArticleCard(article, userSnapshot.val());
          }
      });
  }).catch(error => {
      console.error(error);
      articlesContainer.innerHTML = '<p>Error loading articles.</p>';
  });
}

// Render Article Card
function renderArticleCard(article, user) {
  const card = document.createElement('div');
  card.classList.add('article-card');

  card.innerHTML = `
      <img src="${article.image}" alt="Thumbnail" class="article-thumbnail">
      <div class="article-content">
          <h3 class="article-title">${article.name}</h3>
          <div class="author-info">
              <img src="${user.profilePicture || 'default-avatar.png'}" alt="Author">
              <span class="author-name">${user.name || 'Anonymous'}</span>
          </div>
      </div>
  `;
  articlesContainer.appendChild(card);
}

// Search Functionality
searchBar.addEventListener('input', () => {
  const searchTerm = searchBar.value.toLowerCase();
  const articleCards = document.querySelectorAll('.article-card');
  articleCards.forEach(card => {
      const title = card.querySelector('.article-title').textContent.toLowerCase();
      const author = card.querySelector('.author-name').textContent.toLowerCase();
      if (title.includes(searchTerm) || author.includes(searchTerm)) {
          card.style.display = 'block';
      } else {
          card.style.display = 'none';
      }
  });
});

// Authentication Status
auth.onAuthStateChanged(user => {
  if (user) {
      authStatus.textContent = `Welcome ${user.displayName || user.email}`;
      loadArticles();
  } else {
      window.location.href = 'login.html';
  }
});

// Sign Out
document.getElementById('sign-out').addEventListener('click', () => {
  auth.signOut().then(() => {
      window.location.href = 'login.html';
  });
});
