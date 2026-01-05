// Authentication System for Chem Master Ghana

// DOM Elements for Authentication
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const closeButtons = document.querySelectorAll('.close');
const showSignup = document.getElementById('showSignup');
const showLogin = document.getElementById('showLogin');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

// Validation Patterns
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

// Show/Hide Modals
function showModal(modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function hideModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Clear Error Messages
function clearErrors() {
    document.querySelectorAll('.error-message').forEach(error => {
        error.style.display = 'none';
        error.textContent = '';
    });
}

// Show Error Message
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

// Validate Email
function validateEmail(email) {
    if (!email) return 'Email is required';
    if (!emailPattern.test(email)) return 'Please enter a valid email address';
    return '';
}

// Validate Password
function validatePassword(password, isLogin = false) {
    if (!password) return 'Password is required';
    if (!isLogin && !passwordPattern.test(password)) {
        return 'Password must be at least 8 characters with at least one letter and one number';
    }
    return '';
}

// Validate Name
function validateName(name) {
    if (!name) return 'Full name is required';
    if (name.length < 2) return 'Name must be at least 2 characters';
    return '';
}

// Validate Password Confirmation
function validatePasswordConfirmation(password, confirmPassword) {
    if (password !== confirmPassword) return 'Passwords do not match';
    return '';
}

// Initialize users array in localStorage if not exists
function initializeUsers() {
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([]));
    }
}

// Hash Password (simplified for demo - in production use bcrypt)
function hashPassword(password) {
    // Note: This is a simplified hash for demo purposes only
    // In production, use a proper hashing library like bcrypt
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString();
}

// Generate User Token (simplified)
function generateToken(user) {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substr(2);
    return btoa(`${user.email}:${timestamp}:${random}`);
}

// Register User
function registerUser(name, email, password) {
    initializeUsers();
    
    const users = JSON.parse(localStorage.getItem('users'));
    
    // Check if user already exists
    if (users.some(user => user.email === email)) {
        return { success: false, message: 'Email already registered' };
    }
    
    // Create new user object
    const newUser = {
        id: Date.now().toString(),
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashPassword(password), // Hashed password
        token: generateToken({ email }),
        progress: {
            lessonsCompleted: [],
            quizScores: {},
            assessmentScores: {}
        },
        createdAt: new Date().toISOString()
    };
    
    // Add to users array
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Set current user
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    return { success: true, user: newUser };
}

// Login User
function loginUser(email, password) {
    initializeUsers();
    
    const users = JSON.parse(localStorage.getItem('users'));
    const user = users.find(u => u.email === email.toLowerCase().trim());
    
    if (!user) {
        return { success: false, message: 'User not found' };
    }
    
    // Check password (using simplified hash)
    if (user.password !== hashPassword(password)) {
        return { success: false, message: 'Invalid password' };
    }
    
    // Generate new token
    user.token = generateToken(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Update users array with new token
    const userIndex = users.findIndex(u => u.email === email);
    users[userIndex] = user;
    localStorage.setItem('users', JSON.stringify(users));
    
    return { success: true, user };
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Show Login Modal
    document.addEventListener('click', (e) => {
        if (e.target.id === 'loginBtn' || e.target.closest('#loginBtn')) {
            clearErrors();
            showModal(loginModal);
        }
    });
    
    // Show Signup Modal
    document.addEventListener('click', (e) => {
        if (e.target.id === 'signupBtn' || e.target.closest('#signupBtn')) {
            clearErrors();
            showModal(signupModal);
        }
    });
    
    // Close Modals
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            hideModal(loginModal);
            hideModal(signupModal);
        });
    });
    
    // Switch between Login and Signup
    showSignup?.addEventListener('click', (e) => {
        e.preventDefault();
        hideModal(loginModal);
        showModal(signupModal);
    });
    
    showLogin?.addEventListener('click', (e) => {
        e.preventDefault();
        hideModal(signupModal);
        showModal(loginModal);
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) hideModal(loginModal);
        if (e.target === signupModal) hideModal(signupModal);
    });
    
    // Login Form Submission
    loginForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrors();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        // Validate inputs
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password, true);
        
        if (emailError) {
            showError('loginEmailError', emailError);
        }
        
        if (passwordError) {
            showError('loginPasswordError', passwordError);
        }
        
        if (emailError || passwordError) return;
        
        // Attempt login
        const result = loginUser(email, password);
        
        if (result.success) {
            // Login successful
            hideModal(loginModal);
            alert(`Welcome back, ${result.user.name}!`);
            
            // Update navigation
            if (typeof updateNavigation === 'function') {
                updateNavigation();
            }
            
            // Clear form
            loginForm.reset();
        } else {
            // Login failed
            showError('loginPasswordError', result.message);
        }
    });
    
    // Signup Form Submission
    signupForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrors();
        
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Validate inputs
        const nameError = validateName(name);
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);
        const confirmError = validatePasswordConfirmation(password, confirmPassword);
        
        if (nameError) showError('signupNameError', nameError);
        if (emailError) showError('signupEmailError', emailError);
        if (passwordError) showError('signupPasswordError', passwordError);
        if (confirmError) showError('confirmPasswordError', confirmError);
        
        if (nameError || emailError || passwordError || confirmError) return;
        
        // Attempt registration
        const result = registerUser(name, email, password);
        
        if (result.success) {
            // Registration successful
            hideModal(signupModal);
            alert(`Welcome to Chem Master Ghana, ${result.user.name}! Your account has been created successfully.`);
            
            // Update navigation
            if (typeof updateNavigation === 'function') {
                updateNavigation();
            }
            
            // Clear form
            signupForm.reset();
        } else {
            // Registration failed
            showError('signupEmailError', result.message);
        }
    });
});

// Session Management
function checkSession() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    if (user && user.token) {
        // Verify token (simplified - in production, verify with server)
        const tokenAge = Date.now() - parseInt(atob(user.token).split(':')[1]);
        const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
        
        if (tokenAge > maxAge) {
            // Token expired
            localStorage.removeItem('currentUser');
            return null;
        }
        
        return user;
    }
    
    return null;
}

// Auto-check session on page load
window.addEventListener('load', () => {
    const currentUser = checkSession();
    if (!currentUser && window.location.pathname.includes('lesson')) {
        // Optional: Redirect to login if trying to access protected content
        // window.location.href = 'index.html';
    }
});

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateEmail,
        validatePassword,
        registerUser,
        loginUser,
        checkSession
    };
}