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

function deletePost(index) {
    const posts = getPosts();
    posts.splice(index, 1);
    savePosts(posts);
    displayPosts(posts);
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
    posts.forEach((post, index) => {
        const postElement = document.createElement('div');
        postElement.className = 'post';

        const postContent = document.createElement('span');
        postContent.textContent = post;
        
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deletePost(index);

        postElement.appendChild(postContent);
        postElement.appendChild(deleteButton);
        postsContainer.appendChild(postElement);
    });
}
