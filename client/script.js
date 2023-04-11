import bot from './assets/bot.svg'
import user from './assets/user.svg'

const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container')

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const prompt = form.prompt.value;
    form.reset();

    // Add user message to chat
    addMessageToChat(prompt, "user");

    // Fetch response from GPT-3.5
    const response = await fetch("/process_query", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
    });

    const { response: gptResponse } = await response.json();

    // Add GPT-3.5 response to chat
    addMessageToChat(gptResponse, "ai");
});

function addMessageToChat(message, sender) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("chat", sender);

    messageElement.innerHTML = `
        <div class="profile">
            <img src="assets/${sender}.svg" alt="${sender}" />
        </div>
        <div class="message">
            ${message}
        </div>
    `;

    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Get references to the access code elements
const accessCodeOverlay = document.querySelector('#accessCodeOverlay');
const accessCodeInput = document.querySelector('#accessCodeInput');
const accessCodeButton = document.querySelector('#accessCodeButton');

// Define the correct access code
const correctAccessCode = '9ak2';

// Add a click event listener to the access code button
accessCodeButton.addEventListener('click', () => {
    // Get the value of the access code input
    const enteredAccessCode = accessCodeInput.value;

    // Check if the entered access code is correct
    if (enteredAccessCode === correctAccessCode) {
        // If the access code is correct, remove the overlay and display the site content
        accessCodeOverlay.remove();
    } else {
        // If the access code is incorrect, display an error message
        alert('Código de acesso incorreto. Tente novamente.');
    }
});

