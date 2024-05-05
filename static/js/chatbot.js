const chatbot = document.getElementById('chatbot');
const conversation = document.getElementById('conversation');
const inputForm = document.getElementById('input-form');
const inputField = document.getElementById('input-field');
const voiceButton = document.getElementById("voice-button");
let speakButton = document.getElementById("speaker");
const initialMsg = document.getElementById("initialText").textContent;

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

recognition.continuous = true;
recognition.interimResults = true;

let listening = false;

voiceButton.addEventListener("click", () => {
    if (!listening) {
        recognition.start();
    } else {
        recognition.stop();
    }
    listening = !listening;
});

recognition.onresult = event => {
    const transcript = event.results[event.results.length - 1][0].transcript;
    inputField.value = transcript;
    readText(transcript);
};

// Function to read out text
function readOutputText(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  }

let msg = new SpeechSynthesisUtterance();
msg.text = initialMsg;
const speechSynthesis = window.speechSynthesis;

speakButton.addEventListener("click", () => {
    msg.voice = speechSynthesis.getVoices()[4];
    speechSynthesis.speak(msg);
});


const root = document.documentElement;
const darkToggle = document.getElementById("dark-toggle");
const darkToggleIcon = darkToggle.firstChild;
const oldToggle = document.getElementById("old-toggle");
const oldToggleIcon = oldToggle.firstChild;
const favicon = document.getElementById("favicon");
const logo = document.getElementById("logo");
const popup = document.getElementById("popup");
const chatIcons = document.getElementsByClassName("chatbot-icon");
const userIcons = document.getElementsByClassName("user-icon");
const darkMode = localStorage.getItem("dark-mode");
const oldMode = localStorage.getItem("old-mode");
var uIcon = '/static/images/user_icon_new.png';
var cIcon = '/static/images/chatbot_icon_new.png';

if (oldMode) {
    root.classList.add("old-mode");
    oldToggleIcon.classList.remove("fa-toggle-on");
    oldToggleIcon.classList.add("fa-toggle-off");
    favicon.href = '/images/chatbot_icon_old.png';
    logo.src = '/static/images/logo_h_old.png';
    popup.src = '/static/images/chatbot_icon_old.png';
    for (var i = 0; i < chatIcons.length; i++)
        chatIcons[i].src = '/static/images/chatbot_icon_old.png';
    for (var i = 0; i < userIcons.length; i++)
        userIcons[i].src = '/static/images/user_icon_old.png';
    uIcon = '/static/images/user_icon_old.png';
    cIcon = '/static/images/chatbot_icon_old.png';
}

if (darkMode) {
    root.classList.add("dark-mode");
    darkToggleIcon.classList.remove("fa-moon");
    darkToggleIcon.classList.add("fa-sun");
    if (oldMode)
        root.classList.add("dark-mode-old");
}

darkToggle.addEventListener("click", () => {
    root.classList.toggle("dark-mode");
    if (root.classList.contains("dark-mode")) {
        localStorage.setItem("dark-mode", true);
        darkToggleIcon.classList.remove("fa-moon");
        darkToggleIcon.classList.add("fa-sun");
        if (root.classList.contains("old-mode"))
            root.classList.add("dark-mode-old");
    } else {
        localStorage.removeItem("dark-mode");
        darkToggleIcon.classList.remove("fa-sun");
        darkToggleIcon.classList.add("fa-moon");
        if (root.classList.contains("old-mode"))
            root.classList.remove("dark-mode-old");
    }
});


oldToggle.addEventListener("click", () => {
    root.classList.toggle("old-mode");
    if (root.classList.contains("old-mode")) {
        localStorage.setItem("old-mode", true);
        oldToggleIcon.classList.remove("fa-toggle-on");
        oldToggleIcon.classList.add("fa-toggle-off");
        favicon.href = '/static/images/chatbot_icon_old.png';
        logo.src = '/static/images/logo_h_old.png';
        popup.src = '/static/images/chatbot_icon_old.png';
        for (var i = 0; i < chatIcons.length; i++)
            chatIcons[i].src = '/static/images/chatbot_icon_old.png';
        for (var i = 0; i < userIcons.length; i++)
            userIcons[i].src = '/static/images/user_icon_old.png';
        uIcon = '/static/images/user_icon_old.png';
        cIcon = '/static/images/chatbot_icon_old.png';
        if (root.classList.contains("dark-mode"))
            root.classList.add("dark-mode-old");
    } else {
        root.classList.remove("dark-mode-old");
        localStorage.removeItem("old-mode");
        oldToggleIcon.classList.remove("fa-toggle-off");
        oldToggleIcon.classList.add("fa-toggle-on");
        favicon.href = '/static/images/chatbot_icon_new.png';
        logo.src = '/static/images/logo_h_new.png';
        popup.src = '/static/images/chatbot_icon_new.png';
        for (var i = 0; i < chatIcons.length; i++)
            chatIcons[i].src = '/static/images/chatbot_icon_new.png';
        for (var i = 0; i < userIcons.length; i++)
            userIcons[i].src = '/static/images/user_icon_new.png';
        uIcon = '/static/images/user_icon_new.png';
        cIcon = '/static/images/chatbot_icon_new.png';
        if (root.classList.contains("dark-mode-old"))
            root.classList.remove("dark-mode-old");
    }
});

inputForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const input = inputField.value;
    inputField.value = '';
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" });

    let row = document.createElement('div');
    row.classList.add('user-row');
    let message = document.createElement('div');
    message.classList.add('user-message');
    message.innerHTML = `<p class="user-text" sentTime="${currentTime}">${input}</p>`;
    row.appendChild(message);
    let icon = document.createElement('img');
    icon.classList.add('user-icon');
    icon.src = uIcon;
    icon.alt = '';
    row.appendChild(icon);
    conversation.appendChild(row);
    message.scrollIntoView({ behavior: "smooth" });

    let loading = document.getElementById("loading")
    loading.style.visibility = "visible";
    const response = await chatbot_response(input);

    row = document.createElement('div');
    row.classList.add('chatbot-row');
    message = document.createElement('div');
    message.classList.add('chatbot-message');
    message.innerHTML = `<p class="chatbot-text" sentTime="${currentTime}">${response}</p>`;
    icon = document.createElement('img');
    icon.classList.add('chatbot-icon');
    icon.src = cIcon;
    icon.alt = '';
    speakButton.remove();
    speakButton = document.createElement('i');
    speakButton.classList.add('fa-solid', 'fa-volume-up');
    speakButton.id = 'speaker';
    row.appendChild(icon);
    row.appendChild(message);
    row.appendChild(speakButton);
    conversation.appendChild(row);
    loading.style.visibility = "hidden";
    message.scrollIntoView({ behavior: "smooth" });

    speakButton.addEventListener('click', () => {
        msg.voice = speechSynthesis.getVoices()[4];
        msg.text = response;
        speechSynthesis.speak(msg);
    });
});

async function chatbot_response(user_input) {
    try {
        const response = await fetch(`http://localhost:5000/api/Murshidi?query=${user_input}`);
        const data = await response.json();
        return data['result']
    } catch {
        return 'Sorry, I do not have the answer to your question at the moment.';
    }
}