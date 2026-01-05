// Main JavaScript for Chem Master Ghana Website

// DOM Elements
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const glossarySearch = document.getElementById('glossarySearch');
const glossaryList = document.getElementById('glossaryList');

// Glossary Data
const glossaryTerms = [
    {
        term: "Solubility",
        definition: "Maximum amount of solute that dissolves in a given amount of solvent at a specific temperature and pressure.",
        icon: "fas fa-water"
    },
    {
        term: "Solute",
        definition: "The substance that gets dissolved in a solution (e.g., sugar in tea).",
        icon: "fas fa-cube"
    },
    {
        term: "Solvent",
        definition: "The substance that does the dissolving (e.g., water is the universal solvent).",
        icon: "fas fa-tint"
    },
    {
        term: "Solution",
        definition: "A homogeneous mixture of solute and solvent where the solute is evenly distributed.",
        icon: "fas fa-vial"
    },
    {
        term: "Saturated Solution",
        definition: "A solution containing the maximum amount of dissolved solute at a given temperature.",
        icon: "fas fa-weight-hanging"
    },
    {
        term: "Unsaturated Solution",
        definition: "A solution that can dissolve more solute at the same temperature.",
        icon: "fas fa-plus-circle"
    },
    {
        term: "Supersaturated Solution",
        definition: "An unstable solution containing more dissolved solute than normally possible.",
        icon: "fas fa-exclamation-triangle"
    },
    {
        term: "Precipitate",
        definition: "A solid that forms when two solutions are mixed together.",
        icon: "fas fa-cloud-rain"
    },
    {
        term: "Polar Molecule",
        definition: "A molecule with positive and negative ends, like water (H₂O).",
        icon: "fas fa-magnet"
    },
    {
        term: "Non-polar Molecule",
        definition: "A molecule with no charged ends, like oil or petrol.",
        icon: "fas fa-ban"
    },
    {
        term: "Miscible",
        definition: "Liquids that can mix in any proportion to form a homogeneous solution.",
        icon: "fas fa-blender"
    },
    {
        term: "Immiscible",
        definition: "Liquids that do not mix and form separate layers (e.g., oil and water).",
        icon: "fas fa-layer-group"
    },
    {
        term: "Concentration",
        definition: "The amount of solute present in a given amount of solution.",
        icon: "fas fa-chart-line"
    },
    {
        term: "Solubility Curve",
        definition: "A graph showing how solubility changes with temperature for different substances.",
        icon: "fas fa-chart-line"
    },
    {
        term: "Hydration",
        definition: "The process where water molecules surround and separate solute particles.",
        icon: "fas fa-atom"
    }
];

// Navigation Toggle
menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
        navLinks.classList.remove('active');
    }
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Close mobile menu if open
            navLinks.classList.remove('active');
            
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});

// Populate Glossary
function populateGlossary() {
    glossaryList.innerHTML = '';
    
    glossaryTerms.forEach(term => {
        const termElement = document.createElement('div');
        termElement.className = 'glossary-term';
        termElement.innerHTML = `
            <h4><i class="${term.icon}"></i> ${term.term}</h4>
            <p>${term.definition}</p>
        `;
        glossaryList.appendChild(termElement);
    });
}

// Search Glossary
glossarySearch.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredTerms = glossaryTerms.filter(term => 
        term.term.toLowerCase().includes(searchTerm) || 
        term.definition.toLowerCase().includes(searchTerm)
    );
    
    glossaryList.innerHTML = '';
    filteredTerms.forEach(term => {
        const termElement = document.createElement('div');
        termElement.className = 'glossary-term';
        termElement.innerHTML = `
            <h4><i class="${term.icon}"></i> ${term.term}</h4>
            <p>${term.definition}</p>
        `;
        glossaryList.appendChild(termElement);
    });
});

// Start Assessment
function startAssessment(testNumber) {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
        alert('Please login to take assessments and track your progress!');
        document.getElementById('loginBtn').click();
        return;
    }
    
    // Store assessment info
    localStorage.setItem('currentAssessment', JSON.stringify({
        testNumber,
        startTime: new Date().toISOString()
    }));
    
    // Redirect to assessment page
    window.location.href = `assessment${testNumber}.html`;
}

// Update Navigation based on login state
function updateNavigation() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const authButtons = document.querySelector('.auth-buttons');
    
    if (user) {
        authButtons.innerHTML = `
            <div class="user-menu">
                <span class="user-greeting">Welcome, ${user.name.split(' ')[0]}!</span>
                <button id="logoutBtn" class="btn btn-outline">Logout</button>
            </div>
        `;
        
        document.getElementById('logoutBtn').addEventListener('click', logout);
    } else {
        authButtons.innerHTML = `
            <button id="loginBtn" class="btn btn-outline">Login</button>
            <button id="signupBtn" class="btn btn-primary">Sign Up</button>
        `;
    }
}
function updateNavigation() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const authButtons = document.querySelector('.auth-buttons');
    
    if (user) {
        authButtons.innerHTML = `
            <div class="user-menu" style="display: flex; align-items: center; gap: 15px;">
                <div class="user-progress" style="display: flex; align-items: center; gap: 10px;">
                    <div style="text-align: right;">
                        <div class="user-greeting" style="font-weight: 500;">Welcome, ${user.name.split(' ')[0]}!</div>
                        <div style="font-size: 0.8rem; color: var(--gray-dark);">
                            ${user.progress?.lessonsCompleted?.length || 0}/6 lessons completed
                        </div>
                    </div>
                    <div class="progress-circle" style="width: 40px; height: 40px; border-radius: 50%; background: conic-gradient(var(--primary-color) ${((user.progress?.lessonsCompleted?.length || 0)/6)*100}%, #e0e0e0 0); display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: 0.7rem; font-weight: bold; color: var(--primary-dark);">
                            ${Math.round(((user.progress?.lessonsCompleted?.length || 0)/6)*100)}%
                        </span>
                    </div>
                </div>
                <button id="dashboardBtn" class="btn btn-outline">
                    <i class="fas fa-tachometer-alt"></i> Dashboard
                </button>
                <button id="logoutBtn" class="btn btn-outline">Logout</button>
            </div>
        `;
        
        document.getElementById('logoutBtn').addEventListener('click', logout);
        document.getElementById('dashboardBtn').addEventListener('click', showDashboard);
    } else {
        authButtons.innerHTML = `
            <button id="loginBtn" class="btn btn-outline">Login</button>
            <button id="signupBtn" class="btn btn-primary">Sign Up</button>
        `;
    }
}

function showDashboard() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    const dashboardHTML = `
        <div id="dashboardModal" class="modal" style="display: flex;">
            <div class="modal-content" style="max-width: 800px;">
                <span class="close" onclick="closeDashboard()">&times;</span>
                <h2><i class="fas fa-tachometer-alt"></i> Student Dashboard</h2>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 30px 0;">
                    <div class="dashboard-card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px;">
                        <h3><i class="fas fa-book-open"></i> Progress</h3>
                        <div style="font-size: 2.5rem; font-weight: bold; margin: 15px 0;">
                            ${user.progress?.lessonsCompleted?.length || 0}/6
                        </div>
                        <div>Lessons Completed</div>
                    </div>
                    
                    <div class="dashboard-card" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 20px; border-radius: 10px;">
                        <h3><i class="fas fa-chart-line"></i> Average Score</h3>
                        <div style="font-size: 2.5rem; font-weight: bold; margin: 15px 0;">
                            ${calculateAverageScore()}%
                        </div>
                        <div>Across Assessments</div>
                    </div>
                    
                    <div class="dashboard-card" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 20px; border-radius: 10px;">
                        <h3><i class="fas fa-clock"></i> Time Spent</h3>
                        <div style="font-size: 2.5rem; font-weight: bold; margin: 15px 0;">
                            ${calculateStudyTime()}
                        </div>
                        <div>Estimated Learning</div>
                    </div>
                </div>
                
                <h3 style="margin: 30px 0 15px; color: var(--primary-dark);">
                    <i class="fas fa-trophy"></i> Assessment Results
                </h3>
                
                <div id="assessmentResults">
                    ${renderAssessmentResults()}
                </div>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid var(--gray-light);">
                    <h4><i class="fas fa-bullseye"></i> Recommendations</h4>
                    <div style="background: #e8f4f8; padding: 15px; border-radius: 8px; margin-top: 10px;">
                        ${getRecommendations()}
                    </div>
                </div>
                
                <div style="margin-top: 30px; text-align: center;">
                    <button class="btn btn-primary" onclick="continueLearning()">
                        <i class="fas fa-play-circle"></i> Continue Learning
                    </button>
                    <button class="btn btn-outline" onclick="viewAllResults()">
                        <i class="fas fa-chart-bar"></i> View Detailed Results
                    </button>
                </div>
            </div>
        </div>
    `;
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = dashboardHTML;
    document.body.appendChild(tempDiv);
}

function calculateAverageScore() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user || !user.assessmentScores) return 0;
    
    const scores = Object.values(user.assessmentScores);
    if (scores.length === 0) return 0;
    
    const total = scores.reduce((sum, score) => sum + (score.percentage || 0), 0);
    return Math.round(total / scores.length);
}

function renderAssessmentResults() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user || !user.assessmentScores) {
        return '<p>No assessment results yet. Complete an assessment to see your scores.</p>';
    }
    
    let html = '<div style="display: flex; flex-direction: column; gap: 15px;">';
    Object.entries(user.assessmentScores).forEach(([assessment, score]) => {
        const assessmentNum = assessment.replace('assessment', '');
        html += `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: white; border-radius: 8px; box-shadow: var(--shadow);">
                <div>
                    <div style="font-weight: 500;">Assessment Test ${assessmentNum}</div>
                    <div style="font-size: 0.9rem; color: var(--gray-dark);">
                        ${new Date(score.date).toLocaleDateString()} • Score: ${score.score}/100
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 15px;">
                    <div style="text-align: center;">
                        <div style="font-size: 1.8rem; font-weight: bold; color: ${score.percentage >= 80 ? '#27ae60' : score.percentage >= 60 ? '#f39c12' : '#e74c3c'};">${score.percentage}%</div>
                        <div style="font-size: 0.8rem; color: var(--gray-dark);">Percentage</div>
                    </div>
                    <button class="btn btn-outline" onclick="reviewAssessment(${assessmentNum})" style="padding: 8px 15px;">
                        <i class="fas fa-eye"></i> Review
                    </button>
                </div>
            </div>
        `;
    });
    html += '</div>';
    return html;
}

function reviewAssessment(assessmentNum) {
    closeDashboard();
    if (assessmentNum === 1) {
        window.location.href = 'assessment1.html?review=true';
    } else {
        window.location.href = 'assessment2.html?review=true';
    }
}

function closeDashboard() {
    const modal = document.getElementById('dashboardModal');
    if (modal) {
        modal.remove();
    }
}

// Logout Function
function logout() {
    localStorage.removeItem('currentUser');
    updateNavigation();
    alert('You have been logged out successfully.');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    populateGlossary();
    updateNavigation();
    
    // Add active class to current section in navigation
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                document.querySelector(`.nav-links a[href="#${sectionId}"]`)?.classList.add('active');
            } else {
                document.querySelector(`.nav-links a[href="#${sectionId}"]`)?.classList.remove('active');
            }
        });
    });
});

// Lesson Progress Tracking
function trackLessonProgress(lessonNumber) {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) return;
    
    if (!user.progress) {
        user.progress = {
            lessonsCompleted: [],
            quizScores: {},
            assessmentScores: {}
        };
    }
    
    if (!user.progress.lessonsCompleted.includes(lessonNumber)) {
        user.progress.lessonsCompleted.push(lessonNumber);
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Update users in localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.email === user.email);
        if (userIndex !== -1) {
            users[userIndex] = user;
            localStorage.setItem('users', JSON.stringify(users));
        }
    }
}