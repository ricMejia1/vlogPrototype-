document.addEventListener('DOMContentLoaded', (event) => {
    loadChats();
});

let currentChat = 'default';

function addPost() {
    const postContent = document.getElementById('postContent').value;

    if (postContent.trim() === "") {
        alert("Please write something before posting!");
        return;
    }

    const chats = getChats();
    if (!chats[currentChat]) {
        chats[currentChat] = [];
    }
    chats[currentChat].push({
        content: postContent
    });
    saveChats(chats);
    displayPosts(chats[currentChat]);

    document.getElementById('postContent').value = '';
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

        const postContent =
