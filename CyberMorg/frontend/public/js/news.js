document.addEventListener('DOMContentLoaded', async () => {
    // API Base URL - Production için
    const API_BASE_URL = window.location.hostname === 'localhost' 
        ? 'http://localhost:5001' 
        : 'https://cyber-web.onrender.com';

    try {
        const response = await fetch(`${API_BASE_URL}/api/news`);
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.error);
        }
        
        const news = result.data;
        const newsGrid = document.querySelector('.news-grid');
        
        if (news && news.length > 0) {
            news.forEach(item => {
                const newsCard = document.createElement('div');
                newsCard.className = 'news-card';
                newsCard.innerHTML = `
                    <img src="${item.imageUrl || 'https://cdn.pixabay.com/photo/2016/11/30/20/58/programming-1873854_1280.png'}" alt="${item.title}" onerror="this.src='https://cdn.pixabay.com/photo/2016/11/30/20/58/programming-1873854_1280.png';">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                    <div class="news-meta">
                        <span>${new Date(item.date).toLocaleDateString('tr-TR')}</span>
                        <span>${item.source}</span>
                    </div>
                    <a href="${item.link}" target="_blank" class="read-more">Devamını Oku</a>
                `;
                
                newsGrid.appendChild(newsCard);
            });
        } else {
            newsGrid.innerHTML = '<p style="text-align: center; color: #ccc;">Henüz haber bulunmamaktadır.</p>';
        }
        
    } catch (error) {
        console.error('Haber yükleme hatası:', error);
        const newsGrid = document.querySelector('.news-grid');
        if (newsGrid) {
            newsGrid.innerHTML = '<p style="text-align: center; color: red;">Haberler yüklenirken bir hata oluştu.</p>';
        }
    }
});