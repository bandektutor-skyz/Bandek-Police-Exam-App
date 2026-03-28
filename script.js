let allQuestions = [];
let currentIndex = 0;
let score = 0;

// 1. โหลดข้อมูลจากไฟล์ JSON
async function loadQuestions() {
    try {
        const response = await fetch('questions.json');
        allQuestions = await response.json();
        console.log("โหลดข้อสอบสำเร็จ:", allQuestions.length, "ข้อ");
    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการโหลด:", error);
    }
}

// 2. ฟังก์ชันเริ่มทำข้อสอบ
function startQuiz() {
    if (allQuestions.length > 0) {
        // เปลี่ยนหน้าจอด้วยวิธีที่ชัวร์ที่สุด
        document.getElementById('home-screen').classList.add('hidden');
        document.getElementById('quiz-screen').classList.remove('hidden');
        document.getElementById('quiz-screen').style.display = 'block';
        
        currentIndex = 0;
        score = 0;
        showQuestion(0);
    } else {
        alert("ขออภัย ข้อมูลข้อสอบยังโหลดไม่สำเร็จ กรุณารอสักครู่ครับ");
    }
}

// 3. แสดงคำถามและตัวเลือก
function showQuestion(index) {
    currentIndex = index;
    const q = allQuestions[index];
    
    // อัปเดตหัวข้อโจทย์และเลขข้อ
    document.getElementById('progress-text').innerText = "ข้อที่ " + (index + 1) + " / " + allQuestions.length;
    document.getElementById('question').innerText = q.question;
    
    const container = document.getElementById('options');
    container.innerHTML = ''; // ล้างตัวเลือกเก่า
    
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
    
    document.getElementById('score-text').innerText = "คะแนน: " + score;
    nextQuestion();
}

// 5. ไปข้อถัดไป
function nextQuestion() {
    if (currentIndex + 1 < allQuestions.length) {
        showQuestion(currentIndex + 1);
    } else {
        alert("ทำครบทุกข้อแล้ว! คะแนนรวมของคุณคือ: " + score + " คะแนน");
        location.reload(); // กลับหน้าหลัก
    }
}
// ฟังก์ชันย้อนกลับไปข้อก่อนหน้า
function prevQuestion() {
    if (currentIndex > 0) {
        // ลดตัวเลขลำดับข้อลง 1 แล้วสั่งให้แสดงโจทย์
        showQuestion(currentIndex - 1);
    } else {
        alert("นี่คือข้อแรกแล้วครับ ไม่สามารถย้อนกลับได้อีก");
    }
}
// เรียกใช้โหลดข้อมูลทันทีที่เปิดแอป
loadQuestions();
