let allQuestions = [];
let currentQuestions = [];
let currentIndex = 0;
let score = 0; // เพิ่มตัวแปรเก็บคะแนน
let timerInterval;

// 1. โหลดข้อมูล
async function loadQuestions() {
    try {
        const response = await fetch('questions.json');
        allQuestions = await response.json();
        console.log("โหลดข้อมูลสำเร็จ จำนวน:", allQuestions.length);
    } catch (error) {
        console.error("โหลดไฟล์ JSON ไม่สำเร็จ:", error);
    }
}

// 2. เริ่มทำข้อสอบ
function startQuiz(setNumber) {
currentQuestions = allQuestions.filter(q => Number(q.set) === Number(setNumber));

    if (currentQuestions.length > 0) {
        currentIndex = 0;
        score = 0; // รีเซ็ตคะแนนใหม่ทุกครั้งที่เริ่ม
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
    
    // อัปเดตหัวข้อและหมวดหมู่
    document.getElementById('question').innerText = `[${questionData.category}] ข้อที่ ${currentIndex + 1}: ${questionData.question}`;
    
    const optionsElement = document.getElementById('options');
    optionsElement.innerHTML = '';
    
    // ซ่อนเฉลยเมื่อขึ้นข้อใหม่
    const rationaleElement = document.getElementById('rationale');
    rationaleElement.style.display = 'none';
    rationaleElement.classList.remove('correct', 'wrong');

    questionData.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.innerText = option;
        button.classList.add('option-btn');
        button.onclick = () => selectAnswer(index);
        optionsElement.appendChild(button);
    });
}

// 4. เลือกคำตอบ
function selectAnswer(selectedIndex) {
    const questionData = currentQuestions[currentIndex];
    const buttons = document.querySelectorAll('.option-btn');
    const rationaleElement = document.getElementById('rationale');

    // ตรวจสอบว่าตอบถูกหรือไม่
    if (selectedIndex === questionData.answerIndex) {
        score++;
        rationaleElement.classList.add('correct');
    } else {
        rationaleElement.classList.add('wrong');
    }

    buttons.forEach((btn, index) => {
        btn.disabled = true; // ล็อกปุ่มไม่ให้กดซ้ำ
        if (index === questionData.answerIndex) {
            btn.style.backgroundColor = "#4CAF50"; // สีเขียว (ข้อที่ถูก)
            btn.style.color = "white";
        } else if (index === selectedIndex) {
            btn.style.backgroundColor = "#f44336"; // สีแดง (ข้อที่เราเลือกผิด)
            btn.style.color = "white";
        }
    });

    rationaleElement.innerText = "คำอธิบาย: " + questionData.rationale;
    rationaleElement.style.display = 'block';
}

// 5. เปลี่ยนข้อ
function nextQuestion() {
    if (currentIndex < currentQuestions.length - 1) {
        currentIndex++;
        showQuestion();
    } else {
        finishQuiz();
    }
}

function prevQuestion() {
    if (currentIndex > 0) {
        currentIndex--;
        showQuestion();
    }
}

// 6. จบการสอบ
function finishQuiz() {
    clearInterval(timerInterval);
    
    // ซ่อนหน้าข้อสอบและตัวจับเวลา
    document.getElementById('quiz-content').style.display = 'none';
    document.getElementById('timer-container').style.display = 'none';
    
    // แสดงหน้าสรุปผลคะแนน
    const resultContainer = document.getElementById('result-container');
    resultContainer.style.display = 'block';
    
    // ใส่คะแนน
    document.getElementById('final-score').innerText = `${score} / ${currentQuestions.length}`;
    
    // เพิ่มข้อความตามระดับคะแนน
    const messageElement = document.getElementById('score-message');
    const percent = (score / currentQuestions.length) * 100;
    
    if (percent >= 80) {
        messageElement.innerText = "สุดยอดมาก! โอกาสสอบติดสูงมากครับ ✨";
    } else if (percent >= 50) {
        messageElement.innerText = "เก่งมากครับ อีกนิดเดียวจะทำคะแนนได้ดีมากแล้ว 💪";
    } else {
        messageElement.innerText = "พยายามต่อไปนะครับ ทบทวนบ่อยๆ เดี๋ยวก็เก่งครับ ✌️";
    }
}

// 7. จับเวลา
function startTimer() {
    let time = 180 * 60; // 3 ชั่วโมงตามเกณฑ์จริง
    const timerDisplay = document.getElementById('time');
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;
        timerDisplay.innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        if (time <= 0) { 
            clearInterval(timerInterval); 
            alert("หมดเวลาสอบ!");
            finishQuiz();
        }
        time--;
    }, 1000);
}

loadQuestions();
