let allQuestions = [];
let currentQuestions = [];
let currentIndex = 0;
let timerInterval;

async function loadQuestions() {
    const response = await fetch('questions.json');
    allQuestions = await response.json();
    console.log("โหลดข้อมูลสำเร็จ");
}

function startQuiz(setNumber) {
    // กรองข้อสอบเฉพาะชุดที่เลือก
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

function showQuestion() {
    const questionData = currentQuestions[currentIndex];
    // แสดงเลขชุดและเลขข้อ
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

// เรียกโหลดข้อสอบทันที
loadQuestions();

// อย่าลืมใส่ฟังก์ชัน selectAnswer, nextQuestion, startTimer ต่อท้ายตามเดิมนะครับ
