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
const storage = firebase.storage();

// Check user authentication status
auth.onAuthStateChanged(user => {
    if (user) {
        document.getElementById("auth-status").innerText = `Welcome ${user.displayName || user.email}`;
        document.getElementById('upload-form').style.display = 'block';
    } else {
        window.location.href = 'login.html';  // Redirect to sign-in page if not logged in
    }
});

// Update character counts
document.getElementById('articleName').addEventListener('input', function() {
    updateCharacterCount('articleName', 100);
});

document.getElementById('articleDescription').addEventListener('input', function() {
    updateCharacterCount('articleDescription', 250);
});

function updateCharacterCount(fieldId, maxLength) {
    const field = document.getElementById(fieldId);
    const countSpan = document.getElementById(fieldId + 'Count');
    const currentLength = field.value.length;
    countSpan.innerText = `${currentLength}/${maxLength}`;

    if (currentLength > maxLength) {
        countSpan.style.color = 'red';
    } else {
        countSpan.style.color = '#333';
    }
}

function uploadArticle() {
    const articleName = document.getElementById('articleName').value;
    const articleDescription = document.getElementById('articleDescription').value;
    const articleTags = document.getElementById('articleTags').value.split(',').map(tag => tag.trim());
    const articleImage = document.getElementById('articleImage').files[0];
    const articleFile = document.getElementById('articleFile').files[0];

    if (articleFile.size > 5 * 1024 * 1024) {
        showError("Article PDF file size must be less than 5MB.");
        return;
    }

    if (articleImage.size > 10 * 1024 * 1024 || !['image/jpeg', 'image/png', 'image/gif'].includes(articleImage.type)) {
        showError("Image size must be less than 10MB and must be JPG, PNG, or GIF.");
        return;
    }

    showLoader(true);

    const user = auth.currentUser;
    const articleId = Date.now(); // Unique ID for each article

    const articleData = {
        name: articleName,
        description: articleDescription,
        createdAt: new Date().toISOString(),
        tags: articleTags.reduce((acc, tag, index) => {
            acc[`tag_${index + 1}`] = tag;
            return acc;
        }, {}) // Save tags as individual properties under `tags`
    };

    // Upload image to Firebase Storage
    const imageRef = storage.ref().child(`articles/${user.uid}/thumbnails/${articleId}/${articleImage.name}`);
    imageRef.put(articleImage).then(imageSnapshot => {
        return imageSnapshot.ref.getDownloadURL().then(imageUrl => {
            articleData.image = imageUrl;

            // Upload PDF file to Firebase Storage
            const pdfRef = storage.ref().child(`articles/${user.uid}/pdfs/${articleId}/${articleFile.name}`);
            return pdfRef.put(articleFile).then(pdfSnapshot => {
                return pdfSnapshot.ref.getDownloadURL().then(pdfUrl => {
                    articleData.pdf = pdfUrl;

                    // Save article data in Firebase Realtime Database
                    return db.ref(`users/${user.uid}/articles/${articleId}`).set(articleData).then(() => {
                        // Save each tag under `tags` node
                        const tagsRef = db.ref(`users/${user.uid}/articles/${articleId}/tags`);
                        articleTags.forEach((tag, index) => {
                            tagsRef.child(`tag_${index + 1}`).set(tag);
                        });

                        showLoader(false);
                        alert("Article uploaded successfully!");
                        document.getElementById('upload-form').reset(); // Reset the form
                    });
                });
            });
        });
    }).catch(error => {
        showLoader(false);
        showError(error.message);
    });
}



// Show Loader
function showLoader(show) {
    document.getElementById('loader').style.display = show ? 'block' : 'none';
}

// Show Error Message
function showError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.innerText = message;
    errorDiv.style.display = 'block';
    setTimeout(() => errorDiv.style.display = 'none', 5000);
}

// Sign out the user
function signOut() {
    auth.signOut().then(() => {
        window.location.href = 'login.html';  // Redirect to sign-in page after sign-out
    }).catch(error => {
        showError(error.message);
    });
}
