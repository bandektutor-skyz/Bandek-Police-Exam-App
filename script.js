let currentQuestionIndex = 0;
let quizData = [];
let userAnswers = []; // เก็บคำตอบที่ผู้ใช้เลือกไว้

// โหลดข้อมูลจาก JSON
fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        quizData = data;
        userAnswers = new Array(data.length).fill(null); // จองที่ว่างสำหรับคำตอบทุกข้อ
        showQuestion();
        startTimer();
    })
    .catch(error => {
        document.getElementById('quiz-container').innerHTML = '<h2>โหลดข้อมูลไม่สำเร็จ</h2>';
        console.error('Error:', error);
    });

function showQuestion() {
    const questionData = quizData[currentQuestionIndex];
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');
    const rationaleElement = document.getElementById('rationale');

    // ล้างข้อมูลเก่า
    questionElement.innerText = `${currentQuestionIndex + 1}. ${questionData.question}`;
    optionsElement.innerHTML = '';
    rationaleElement.style.display = 'none';

    // สร้างปุ่มตัวเลือก
    questionData.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.innerText = option;
        
        // ถ้าเคยตอบข้อนี้ไปแล้ว ให้ไฮไลท์ไว้
        if (userAnswers[currentQuestionIndex] === index) {
            button.style.border = "3px solid #2ecc71";
        }

        button.onclick = () => selectAnswer(index);
        optionsElement.appendChild(button);
    });

    // ซ่อนปุ่มย้อนกลับถ้าอยู่ที่ข้อแรก
    document.getElementById('prev-btn').style.visibility = (currentQuestionIndex === 0) ? 'hidden' : 'visible';
}

function selectAnswer(index) {
    userAnswers[currentQuestionIndex] = index; // บันทึกคำตอบ
    const questionData = quizData[currentQuestionIndex];
    const rationaleElement = document.getElementById('rationale');

    // แสดงเฉลย (ถ้าต้องการให้เฉลยทันที)
    rationaleElement.innerText = (index === questionData.answerIndex) ? 
        `ถูกต้อง! ${questionData.rationale}` : 
        `ผิดนะ.. คำตอบที่ถูกคือ: ${questionData.options[questionData.answerIndex]}. ${questionData.rationale}`;
    
    rationaleElement.style.display = 'block';

    // หน่วงเวลา 1.5 วินาทีแล้วไปข้อถัดไปอัตโนมัติ
    setTimeout(nextQuestion, 1500);
}

function nextQuestion() {
    if (currentQuestionIndex < quizData.length - 1) {
        currentQuestionIndex++;
        showQuestion();
    } else {
        alert("ทำครบทุกข้อแล้ว! ตรวจทานข้อที่ข้ามไปได้โดยกดปุ่มย้อนกลับ");
    }
}

function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion();
    }
}
let timeLeft = 180 * 60; // ตั้งเวลา 180 นาที (เปลี่ยนเป็นวินาที)
const timerElement = document.getElementById('time');

function startTimer() {
    const timerInterval = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;

        // แสดงผลในรูปแบบ 00:00
        timerElement.innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert("หมดเวลาสอบแล้ว!");
            // คุณสามารถเพิ่มฟังก์ชันสรุปคะแนนตรงนี้ได้
        } else {
            timeLeft--;
        }
    }, 1000);
}

// เรียกใช้ฟังก์ชันจับเวลาเมื่อโหลดข้อมูลเสร็จ
// แก้ไขในส่วน fetch(...).then(data => { ... }) เพิ่มบรรทัดนี้ลงไป:
// startTimer();
