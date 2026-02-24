let allQuestions = [];
let currentQuestions = [];

async function loadQuestions() {
    try {
        const response = await fetch('questions.json');
        allQuestions = await response.json();
        console.log("โหลดข้อสอบสำเร็จ:", allQuestions.length, "ข้อ");
    } catch (error) {
        console.error("โหลดข้อสอบล้มเหลว:", error);
    }
}

// แก้ชื่อฟังก์ชันให้ตรงกับที่ปุ่มเรียกหา (startQuiz)
function startQuiz(setNumber) {
    currentQuestions = allQuestions.filter(q => q.set === setNumber);
    if (currentQuestions.length > 0) {
        document.getElementById('menu-screen').classList.add('hidden');
        document.getElementById('quiz-screen').classList.remove('hidden');
        showQuestion(0);
    } else {
        alert("ขออภัย ไม่พบข้อสอบในชุดที่ " + setNumber);
    }
}

function showQuestion(index) {
    const q = currentQuestions[index];
    document.getElementById('question-text').innerText = q.question;
    // ... โค้ดส่วนแสดงผลอื่น ๆ ของคุณ ...
}

loadQuestions();
