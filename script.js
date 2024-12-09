// Initialize Firebase
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
  const db = firebase.database();
  const storage = firebase.storage();
  
  // Fetch and display articles
  function fetchArticles() {
    const articlesRef = db.ref("articles");
    articlesRef.once("value").then(snapshot => {
      const articles = snapshot.val();
      if (articles) {
        const articleArray = Object.keys(articles).map(key => ({
          id: key,
          ...articles[key],
        }));
        displayArticles(shuffleArray(articleArray));
      }
    });
  }
  
  // Shuffle the articles array
  function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
  }
  
  // Display articles on the page
  function displayArticles(articles) {
    const articlesContainer = document.getElementById("articles-container");
    articlesContainer.innerHTML = "";
  
    articles.forEach((article) => {
      const articleCard = document.createElement("div");
      articleCard.classList.add("article-card");
  
      // Article Thumbnail
      const articleImage = document.createElement("img");
      articleImage.src = article.imageUrl;
      articleCard.appendChild(articleImage);
  
      // Article Title
      const articleTitle = document.createElement("h3");
      articleTitle.innerText = article.name;
      articleCard.appendChild(articleTitle);
  
      // Profile Info (Writer)
      const profileInfo = document.createElement("div");
      profileInfo.classList.add("profile-info");
  
      const profilePic = document.createElement("img");
      profilePic.src = article.userProfilePicture;
      profileInfo.appendChild(profilePic);
  
      const userName = document.createElement("span");
      userName.innerText = article.userName;
      profileInfo.appendChild(userName);
  
      articleCard.appendChild(profileInfo);
      articlesContainer.appendChild(articleCard);
    });
  }
  
  // Initialize the page
  function init() {
    fetchArticles();
  }
  
  init();
  