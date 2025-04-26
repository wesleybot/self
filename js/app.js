// js/app.js

// --- 新增：允許登入的使用者名稱 ---
const ALLOWED_USERS = ["Alice", "Bob"];

// DOM 取用
const loginScreen     = document.getElementById('login-screen');
const usernameInput   = document.getElementById('username-input');
const loginBtn        = document.getElementById('login-btn');
const loginErrorP     = document.getElementById('login-error');
const categoryDiv     = document.getElementById('category-select');
const categoriesContainer = document.getElementById('categories');
const quizDiv         = document.getElementById('quiz');
const quizScreen      = document.getElementById('quiz-screen');
const resultScreen    = document.getElementById('result-screen');
const questionDiv     = document.getElementById('question');
const questionImageDiv= document.getElementById('question-image');
const optionsDiv      = document.getElementById('options');
const prevBtn         = document.getElementById('prev-btn');
const nextBtn         = document.getElementById('next-btn');
const homeBtn         = document.getElementById('home-btn');
const home2Btn        = document.getElementById('home2-btn');
const finalScoreP     = document.getElementById('final-score');
const reviewBtn       = document.getElementById('review-btn');
const againBtn        = document.getElementById('again-btn');
const reviewDiv       = document.getElementById('review');

let questions = [], current = 0, score = 0, currentCategory = null;
const userAnswers = [];

// --- 1. 處理登入 ---
loginBtn.onclick = () => {
  const name = usernameInput.value.trim();
  if (ALLOWED_USERS.includes(name)) {
    // 登入成功
    loginScreen.style.display    = 'none';
    categoryDiv.style.display    = 'block';
    buildCategoryButtons();
  } else {
    loginErrorP.style.display = 'block';
  }
};

// 產生類別按鈕（登入成功後才呼叫一次）
function buildCategoryButtons() {
  const totalCategories = 6;
  for (let i = 1; i <= totalCategories; i++) {
    const btn = document.createElement('button');
    btn.textContent = `${i} 類練習`;
    btn.onclick = () => loadCategory(i);
    categoriesContainer.appendChild(btn);
  }
}

// 回到主頁（類別選單）
homeBtn.onclick = () => {
  quizDiv.style.display     = 'none';
  resultScreen.style.display= 'none';
  categoryDiv.style.display = 'block';
};
home2Btn.onclick = homeBtn.onclick;

// 上／下一題
prevBtn.onclick = () => {
  if (current > 0) {
    current--;
    renderQuestion();
  }
};
nextBtn.onclick = () => {
  if (userAnswers[current] == null) return;
  if (current < questions.length - 1) {
    current++;
    renderQuestion();
  } else {
    showResults();
  }
};

// 檢視回顧 & 重做本類
reviewBtn.onclick = renderReview;
againBtn.onclick  = () => loadCategory(currentCategory);

// 載入分類
async function loadCategory(n) {
  currentCategory = n;
  categoryDiv.style.display    = 'none';
  quizDiv.style.display        = 'block';
  quizScreen.style.display     = 'block';
  resultScreen.style.display   = 'none';

  current = 0;
  score = 0;
  userAnswers.length = 0;

  const res = await fetch(`questions_${n}.json`);
  questions = await res.json();

  renderQuestion();
}

// 顯示題目
function renderQuestion() {
  const q = questions[current];
  questionDiv.innerHTML = `<h3>第 ${current+1} 題（共 ${questions.length} 題）</h3><p>${q.question}</p>`;

  questionImageDiv.innerHTML = q.image
    ? `<img src="${q.image}" alt="題目圖片" style="max-width:100%; margin:8px 0;">`
    : '';

  optionsDiv.innerHTML = '';
  for (const [key,opt] of Object.entries(q.options)) {
    let txt = '', img = '';
    if (typeof opt === 'string') {
      txt = opt;
    } else {
      txt = opt.text||'';
      if (opt.image) img = `<img src="${opt.image}" alt="選項${key}">`;
    }
    const d = document.createElement('div');
    d.className = 'option';
    d.innerHTML = `${img}<span>(${key}) ${txt}</span>`;
    d.onclick = () => {
      userAnswers[current] = key;
      markAnswers();
      nextBtn.style.display = 'inline-block';
    };
    optionsDiv.appendChild(d);
  }

  prevBtn.style.display = current>0               ? 'inline-block':'none';
  nextBtn.style.display = userAnswers[current]!=null ? 'inline-block':'none';

  if (userAnswers[current]!=null) markAnswers();
}

// 標示正誤
function markAnswers() {
  const correct = questions[current].answer;
  Array.from(optionsDiv.children).forEach(o => {
    o.classList.remove('correct','incorrect');
    const k = o.textContent.trim().charAt(1);
    if (k===correct)      o.classList.add('correct');
    else if (k===userAnswers[current]) o.classList.add('incorrect');
  });
}

// 顯示結果
function showResults() {
  quizScreen.style.display   = 'none';
  resultScreen.style.display = 'block';

  score = userAnswers.reduce((sum,ans,i)=>
    sum + (ans===questions[i].answer?5:0)
  ,0);
  finalScoreP.textContent = `你總共得了 ${score} 分（滿分 ${questions.length*5} 分）`;
}

// 回顧列表
function renderReview() {
  reviewDiv.innerHTML = questions.map((q,i)=>{
    const your = userAnswers[i]||'無';
    return `
      <div style="margin:0.5em 0; padding:0.5em; border-bottom:1px solid #ccc">
        <strong>第 ${i+1} 題：</strong>${q.question}<br>
        正確答案：(${q.answer})，你的答案：(${your})
      </div>`;
  }).join('');
}
