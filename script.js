let allQuestions = [];      // เก็บข้อสอบทั้งหมดจากไฟล์ JSON
let currentQuestions = [];  // เก็บข้อสอบเฉพาะชุดที่เลือก (เช่น ชุดที่ 1)
let currentIndex = 0;
let timerInterval;

// 1. โหลดข้อสอบทั้งหมดเตรียมไว้ก่อน
async function loadQuestions() {
    try {
        const response = await fetch('questions.json');
        allQuestions = await response.json();
        console.log("โหลดข้อสอบสำเร็จ");
    } catch (error) {
        console.error("โหลดข้อสอบไม่สำเร็จ:", error);
    }
}

// 2. ฟังก์ชันเริ่มทำข้อสอบตามชุดที่เลือก
function startQuiz(setNumber) {
    // ใช้ filter กรองข้อสอบที่มีเลขชุดตรงกับที่กดเลือก
    currentQuestions = allQuestions.filter(q => q.set === setNumber);

    if (currentQuestions.length > 0) {
        currentIndex = 0;
        // ซ่อนหน้าเมนู และแสดงหน้าทำข้อสอบ
        document.getElementById('menu-container').style.display = 'none';
        document.getElementById('quiz-content').style.display = 'block';
        document.getElementById('timer-container').style.display = 'block';
        
        showQuestion();
        startTimer();
    } else {
        alert("ขออภัย! ยังไม่มีข้อมูลข้อสอบชุดที่ " + setNumber);
    }
}

// 3. ฟังก์ชันแสดงโจทย์ (ปรับจากของเดิมเล็กน้อย)
function showQuestion() {
    const questionData = currentQuestions[currentIndex];
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');
    const rationaleElement = document.getElementById('rationale');

    // แสดงโจทย์และลำดับข้อ
    questionElement.innerText = `ข้อที่ ${currentIndex + 1}: ${questionData.question}`;
    optionsElement.innerHTML = '';
    rationaleElement.style.display = 'none';
    rationaleElement.innerText = questionData.rationale;

    // สร้างปุ่มตัวเลือก
    questionData.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.innerText = option;
        button.classList.add('option-btn');
        button.onclick = () => selectAnswer(index);
        optionsElement.appendChild(button);
    });
}

// 4. ฟังก์ชันเลือกคำตอบ (คงเดิมจากที่คุณมี)
function selectAnswer(selectedIndex) {
    const questionData = currentQuestions[currentIndex];
    const buttons = document.querySelectorAll('.option-btn');
    const rationaleElement = document.getElementById('rationale');

    buttons.forEach((btn, index) => {
        btn.disabled = true; // ห้ามกดซ้ำ
        if (index === questionData.answer) {
            btn.classList.add('correct'); // สีเขียว
        } else if (index === selectedIndex) {
            btn.classList.add('incorrect'); // สีแดง
        }
    });

    rationaleElement.style.display = 'block'; // แสดงเฉลย
}

// 5. ฟังก์ชันเปลี่ยนข้อ
function nextQuestion() {
    if (currentIndex < currentQuestions.length - 1) {
        currentIndex++;
        showQuestion();
    } else {
        alert("คุณทำครบทุกข้อในชุดนี้แล้ว!");
    }
}

function prevQuestion() {
    if (currentIndex > 0) {
        currentIndex--;
        showQuestion();
    }
}

// 6. ระบบจับเวลา 180 นาที (คงเดิม)
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

// เรียกโหลดข้อสอบทันทีที่เปิดเว็บ
loadQuestions();
