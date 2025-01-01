// Kullanıcı kimlik doğrulama işlemleri
function updateAuthButtons() {
    const authButtons = document.querySelector('.auth-buttons');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (user) {
        // ... giriş yapmış kullanıcı için butonlar ...
    } else {
        // ... giriş yapmamış kullanıcı için butonlar ...
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
}

// ... diğer auth fonksiyonları ... 