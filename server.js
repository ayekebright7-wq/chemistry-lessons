// Backend Server for Chem Master Ghana
// Note: This requires Node.js and Express to run

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// In-memory database (in production, use a real database like MongoDB or PostgreSQL)
let users = [];
let userProgress = {};

// Validation middleware
const validateUser = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
];

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Chem Master API is running' });
});

// Register user
app.post('/api/register', validateUser, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const { name, email, password } = req.body;
    
    // Check if user exists
    if (users.find(user => user.email === email)) {
        return res.status(400).json({ error: 'Email already registered' });
    }
    
    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create user
        const user = {
            id: Date.now().toString(),
            name,
            email,
            password: hashedPassword,
            createdAt: new Date().toISOString()
        };
        
        users.push(user);
        userProgress[user.id] = {
            lessonsCompleted: [],
            quizScores: {},
            assessmentScores: {}
        };
        
        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            },
            token
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error during registration' });
    }
});

// Login user
app.post('/api/login', [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const { email, password } = req.body;
    
    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    try {
        // Verify password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            },
            token
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error during login' });
    }
});

// Get user progress (protected)
app.get('/api/progress', authenticateToken, (req, res) => {
    const progress = userProgress[req.user.userId] || {
        lessonsCompleted: [],
        quizScores: {},
        assessmentScores: {}
    };
    
    res.json({ progress });
});

// Update lesson progress (protected)
app.post('/api/progress/lesson', authenticateToken, (req, res) => {
    const { lessonNumber } = req.body;
    
    if (!userProgress[req.user.userId]) {
        userProgress[req.user.userId] = {
            lessonsCompleted: [],
            quizScores: {},
            assessmentScores: {}
        };
    }
    
    if (!userProgress[req.user.userId].lessonsCompleted.includes(lessonNumber)) {
        userProgress[req.user.userId].lessonsCompleted.push(lessonNumber);
    }
    
    res.json({ 
        message: 'Progress updated',
        progress: userProgress[req.user.userId]
    });
});

// Save quiz score (protected)
app.post('/api/progress/quiz', authenticateToken, (req, res) => {
    const { quizId, score } = req.body;
    
    if (!userProgress[req.user.userId]) {
        userProgress[req.user.userId] = {
            lessonsCompleted: [],
            quizScores: {},
            assessmentScores: {}
        };
    }
    
    userProgress[req.user.userId].quizScores[quizId] = score;
    
    res.json({ 
        message: 'Quiz score saved',
        progress: userProgress[req.user.userId]
    });
});

// Save assessment score (protected)
app.post('/api/progress/assessment', authenticateToken, (req, res) => {
    const { assessmentId, score } = req.body;
    
    if (!userProgress[req.user.userId]) {
        userProgress[req.user.userId] = {
            lessonsCompleted: [],
            quizScores: {},
            assessmentScores: {}
        };
    }
    
    userProgress[req.user.userId].assessmentScores[assessmentId] = score;
    
    res.json({ 
        message: 'Assessment score saved',
        progress: userProgress[req.user.userId]
    });
});

// Glossary data
app.get('/api/glossary', (req, res) => {
    const glossary = [
        { term: "Solubility", definition: "Maximum amount of solute that dissolves in a given amount of solvent at a specific temperature and pressure." },
        { term: "Solute", definition: "The substance that gets dissolved in a solution (e.g., sugar in tea)." },
        { term: "Solvent", definition: "The substance that does the dissolving (e.g., water is the universal solvent)." },
        { term: "Solution", definition: "A homogeneous mixture of solute and solvent where the solute is evenly distributed." },
        { term: "Saturated Solution", definition: "A solution containing the maximum amount of dissolved solute at a given temperature." },
        { term: "Unsaturated Solution", definition: "A solution that can dissolve more solute at the same temperature." },
        { term: "Supersaturated Solution", definition: "An unstable solution containing more dissolved solute than normally possible." },
        { term: "Precipitate", definition: "A solid that forms when two solutions are mixed together." },
        { term: "Polar Molecule", definition: "A molecule with positive and negative ends, like water (H₂O)." },
        { term: "Non-polar Molecule", definition: "A molecule with no charged ends, like oil or petrol." },
        { term: "Miscible", definition: "Liquids that can mix in any proportion to form a homogeneous solution." },
        { term: "Immiscible", definition: "Liquids that do not mix and form separate layers (e.g., oil and water)." },
        { term: "Concentration", definition: "The amount of solute present in a given amount of solution." },
        { term: "Solubility Curve", definition: "A graph showing how solubility changes with temperature for different substances." },
        { term: "Hydration", definition: "The process where water molecules surround and separate solute particles." }
    ];
    
    res.json(glossary);
});

// Start server
app.listen(PORT, () => {
    console.log(`Chem Master Ghana server running on port ${PORT}`);
    console.log(`Access the website at: http://localhost:${PORT}`);
});

// Export app for testing
module.exports = app;