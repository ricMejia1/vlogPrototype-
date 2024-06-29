document.addEventListener('DOMContentLoaded', (event) => {
    loadPosts();
});

function addPost() {
    const postContent = document.getElementById('postContent').value;
    const fileInput = document.getElementById('fileInput');
    const files = fileInput.files;
    const attachments = [];

    if (postContent.trim() === "" && files.length === 0) {
        alert("Please write something or attach a file before posting!");
        return;
    }

    const readerPromises = [];
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        readerPromises.push(new Promise((resolve) => {
            reader.onload = (e) => {
                attachments.push({
                    name: file.name,
                    type: file.type,
                    content: e.target.result
                });
                resolve();
            };
            reader.readAsDataURL(file);
        }));
    }

    Promise.all(readerPromises).then(() => {
        const posts = getPosts();
        posts.push({
            content: postContent,
            attachments: attachments,
            date: new Date().toLocaleString()
        });
        savePosts(posts);
        displayPosts(posts);

        document.getElementById('postContent').value = '';
        fileInput.value = '';
    });
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
        postContent.textContent = post.content;

        const postDate = document.createElement('div');
        postDate.className = 'post-date';
        postDate.textContent = `Posted on: ${post.date}`;

        const attachmentsContainer = document.createElement('div');
        attachmentsContainer.className = 'attachments';

        post.attachments.forEach((attachment) => {
            const attachmentElement = document.createElement('div');
            if (attachment.type.startsWith('image/')) {
                const img = document.createElement('img');
                img.src = attachment.content;
                img.alt = attachment.name;
                attachmentElement.appendChild(img);
            } else if (attachment.type.startsWith('video/')) {
                const video = document.createElement('video');
                video.controls = true;
                video.src = attachment.content;
                attachmentElement.appendChild(video);
            } else if (attachment.type === 'application/pdf') {
                const pdfLink = document.createElement('a');
                pdfLink.href = attachment.content;
                pdfLink.target = '_blank';
                pdfLink.textContent = attachment.name;
                attachmentElement.appendChild(pdfLink);
            }
            attachmentsContainer.appendChild(attachmentElement);
        });

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deletePost(index);

        postElement.appendChild(postContent);
        postElement.appendChild(postDate);
        postElement.appendChild(attachmentsContainer);
        postElement.appendChild(deleteButton);
        postsContainer.appendChild(postElement);
    });
}

