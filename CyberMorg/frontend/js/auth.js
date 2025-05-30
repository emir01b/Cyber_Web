document.addEventListener('DOMContentLoaded', function() {
    updateAuthButtons();
});

// Kullanıcı kimlik doğrulama işlemleri
function updateAuthButtons() {
    const authButtons = document.querySelector('.auth-buttons');
    if (!authButtons) return;
    
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (user) {
        // Kullanıcı giriş yapmışsa
        authButtons.innerHTML = `
            <div class="user-menu">
                <button class="user-button">
                    <i class="fas fa-user"></i>
                    ${user.username}
                    <i class="fas fa-chevron-down"></i>
                </button>
                <div class="dropdown-menu">
                    <a href="/profile"><i class="fas fa-user-circle"></i> Profil</a>
                    <a href="/settings"><i class="fas fa-cog"></i> Ayarlar</a>
                    <hr>
                    <a href="#" onclick="logout()"><i class="fas fa-sign-out-alt"></i> Çıkış Yap</a>
                </div>
            </div>
        `;

        const userButton = document.querySelector('.user-button');
        const dropdownMenu = document.querySelector('.dropdown-menu');

        if (userButton && dropdownMenu) {
            userButton.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdownMenu.classList.toggle('active');
            });

            document.addEventListener('click', () => {
                dropdownMenu.classList.remove('active');
            });
        }
    } else {
        // Kullanıcı giriş yapmamışsa
        authButtons.innerHTML = `
            <a href="/login" class="btn">Giriş Yap</a>
            <a href="/register" class="btn">Kayıt Ol</a>
        `;
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
}

// Mobile hamburger menü toggle fonksiyonu
function toggleMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    const hamburger = document.querySelector('.hamburger i');
    
    if (navLinks) {
        navLinks.classList.toggle('active');
        
        // Hamburger icon'u değiştir
        if (navLinks.classList.contains('active')) {
            hamburger.className = 'fas fa-times';
        } else {
            hamburger.className = 'fas fa-bars';
        }
    }
}

// Global olarak erişilebilir olması için
window.updateAuthButtons = updateAuthButtons;
window.logout = logout;
window.toggleMobileMenu = toggleMobileMenu;

// ... diğer auth fonksiyonları ... 