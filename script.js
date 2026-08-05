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

function startQuiz() {
    currentQuestion = 0;
    score = 0;
    answered = false;
    userAnswers = [];
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
}

function selectAnswer(index) {
    if (answered) return;
    
    answered = true;
    const question = quizData[currentQuestion];
    const buttons = document.querySelectorAll('.answer-btn');
    
    // Record user answer
    userAnswers.push({
        question: question.question,
        userAnswer: question.answers[index],
        correctAnswer: question.answers[question.correct],
        correct: index === question.correct
    });
    
    // Show correct/incorrect feedback
    buttons.forEach((button, btnIndex) => {
        button.disabled = true;
        button.classList.add('disabled');
        
        if (btnIndex === question.correct) {
            button.classList.add('correct');
        } else if (btnIndex === index && index !== question.correct) {
            button.classList.add('incorrect');
        }
    });
    
    // Update score if correct
    if (index === question.correct) {
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
    showScreen('welcomeScreen');
}

// Initialize by showing welcome screen
window.addEventListener('load', () => {
    showScreen('welcomeScreen');
});