let allQuestions = [];
let currentQuestions = [];
let currentIndex = 0;
let timerInterval;

// 1. โหลดข้อมูล
async function loadQuestions() {
    try {
        const response = await fetch('questions.json');
        allQuestions = await response.json();
        console.log("โหลดข้อมูลสำเร็จ");
    } catch (error) {
        console.error("โหลดไฟล์ JSON ไม่สำเร็จ:", error);
    }
}

// 2. เริ่มทำข้อสอบ
function startQuiz(setNumber) {
    // ใช้ == เพื่อรองรับทั้ง "1" และ 1 จาก JSON
    currentQuestions = allQuestions.filter(q => q.set == setNumber);

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

// 3. แสดงโจทย์
function showQuestion() {
    const questionData = currentQuestions[currentIndex];
    document.getElementById('question').innerText = `ชุดที่ ${questionData.set} ข้อที่ ${currentIndex + 1}: ${questionData.question}`;
    
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

// 4. เลือกคำตอบ (ตรวจสอบชื่อ answerIndex ให้ตรงกับ JSON)
function selectAnswer(selectedIndex) {
    const questionData = currentQuestions[currentIndex];
    const buttons = document.querySelectorAll('.option-btn');
    const rationaleElement = document.getElementById('rationale');

    buttons.forEach((btn, index) => {
        btn.disabled = true;
        // ใช้ answerIndex ตามในไฟล์ questions.json ของคุณ
        if (index === questionData.answerIndex) {
            btn.style.backgroundColor = "#4CAF50";
            btn.style.color = "white";
        } else if (index === selectedIndex) {
            btn.style.backgroundColor = "#f44336";
            btn.style.color = "white";
        }
    });

    rationaleElement.innerText = "เฉลย: " + questionData.rationale;
    rationaleElement.style.display = 'block';
}

// 5. เปลี่ยนข้อ
function nextQuestion() {
    if (currentIndex < currentQuestions.length - 1) {
        currentIndex++;
        showQuestion();
    } else {
        alert("จบชุดข้อสอบแล้วครับ");
    }
}

function prevQuestion() {
    if (currentIndex > 0) {
        currentIndex--;
        showQuestion();
    }
}

// 6. จับเวลา
function startTimer() {
    let time = 180 * 60;
    const timerDisplay = document.getElementById('time');
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;
        timerDisplay.innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        if (time <= 0) { 
            clearInterval(timerInterval); 
            alert("หมดเวลาสอบ!"); 
        }
        time--;
    }, 1000);
}

// 7. เรียกใช้งานตอนโหลดหน้าเว็บ
loadQuestions();
