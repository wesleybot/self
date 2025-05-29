const expectedHash = "b1713e2e7cc7c2e56cb6f585c3a8993987860ef3c93d8f9f99bcc94898c75749";

window.checkPassword = async function () {
    const input = document.getElementById("passwordInput").value;
    const hash = await sha256(input);
    const message = document.getElementById("message");

    if (hash === expectedHash) {
        localStorage.setItem("eco_pass", "true");
        window.location.href = "eco_quiz.html";
    } else {
        message.innerHTML = '<span class="text-danger">通關密語錯誤，請再試一次。</span>';
    }
};

async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");
}
