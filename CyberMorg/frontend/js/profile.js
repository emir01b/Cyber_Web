document.addEventListener('DOMContentLoaded', function() {
    // Kullanıcı giriş yapmadıysa anasayfaya yönlendir
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user) {
        window.location.href = '/login';
        return;
    }
    
    // Kullanıcı bilgilerini göster
    const usernameElement = document.getElementById('username');
    const emailElement = document.getElementById('email');
    const memberSinceElement = document.getElementById('memberSince');
    const lastLoginElement = document.getElementById('lastLogin');
    
    if (usernameElement) usernameElement.textContent = user.username;
    if (emailElement) emailElement.textContent = user.email;
    
    // Günün tarihini göster (gerçek bir sistemde, kullanıcının kaydolma tarihi veritabanından alınmalıdır)
    const today = new Date();
    if (memberSinceElement) {
        memberSinceElement.textContent = today.toLocaleDateString('tr-TR', {
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
        });
    }
    
    if (lastLoginElement) {
        lastLoginElement.textContent = today.toLocaleDateString('tr-TR', {
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
        }) + ' ' + today.toLocaleTimeString('tr-TR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    // Şifre değiştirme butonu için olay dinleyici
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', function() {
            alert('Şifre değiştirme özelliği henüz eklenmedi.');
        });
    }
    
    // Kimlik doğrulama butonlarını güncelle
    updateAuthButtons();
}); 