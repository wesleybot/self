if (window.location.hostname !== "a.wes1ey.ggff.net") {
    window.location.href = "/";
}
function startCountdown(duration) {
    let timer = duration, hours, minutes, seconds;
    const countdownElement = document.getElementById('countdown');
    setInterval(function () {
        hours = parseInt(timer / 3600, 10);
        minutes = parseInt((timer % 3600) / 60, 10);
        seconds = parseInt(timer % 60, 10);
        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        countdownElement.textContent = hours + ":" + minutes + ":" + seconds;
        if (--timer < 0) {
            countdownElement.textContent = "維護完成，請刷新頁面！";
        }
    }, 1000);
}
window.onload = function () {
    startCountdown(359999); // 設定99:99:99倒數（最大值）
};
