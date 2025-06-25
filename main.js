// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Form handling
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('#login-form');
    const registerForm = document.querySelector('#register-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(loginForm);
            
            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();
                
                if (data.success) {
                    window.location.href = data.redirect;
                } else {
                    showNotification(data.message, 'error');
                }
            } catch (error) {
                showNotification('An error occurred. Please try again.', 'error');
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(registerForm);
            
            try {
                const response = await fetch('/register', {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();
                
                if (data.success) {
                    showNotification(data.message, 'success');
                    setTimeout(() => {
                        window.location.href = '/login';
                    }, 2000);
                } else {
                    showNotification(data.message, 'error');
                }
            } catch (error) {
                showNotification('An error occurred. Please try again.', 'error');
            }
        });
    }
});

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Skill Score animation
function animateSkillScore(element, targetScore) {
    let currentScore = 0;
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = targetScore / steps;
    const interval = duration / steps;
    
    const timer = setInterval(() => {
        currentScore += increment;
        if (currentScore >= targetScore) {
            currentScore = targetScore;
            clearInterval(timer);
        }
        element.textContent = Math.round(currentScore);
    }, interval);
}

// Project filtering
function filterProjects(category) {
    const projects = document.querySelectorAll('.project-card');
    
    projects.forEach(project => {
        if (category === 'all' || project.dataset.category === category) {
            project.style.display = 'block';
        } else {
            project.style.display = 'none';
        }
    });
}

// Mobile menu toggle
const mobileMenuButton = document.querySelector('.mobile-menu-button');
const mobileMenu = document.querySelector('.mobile-menu');

if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
    });
}

// Initialize tooltips
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = element.dataset.tooltip;
        
        element.appendChild(tooltip);
        
        element.addEventListener('mouseenter', () => {
            tooltip.classList.add('visible');
        });
        
        element.addEventListener('mouseleave', () => {
            tooltip.classList.remove('visible');
        });
    });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeTooltips();
    
    // Animate skill scores on dashboard
    const skillScoreElements = document.querySelectorAll('.skill-score');
    skillScoreElements.forEach(element => {
        const targetScore = parseInt(element.dataset.score);
        animateSkillScore(element, targetScore);
    });
});

// Chat Bot Functions
function toggleChatbot() {
    const chatbot = document.getElementById('chatbot');
    chatbot.classList.toggle('active');
}

function sendMessage() {
    const input = document.getElementById('user-input');
    const messages = document.getElementById('chatbot-messages');
    const message = input.value.trim();
    
    if (message) {
        // Add user message
        const userMessage = document.createElement('div');
        userMessage.className = 'message user';
        userMessage.innerHTML = `<p>${message}</p>`;
        messages.appendChild(userMessage);
        
        // Clear input
        input.value = '';
        
        // Simulate bot response
        setTimeout(() => {
            const botMessage = document.createElement('div');
            botMessage.className = 'message bot';
            botMessage.innerHTML = '<p>Thank you for your message. Our support team will get back to you shortly.</p>';
            messages.appendChild(botMessage);
            messages.scrollTop = messages.scrollHeight;
        }, 1000);
    }
}

// Company Logo Modal Functions
function openModal(logoPath) {
    const modal = document.getElementById('companyModal');
    const modalLogo = document.getElementById('modalLogo');
    modalLogo.src = logoPath;
    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('companyModal');
    modal.style.display = 'none';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Add click event to 24/7 Support feature card
    const supportCard = document.querySelector('.feature-card:nth-child(3)');
    supportCard.addEventListener('click', function() {
        const chatbot = document.getElementById('chatbot');
        chatbot.classList.add('active');
    });
    
    // Add click events to company logos
    const companyLogos = document.querySelectorAll('.trusted-logos img');
    companyLogos.forEach(logo => {
        logo.addEventListener('click', function() {
            openModal(this.src);
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('companyModal');
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Handle Enter key in chat input
    const chatInput = document.getElementById('user-input');
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}); 