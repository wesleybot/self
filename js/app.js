// 初始化：預設載入 Ch1 題目
loadQuiz(1);

// 章節選單變更事件
document.getElementById('chapterSelect').addEventListener('change', function () {
  const chapter = this.value;
  loadQuiz(chapter);
});

// 主函式：載入題庫資料並渲染畫面
function loadQuiz(chapter) {
  const container = document.getElementById('quiz-container');
  container.innerHTML = '';

  fetch(`./question/quiz_ch${chapter}.json`)
    .then(response => response.json())
    .then(data => {
      const key = `Ch${chapter}`;
      const quiz = data[key];

      quiz.forEach((q, index) => {
        const qId = `q${index + 1}`;
        const optionsHtml = Object.entries(q.options).map(([key, value]) => `
          <div class="form-check">
            <input class="form-check-input" type="radio" name="${qId}" id="${qId}_${key}" value="${key}">
            <label class="form-check-label" for="${qId}_${key}">${key}. ${value}</label>
          </div>
        `).join('');

        container.innerHTML += `
          <div class="card mb-3">
            <div class="card-body">
              <h5 class="card-title">Q${index + 1}. ${q.question}</h5>
              <form>${optionsHtml}</form>
              <button class="btn btn-primary mt-2" onclick="checkAnswer('${qId}', '${q.answer}')">送出</button>
              <div id="${qId}-result" class="mt-2"></div>
            </div>
          </div>
        `;
      });
    });
}

// 檢查使用者選擇的答案是否正確
function checkAnswer(questionName, correctAnswer) {
  const selected = document.querySelector(`input[name="${questionName}"]:checked`);
  const result = document.getElementById(`${questionName}-result`);

  if (!selected) {
    result.innerHTML = '<span class="text-warning">請選擇一個答案。</span>';
    return;
  }

  if (selected.value === correctAnswer) {
    result.innerHTML = '<span class="text-success">答對了！</span>';
  } else {
    result.innerHTML = '<span class="text-danger">答錯了，正確答案是 ' + correctAnswer + '。</span>';
  }
}
