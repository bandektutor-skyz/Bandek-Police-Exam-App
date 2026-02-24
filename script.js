let allQuestions = [];
let currentQuestions = [];

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

// 2. ฟังก์ชันเริ่มทำข้อสอบ (ต้องใช้ชื่อ startQuiz ให้ตรงกับที่ปุ่มเรียก)
function startQuiz(setNumber) {
    console.log("กำลังเริ่มชุดที่:", setNumber);
    currentQuestions = allQuestions.filter(q => q.set === setNumber);
    
    if (currentQuestions.length > 0) {
        // ซ่อนหน้าเมนูและแสดงหน้าทำข้อสอบ
        document.getElementById('menu-screen').classList.add('hidden');
        document.getElementById('quiz-screen').classList.remove('hidden');
        showQuestion(0);
    } else {
        alert("ขออภัย ไม่พบข้อสอบชุดที่ " + setNumber);
    }
}

// 3. ฟังก์ชันแสดงคำถาม
function showQuestion(index) {
    const q = currentQuestions[index];
    const questionText = document.getElementById('question-text');
    if (questionText) {
        questionText.innerText = q.question;
    }
    // เพิ่มเติมโค้ดส่วนแสดงตัวเลือก (Options) ตามโครงสร้างแอปของคุณ
}

// เรียกใช้งานฟังก์ชันโหลดข้อมูลทันทีที่เปิดแอป
loadQuestions();
