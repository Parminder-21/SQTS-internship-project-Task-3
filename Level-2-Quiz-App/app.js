// DOM Elements
const sections = {
    auth: document.getElementById('auth-section'),
    dashboard: document.getElementById('dashboard-section'),
    quiz: document.getElementById('quiz-section'),
    result: document.getElementById('result-section')
};

// State
const state = {
    currentUser: null,
    currentDomainId: null,
    currentQuestionIndex: 0,
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    timer: null,
    timeLeft: 30,
    totalTimeTaken: 0,
    totalQuestions: 0
};

// Configuration
const SECONDS_PER_QUESTION = 30;

// Initialize
function init() {
    setupEventListeners();
    checkAuth();
}

function showSection(sectionId) {
    Object.values(sections).forEach(s => s.classList.add('hidden'));
    sections[sectionId].classList.remove('hidden');
    sections[sectionId].classList.add('active');
}

// ==== AUTHENTICATION ====
function setupEventListeners() {
    // Auth Tabs
    const authTabs = document.querySelectorAll('.tab-btn');
    authTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            authTabs.forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');

            if (e.target.dataset.tab === 'login') {
                document.getElementById('login-form').classList.remove('hidden');
                document.getElementById('register-form').classList.add('hidden');
            } else {
                document.getElementById('login-form').classList.add('hidden');
                document.getElementById('register-form').classList.remove('hidden');
            }
        });
    });

    // Login Form
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const users = JSON.parse(localStorage.getItem('proquiz_users') || '[]');

        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            login(user);
        } else {
            document.getElementById('login-error').innerText = 'Invalid email or password';
        }
    });

    // Register Form
    document.getElementById('register-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;

        const users = JSON.parse(localStorage.getItem('proquiz_users') || '[]');
        if (users.some(u => u.email === email)) {
            document.getElementById('reg-error').innerText = 'Email already exists';
            return;
        }

        const newUser = { id: Date.now(), name, email, password, history: [] };
        users.push(newUser);
        localStorage.setItem('proquiz_users', JSON.stringify(users));
        login(newUser);
    });

    // Logout
    document.getElementById('logout-btn').addEventListener('click', logout);

    // Quiz Actions
    document.getElementById('next-btn').addEventListener('click', handleNextQuestion);
    document.getElementById('retry-btn').addEventListener('click', () => startQuiz(state.currentDomainId));
    document.getElementById('home-btn').addEventListener('click', renderDashboard);
}

function checkAuth() {
    const savedUser = localStorage.getItem('proquiz_current_user');
    if (savedUser) {
        state.currentUser = JSON.parse(savedUser);
        updateHeader();
        renderDashboard();
    } else {
        showSection('auth');
    }
}

function login(user) {
    state.currentUser = user;
    localStorage.setItem('proquiz_current_user', JSON.stringify(user));
    updateHeader();
    renderDashboard();
}

function logout() {
    state.currentUser = null;
    localStorage.removeItem('proquiz_current_user');
    document.getElementById('user-profile').classList.add('hidden');
    showSection('auth');
}

function updateHeader() {
    document.getElementById('user-profile').classList.remove('hidden');
    document.getElementById('username-display').innerText = `👋 ${state.currentUser.name}`;
}

// ==== DASHBOARD ====
function renderDashboard() {
    showSection('dashboard');

    // Render Domains
    const domainGrid = document.getElementById('domain-grid');
    domainGrid.innerHTML = '';

    quizDomains.forEach(domain => {
        const card = document.createElement('div');
        card.className = 'domain-card';
        card.innerHTML = `
            <div class="domain-icon">${domain.icon}</div>
            <div class="domain-title">${domain.title}</div>
            <div class="domain-meta">${domain.questions.length} questions</div>
        `;
        card.addEventListener('click', () => startQuiz(domain.id));
        domainGrid.appendChild(card);
    });

    // Render History
    renderHistory();
}

function renderHistory() {
    const user = state.currentUser;
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';

    if (!user.history || user.history.length === 0) {
        historyList.innerHTML = '<p class="text-muted" style="text-align: center; padding: 15px;">No quizzes taken yet.</p>';
        return;
    }

    // Sort by recent first and take top 5
    const recentHistory = [...user.history].sort((a, b) => b.date - a.date).slice(0, 5);

    recentHistory.forEach(item => {
        const domain = quizDomains.find(d => d.id === item.domainId);
        const domainName = domain ? domain.title : 'Unknown';
        const isPass = (item.score / item.total) >= 0.5;

        const el = document.createElement('div');
        el.className = 'history-item';
        el.innerHTML = `
            <div>
                <strong>${domainName}</strong>
                <div style="font-size: 0.8rem; color: var(--text-muted)">
                    ${new Date(item.date).toLocaleDateString()}
                </div>
            </div>
            <div class="score" style="color: ${isPass ? 'var(--success)' : 'var(--danger)'}">
                ${item.score}/${item.total}
            </div>
        `;
        historyList.appendChild(el);
    });
}

// ==== QUIZ LOGIC ====
function startQuiz(domainId) {
    state.currentDomainId = domainId;
    state.currentQuestionIndex = 0;
    state.score = 0;
    state.correctAnswers = 0;
    state.wrongAnswers = 0;
    state.totalTimeTaken = 0;

    const domain = quizDomains.find(d => d.id === domainId);
    state.totalQuestions = domain.questions.length;

    document.getElementById('total-questions-num').innerText = state.totalQuestions;

    showSection('quiz');
    loadQuestion();
}

function loadQuestion() {
    const domain = quizDomains.find(d => d.id === state.currentDomainId);
    const question = domain.questions[state.currentQuestionIndex];

    // Update UI
    document.getElementById('current-question-num').innerText = state.currentQuestionIndex + 1;
    document.getElementById('question-text').innerText = question.text;
    document.getElementById('feedback-msg').innerText = '';
    document.getElementById('next-btn').disabled = true;

    // Progress bar
    const progressPercent = ((state.currentQuestionIndex) / state.totalQuestions) * 100;
    document.getElementById('progress-bar').style.width = `${progressPercent}%`;

    // Options
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';

    question.options.forEach((optText, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = optText;
        btn.addEventListener('click', () => selectOption(idx, btn));
        optionsContainer.appendChild(btn);
    });

    startTimer();
}

function startTimer() {
    clearInterval(state.timer);
    state.timeLeft = SECONDS_PER_QUESTION;
    updateTimerUI();

    state.timer = setInterval(() => {
        state.timeLeft--;
        state.totalTimeTaken++;
        updateTimerUI();

        if (state.timeLeft <= 0) {
            clearInterval(state.timer);
            // Handle timeout - auto wrong answer
            handleTimeout();
        }
    }, 1000);
}

function updateTimerUI() {
    const timerSpan = document.getElementById('time-left');
    const timerParent = timerSpan.parentElement;

    timerSpan.innerText = `00:${state.timeLeft.toString().padStart(2, '0')}`;

    if (state.timeLeft <= 10) {
        timerParent.classList.add('danger');
    } else {
        timerParent.classList.remove('danger');
    }
}

function selectOption(selectedIndex, btnElement) {
    clearInterval(state.timer); // Stop timer on selection

    // Disable all options
    const options = document.querySelectorAll('.option-btn');
    options.forEach(btn => btn.disabled = true);

    btnElement.classList.add('selected');

    const domain = quizDomains.find(d => d.id === state.currentDomainId);
    const question = domain.questions[state.currentQuestionIndex];
    const isCorrect = selectedIndex === question.correctAnswer;

    const feedbackMsg = document.getElementById('feedback-msg');

    if (isCorrect) {
        btnElement.classList.add('correct');
        feedbackMsg.innerText = '✓ Correct';
        feedbackMsg.className = 'feedback-msg correct-text';
        state.correctAnswers++;
        state.score++;
    } else {
        btnElement.classList.add('wrong');
        feedbackMsg.innerText = '✗ Incorrect';
        feedbackMsg.className = 'feedback-msg wrong-text';
        state.wrongAnswers++;

        // Highlight correct option
        options[question.correctAnswer].classList.add('correct');
    }

    document.getElementById('next-btn').disabled = false;
}

function handleTimeout() {
    // Disable all options
    const options = document.querySelectorAll('.option-btn');
    options.forEach(btn => btn.disabled = true);

    const domain = quizDomains.find(d => d.id === state.currentDomainId);
    const question = domain.questions[state.currentQuestionIndex];

    const feedbackMsg = document.getElementById('feedback-msg');
    feedbackMsg.innerText = '⏱️ Time is up!';
    feedbackMsg.className = 'feedback-msg wrong-text';
    state.wrongAnswers++;

    // Highlight correct option
    options[question.correctAnswer].classList.add('correct');
    document.getElementById('next-btn').disabled = false;
}

function handleNextQuestion() {
    state.currentQuestionIndex++;

    if (state.currentQuestionIndex < state.totalQuestions) {
        loadQuestion();
    } else {
        finishQuiz();
    }
}

// ==== RESULTS ====
function finishQuiz() {
    clearInterval(state.timer);
    document.getElementById('progress-bar').style.width = '100%';

    // Save to history
    saveResultToHistory();

    // Calculate stats
    const percentage = Math.round((state.correctAnswers / state.totalQuestions) * 100);
    const avgTime = Math.round(state.totalTimeTaken / state.totalQuestions);
    const isPass = percentage >= 50; // Pass threshold

    // Update UI
    showSection('result');

    const statusEl = document.getElementById('result-status');
    statusEl.innerText = isPass ? '🎉 Congratulations!' : 'Better luck next time!';
    statusEl.style.color = isPass ? 'var(--success)' : 'var(--danger)';

    // Circle animation
    const circle = document.getElementById('score-circle-path');
    const perimeter = 100;
    circle.style.strokeDasharray = `${percentage}, 100`;
    circle.style.stroke = isPass ? 'var(--success)' : 'var(--danger)';

    document.getElementById('score-percentage').innerText = `${percentage}%`;
    document.getElementById('total-score-text').innerText = `You scored ${state.score} out of ${state.totalQuestions}`;

    document.getElementById('correct-count').innerText = state.correctAnswers;
    document.getElementById('wrong-count').innerText = state.wrongAnswers;
    document.getElementById('avg-time').innerText = `${avgTime}s`;

    // Suggestion logic
    const suggestionEl = document.getElementById('improvement-suggestion');
    if (percentage === 100) {
        suggestionEl.innerText = "Flawless! You're an absolute master of this domain.";
    } else if (percentage >= 80) {
        suggestionEl.innerText = "Great job! Just a few minor mistakes. Review the concepts you missed to achieve perfection.";
    } else if (percentage >= 50) {
        suggestionEl.innerText = "Good effort, you passed! But there's definitely room for improvement. Keep studying!";
    } else {
        suggestionEl.innerText = "You didn't pass this time. Take some time to review the fundamentals of this domain and try again.";
    }
}

function saveResultToHistory() {
    const user = state.currentUser;
    if (!user) return;

    const result = {
        domainId: state.currentDomainId,
        score: state.score,
        total: state.totalQuestions,
        date: Date.now()
    };

    user.history = user.history || [];
    user.history.push(result);

    // Update users array in localStorage
    const users = JSON.parse(localStorage.getItem('proquiz_users') || '[]');
    const userIndex = users.findIndex(u => u.email === user.email);
    if (userIndex !== -1) {
        users[userIndex] = user;
        localStorage.setItem('proquiz_users', JSON.stringify(users));
        localStorage.setItem('proquiz_current_user', JSON.stringify(user));
    }
}

// Start
window.addEventListener('DOMContentLoaded', init);
