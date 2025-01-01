document.addEventListener('DOMContentLoaded', function() {
    const authButtons = document.querySelector('.auth-buttons');
    const user = JSON.parse(localStorage.getItem('user'));

    function updateAuthButtons() {
        if (user) {
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

            userButton.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdownMenu.classList.toggle('active');
            });

            document.addEventListener('click', () => {
                dropdownMenu.classList.remove('active');
            });
        } else {
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

    updateAuthButtons();
    window.logout = logout;
}); 