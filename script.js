let allQuestions = [];
let currentIndex = 0;
let score = 0;
let timeLeft = 180 * 60; // 180 นาที
let timerInterval;

// 1. โหลดข้อมูล
async function loadQuestions() {
    try {
        const response = await fetch('questions.json');
        allQuestions = await response.json();
        console.log("โหลดข้อสอบสำเร็จ:", allQuestions.length, "ข้อ");
    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการโหลด:", error);
    }
}

// 2. เริ่มสอบ
function startQuiz() {
    if (allQuestions.length > 0) {
        document.getElementById('home-screen').classList.add('hidden');
        document.getElementById('quiz-screen').classList.remove('hidden');
        document.getElementById('quiz-screen').style.display = 'block';
        
        currentIndex = 0;
        score = 0;
        startTimer(); // เริ่มจับเวลา
        showQuestion(0);
    } else {
        alert("กรุณารอโหลดข้อสอบสักครู่...");
    }
}

// 3. แสดงโจทย์
function showQuestion(index) {
    currentIndex = index;
    const q = allQuestions[index];
    document.getElementById('progress-text').innerText = `ข้อที่ ${index + 1} / ${allQuestions.length}`;
    document.getElementById('question').innerText = q.question;
    
    const container = document.getElementById('options');
    container.innerHTML = '';
    
    q.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.className = 'btn btn-outline-primary option-btn';
        btn.onclick = () => checkAnswer(i, q.answerIndex);
        container.appendChild(btn);
    });
}

// 4. ตรวจคำตอบ
function checkAnswer(selected, correct) {
    if (selected === correct) {
        score++;
    }
    nextQuestion();
}

// 5. จัดการปุ่มถัดไป/ย้อนกลับ
function nextQuestion() {
    if (currentIndex + 1 < allQuestions.length) {
        showQuestion(currentIndex + 1);
    } else {
        finishQuiz("คุณทำข้อสอบครบทุกข้อแล้ว!");
    }
}

function prevQuestion() {
    if (currentIndex > 0) {
        showQuestion(currentIndex - 1);
    }
}

// 6. ระบบเวลาและสรุปผล
function startTimer() {
    timerInterval = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        document.getElementById('timer').innerText = `เวลาเหลือ: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            finishQuiz("หมดเวลาแล้ว!");
        }
        timeLeft--;
    }, 1000);
}

function finishQuiz(message) {
    clearInterval(timerInterval);
    alert(`${message}\nคะแนนของคุณคือ: ${score} คะแนน`);
    location.reload();
}

loadQuestions();
