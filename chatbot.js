const chatbot = document.getElementById('chatbot');
const conversation = document.getElementById('conversation');
const inputForm = document.getElementById('input-form');
const inputField = document.getElementById('input-field');

// Add event listener to input form
inputForm.addEventListener('submit', async function (event) {
    // Prevent form submission
    event.preventDefault();

    // Get user input
    const input = inputField.value;

    // Clear input field
    inputField.value = '';
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" });

    // Add user input to conversation
    let row = document.createElement('div');
    row.classList.add('user-row');
    let message = document.createElement('div');
    message.classList.add('user-message');
    message.innerHTML = `<p class="user-text" sentTime="${currentTime}">${input}</p>`;
    row.appendChild(message);
    let icon = document.createElement('img');
    icon.classList.add('user-icon');
    icon.src = './images/user-icon.png';
    icon.alt = '';
    row.appendChild(icon);
    conversation.appendChild(row);

    // Generate chatbot response
    const response = await chatbot_response(input);

    // Add chatbot response to conversation
    row = document.createElement('div');
    row.classList.add('chatbot-row');
    message = document.createElement('div');
    message.classList.add('chatbot-message');
    message.innerHTML = `<p class="chatbot-text" sentTime="${currentTime}">${response}</p>`;
    icon = document.createElement('img');
    icon.classList.add('chatbot-icon');
    icon.src = "./images/chatbot-icon.png";
    icon.alt = '';
    row.appendChild(icon);
    row.appendChild(message);
    conversation.appendChild(row);
    message.scrollIntoView({ behavior: "smooth" });
});

async function chatbot_response(user_input) {
    try { 
       const response = await fetch(`http://localhost:5000/api/Murshidi?query=${user_input}`);
       const data = await response.json();
       return data['result']
    } catch {
        return 'Sorry, I cannot answer this question at the moment.';
    } 
}