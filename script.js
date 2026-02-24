let allQuestions = []; // เก็บข้อสอบทั้งหมด 150 ข้อ
let currentQuestions = []; // เก็บข้อสอบเฉพาะชุดที่เลือก

// 1. ฟังก์ชันดึงข้อมูลจากไฟล์ JSON
async function loadQuestions() {
    try {
        const response = await fetch('questions.json'); // ตรวจสอบชื่อไฟล์ให้ตรง
        allQuestions = await response.json();
        console.log("โหลดข้อสอบสำเร็จ:", allQuestions.length, "ข้อ");
    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการโหลดข้อสอบ:", error);
    }
}

// 2. ฟังก์ชันเลือกชุดข้อสอบ (Set)
function selectSet(setNumber) {
    // กรองข้อสอบตามเลขชุดที่เลือก
    currentQuestions = allQuestions.filter(q => q.set === setNumber);
    
    if (currentQuestions.length > 0) {
        // ถ้ามีข้อสอบ ให้ย้ายไปหน้าทำข้อสอบ
        document.getElementById('menu-screen').classList.add('hidden');
        document.getElementById('quiz-screen').classList.remove('hidden');
        showQuestion(0); // เริ่มที่ข้อแรก
        startTimer(); // เริ่มจับเวลา
    } else {
        alert("ขออภัย ไม่พบข้อสอบในชุดนี้");
    }
}

// เรียกใช้ฟังก์ชันโหลดข้อมูลเมื่อเปิดหน้าเว็บ
loadQuestions();
