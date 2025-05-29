document.addEventListener('DOMContentLoaded', async function() {
    // API Base URL - Production için
    const API_BASE_URL = window.location.hostname === 'localhost' 
        ? 'http://localhost:5001' 
        : 'https://cyber-web.onrender.com';

    const authButtons = document.querySelector('.auth-buttons');
    const educationGrid = document.getElementById('educationGrid');
    const adminPanel = document.getElementById('adminPanel');
    const addCourseBtn = document.getElementById('addCourseBtn');
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

    // Admin panelini göster/gizle
    function checkAdminStatus() {
        if (user && user.isAdmin) {
            adminPanel.style.display = 'block';
        } else {
            adminPanel.style.display = 'none';
        }
    }

    // Yeni eğitim ekle butonuna tıklandığında editör sayfasına yönlendir
    if (addCourseBtn) {
    addCourseBtn.addEventListener('click', () => {
            window.location.href = '/education/create';
        });
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
                stars += '<i class="fas fa-star" style="color: var(--primary-color);"></i>';
            } else {
                stars += '<i class="fas fa-star" style="color: rgba(0, 255, 0, 0.3);"></i>';
            }
        }
        return stars;
    }

    // Eğitimi sayfaya ekle
    function addCourseToPage(course) {
        const date = new Date(course.createdAt).toLocaleDateString('tr-TR');
        const categoryColor = getCategoryColor(course.category);
        const categoryIcon = getCategoryIcon(course.category);
        const difficultyStars = createDifficultyStars(course.difficulty || 1);
        
        // Etiketleri göster
        let tagsHTML = '';
        if (course.tags && course.tags.length > 0) {
            tagsHTML = `
                <div class="course-tags">
                    ${course.tags.slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('')}
                    ${course.tags.length > 3 ? `<span class="tag-more">+${course.tags.length - 3}</span>` : ''}
                </div>
            `;
        }
        
        const courseHTML = `
            <div class="course-card" onclick="viewCourse('${course._id}')" style="cursor: pointer;">
                <div class="course-header">
                    <div class="course-category" style="background: ${categoryColor}">
                        <i class="${categoryIcon}"></i>
                        ${course.category}
                    </div>
                    ${user && user.isAdmin ? `
                        <div class="admin-actions" onclick="event.stopPropagation();">
                            <button class="edit-course-btn" onclick="editCourse('${course._id}')" title="Eğitimi Düzenle">
                                <i class="fas fa-edit"></i>
                            </button>
                        <button class="delete-course-btn" onclick="deleteCourse('${course._id}')" title="Eğitimi Sil">
                            <i class="fas fa-trash"></i>
                        </button>
                        </div>
                    ` : ''}
                </div>
                <div class="course-content">
                    <h3>${course.title}</h3>
                    <p>${course.description}</p>
                    ${tagsHTML}
                    <div class="course-details">
                        <span><i class="fas fa-user-tie"></i> ${course.instructor}</span>
                        <span><i class="fas fa-calendar"></i> ${date}</span>
                    </div>
                    <div class="course-stats">
                        <span><i class="fas fa-eye"></i> ${course.viewCount || 0} görüntüleme</span>
                        <span class="difficulty-rating">
                            <i class="fas fa-star"></i> Zorluk: ${difficultyStars}
                        </span>
                    </div>
                </div>
            </div>
        `;
        educationGrid.insertAdjacentHTML('afterbegin', courseHTML);
    }

    // Eğitimi görüntüle
    window.viewCourse = function(courseId) {
        window.location.href = `/education/course?id=${courseId}`;
    };

    // Eğitimi düzenle
    window.editCourse = function(courseId) {
        window.location.href = `/education/edit?id=${courseId}`;
    };

    // Eğitimi sil
    window.deleteCourse = async function(courseId) {
        if (!confirm('Bu eğitimi silmek istediğinizden emin misiniz?')) {
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
                loadCourses(); // Eğitimleri yeniden yükle
                alert('Eğitim başarıyla silindi!');
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Eğitim silinirken bir hata oluştu!');
            }
        } catch (err) {
            console.error('Eğitim silme hatası:', err);
            alert('Eğitim silinirken bir hata oluştu!');
        }
    };

    // Eğitimleri yükle
    async function loadCourses() {
        try {
            educationGrid.innerHTML = '<div class="loading">Eğitimler yükleniyor...</div>';
            
            const response = await fetch(`${API_BASE_URL}/api/education/courses`);
            if (response.ok) {
                const courses = await response.json();
                educationGrid.innerHTML = '';
                
                if (courses.length === 0) {
                    educationGrid.innerHTML = '<p class="no-courses">Henüz eğitim eklenmemiş.</p>';
                } else {
                    courses.forEach(course => addCourseToPage(course));
                }
            } else {
                throw new Error('Eğitimler yüklenemedi');
            }
        } catch (err) {
            console.error('Eğitimler yüklenirken hata:', err);
            educationGrid.innerHTML = '<p class="error">Eğitimler yüklenirken bir hata oluştu.</p>';
        }
    }

    // Global logout fonksiyonu
    window.logout = logout;

    updateAuthButtons();
    checkAdminStatus();
    loadCourses();
}); 