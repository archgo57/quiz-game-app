const quizData = [
    {
        question: "What is the capital of France?",
        answers: ["Berlin", "Paris", "Madrid", "Rome"],
        correct: 1
    },
    {
        question: "Which planet is known as the Red Planet?",
        answers: ["Venus", "Mars", "Jupiter", "Saturn"],
        correct: 1
    },
    {
        question: "Who wrote Romeo and Juliet?",
        answers: ["Mark Twain", "Jane Austen", "William Shakespeare", "Charles Dickens"],
        correct: 2
    },
    {
        question: "What is the largest ocean on Earth?",
        answers: ["Atlantic", "Indian", "Arctic", "Pacific"],
        correct: 3
    },
    {
        question: "In what year did the Titanic sink?",
        answers: ["1912", "1915", "1920", "1925"],
        correct: 0
    }
];

let currentQuestion = 0;
let score = 0;
let answered = false;
let userAnswers = [];
const questionTimeLimit = 20;
let timeRemaining = questionTimeLimit;
let timerAnimationFrame = null;
let timerDeadline = 0;
const timerRadius = 52;
const timerCircumference = 2 * Math.PI * timerRadius;

function initializeTimerRing() {
    const timerFill = document.getElementById('timerFill');
    timerFill.style.strokeDasharray = `${timerCircumference}`;
    timerFill.style.strokeDashoffset = '0';
}

function startQuiz() {
    currentQuestion = 0;
    score = 0;
    answered = false;
    userAnswers = [];
    stopTimer();
    showScreen('quizScreen');
    loadQuestion();
}

function loadQuestion() {
    const question = quizData[currentQuestion];
    const questionNumber = currentQuestion + 1;
    
    // Update progress
    document.getElementById('questionNumber').textContent = `Question ${questionNumber} of ${quizData.length}`;
    const progressPercent = (currentQuestion / quizData.length) * 100;
    document.getElementById('progressFill').style.width = progressPercent + '%';
    
    // Update question text
    document.getElementById('questionText').textContent = question.question;
    
    // Clear previous answers
    const container = document.getElementById('answersContainer');
    container.innerHTML = '';
    
    // Add answer buttons
    question.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.className = 'answer-btn';
        button.textContent = answer;
        button.onclick = () => selectAnswer(index);
        container.appendChild(button);
    });
    
    // Update score display
    document.getElementById('scoreDisplay').textContent = `Score: ${score}/${quizData.length}`;
    
    answered = false;
    startTimer();
}

function startTimer() {
    stopTimer();
    timeRemaining = questionTimeLimit;
    timerDeadline = performance.now() + (questionTimeLimit * 1000);
    document.getElementById('timerStatus').textContent = '';
    initializeTimerRing();
    updateTimerDisplay(questionTimeLimit * 1000);

    const tick = (now) => {
        const remainingMs = Math.max(0, timerDeadline - now);
        timeRemaining = Math.ceil(remainingMs / 1000);
        updateTimerDisplay(remainingMs);

        if (remainingMs <= 0) {
            stopTimer();
            handleTimeUp();
            return;
        }

        timerAnimationFrame = requestAnimationFrame(tick);
    };

    timerAnimationFrame = requestAnimationFrame(tick);
}

function stopTimer() {
    if (timerAnimationFrame) {
        cancelAnimationFrame(timerAnimationFrame);
        timerAnimationFrame = null;
    }
}

function updateTimerDisplay(remainingMs) {
    const timerText = document.getElementById('timerText');
    const timerFill = document.getElementById('timerFill');
    const timerRatio = Math.max(0, remainingMs / (questionTimeLimit * 1000));
    const secondsRemaining = Math.ceil(remainingMs / 1000);

    timerFill.style.strokeDashoffset = `${timerCircumference * (1 - timerRatio)}`;

    timerText.textContent = `${secondsRemaining}s`;
    timerText.setAttribute('aria-label', `${secondsRemaining} seconds remaining`);
    timerText.classList.toggle('warning', secondsRemaining <= 10 && secondsRemaining > 5);
    timerText.classList.toggle('danger', secondsRemaining <= 5);

    timerFill.classList.toggle('warning', secondsRemaining <= 10 && secondsRemaining > 5);
    timerFill.classList.toggle('danger', secondsRemaining <= 5);
}

function handleTimeUp() {
    if (answered) return;
    document.getElementById('timerStatus').textContent = "Time's up!";
    selectAnswer(null, true);
}

function selectAnswer(index, timedOut = false) {
    if (answered) return;
    
    answered = true;
    stopTimer();
    const question = quizData[currentQuestion];
    const buttons = document.querySelectorAll('.answer-btn');
    
    // Record user answer
    userAnswers.push({
        question: question.question,
        userAnswer: timedOut ? "No answer (Time's up)" : question.answers[index],
        correctAnswer: question.answers[question.correct],
        correct: !timedOut && index === question.correct
    });
    
    // Show correct/incorrect feedback
    buttons.forEach((button, btnIndex) => {
        button.disabled = true;
        button.classList.add('disabled');
        
        if (btnIndex === question.correct) {
            button.classList.add('correct');
        } else if (!timedOut && btnIndex === index && index !== question.correct) {
            button.classList.add('incorrect');
        }
    });
    
    // Update score if correct
    if (!timedOut && index === question.correct) {
        score++;
    }
    
    // Move to next question or show results
    setTimeout(() => {
        if (currentQuestion < quizData.length - 1) {
            currentQuestion++;
            loadQuestion();
        } else {
            showResults();
        }
    }, 1500);
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function showResults() {
    stopTimer();
    showScreen('resultsScreen');
    
    // Calculate percentage
    const percentage = Math.round((score / quizData.length) * 100);
    document.getElementById('finalScore').textContent = score;
    document.getElementById('scorePercentage').textContent = percentage + '%';
    
    // Set result message
    let message = '';
    if (percentage === 100) {
        message = "Perfect Score! You're a genius! 🌟";
    } else if (percentage >= 80) {
        message = "Excellent! You scored great! 🎉";
    } else if (percentage >= 60) {
        message = "Good job! Keep learning! 📚";
    } else if (percentage >= 40) {
        message = "Not bad! Practice makes perfect! 💪";
    } else {
        message = "Nice try! Study and try again! 📖";
    }
    document.getElementById('resultMessage').textContent = message;
    
    // Show answers review
    const reviewContainer = document.getElementById('answersReview');
    reviewContainer.innerHTML = '';
    
    userAnswers.forEach((answer, index) => {
        const reviewItem = document.createElement('div');
        reviewItem.className = `review-item ${answer.correct ? 'correct' : 'incorrect'}`;
        
        reviewItem.innerHTML = `
            <div class="review-item-question">Q${index + 1}: ${answer.question}</div>
            <div class="review-item-answer ${answer.correct ? 'correct' : 'incorrect'}">
                ${answer.userAnswer}
            </div>
            ${!answer.correct ? `<div class="review-item-answer correct">Correct Answer: ${answer.correctAnswer}</div>` : ''}
        `;
        
        reviewContainer.appendChild(reviewItem);
    });
}

function restartQuiz() {
    stopTimer();
    showScreen('welcomeScreen');
}

// Initialize by showing welcome screen
window.addEventListener('load', () => {
    showScreen('welcomeScreen');
});