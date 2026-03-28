let allQuestions = [];
let currentIndex = 0;
let score = 0;
let timeLeft = 180 * 60; 
let timerInterval;
// --- เพิ่มตัวแปรเก็บคำตอบของผู้ใช้ ---
let userAnswers = []; 

async function loadQuestions() {
    try {
        const response = await fetch('questions.json');
        allQuestions = await response.json();
        // เตรียมพื้นที่เก็บคำตอบให้เท่ากับจำนวนข้อสอบ
        userAnswers = new Array(allQuestions.length).fill(null);
    } catch (error) {
        console.error("โหลดข้อมูลล้มเหลว:", error);
    }
}

function startQuiz() {
    if (allQuestions.length > 0) {
        document.getElementById('home-screen').classList.add('hidden');
        document.getElementById('quiz-screen').classList.remove('hidden');
        document.getElementById('quiz-screen').style.display = 'block';
        
        currentIndex = 0;
        score = 0;
        // ล้างคำตอบใหม่ทุกครั้งที่เริ่มสอบ
        userAnswers = new Array(allQuestions.length).fill(null);
        document.getElementById('score-text').innerText = `คะแนน: 0`;
        
        startTimer();
        showQuestion(0);
    }
}

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
        
        // --- เช็คว่าข้อนี้เคยตอบไปหรือยัง ถ้าใช่ให้เปลี่ยนสีปุ่ม ---
        if (userAnswers[currentIndex] === i) {
            btn.className = 'btn btn-primary option-btn'; // สีเข้มเมื่อเลือกแล้ว
        } else {
            btn.className = 'btn btn-outline-primary option-btn';
        }
        
        btn.onclick = () => checkAnswer(i, q.answerIndex);
        container.appendChild(btn);
    });
}

function checkAnswer(selected, correct) {
    // 1. บันทึกคำตอบที่เลือกในข้อนั้นๆ
    userAnswers[currentIndex] = selected;
    
    // 2. คำนวณคะแนนใหม่จากคำตอบทั้งหมดที่มีตอนนี้
    calculateScore();
    
    // 3. ไปข้อถัดไป
    nextQuestion();
}

// --- ฟังก์ชันคำนวณคะแนนใหม่ทุกครั้ง ---
function calculateScore() {
    let currentScore = 0;
    userAnswers.forEach((ans, index) => {
        if (ans !== null && ans === allQuestions[index].answerIndex) {
            currentScore++;
        }
    });
    score = currentScore;
    document.getElementById('score-text').innerText = `คะแนน: ${score}`;
}

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

function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        const timerElement = document.getElementById('timer');
        timerElement.innerText = `เวลาเหลือ: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerElement.innerText = "หมดเวลาแล้ว!";
            alert("หมดเวลา 180 นาทีแล้วครับ! (คุณสามารถทำข้อสอบต่อจนเสร็จได้)");
        }
        timeLeft--;
    }, 1000);
}

function finishQuiz(message) {
    clearInterval(timerInterval);
    alert(`${message}\nคะแนนของคุณคือ: ${score} จาก ${allQuestions.length} คะแนน`);
    location.reload();
}

loadQuestions();
