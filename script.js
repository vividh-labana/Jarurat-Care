// ============================================
// DOM Elements
// ============================================
const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const newQuoteBtn = document.getElementById('new-quote-btn');
const contactForm = document.getElementById('contact-form');
const successModal = document.getElementById('success-modal');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

// ============================================
// Quote Fetching with ZenQuotes API
// ============================================

// Fallback quotes for when API is unavailable (CORS issues, etc.)
const fallbackQuotes = [
    { q: "The human spirit is stronger than anything that can happen to it.", a: "C.C. Scott" },
    { q: "You beat cancer by how you live, why you live, and in the manner in which you live.", a: "Stuart Scott" },
    { q: "Cancer may have started the fight, but I will finish it.", a: "Unknown" },
    { q: "Courage is not the absence of fear, but rather the judgment that something else is more important than fear.", a: "Ambrose Redmoon" },
    { q: "Once you choose hope, anything's possible.", a: "Christopher Reeve" },
    { q: "Strength doesn't come from what you can do. It comes from overcoming the things you once thought you couldn't.", a: "Rikki Rogers" },
    { q: "The only impossible journey is the one you never begin.", a: "Tony Robbins" },
    { q: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", a: "Ralph Waldo Emerson" },
    { q: "You never know how strong you are until being strong is the only choice you have.", a: "Bob Marley" },
    { q: "In the middle of difficulty lies opportunity.", a: "Albert Einstein" },
    { q: "Hope is the thing with feathers that perches in the soul.", a: "Emily Dickinson" },
    { q: "Every day is a gift. That's why they call it the present.", a: "Unknown" },
    { q: "Life is not about waiting for the storm to pass, it's about learning to dance in the rain.", a: "Vivian Greene" },
    { q: "The greatest glory in living lies not in never falling, but in rising every time we fall.", a: "Nelson Mandela" },
    { q: "Believe you can and you're halfway there.", a: "Theodore Roosevelt" }
];

// Track used quotes to avoid repetition
let usedQuoteIndices = [];

// Get a random fallback quote (without immediate repetition)
function getRandomFallbackQuote() {
    // Reset if all quotes have been used
    if (usedQuoteIndices.length >= fallbackQuotes.length) {
        usedQuoteIndices = [];
    }
    
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * fallbackQuotes.length);
    } while (usedQuoteIndices.includes(randomIndex));
    
    usedQuoteIndices.push(randomIndex);
    return fallbackQuotes[randomIndex];
}

// Display a quote with animation
function displayQuote(quote, author) {
    // Fade out
    quoteText.style.opacity = '0';
    quoteAuthor.style.opacity = '0';
    
    setTimeout(() => {
        quoteText.textContent = quote;
        quoteAuthor.textContent = author ? `— ${author}` : '— Unknown';
        
        // Fade in
        quoteText.style.opacity = '1';
        quoteAuthor.style.opacity = '1';
    }, 300);
}

// Fetch quote from ZenQuotes API
async function fetchQuote() {
    // Show loading state
    newQuoteBtn.classList.add('loading');
    newQuoteBtn.disabled = true;
    
    try {
        // ZenQuotes API - using a proxy to avoid CORS issues
        // Direct API: https://zenquotes.io/api/random
        // Using a CORS proxy or the quotes.rest alternative
        
        // Try using the allorigins proxy for ZenQuotes
        const response = await fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://zenquotes.io/api/random'));
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        const quotes = JSON.parse(data.contents);
        
        if (quotes && quotes[0]) {
            displayQuote(quotes[0].q, quotes[0].a);
        } else {
            throw new Error('Invalid quote data');
        }
    } catch (error) {
        console.log('Using fallback quote due to:', error.message);
        // Use fallback quotes when API fails
        const fallback = getRandomFallbackQuote();
        displayQuote(fallback.q, fallback.a);
    } finally {
        // Remove loading state
        newQuoteBtn.classList.remove('loading');
        newQuoteBtn.disabled = false;
    }
}

// ============================================
// Contact Form Handling
// ============================================
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    
    // Basic validation
    if (!name || !email || !message) {
        alert('Please fill in all fields');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    // Log the form data (in a real app, this would be sent to a server)
    console.log('Form Submission:', {
        name,
        email,
        message,
        timestamp: new Date().toISOString()
    });
    
    // Show success modal
    successModal.classList.add('show');
    
    // Reset form
    contactForm.reset();
}

// Close modal function
function closeModal() {
    successModal.classList.remove('show');
}

// Close modal on outside click
successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
        closeModal();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && successModal.classList.contains('show')) {
        closeModal();
    }
});

// ============================================
// Mobile Navigation
// ============================================
function toggleMobileMenu() {
    mobileMenuBtn.classList.toggle('active');
    navLinks.classList.toggle('active');
}

// Close mobile menu when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// ============================================
// Smooth Scroll for Navigation Links
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// Scroll Reveal Animation
// ============================================
function revealOnScroll() {
    const reveals = document.querySelectorAll('.about-card, .stat, .contact-info, .contact-form');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('visible');
        }
    });
}

// Add reveal class to elements
document.querySelectorAll('.about-card, .stat').forEach((el, index) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${index * 0.1}s`;
});

// ============================================
// Navbar Background on Scroll
// ============================================
function updateNavbar() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = 'none';
    }
}

// ============================================
// Initialize
// ============================================
function init() {
    // Fetch initial quote
    fetchQuote();
    
    // Event listeners
    newQuoteBtn.addEventListener('click', fetchQuote);
    contactForm.addEventListener('submit', handleFormSubmit);
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    
    // Scroll events
    window.addEventListener('scroll', () => {
        revealOnScroll();
        updateNavbar();
    });
    
    // Initial reveal check
    revealOnScroll();
    
    // Add transition for quote text
    quoteText.style.transition = 'opacity 0.3s ease';
    quoteAuthor.style.transition = 'opacity 0.3s ease';
}

// Run on DOM load
document.addEventListener('DOMContentLoaded', init);

// Make closeModal available globally for inline onclick
window.closeModal = closeModal;

