document.addEventListener('DOMContentLoaded', function() {
    // API Base URL - Production için
    const API_BASE_URL = window.location.hostname === 'localhost' 
        ? 'http://localhost:5001' 
        : 'https://cyber-web.onrender.com';

    const topicDetail = document.getElementById('topicDetail');
    const commentsList = document.getElementById('commentsList');
    const addCommentSection = document.getElementById('addCommentSection');
    const loginMessage = document.getElementById('loginMessage');
    const addCommentForm = document.getElementById('addCommentForm');
    const user = JSON.parse(localStorage.getItem('user'));

    // URL'den konu ID'sini al
    const urlParams = new URLSearchParams(window.location.search);
    const topicId = urlParams.get('id');

    if (!topicId) {
        alert('Konu ID bulunamadı!');
        window.location.href = '/forum';
        return;
    }

    // Kullanıcı durumuna göre yorum bölümünü göster/gizle
    if (user) {
        addCommentSection.style.display = 'block';
        loginMessage.style.display = 'none';
    } else {
        addCommentSection.style.display = 'none';
        loginMessage.style.display = 'block';
    }

    // Konu detaylarını yükle
    async function loadTopicDetail() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/forum/topics/${topicId}`);
            if (response.ok) {
                const topic = await response.json();
                displayTopic(topic);
            } else {
                throw new Error('Konu bulunamadı');
            }
        } catch (err) {
            console.error('Konu yüklenirken hata:', err);
            alert('Konu yüklenirken bir hata oluştu!');
            window.location.href = '/forum';
        }
    }

    // Konu bilgilerini göster
    function displayTopic(topic) {
        const date = new Date(topic.createdAt).toLocaleString('tr-TR');
        const topicHTML = `
            <div class="topic-header">
                <h1 class="topic-title">${topic.title}</h1>
                <div class="topic-meta">
                    <span><i class="fas fa-user"></i> ${topic.author}</span>
                    <span><i class="fas fa-calendar"></i> ${date}</span>
                </div>
            </div>
            <div class="topic-content">
                <p>${topic.content}</p>
            </div>
        `;
        topicDetail.innerHTML = topicHTML;
    }

    // Yorumları yükle
    async function loadComments() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/forum/topics/${topicId}/comments`);
            if (response.ok) {
                const comments = await response.json();
                displayComments(comments);
            }
        } catch (err) {
            console.error('Yorumlar yüklenirken hata:', err);
        }
    }

    // Yorumları göster
    function displayComments(comments) {
        if (comments.length === 0) {
            commentsList.innerHTML = '<p class="no-comments">Henüz yorum yapılmamış.</p>';
            return;
        }

        const commentsHTML = comments.map(comment => {
            const date = new Date(comment.createdAt).toLocaleString('tr-TR');
            return `
                <div class="comment">
                    <div class="comment-header">
                        <span class="comment-author"><i class="fas fa-user"></i> ${comment.author}</span>
                        <span class="comment-date">${date}</span>
                    </div>
                    <div class="comment-content">
                        <p>${comment.content}</p>
                    </div>
                </div>
            `;
        }).join('');

        commentsList.innerHTML = commentsHTML;
    }

    // Yorum ekleme formu gönderildiğinde
    addCommentForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const content = document.getElementById('commentContent').value.trim();

        if (!content) {
            alert('Lütfen yorum içeriğini girin!');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/forum/topics/${topicId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content,
                    author: user.username
                })
            });

            if (response.ok) {
                const comment = await response.json();
                document.getElementById('commentContent').value = '';
                loadComments(); // Yorumları yeniden yükle
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Yorum eklenirken bir hata oluştu!');
            }
        } catch (err) {
            console.error('Yorum ekleme hatası:', err);
            alert('Yorum eklenirken bir hata oluştu!');
        }
    });

    // Sayfa yüklendiğinde konu ve yorumları yükle
    loadTopicDetail();
    loadComments();
}); 