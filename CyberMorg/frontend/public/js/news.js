document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('http://localhost:5000/api/news');
        const news = await response.json();
        
        const newsGrid = document.querySelector('.news-grid');
        news.forEach(item => {
            const newsCard = document.createElement('div');
            newsCard.className = 'news-card';
            newsCard.innerHTML = `
                <img src="${item.imageUrl}" alt="${item.title}">