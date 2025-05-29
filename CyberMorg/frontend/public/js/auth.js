// API Base URL - Production için
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5001' 
    : 'https://cyber-web.onrender.com';

const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

loginBtn.addEventListener('click', () => {
    loginModal.style.display = 'block';
});

registerBtn.addEventListener('click', () => {
    registerModal.style.display = 'block';
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = loginForm.querySelector('[type="email"]').value;
    const password = loginForm.querySelector('[type="password"]').value;

    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (response.ok && data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            loginModal.style.display = 'none';
            window.location.reload();
        } else {
            alert(data.error || 'Giriş işlemi başarısız');
        }
    } catch (err) {
        console.error('Giriş hatası:', err);
        alert('Giriş işlemi başarısız. Lütfen tekrar deneyin.');
    }
});

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = registerForm.querySelector('[type="text"]').value;
    const email = registerForm.querySelector('[type="email"]').value;
    const password = registerForm.querySelector('[type="password"]').value;

    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();
        if (response.ok && data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            registerModal.style.display = 'none';
            window.location.reload();
        } else {
            alert(data.error || 'Kayıt işlemi başarısız');
        }
    } catch (err) {
        console.error('Kayıt hatası:', err);
        alert('Kayıt işlemi başarısız. Lütfen tekrar deneyin.');
    }
});
