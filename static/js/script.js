document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const serverOptions = document.querySelectorAll('.server-option');
    const questionInput = document.getElementById('question');
    const submitBtn = document.getElementById('submit-btn');
    const clearBtn = document.getElementById('clear-btn');
    const resultElement = document.getElementById('result');
    const loadingIndicator = document.querySelector('.loading-indicator');
    
    // Store the welcome message HTML for reuse
    const welcomeMessageHTML = resultElement.innerHTML;
    
    // Current selected server
    let selectedServer = 'all';
    
    // Server selection
    serverOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all options
            serverOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selected class to clicked option
            this.classList.add('selected');
            
            // Update selected server
            selectedServer = this.getAttribute('data-server');
            
            // Add futuristic click effect
            addClickEffect(this);
        });
    });
    
    // Submit button click event
    submitBtn.addEventListener('click', function(e) {
        console.log('Submit button clicked');
        submitQuery();
    });
    
    // Enter key in textarea
    questionInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submitQuery();
        }
    });
    
    // Clear button click event
    clearBtn.addEventListener('click', function() {
        // Reset result area to welcome message
        resultElement.innerHTML = welcomeMessageHTML;
        
        // Clear the input textarea
        questionInput.value = '';
        
        // Add futuristic click effect
        addClickEffect(this);
    });
    
    // Function to submit query
    function submitQuery() {
        const question = questionInput.value.trim();
        
        if (!question) {
            // Add shake animation to textarea if empty
            questionInput.classList.add('shake');
            setTimeout(() => questionInput.classList.remove('shake'), 500);
            return;
        }
        
        // Show loading indicator
        loadingIndicator.classList.remove('hidden');
        
        // Clear previous result (except when loading)
        resultElement.innerHTML = '<div class="typing-effect">Processing query...</div>';
        
        // Log for debugging
        console.log('Submitting query:', question, 'Server:', selectedServer);
        
        // Prepare data for API request
        const data = {
            question: question,
            server: selectedServer === 'all' ? null : selectedServer
        };
        
        // Send API request
        fetch('/api/query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Hide loading indicator
            loadingIndicator.classList.add('hidden');
            
            // Display result with typing effect
            if (data.error) {
                displayWithTypingEffect(`Error: ${data.error}`, resultElement);
            } else {
                // Format the result with syntax highlighting for code blocks
                const formattedResult = formatResult(data.result);
                displayWithTypingEffect(formattedResult, resultElement);
            }
        })
        .catch(error => {
            // Hide loading indicator
            loadingIndicator.classList.add('hidden');
            
            // Display error
            displayWithTypingEffect(`Error: ${error.message}`, resultElement);
        });
    }
    
    // Function to format result with code highlighting
    function formatResult(text) {
        // Since we're now converting markdown to HTML on the server side,
        // we can just return the HTML directly
        return text;
    }
    
    // Function to display text with typing effect
    function displayWithTypingEffect(text, element) {
        element.innerHTML = '';
        
        // If text contains HTML (which it will since we're converting markdown to HTML on the server),
        // we need to handle it differently
        if (text.includes('<') && text.includes('>')) {
            element.innerHTML = text;
            return;
        }
        
        let i = 0;
        const speed = 5; // typing speed (lower is faster)
        
        function typeWriter() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
            }
        }
        
        typeWriter();
    }
    
    // Function to add click effect
    function addClickEffect(element) {
        // Create ripple element
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        element.appendChild(ripple);
        
        // Set position
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${0}px`;
        ripple.style.top = `${0}px`;
        
        // Remove after animation
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    // Add CSS for additional animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .shake {
            animation: shake 0.5s;
        }
        
        .ripple {
            position: absolute;
            background: rgba(0, 240, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
        
        .typing-effect {
            color: var(--primary-color);
            border-right: 2px solid var(--primary-color);
            animation: blink 0.7s infinite;
            padding-right: 5px;
        }
        
        @keyframes blink {
            0%, 100% { border-color: transparent; }
            50% { border-color: var(--primary-color); }
        }
    `;
    
    document.head.appendChild(style);
});
