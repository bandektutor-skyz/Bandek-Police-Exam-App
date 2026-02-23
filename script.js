let allQuestions = [];
let currentQuestions = [];

fetch('questions.json')
  .then(response => response.json())
  .then(data => {
    allQuestions = data;
    console.log("โหลดสำเร็จ:", allQuestions.length);
  })
  .catch(err => console.error("ไฟล์ JSON พัง:", err));

function startQuiz(setNumber) {
    currentQuestions = allQuestions.filter(q => String(q.set).trim() === String(setNumber).trim());

    if (currentQuestions.length > 0) {
        currentIndex = 0;
        score = 0;
        document.getElementById('menu-container').style.display = 'none';
        document.getElementById('quiz-content').style.display = 'block';
        document.getElementById('timer-container').style.display = 'block';
        showQuestion();
        startTimer();
        document.getElementById('home-btn').style.display = 'block';
    } else {
        alert("ขออภัย! ไม่พบข้อสอบชุดที่ " + setNumber);
    }
}

function showQuestion() {
    const questionData = currentQuestions[currentIndex];
    document.getElementById('question').innerText = `[${questionData.category}] ข้อที่ ${currentIndex + 1}: ${questionData.question}`;
    const optionsElement = document.getElementById('options');
    optionsElement.innerHTML = '';
    questionData.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.innerText = option;
        button.onclick = () => checkAnswer(index);
        optionsElement.appendChild(button);
    });
}

function checkAnswer(selectedIndex) {
    const questionData = currentQuestions[currentIndex];
    if (selectedIndex === questionData.answerIndex) score++;
    currentIndex++;
    if (currentIndex < currentQuestions.length) {
        showQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    document.getElementById('quiz-content').style.display = 'none';
    document.getElementById('result-container').style.display = 'block';
    document.getElementById('score-text').innerText = `คุณทำคะแนนได้ ${score} / ${currentQuestions.length}`;
}

function startTimer() {
    let timeLeft = 180 * 60;
    const timerElement = document.getElementById('timer');
    const timerInterval = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerElement.innerText = `เวลาคงเหลือ: ${minutes}:${seconds < 10 ? '0' : ''}${seconds} นาที`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            showResult();
        }
        timeLeft--;
    }, 1000);
}
