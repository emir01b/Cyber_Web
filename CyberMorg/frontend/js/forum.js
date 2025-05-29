document.addEventListener('DOMContentLoaded', function() {
    // API Base URL - Production için
    const API_BASE_URL = window.location.hostname === 'localhost' 
        ? 'http://localhost:5001' 
        : 'https://cyber-web.onrender.com';

    const newTopicBtn = document.querySelector('.new-topic-btn');
    const forumTopics = document.getElementById('forumTopics');
    const user = JSON.parse(localStorage.getItem('user'));

    // Modal HTML'ini oluştur
    const modalHTML = `
        <div id="newTopicModal" class="modal">
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Yeni Konu Oluştur</h2>
                <form id="newTopicForm">
                    <div class="form-group">
                        <label for="topicTitle">Konu Başlığı</label>
                        <input type="text" id="topicTitle" required>
                    </div>
                    <div class="form-group">
                        <label for="topicContent">Konu İçeriği</label>
                        <textarea id="topicContent" required></textarea>
                    </div>
                    <button type="submit">Konu Oluştur</button>
                </form>
            </div>
        </div>
    `;

    // Modal'ı sayfaya ekle
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('newTopicModal');
    const closeBtn = document.querySelector('.close');

    // Yeni konu oluştur butonuna tıklandığında
    newTopicBtn.addEventListener('click', () => {
        if (!user) {
            alert('Konu oluşturmak için giriş yapmalısınız!');
            window.location.href = '/login';
            return;
        }
        modal.style.display = 'block';
    });

    // Modal'ı kapat
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Modal dışına tıklandığında kapat
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    // Yeni konu formu gönderildiğinde
    document.getElementById('newTopicForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = document.getElementById('topicTitle').value.trim();
        const content = document.getElementById('topicContent').value.trim();

        if (!title || !content) {
            alert('Lütfen tüm alanları doldurun!');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/forum/topics`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    content,
                    author: user.username
                })
            });

            if (response.ok) {
                const topic = await response.json();
                addTopicToPage(topic);
                modal.style.display = 'none';
                document.getElementById('newTopicForm').reset();
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Konu oluşturulurken bir hata oluştu!');
            }
        } catch (err) {
            console.error('Hata:', err);
            alert('Konu oluşturulurken bir hata oluştu!');
        }
    });

    // Konuları sayfaya ekle
    function addTopicToPage(topic) {
        const date = new Date(topic.createdAt).toLocaleString('tr-TR');
        const commentCount = topic.commentCount || 0;
        const topicHTML = `
            <div class="forum-topic" onclick="window.location.href='/topic-detail?id=${topic._id}'" style="cursor: pointer;">
                <div class="topic-header">
                    <span class="topic-title">${topic.title}</span>
                    <span class="topic-meta">${date}</span>
                </div>
                <div class="topic-content">${topic.content.length > 150 ? topic.content.substring(0, 150) + '...' : topic.content}</div>
                <div class="topic-footer">
                    <span><i class="fas fa-user"></i> ${topic.author}</span>
                    <span><i class="fas fa-comments"></i> ${commentCount} Yorum</span>
                </div>
            </div>
        `;
        forumTopics.insertAdjacentHTML('afterbegin', topicHTML);
    }

    // Sayfa yüklendiğinde konuları getir
    async function loadTopics() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/forum/topics`);
            if (response.ok) {
                const topics = await response.json();
                forumTopics.innerHTML = '';
                topics.forEach(topic => addTopicToPage(topic));
            }
        } catch (err) {
            console.error('Konular yüklenirken hata:', err);
        }
    }

    loadTopics();
}); 