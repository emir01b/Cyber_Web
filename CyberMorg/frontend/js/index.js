document.addEventListener('DOMContentLoaded', async function() {
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

    // API'den veri çekme fonksiyonu
    async function fetchData(url) {
        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error('Veri çekme hatası');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Veri çekme hatası:', error);
            return null;
        }
    }

    // Tarih formatı fonksiyonu
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Kategori rengi alma fonksiyonu
    function getCategoryColor(category) {
        const colors = {
            'Ağ Güvenliği': '#4CAF50',
            'Web Güvenliği': '#2196F3',
            'Mobil Güvenlik': '#FFC107',
            'Kriptografi': '#9C27B0',
            'Tersine Mühendislik': '#F44336',
            'Adli Bilişim': '#FF5722',
            'Sosyal Mühendislik': '#795548',
            'Temel Bilgiler': '#607D8B'
        };
        return colors[category] || '#00FF00';
    }

    // Kategori ikonu alma fonksiyonu
    function getCategoryIcon(category) {
        const icons = {
            'Ağ Güvenliği': 'fas fa-network-wired',
            'Web Güvenliği': 'fas fa-globe',
            'Mobil Güvenlik': 'fas fa-mobile-alt',
            'Kriptografi': 'fas fa-key',
            'Tersine Mühendislik': 'fas fa-microchip',
            'Adli Bilişim': 'fas fa-search',
            'Sosyal Mühendislik': 'fas fa-users',
            'Temel Bilgiler': 'fas fa-book'
        };
        return icons[category] || 'fas fa-shield-alt';
    }

    // Son haberleri yükle
    async function loadLatestNews() {
        const newsContainer = document.getElementById('latestNews');
        
        try {
            const response = await fetch('http://localhost:5001/api/news');
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error);
            }
            
            const news = result.data.slice(0, 3); // Sadece ilk 3 haberi al
            
            if (!news || news.length === 0) {
                newsContainer.innerHTML = '<p style="text-align: center; color: var(--light-text);">Henüz haber bulunmamaktadır.</p>';
                return;
            }
            
            // Haberleri temizle ve ekle
            newsContainer.innerHTML = '';
            const DEFAULT_IMAGE = 'https://cdn.pixabay.com/photo/2016/11/30/20/58/programming-1873854_1280.png';
            
            news.forEach(item => {
                const date = formatDate(item.date);
                
                const newsCard = document.createElement('div');
                newsCard.className = 'news-card';
                newsCard.addEventListener('click', () => window.open(item.link, '_blank'));
                newsCard.style.cursor = 'pointer';
                
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
                    </div>
                `;
                
                newsContainer.appendChild(newsCard);
            });
            
        } catch (error) {
            console.error('Haber yükleme hatası:', error);
            newsContainer.innerHTML = '<p style="text-align: center; color: red;">Haberler yüklenirken bir hata oluştu.</p>';
        }
        
        // Haber sayısını güncelle
        updateNewsCount();
    }

    // Son forum konularını yükle
    async function loadLatestTopics() {
        const topicsContainer = document.getElementById('latestTopics');
        
        try {
            const response = await fetch('http://localhost:5001/api/forum/topics');
            
            if (!response.ok) {
                throw new Error('Forum konuları yüklenemedi');
            }
            
            const topics = await response.json();
            const latestTopics = topics.slice(0, 3); // Sadece ilk 3 konuyu al
            
            if (latestTopics.length === 0) {
                topicsContainer.innerHTML = '<p style="text-align: center; color: var(--light-text);">Henüz forum konusu bulunmamaktadır.</p>';
                return;
            }
            
            // Konuları temizle ve ekle
            topicsContainer.innerHTML = '';
            
            latestTopics.forEach(topic => {
                const date = formatDate(topic.createdAt);
                const commentCount = topic.commentCount || 0;
                
                const topicCard = document.createElement('div');
                topicCard.className = 'topic-card';
                topicCard.addEventListener('click', () => window.location.href = `/topic-detail?id=${topic._id}`);
                
                topicCard.innerHTML = `
                    <div class="topic-title">${topic.title}</div>
                    <div class="topic-content">${topic.content.length > 150 ? topic.content.substring(0, 150) + '...' : topic.content}</div>
                    <div class="topic-footer">
                        <span><i class="fas fa-user"></i> ${topic.author}</span>
                        <span><i class="fas fa-calendar-alt"></i> ${date}</span>
                        <span><i class="fas fa-comments"></i> ${commentCount}</span>
                    </div>
                `;
                
                topicsContainer.appendChild(topicCard);
            });
            
        } catch (error) {
            console.error('Forum konuları yükleme hatası:', error);
            topicsContainer.innerHTML = '<p style="text-align: center; color: red;">Forum konuları yüklenirken bir hata oluştu.</p>';
        }
        
        // Forum konusu sayısını güncelle
        updateForumCount();
    }

    // Popüler eğitimleri yükle
    async function loadPopularCourses() {
        const coursesContainer = document.getElementById('popularCourses');
        
        try {
            const response = await fetch('http://localhost:5001/api/education/courses');
            
            if (!response.ok) {
                throw new Error('Eğitimler yüklenemedi');
            }
            
            const courses = await response.json();
            
            // Görüntülenme sayısına göre sırala ve ilk 3'ü al
            const popularCourses = courses
                .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
                .slice(0, 3);
            
            if (popularCourses.length === 0) {
                coursesContainer.innerHTML = '<p style="text-align: center; color: var(--light-text);">Henüz eğitim bulunmamaktadır.</p>';
                return;
            }
            
            // Eğitimleri temizle ve ekle
            coursesContainer.innerHTML = '';
            
            popularCourses.forEach(course => {
                const courseCard = document.createElement('div');
                courseCard.className = 'course-card';
                courseCard.addEventListener('click', () => window.location.href = `/course-detail?id=${course._id}`);
                
                const categoryColor = getCategoryColor(course.category);
                const categoryIcon = getCategoryIcon(course.category);
                
                courseCard.innerHTML = `
                    <div class="course-header">
                        <div class="course-title">${course.title}</div>
                        <div class="course-category" style="background: ${categoryColor}">
                            <i class="${categoryIcon}"></i> ${course.category}
                        </div>
                    </div>
                    <div class="course-body">
                        <div class="course-description">${course.description}</div>
                    </div>
                    <div class="course-footer">
                        <div class="course-meta">
                            <span><i class="fas fa-user"></i> ${course.instructor}</span>
                            <span><i class="fas fa-eye"></i> ${course.viewCount || 0}</span>
                        </div>
                    </div>
                `;
                
                coursesContainer.appendChild(courseCard);
            });
            
        } catch (error) {
            console.error('Eğitimler yükleme hatası:', error);
            coursesContainer.innerHTML = '<p style="text-align: center; color: red;">Eğitimler yüklenirken bir hata oluştu.</p>';
        }
        
        // Eğitim sayısını güncelle
        updateCourseCount();
    }

    // İstatistikleri güncelle
    // Kullanıcı sayısı
    async function updateUserCount() {
        try {
            const response = await fetch('http://localhost:5001/api/auth/count');
            
            if (!response.ok) {
                throw new Error('Kullanıcı sayısı alınamadı');
            }
            
            const data = await response.json();
            document.getElementById('userCount').textContent = data.count;
        } catch (error) {
            console.error('Kullanıcı sayısı güncelleme hatası:', error);
            document.getElementById('userCount').textContent = '0';
        }
    }

    // Haber sayısı
    async function updateNewsCount() {
        try {
            const response = await fetch('http://localhost:5001/api/news');
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error);
            }
            
            document.getElementById('newsCount').textContent = result.data.length;
        } catch (error) {
            console.error('Haber sayısı güncelleme hatası:', error);
            document.getElementById('newsCount').textContent = '0';
        }
    }

    // Forum konusu sayısı
    async function updateForumCount() {
        try {
            const response = await fetch('http://localhost:5001/api/forum/topics');
            
            if (!response.ok) {
                throw new Error('Forum konuları yüklenemedi');
            }
            
            const topics = await response.json();
            document.getElementById('forumCount').textContent = topics.length;
        } catch (error) {
            console.error('Forum sayısı güncelleme hatası:', error);
            document.getElementById('forumCount').textContent = '0';
        }
    }

    // Eğitim sayısı
    async function updateCourseCount() {
        try {
            const response = await fetch('http://localhost:5001/api/education/courses');
            
            if (!response.ok) {
                throw new Error('Eğitimler yüklenemedi');
            }
            
            const courses = await response.json();
            document.getElementById('courseCount').textContent = courses.length;
        } catch (error) {
            console.error('Eğitim sayısı güncelleme hatası:', error);
            document.getElementById('courseCount').textContent = '0';
        }
    }

    // İstatistikleri animasyonlu göster
    function animateStats() {
        const stats = document.querySelectorAll('.stat-card h3');
        
        stats.forEach(stat => {
            const targetValue = parseInt(stat.textContent);
            let currentValue = 0;
            const duration = 1500;
            const steps = 50;
            const increment = targetValue / steps;
            const interval = duration / steps;
            
            const counter = setInterval(() => {
                currentValue += increment;
                
                if (currentValue >= targetValue) {
                    stat.textContent = targetValue;
                    clearInterval(counter);
                } else {
                    stat.textContent = Math.floor(currentValue);
                }
            }, interval);
        });
    }

    // Sayfa yüklendiğinde çalıştır
    updateAuthButtons();
    window.logout = logout;
    
    // İçerikleri yükle
    await Promise.all([
        loadLatestNews(),
        loadLatestTopics(),
        loadPopularCourses(),
        updateUserCount()
    ]);
    
    // İstatistikleri animasyonla göster
    setTimeout(animateStats, 500);
}); 