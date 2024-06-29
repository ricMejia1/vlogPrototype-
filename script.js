document.addEventListener('DOMContentLoaded', (event) => {
    loadChats();
});

let currentChat = 'default';

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
        const chats = getChats();
        if (!chats[currentChat]) {
            chats[currentChat] = [];
        }
        chats[currentChat].push({
            content: postContent,
            attachments: attachments
        });
        saveChats(chats);
        displayPosts(chats[currentChat]);

        document.getElementById('postContent').value = '';
        fileInput.value = '';
    });
}

function deletePost(index) {
    const chats = getChats();
    chats[currentChat].splice(index, 1);
    saveChats(chats);
    displayPosts(chats[currentChat]);
}

function getChats() {
    const chats = localStorage.getItem('chats');
    return chats ? JSON.parse(chats) : {};
}

function saveChats(chats) {
    localStorage.setItem('chats', JSON.stringify(chats));
}

function loadChats() {
    const chats = getChats();
    const chatList = document.getElementById('chatList');
    chatList.innerHTML = '';

    Object.keys(chats).forEach(chat => {
        const chatItem = document.createElement('li');
        chatItem.textContent = chat;
        chatItem.onclick = () => switchChat(chat);
        chatList.appendChild(chatItem);
    });

    if (!chats[currentChat]) {
        chats[currentChat] = [];
        saveChats(chats);
    }
    displayPosts(chats[currentChat]);
}

function switchChat(chat) {
    currentChat = chat;
    const chats = getChats();
    displayPosts(chats[chat]);
}

function newChat() {
    const chatName = prompt("Enter chat name:");
    if (chatName && chatName.trim()) {
        const chats = getChats();
        chats[chatName] = [];
        saveChats(chats);
        loadChats();
        switchChat(chatName);
    }
}

function displayPosts(posts) {
    const postsContainer = document.getElementById('posts');
    postsContainer.innerHTML = '';
    posts.forEach((post, index) => {
        const postElement = document.createElement('div');
        postElement.className = 'post';

        const postContent = document.createElement('span');
        postContent.textContent = post.content;

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

        cons
