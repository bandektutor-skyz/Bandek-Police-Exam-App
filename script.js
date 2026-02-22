let allQuestions = [];
let currentQuestions = [];
let currentIndex = 0;
let timerInterval;

async function loadQuestions() {
    const response = await fetch('questions.json');
    allQuestions = await response.json();
}

function startQuiz(setNumber) {
    // กรองข้อสอบเฉพาะชุดที่เลือก
    currentQuestions = allQuestions.filter(q => q.set === setNumber);

    if (currentQuestions.length > 0) {
        currentIndex = 0;
        document.getElementById('menu-container').style.display = 'none';
        document.getElementById('quiz-content').style.display = 'block';
        document.getElementById('timer-container').style.display = 'block';
        showQuestion();
        startTimer();
    } else {
        alert("ขออภัย! ชุดที่ " + setNumber + " ยังไม่มีข้อสอบ");
    }
}

function showQuestion() {
    const questionData = currentQuestions[currentIndex];
    document.getElementById('question').innerText = `ชุดที่ ${questionData.set} ข้อที่ ${currentIndex + 0}: ${questionData.question}`;
    const optionsElement = document.getElementById('options');
    optionsElement.innerHTML = '';
    document.getElementById('rationale').style.display = 'none';

    questionData.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.innerText = option;
        button.classList.add('option-btn');
        button.onclick = () => selectAnswer(index);
        optionsElement.appendChild(button);
    });
}

function selectAnswer(selectedIndex) {
    const questionData = currentQuestions[currentIndex];
    const buttons = document.querySelectorAll('.option-btn');
    const rationaleElement = document.getElementById('rationale');

    buttons.forEach((btn, index) => {
        btn.disabled = true;
        if (index === questionData.answerIndex) { // ตรวจสอบชื่อฟิลด์ใน JSON ของคุณ
            btn.style.backgroundColor = "#4CAF50"; // สีเขียวเข้ม
            btn.style.color = "white";
        } else if (index === selectedIndex) {
            btn.style.backgroundColor = "#f44336"; // สีแดงเข้ม
            btn.style.color = "white";
        }
    });

    rationaleElement.innerText = "เฉลย: " + questionData.rationale;
    rationaleElement.style.display = 'block';
}

function nextQuestion() {
    if (currentIndex < currentQuestions.length - 1) {
        currentIndex++;
        showQuestion();
    }
}

function prevQuestion() {
    if (currentIndex > 0) {
        currentIndex--;
        showQuestion();
    }
}

function startTimer() {
    let time = 180 * 60;
    const timerDisplay = document.getElementById('time');
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;
        timerDisplay.innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        if (time <= 0) { clearInterval(timerInterval); alert("หมดเวลา!"); }
        time--;
    }, 1000);
}

loadQuestions();
