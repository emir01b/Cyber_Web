document.addEventListener('DOMContentLoaded', async function() {
    // API Base URL - Production için
    const API_BASE_URL = window.location.hostname === 'localhost' 
        ? 'http://localhost:5001' 
        : 'https://cyber-web.onrender.com';

    const newsContainer = document.getElementById('newsContainer');
    const DEFAULT_IMAGE = 'https://cdn.pixabay.com/photo/2016/11/30/20/58/programming-1873854_1280.png';
    
    // Yükleme animasyonunu göster
    newsContainer.innerHTML = `
        <div class="loading-container">
            <div class="loading-spinner"></div>
            <p>Haberler yükleniyor...</p>
        </div>
    `;

    // Auth butonlarını ve kullanıcı bilgilerini al
    const authButtons = document.querySelector('.auth-buttons');
    const user = JSON.parse(localStorage.getItem('user'));

    // Auth butonlarını güncelleyen fonksiyon
    function updateAuthButtons() {
        if (user) {
            // Kullanıcı giriş yapmışsa, kullanıcı menüsünü göster
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

            // Kullanıcı menüsü ve dropdown menüyü al
            const userButton = document.querySelector('.user-button');
            const dropdownMenu = document.querySelector('.dropdown-menu');

            // Kullanıcı butonuna tıklanınca dropdown menüyü aç/kapat
            userButton.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdownMenu.classList.toggle('active');
            });

            // Sayfada herhangi bir yere tıklanınca dropdown menüyü kapat
            document.addEventListener('click', () => {
                dropdownMenu.classList.remove('active');
            });
        } else {
            // Kullanıcı giriş yapmamışsa, giriş ve kayıt ol butonlarını göster
            authButtons.innerHTML = `
                <a href="/login" class="btn">Giriş Yap</a>
                <a href="/register" class="btn">Kayıt Ol</a>
            `;
        }
    }

    // Kullanıcı çıkış fonksiyonu
    function logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    }

    // Sayfa yüklendiğinde auth butonlarını güncelle
    updateAuthButtons();
    window.logout = logout;

    try {
        const response = await fetch(`${API_BASE_URL}/api/news`);
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.error);
        }

        const news = result.data;
        
        if (!news || news.length === 0) {
            newsContainer.innerHTML = '<p style="text-align: center; color: var(--light-text);">Henüz haber bulunmamaktadır.</p>';
            return;
        }

        // Haberleri sırayla ekle (animasyon için)
        newsContainer.innerHTML = '';
        news.forEach((item, index) => {
            setTimeout(() => {
                const newsCard = document.createElement('div');
                newsCard.className = 'news-card';
                
                const date = new Date(item.date).toLocaleDateString('tr-TR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                
                newsCard.innerHTML = `
                    <div class="news-image">
                        <img src="${item.imageUrl || DEFAULT_IMAGE}" 
                             alt="${item.title}" 
                             onerror="this.onerror=null; this.src='${DEFAULT_IMAGE}';">
                    </div>
                    <div class="news-content">
                        <h3>${item.title}</h3>
                        <p>${item.description}</p>
                        <div class="news-meta">
                            <span class="news-date">
                                <i class="fas fa-calendar-alt"></i>
                                ${date}
                            </span>
                            <span class="news-source">
                                <i class="fas fa-link"></i>
                                ${item.source}
                            </span>
                        </div>
                        <a href="${item.link}" target="_blank" class="btn">
                            <i class="fas fa-external-link-alt"></i>
                            Devamını Oku
                        </a>
                    </div>
                `;
                
                newsContainer.appendChild(newsCard);
            }, index * 100); // Her haber kartı 100ms arayla eklenecek
        });

    } catch (error) {
        console.error('Haber yükleme hatası:', error);
        newsContainer.innerHTML = '<p style="text-align: center; color: red;">Haberler yüklenirken bir hata oluştu.</p>';
    }
}); 