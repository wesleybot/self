/* --------- 票速通 ‧ 會員專區腳本 --------- */

/* Back-to-top 按鈕 */
const backBtn = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  window.scrollY > 400 ? backBtn.classList.add('show') : backBtn.classList.remove('show');
});
backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* 登入保護邏輯（5 分鐘有效） */
const PASSWORD_HASH = '0e332dc6d6c545d9b249056afe514fe8236ed2875723247a1b7a0a0665f786a0';
const EXP_KEY = 'ps_auth_exp';
const EXP_MINUTES = 5;

const loginBox = document.getElementById('loginBox');
const protectedContent = document.getElementById('protectedContent');

/* 載入時先檢查 localStorage 是否仍有效 */
(function initAuth() {
  const exp = localStorage.getItem(EXP_KEY);
  if (exp && Date.now() < Number(exp)) {
    showProtected();
  } else {
    localStorage.removeItem(EXP_KEY);
  }
})();

/* 檢查密碼 */
function checkPassword() {
  const input = document.getElementById('passwordInput').value.trim();
  const hash = CryptoJS.SHA256(input).toString();
  if (hash === PASSWORD_HASH) {
    localStorage.setItem(EXP_KEY, Date.now() + EXP_MINUTES * 60 * 1000);
    showProtected();
  } else {
    alert('密碼錯誤，請再試一次');
  }
}

/* 顯示受保護內容 */
function showProtected() {
  loginBox.style.display = 'none';
  protectedContent.style.display = 'block';
  backBtn.classList.remove('show');
  window.scrollTo({ top: 0 });
}
