let allQuestions = [];
let currentIndex = 0;
let score = 0;

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
        showQuestion(0);
    } else {
        alert("กรุณารอโหลดข้อสอบสักครู่...");
    }
}

// 3. แสดงโจทย์
function showQuestion(index) {
    currentIndex = index;
    const q = allQuestions[index];
    document.getElementById('question').innerText = (index + 1) + ". " + q.question;
    
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
        alert("ถูกต้องครับ! 🎉");
        score++;
    } else {
        alert("ยังไม่ถูกครับ ลองข้อถัดไปนะ");
    }
    nextQuestion();
}

function nextQuestion() {
    if (currentIndex + 1 < allQuestions.length) {
        showQuestion(currentIndex + 1);
    } else {
        alert("ทำครบทุกข้อแล้ว! คะแนนของคุณคือ: " + score);
        location.reload(); // กลับหน้าแรก
    }
}

loadQuestions();
