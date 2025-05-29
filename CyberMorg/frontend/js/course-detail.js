document.addEventListener('DOMContentLoaded', async function() {
    // API Base URL - Production için
    const API_BASE_URL = window.location.hostname === 'localhost' 
        ? 'http://localhost:5001' 
        : 'https://cyber-web.onrender.com';

    const authButtons = document.querySelector('.auth-buttons');
    const user = JSON.parse(localStorage.getItem('user'));
    
    // URL'den course ID'sini al
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('id');
    
    if (!courseId) {
        showError('Geçersiz eğitim ID\'si');
        return;
    }

    // Auth buttonları güncelle
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

    // Hata mesajını göster
    function showError(message) {
        document.getElementById('loadingMessage').style.display = 'none';
        document.getElementById('errorMessage').style.display = 'block';
        document.getElementById('errorMessage').innerHTML = `
            <i class="fas fa-exclamation-triangle"></i> ${message}
        `;
    }

    // Kategori rengini belirle
    function getCategoryColor(category) {
        const colors = {
            'Temel': 'var(--success-color)',
            'Orta': 'var(--warning-color)', 
            'İleri': 'var(--primary-color)',
            'Uzman': 'var(--danger-color)'
        };
        return colors[category] || 'var(--primary-color)';
    }

    // Kategori ikonunu belirle
    function getCategoryIcon(category) {
        const icons = {
            'Temel': 'fas fa-seedling',
            'Orta': 'fas fa-leaf',
            'İleri': 'fas fa-tree',
            'Uzman': 'fas fa-crown'
        };
        return icons[category] || 'fas fa-graduation-cap';
    }

    // Zorluk yıldızlarını oluştur
    function createDifficultyStars(difficulty) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= difficulty) {
                stars += '<i class="fas fa-star star"></i>';
            } else {
                stars += '<i class="fas fa-star star empty"></i>';
            }
        }
        return `<span class="difficulty-stars">${stars}</span>`;
    }

    // Tarihi formatla
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Eğitimi yükle
    async function loadCourse() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/education/courses/${courseId}`);
            
            if (!response.ok) {
                if (response.status === 404) {
                    showError('Eğitim bulunamadı');
                } else {
                    showError('Eğitim yüklenirken bir hata oluştu');
                }
                return;
            }

            const course = await response.json();
            displayCourse(course);
            
        } catch (error) {
            console.error('Eğitim yükleme hatası:', error);
            showError('Eğitim yüklenirken bir hata oluştu');
        }
    }

    // Eğitimi görüntüle
    function displayCourse(course) {
        document.getElementById('loadingMessage').style.display = 'none';
        document.getElementById('courseContent').style.display = 'block';

        // Başlık ve açıklama
        document.title = `${course.title} - CyberMorg`;
        document.getElementById('courseTitle').textContent = course.title;
        document.getElementById('courseDescription').textContent = course.description;

        // Kategori
        const categoryElement = document.getElementById('courseCategory');
        const categoryColor = getCategoryColor(course.category);
        const categoryIcon = getCategoryIcon(course.category);
        categoryElement.innerHTML = `<i class="${categoryIcon}"></i> ${course.category}`;
        categoryElement.style.background = categoryColor;
        categoryElement.className = `course-category ${course.category.toLowerCase()}`;

        // İstatistikler
        document.querySelector('.view-count').textContent = course.viewCount || 0;
        document.querySelector('.difficulty-level').textContent = course.difficulty || 1;

        // Eğitmen ve tarih
        document.getElementById('courseInstructor').textContent = course.instructor;
        document.getElementById('publishDate').textContent = formatDate(course.createdAt);

        // Etiketler
        const tagsContainer = document.getElementById('courseTags');
        if (course.tags && course.tags.length > 0) {
            tagsContainer.innerHTML = course.tags.map(tag => 
                `<span class="tag">${tag}</span>`
            ).join('');
        } else {
            tagsContainer.style.display = 'none';
        }

        // Ana içerik
        const courseBody = document.getElementById('courseBody');
        if (course.content) {
            // HTML içeriğini güvenli şekilde render et
            courseBody.innerHTML = course.content.replace(/\n/g, '<br>');
        } else {
            courseBody.innerHTML = '<p style="color: var(--light-text); font-style: italic;">Bu eğitim için henüz içerik eklenmemiş.</p>';
        }

        // Resimler varsa ekle
        if (course.images && course.images.length > 0) {
            course.images.forEach(image => {
                const imgHTML = `
                    <figure style="margin: 2rem 0; text-align: center;">
                        <img src="${image.url}" alt="${image.caption || course.title}" 
                             style="max-width: 100%; height: auto; border-radius: 8px; border: 1px solid rgba(0, 255, 0, 0.2);">
                        ${image.caption ? `<figcaption style="margin-top: 0.5rem; color: var(--light-text); font-style: italic;">${image.caption}</figcaption>` : ''}
                    </figure>
                `;
                courseBody.innerHTML += imgHTML;
            });
        }

        // Admin panelini göster
        if (user && user.isAdmin) {
            document.getElementById('adminActions').style.display = 'flex';
            setupAdminActions(course._id);
        }
    }

    // Admin işlemlerini ayarla
    function setupAdminActions(courseId) {
        const editBtn = document.getElementById('editCourseBtn');
        const deleteBtn = document.getElementById('deleteCourseBtn');

        editBtn.addEventListener('click', () => {
            window.location.href = `/education/edit?id=${courseId}`;
        });

        deleteBtn.addEventListener('click', async () => {
            if (!confirm('Bu eğitimi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
                return;
            }

            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_BASE_URL}/api/education/courses/${courseId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    alert('Eğitim başarıyla silindi!');
                    window.location.href = '/education';
                } else {
                    const errorData = await response.json();
                    alert(errorData.message || 'Eğitim silinirken bir hata oluştu!');
                }
            } catch (error) {
                console.error('Eğitim silme hatası:', error);
                alert('Eğitim silinirken bir hata oluştu!');
            }
        });
    }

    // Global logout fonksiyonu
    window.logout = logout;

    // Sayfa yüklendiğinde çalıştır
    updateAuthButtons();
    loadCourse();
}); 