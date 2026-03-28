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
        // 1. จัดการหน้าจอ (ซ่อนเมนู / แสดงข้อสอบ)
        document.getElementById('home-screen').style.display = 'none';
        document.getElementById('quiz-screen').style.display = 'block';
        
        // 2. ลบคลาส hidden ออกเพื่อความชัวร์
        document.getElementById('home-screen').classList.add('hidden');
        document.getElementById('quiz-screen').classList.remove('hidden');

        // 3. สั่งให้เริ่มแสดงโจทย์ข้อที่ 1
        showQuestion(0);
    } else {
        alert("ไม่พบข้อสอบชุดที่ " + setNumber);
    }
} // ปิดฟังก์ชัน startQuiz

// 3. ฟังก์ชันแสดงคำถามและตัวเลือก (บรรทัด 34)
function showQuestion(index) {
    const q = currentQuestions[index];
    const questionText = document.getElementById('question');
    const optionsContainer = document.getElementById('options'); // ตรวจสอบ ID ใน index.html ว่าชื่อ 'options' หรือไม่

    if (questionText) {
        // แสดงลำดับข้อและเนื้อหาคำถาม
        questionText.innerText = (index + 1) + ". " + q.question;
    }

    if (optionsContainer) {
        optionsContainer.innerHTML = ''; // ล้างตัวเลือกเก่าออกก่อน
        
        q.options.forEach((opt, i) => {
            const btn = document.createElement('button');
            btn.innerText = opt;
            btn.className = 'option-btn'; // คลาสสำหรับตกแต่ง CSS
            // เมื่อคลิกจะเรียกฟังก์ชันเช็คคำตอบ
            btn.onclick = () => checkAnswer(i, q.answerIndex, index);
            optionsContainer.appendChild(btn);
        });
    }
}

// 4. ฟังก์ชันตรวจสอบคำตอบ
function checkAnswer(selected, correct, currentIndex) {
    if (selected === correct) {
        alert("ถูกต้องครับ! 🎉");
    } else {
        alert("ยังไม่ถูกนะครับ ลองใหม่ข้อถัดไป");
    }

    // เลื่อนไปข้อถัดไปถ้ายังไม่ครบ
    if (currentIndex + 1 < currentQuestions.length) {
        showQuestion(currentIndex + 1);
    } else {
        alert("ยินดีด้วย! คุณทำครบทุกข้อในชุดนี้แล้ว");
        // กลับไปหน้าเมนู
        document.getElementById('home-screen').classList.remove('hidden');
        document.getElementById('quiz-screen').classList.add('hidden');
    }
}

// เรียกใช้งานฟังก์ชันโหลดข้อมูลทันทีที่เปิดแอป
loadQuestions();
