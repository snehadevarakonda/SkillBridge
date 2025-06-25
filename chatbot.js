// Chatbot functionality
const chatbot = {
    isOpen: false,
    messages: [],
    predefinedResponses: {
        greetings: [
            "Hello! How can I help you today?",
            "Hi there! What can I do for you?",
            "Welcome! How may I assist you?"
        ],
        help: [
            "I can help you with:",
            "- Finding companies",
            "- Learning about job opportunities",
            "- Understanding the platform",
            "- Technical support",
            "What would you like to know?"
        ],
        companies: [
            "We have several companies listed on our platform:",
            "- Tech Innovators (AI & ML)",
            "- Green Energy (Sustainable Solutions)",
            "- HealthCare Plus (Medical Technology)",
            "- EduTech (Education Technology)",
            "- FinTech (Financial Technology)",
            "Would you like to know more about any specific company?"
        ],
        jobs: [
            "Companies are hiring for various positions:",
            "- Software Development",
            "- Data Science",
            "- UI/UX Design",
            "- Project Management",
            "- Marketing",
            "Would you like to see specific job listings?"
        ],
        platform: [
            "SkillBridge is a platform that:",
            "- Connects students with companies",
            "- Provides job opportunities",
            "- Offers skill development resources",
            "- Creates networking opportunities",
            "How can I help you navigate the platform?"
        ],
        support: [
            "For technical support, you can:",
            "- Check our FAQ section",
            "- Contact our support team",
            "- Email us at support@skillbridge.com",
            "- Call us at +1 (555) 123-4567",
            "What specific issue are you facing?"
        ],
        default: [
            "I'm not sure I understand. Could you rephrase that?",
            "I'm still learning. Could you ask something else?",
            "I don't have an answer for that yet. Try asking about companies, jobs, or platform features."
        ]
    },

    init() {
        this.toggleChatbot();
        this.setupEventListeners();
    },

    setupEventListeners() {
        const userInput = document.getElementById('user-input');
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
    },

    toggleChatbot() {
        const chatbot = document.getElementById('chatbot');
        this.isOpen = !this.isOpen;
        chatbot.style.display = this.isOpen ? 'block' : 'none';
    },

    sendMessage() {
        const userInput = document.getElementById('user-input');
        const message = userInput.value.trim();
        
        if (message) {
            this.addMessage(message, 'user');
            this.processUserMessage(message);
            userInput.value = '';
        }
    },

    addMessage(text, sender) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        messageDiv.innerHTML = `<p>${text}</p>`;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    },

    processUserMessage(message) {
        const lowerMessage = message.toLowerCase();
        let response = '';

        // Check for greetings
        if (lowerMessage.match(/^(hi|hello|hey|greetings)/i)) {
            response = this.getRandomResponse('greetings');
        }
        // Check for help requests
        else if (lowerMessage.match(/help|what can you do|assist/i)) {
            response = this.getRandomResponse('help');
        }
        // Check for company-related queries
        else if (lowerMessage.match(/company|companies|firm|organization/i)) {
            response = this.getRandomResponse('companies');
        }
        // Check for job-related queries
        else if (lowerMessage.match(/job|position|career|hiring|vacancy/i)) {
            response = this.getRandomResponse('jobs');
        }
        // Check for platform-related queries
        else if (lowerMessage.match(/platform|website|site|skillbridge/i)) {
            response = this.getRandomResponse('platform');
        }
        // Check for support-related queries
        else if (lowerMessage.match(/support|help|issue|problem|contact/i)) {
            response = this.getRandomResponse('support');
        }
        // Default response for unrecognized queries
        else {
            response = this.getRandomResponse('default');
        }

        // Simulate typing delay
        setTimeout(() => {
            this.addMessage(response, 'bot');
        }, 500);
    },

    getRandomResponse(category) {
        const responses = this.predefinedResponses[category];
        return responses[Math.floor(Math.random() * responses.length)];
    }
};

// Initialize the chatbot when the page loads
document.addEventListener('DOMContentLoaded', () => {
    chatbot.init();
});

// Toggle chatbot visibility
function toggleChatbot() {
    chatbot.toggleChatbot();
}

// Send message function
function sendMessage() {
    chatbot.sendMessage();
}

// Modal functionality
function openModal(logoUrl) {
    const modal = document.getElementById('companyModal');
    const modalLogo = document.getElementById('modalLogo');
    modalLogo.src = logoUrl;
    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('companyModal');
    modal.style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('companyModal');
    if (event.target === modal) {
        closeModal();
    }
} 