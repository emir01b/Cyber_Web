const axios = require('axios');
const News = require('../models/News');

const DEFAULT_IMAGE = 'https://cdn.pixabay.com/photo/2016/11/30/20/58/programming-1873854_1280.png';

const scrapeNews = async () => {
    try {
        console.log('Reddit\'ten haberleri çekmeye başlıyor...');
        
        const subreddits = ['netsec', 'cybersecurity'];
        const news = [];

        for (const subreddit of subreddits) {
            const response = await axios.get(
                `https://www.reddit.com/r/${subreddit}/hot.json?limit=25`,
                {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                    }
                }
            );

            console.log(`${subreddit} subreddit'inden veriler alınıyor...`);

            const posts = response.data.data.children;
            
            for (const post of posts) {
                const { title, url, created_utc, selftext } = post.data;
                
                if (!url || news.some(item => item.link === url)) continue;
                if (post.data.over_18) continue;

                const description = selftext 
                    ? selftext.substring(0, 200) + '...'
                    : 'Detaylar için haberin devamını okuyun...';

                // Thumbnail kontrolü ve varsayılan resim olarak online bir resim kullan
                let imageUrl = post.data.thumbnail;
                if (!imageUrl || 
                    imageUrl === 'self' || 
                    imageUrl === 'default' || 
                    imageUrl === 'nsfw' ||
                    !imageUrl.startsWith('http')) {
                    imageUrl = DEFAULT_IMAGE;
                }

                news.push({
                    title,
                    description,
                    imageUrl,
                    link: url,
                    date: new Date(created_utc * 1000),
                    source: `r/${subreddit}`
                });

                console.log('İşlenen haber:', title);
            }
        }

        console.log(`Toplam ${news.length} haber bulundu`);

        if (news.length === 0) {
            throw new Error('Hiç haber bulunamadı');
        }

        await News.deleteMany({});
        console.log('Eski haberler temizlendi');

        const savedNews = await News.insertMany(news);
        console.log(`${savedNews.length} yeni haber eklendi`);

        return savedNews;
    } catch (error) {
        console.error('Haber çekme hatası:', error);
        console.error('Hata detayları:', error.response?.data || error.message);
        throw error;
    }
};

const testScraper = async () => {
    try {
        const news = await scrapeNews();
        console.log('Test başarılı:', news.length, 'haber çekildi');
        return news;
    } catch (error) {
        console.error('Test başarısız:', error);
        throw error;
    }
};

module.exports = {
    scrapeNews,
    testScraper
};
