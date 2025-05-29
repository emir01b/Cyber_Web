document.addEventListener('DOMContentLoaded', async function() {
    // API Base URL - Production için
    const API_BASE_URL = window.location.hostname === 'localhost' 
        ? 'http://localhost:5001' 
        : 'https://cyber-web.onrender.com';

    const authButtons = document.querySelector('.auth-buttons');
    const user = JSON.parse(localStorage.getItem('user'));
    
    // Admin kontrolü
    if (!user || !user.isAdmin) {
        alert('Bu sayfaya erişim yetkiniz yok!');
        window.location.href = '/education';
        return;
    }
    
    // URL'den ID al (düzenleme modunda)
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('id');
    const isEditing = !!courseId;
    
    // Sayfa başlığını güncelle
    if (isEditing) {
        document.getElementById('editorTitle').innerHTML = '<i class="fas fa-edit"></i> Eğitimi Düzenle';
        document.title = 'Eğitimi Düzenle - CyberMorg';
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

    // Form elemanları
    const form = document.getElementById('courseEditorForm');
    const titleInput = document.getElementById('courseTitle');
    const descriptionInput = document.getElementById('courseDescription');
    const categorySelect = document.getElementById('courseCategory');
    const instructorInput = document.getElementById('courseInstructor');
    const difficultySelect = document.getElementById('courseDifficulty');
    const tagsInput = document.getElementById('courseTags');
    const contentEditor = document.getElementById('contentEditor');
    const imageUrlInput = document.getElementById('imageUrl');
    const imageCaptionInput = document.getElementById('imageCaption');
    const imageList = document.getElementById('imageList');
    const previewArea = document.getElementById('previewArea');
    
    // File input elemanları
    const imageFileInput = document.getElementById('imageFileInput');
    const galleryFileInput = document.getElementById('galleryFileInput');
    const selectFileBtn = document.getElementById('selectFileBtn');
    const insertImageBtn = document.getElementById('insertImageBtn');
    
    // Modal elemanları
    const imageUploadModal = document.getElementById('imageUploadModal');
    const modalFileInput = document.getElementById('modalFileInput');
    const modalSelectBtn = document.getElementById('modalSelectBtn');
    const modalDropZone = document.getElementById('modalDropZone');
    const closeModal = document.getElementById('closeModal');
    const cancelUpload = document.getElementById('cancelUpload');
    const uploadProgress = document.getElementById('uploadProgress');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    // Resim ayarları elemanları
    const imageSettings = document.getElementById('imageSettings');
    const imagePreview = document.getElementById('imagePreview');
    const insertImageToEditorBtn = document.getElementById('insertImageToEditor');
    
    let courseImages = [];
    let currentImageUrl = '';
    let currentImageSettings = {
        size: 'medium',
        align: 'center',
        float: 'none'
    };

    // File Upload Functions
    async function uploadImageFile(file) {
        const formData = new FormData();
        formData.append('image', file);
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/upload/image`, {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                const result = await response.json();
                return result.imageUrl;
            } else {
                throw new Error('Upload failed');
            }
        } catch (error) {
            console.error('Upload error:', error);
            throw error;
        }
    }

    // Progress bar güncelleme
    function updateProgress(percent) {
        progressFill.style.width = `${percent}%`;
        progressText.textContent = `Yükleniyor... ${percent}%`;
    }

    // Modal'ı aç
    function openImageModal() {
        imageUploadModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        // Sıfırlama
        modalDropZone.style.display = 'block';
        uploadProgress.style.display = 'none';
        imageSettings.style.display = 'none';
        insertImageToEditorBtn.style.display = 'none';
        resetImageSettings();
    }

    // Modal'ı kapat
    function closeImageModal() {
        imageUploadModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        uploadProgress.style.display = 'none';
        modalDropZone.style.display = 'block';
        imageSettings.style.display = 'none';
        insertImageToEditorBtn.style.display = 'none';
        updateProgress(0);
        currentImageUrl = '';
    }
    
    // Resim ayarlarını sıfırla
    function resetImageSettings() {
        currentImageSettings = {
            size: 'medium',
            align: 'center',
            float: 'none'
        };
        
        // Tüm butonları sıfırla
        document.querySelectorAll('.size-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.size === 'medium');
        });
        
        document.querySelectorAll('.align-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.align === 'center');
        });
        
        document.querySelectorAll('.float-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.float === 'none');
        });
    }
    
    // Resim ayarlarını göster
    function showImageSettings(imageUrl) {
        currentImageUrl = imageUrl;
        modalDropZone.style.display = 'none';
        uploadProgress.style.display = 'none';
        imageSettings.style.display = 'block';
        insertImageToEditorBtn.style.display = 'inline-block';
        
        // Resim önizleme
        imagePreview.src = imageUrl;
    }

    // Editöre resim ekle
    function insertImageToEditor(imageUrl) {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        
        // İmleç konumunu kaydet
        const savedRange = range.cloneRange();
        
        // Float yerine flex kullanımını belirle
        const useFlexContainer = currentImageSettings.float !== 'none';
        
        if (useFlexContainer) {
            // Flex container yaklaşımı - metin akışını bozmaz
            const flexContainer = document.createElement('div');
            flexContainer.className = 'image-text-container';
            
            // Text right (resim solda) veya text left (resim sağda)
            if (currentImageSettings.float === 'left') {
                flexContainer.classList.add('text-right'); // Resim sol, metin sağ
            } else {
                flexContainer.classList.add('text-left'); // Resim sağ, metin sol
            }
            
            // Resim container
            const imageContainer = document.createElement('div');
            imageContainer.className = 'image-container';
            
            // Resim elementi
            const img = document.createElement('img');
            img.src = imageUrl;
            img.classList.add(`img-${currentImageSettings.size}`);
            img.style.borderRadius = '8px';
            img.style.border = '1px solid rgba(0, 255, 0, 0.2)';
            
            // Silme butonu
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'image-delete-btn';
            deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
            deleteBtn.onclick = () => flexContainer.remove();
            
            // Metin container - boş bırakılır, kullanıcı buraya metin girecek
            const textContainer = document.createElement('div');
            textContainer.className = 'text-container';
            textContainer.setAttribute('contenteditable', 'true');
            textContainer.innerHTML = '<p>Buraya metin yazabilirsiniz...</p>';
            
            // Elementleri yerleştir
            imageContainer.appendChild(img);
            imageContainer.appendChild(deleteBtn);
            flexContainer.appendChild(imageContainer);
            flexContainer.appendChild(textContainer);
            
            // Flex container'ı içeriğe ekle
            range.deleteContents();
            range.insertNode(flexContainer);
            
            // İmleci metin alanına odakla
            const textRange = document.createRange();
            const textNode = textContainer.querySelector('p').firstChild;
            textRange.setStart(textNode, 0);
            textRange.setEnd(textNode, textNode.length);
            selection.removeAllRanges();
            selection.addRange(textRange);
            
        } else {
            // Normal resim ekleme - hizalama ile
            const imageWrapper = document.createElement('span');
            imageWrapper.className = `image-wrapper align-${currentImageSettings.align}`;
            
            // Resim elementi
            const img = document.createElement('img');
            img.src = imageUrl;
            img.classList.add(`img-${currentImageSettings.size}`);
            img.style.borderRadius = '8px';
            img.style.border = '1px solid rgba(0, 255, 0, 0.2)';
            
            // Silme butonu
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'image-delete-btn';
            deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
            deleteBtn.onclick = () => imageWrapper.remove();
            
            // Elementleri birleştir
            imageWrapper.appendChild(img);
            imageWrapper.appendChild(deleteBtn);
            
            // Resmi içeriğe ekle
            range.deleteContents();
            range.insertNode(imageWrapper);
            
            // İmleci resimden sonraya taşı
            savedRange.setStartAfter(imageWrapper);
            savedRange.setEndAfter(imageWrapper);
            selection.removeAllRanges();
            selection.addRange(savedRange);
        }
        
        // Editöre odaklan
        contentEditor.focus();
    }

    // Editör toolbar'ında resim ekleme butonu
    insertImageBtn.addEventListener('click', () => {
        openImageModal();
    });

    // Modal dosya seçme
    modalSelectBtn.addEventListener('click', () => {
        modalFileInput.click();
    });

    modalFileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
            await handleFileUpload(file);
        }
    });
    
    // İmaj ayar butonları için event listener'lar
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentImageSettings.size = btn.dataset.size;
        });
    });
    
    document.querySelectorAll('.align-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.align-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentImageSettings.align = btn.dataset.align;
        });
    });
    
    document.querySelectorAll('.float-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.float-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentImageSettings.float = btn.dataset.float;
        });
    });
    
    // İmaj ekleme butonu
    insertImageToEditorBtn.addEventListener('click', () => {
        if (currentImageUrl) {
            insertImageToEditor(currentImageUrl);
            closeImageModal();
        }
    });

    // Modal kapatma
    closeModal.addEventListener('click', closeImageModal);
    cancelUpload.addEventListener('click', closeImageModal);

    // Modal dışına tıklayınca kapat
    imageUploadModal.addEventListener('click', (e) => {
        if (e.target === imageUploadModal) {
            closeImageModal();
        }
    });

    // File upload işlemi
    async function handleFileUpload(file) {
        if (!file || !file.type.startsWith('image/')) {
            alert('Lütfen geçerli bir resim dosyası seçin!');
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) {
            alert('Dosya boyutu 5MB\'dan küçük olmalıdır!');
            return;
        }
        
        modalDropZone.style.display = 'none';
        uploadProgress.style.display = 'block';
        
        try {
            // Simulated progress
            for (let i = 0; i <= 90; i += 10) {
                updateProgress(i);
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            const imageUrl = await uploadImageFile(file);
            updateProgress(100);
            
            // Resim yükleme tamamlandıktan sonra ayarları göster
            setTimeout(() => {
                showImageSettings(imageUrl);
            }, 500);
            
        } catch (error) {
            console.error('Upload error:', error);
            alert('Resim yüklenirken bir hata oluştu!');
            closeImageModal();
        }
    }

    // Drag and Drop - Modal
    modalDropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        modalDropZone.classList.add('drag-over');
    });

    modalDropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        modalDropZone.classList.remove('drag-over');
    });

    modalDropZone.addEventListener('drop', async (e) => {
        e.preventDefault();
        modalDropZone.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            await handleFileUpload(files[0]);
        }
    });

    // Galeri için file upload
    selectFileBtn.addEventListener('click', () => {
        galleryFileInput.click();
    });

    galleryFileInput.addEventListener('change', async (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            await handleGalleryUpload(files);
        }
    });

    // Galeri dosya upload işlemi
    async function handleGalleryUpload(files) {
        for (const file of files) {
            if (!file.type.startsWith('image/')) {
                alert(`${file.name} geçerli bir resim dosyası değil!`);
                continue;
            }
            
            if (file.size > 5 * 1024 * 1024) {
                alert(`${file.name} dosyası 5MB'dan büyük!`);
                continue;
            }
            
            try {
                const imageUrl = await uploadImageFile(file);
                addImageToGallery(imageUrl, file.name);
            } catch (error) {
                console.error('Gallery upload error:', error);
                alert(`${file.name} yüklenirken bir hata oluştu!`);
            }
        }
        
        // Input'u temizle
        galleryFileInput.value = '';
    }

    // Galeri için drag and drop
    const fileUploadBox = document.querySelector('.file-upload-box');
    
    fileUploadBox.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileUploadBox.classList.add('drag-over');
    });

    fileUploadBox.addEventListener('dragleave', (e) => {
        e.preventDefault();
        fileUploadBox.classList.remove('drag-over');
    });

    fileUploadBox.addEventListener('drop', async (e) => {
        e.preventDefault();
        fileUploadBox.classList.remove('drag-over');
        
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            await handleGalleryUpload(files);
        }
    });

    // Rich Text Editor Toolbar
    const toolbar = document.querySelector('.editor-toolbar');
    toolbar.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
            e.preventDefault();
            const button = e.target.tagName === 'BUTTON' ? e.target : e.target.closest('button');
            
            // Resim butonunu atla, modal açılacak
            if (button.id === 'insertImageBtn') {
                return;
            }
            
            const command = button.dataset.command;
            const value = button.dataset.value;
            
            if (command === 'formatBlock' && value) {
                document.execCommand('formatBlock', false, value);
            } else if (command) {
                document.execCommand(command, false, null);
            }
            
            contentEditor.focus();
        }
    });

    // URL ile resim ekleme (galeri)
    document.getElementById('addImageUrl').addEventListener('click', () => {
        const url = imageUrlInput.value.trim();
        const caption = imageCaptionInput.value.trim();
        
        if (!url) {
            alert('Lütfen geçerli bir resim URL\'si girin!');
            return;
        }
        
        // URL geçerliliği kontrolü
        try {
            new URL(url);
        } catch {
            alert('Lütfen geçerli bir URL formatı girin!');
            return;
        }
        
        addImageToGallery(url, caption);
        imageUrlInput.value = '';
        imageCaptionInput.value = '';
    });

    // Galeriye resim ekle
    function addImageToGallery(url, caption) {
        const imageId = Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9);
        courseImages.push({ id: imageId, url, caption, position: courseImages.length });
        
        const imageHTML = `
            <div class="image-item" data-id="${imageId}">
                <img src="${url}" alt="${caption || 'Eğitim resmi'}" onerror="this.parentElement.remove(); removeImageFromGallery('${imageId}');">
                <div class="caption">${caption || 'Açıklama yok'}</div>
                <div class="actions">
                    <button type="button" class="btn btn-sm btn-danger" onclick="removeImageFromGallery('${imageId}')">
                        <i class="fas fa-trash"></i> Kaldır
                    </button>
                </div>
            </div>
        `;
        
        imageList.insertAdjacentHTML('beforeend', imageHTML);
    }

    // Galeri resmi kaldır
    window.removeImageFromGallery = function(imageId) {
        courseImages = courseImages.filter(img => img.id !== imageId);
        const element = document.querySelector(`[data-id="${imageId}"]`);
        if (element) {
            element.remove();
        }
    };

    // Resim ID ile kaldır (error durumunda)
    window.removeImageById = function(imageId) {
        courseImages = courseImages.filter(img => img.id !== imageId);
    };

    // Önizleme göster/gizle
    document.getElementById('previewBtn').addEventListener('click', () => {
        const isVisible = previewArea.style.display !== 'none';
        
        if (isVisible) {
            previewArea.style.display = 'none';
        } else {
            updatePreview();
            previewArea.style.display = 'block';
        }
    });

    // Önizlemeyi güncelle
    function updatePreview() {
        const title = titleInput.value || 'Başlık girilmemiş';
        const description = descriptionInput.value || 'Açıklama girilmemiş';
        const content = contentEditor.innerHTML || 'İçerik girilmemiş';
        const instructor = instructorInput.value || 'Eğitmen belirtilmemiş';
        const category = categorySelect.value || 'Kategori seçilmemiş';
        const difficulty = difficultySelect.value || '1';
        
        let tagsHTML = '';
        if (tagsInput.value.trim()) {
            const tags = tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag);
            tagsHTML = `
                <div class="course-tags">
                    ${tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            `;
        }
        
        let difficultyStars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= difficulty) {
                difficultyStars += '<i class="fas fa-star" style="color: var(--primary-color);"></i>';
            } else {
                difficultyStars += '<i class="fas fa-star" style="color: rgba(0, 255, 0, 0.3);"></i>';
            }
        }
        
        // Galeri resimlerini ekle
        let galleryHTML = '';
        if (courseImages.length > 0) {
            galleryHTML = `
                <hr style="border-color: rgba(0, 255, 0, 0.2); margin: 2rem 0;">
                <h3 style="color: var(--primary-color); margin-bottom: 1rem;">Resim Galerisi</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                    ${courseImages.map(img => `
                        <figure style="margin: 0; text-align: center;">
                            <img src="${img.url}" alt="${img.caption}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px; border: 1px solid rgba(0, 255, 0, 0.2);">
                            ${img.caption ? `<figcaption style="margin-top: 0.5rem; color: var(--light-text); font-style: italic; font-size: 0.9rem;">${img.caption}</figcaption>` : ''}
                        </figure>
                    `).join('')}
                </div>
            `;
        }
        
        previewArea.innerHTML = `
            <div class="course-preview">
                <h1 style="color: var(--primary-color); margin-bottom: 1rem;">${title}</h1>
                <p style="color: var(--light-text); font-size: 1.1rem; margin-bottom: 1.5rem;">${description}</p>
                <div style="margin-bottom: 1.5rem;">
                    <span style="color: var(--light-text); margin-right: 2rem;">
                        <i class="fas fa-user-tie" style="color: var(--primary-color);"></i> ${instructor}
                    </span>
                    <span style="color: var(--light-text); margin-right: 2rem;">
                        <i class="fas fa-layer-group" style="color: var(--primary-color);"></i> ${category}
                    </span>
                    <span style="color: var(--light-text);">
                        <i class="fas fa-star" style="color: var(--primary-color);"></i> Zorluk: ${difficultyStars}
                    </span>
                </div>
                ${tagsHTML}
                <hr style="border-color: rgba(0, 255, 0, 0.2); margin: 2rem 0;">
                <div style="color: var(--light-text); line-height: 1.6;">
                    ${content}
                </div>
                ${galleryHTML}
            </div>
        `;
    }

    // Form gönderimi
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveCourse(true); // Yayınla
    });

    // Taslak olarak kaydet
    document.getElementById('saveDraftBtn').addEventListener('click', async () => {
        await saveCourse(false); // Taslak
    });

    // Kursu kaydet
    async function saveCourse(isPublished) {
        const submitBtn = document.getElementById('publishBtn');
        const draftBtn = document.getElementById('saveDraftBtn');
        const originalText = isPublished ? submitBtn.innerHTML : draftBtn.innerHTML;
        
        // Buton durumunu güncelle
        const activeBtn = isPublished ? submitBtn : draftBtn;
        activeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Kaydediliyor...';
        activeBtn.disabled = true;
        
        try {
            // Form verilerini topla
            const title = titleInput.value.trim();
            const description = descriptionInput.value.trim();
            const content = contentEditor.innerHTML;
            const category = categorySelect.value;
            const instructor = instructorInput.value.trim();
            const difficulty = parseInt(difficultySelect.value);
            const tags = tagsInput.value ? tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
            
            // Validasyon
            if (!title || !description || !category || !instructor || !content.trim()) {
                alert('Lütfen tüm zorunlu alanları doldurun!');
                return;
            }
            
            const courseData = {
                title,
                description,
                content,
                category,
                instructor,
                difficulty,
                tags,
                images: courseImages.map(img => ({
                    url: img.url,
                    caption: img.caption,
                    position: img.position
                })),
                isPublished
            };
            
            const token = localStorage.getItem('token');
            const url = isEditing 
                ? `${API_BASE_URL}/api/education/courses/${courseId}`
                : `${API_BASE_URL}/api/education/courses`;
            const method = isEditing ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(courseData)
            });
            
            if (response.ok) {
                const course = await response.json();
                const message = isEditing 
                    ? 'Eğitim başarıyla güncellendi!'
                    : `Eğitim başarıyla ${isPublished ? 'yayınlandı' : 'taslak olarak kaydedildi'}!`;
                    
                alert(message);
                window.location.href = `/education/course?id=${course._id}`;
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Kaydetme işlemi başarısız!');
            }
            
        } catch (error) {
            console.error('Kaydetme hatası:', error);
            alert(error.message || 'Kaydetme işlemi sırasında bir hata oluştu!');
        } finally {
            // Buton durumunu geri al
            activeBtn.innerHTML = originalText;
            activeBtn.disabled = false;
        }
    }

    // Düzenleme modunda mevcut kursu yükle
    async function loadCourseForEditing() {
        if (!isEditing) return;
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/education/courses/${courseId}`);
            if (response.ok) {
                const course = await response.json();
                
                // Form alanlarını doldur
                titleInput.value = course.title;
                descriptionInput.value = course.description;
                categorySelect.value = course.category;
                instructorInput.value = course.instructor;
                difficultySelect.value = course.difficulty || 1;
                tagsInput.value = course.tags ? course.tags.join(', ') : '';
                contentEditor.innerHTML = course.content || '';
                
                // Resimleri yükle
                if (course.images && course.images.length > 0) {
                    course.images.forEach(image => {
                        addImageToGallery(image.url, image.caption);
                    });
                }
                
            } else {
                throw new Error('Eğitim yüklenemedi');
            }
        } catch (error) {
            console.error('Eğitim yükleme hatası:', error);
            alert('Eğitim yüklenirken bir hata oluştu!');
            window.location.href = '/education';
        }
    }

    // Global logout fonksiyonu
    window.logout = logout;

    // Sayfa yüklendiğinde çalıştır
    updateAuthButtons();
    if (isEditing) {
        loadCourseForEditing();
    }
}); 