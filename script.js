document.addEventListener('DOMContentLoaded', (event) => {
    loadPosts();
});

function addPost() {
    const postContent = document.getElementById('postContent').value;
    if (postContent.trim() === "") {
        alert("Please write something before posting!");
        return;
    }

    const posts = getPosts();
    posts.push(postContent);
    savePosts(posts);
    displayPosts(posts);

    document.getElementById('postContent').value = '';
}

function getPosts() {
    const posts = localStorage.getItem('posts');
    return posts ? JSON.parse(posts) : [];
}

function savePosts(posts) {
    localStorage.setItem('posts', JSON.stringify(posts));
}

function loadPosts() {
    const posts = getPosts();
    displayPosts(posts);
}

function displayPosts(posts) {
    const postsContainer = document.getElementById('posts');
    postsContainer.innerHTML = '';
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.textContent = post;
        postsContainer.appendChild(postElement);
    });
}
