document.addEventListener('DOMContentLoaded', () => {
    loadChats();
    document.getElementById('sendButton').addEventListener('click', addPost);
});

let currentChat = 'default';

function addPost() {
    const postContent = document.getElementById('postContent').value.trim();

    if (postContent === "") {
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

    document.getElementById('postContent').value = '';  // Clear the textarea
}

function deletePost(index) {
    const chats = getChats();
    chats[currentChat].splice(index, 1);
    saveChats(chats);
    displayPosts(chats[currentChat]);
}

function deleteCurrentChat() {
    if (currentChat === 'default') {
        alert("Cannot delete the default chat.");
        return;
    }

    const chats = getChats();
    if (confirm(`Are you sure you want to delete the chat "${currentChat}"?`)) {
        delete chats[currentChat]; // Remove the current chat
        saveChats(chats);
        loadChats(); // Reload chats to update the sidebar

        if (Object.keys(chats).length > 0) {
            // If there are other chats left, switch to the first available chat
            const firstChat = Object.keys(chats)[0];
            switchChat(firstChat);
        } else {
            // If no other chats are left, reset to default chat
            currentChat = 'default';
            displayPosts([]);
        }
    }
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

    if (!chats[currentChat] && currentChat !== 'default') {
        // Switch to default chat if the current chat no longer exists
        currentChat = 'default';
    }

    displayPosts(chats[currentChat] || []);
}

function switchChat(chat) {
    currentChat = chat;
    const chats = getChats();
    displayPosts(chats[chat] || []);
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

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deletePost(index);

        postElement.appendChild(postContent);
        postElement.appendChild(deleteButton);
        postsContainer.appendChild(postElement);
    });
}
