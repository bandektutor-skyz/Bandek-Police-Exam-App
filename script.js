let questions = [];
let currentIndex = 0;
let score = 0;

async function loadQuestions() {
    try {
        const response = await fetch('questions.json');
        questions = await response.json();
        showQuestion();
    } catch (error) {
        document.getElementById('question').innerText = "โหลดข้อมูลไม่สำเร็จ";
    }
}

function showQuestion() {
    const q = questions[currentIndex];
    document.getElementById('question').innerText = `ข้อที่ ${currentIndex + 1}: ${q.question}`;
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';
    document.getElementById('rationale').style.display = 'none';
    document.getElementById('next-btn').style.display = 'none';

    q.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(i);
        optionsDiv.appendChild(btn);
    });
}

function checkAnswer(i) {
    const q = questions[currentIndex];
    const ratDiv = document.getElementById('rationale');
    if (i === q.answerIndex) {
        score++;
        ratDiv.innerHTML = `<b style="color:green">ถูกต้อง!</b><br>${q.rationale}`;
    } else {
        ratDiv.innerHTML = `<b style="color:red">ผิด! คำตอบคือ: ${q.options[q.answerIndex]}</b><br>${q.rationale}`;
    }
    ratDiv.style.display = 'block';
    document.getElementById('next-btn').style.display = 'block';
}

document.getElementById('next-btn').onclick = () => {
    currentIndex++;
    if (currentIndex < questions.length) {
        showQuestion();
    } else {
        document.getElementById('quiz-container').innerHTML = `<h2>จบการสอบ! คะแนนของคุณ: ${score}/${questions.length}</h2><button onclick="location.reload()">เริ่มใหม่</button>`;
    }
};

loadQuestions();
