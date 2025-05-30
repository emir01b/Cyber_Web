document.addEventListener('DOMContentLoaded', function() {
    // API Base URL - Production için
    const API_BASE_URL = window.location.hostname === 'localhost' 
        ? 'http://localhost:5001' 
        : 'https://cyber-web.onrender.com';

    const registerForm = document.getElementById('registerForm');
    const sendVerificationButton = document.getElementById('sendVerification');
    const verificationCodeGroup = document.getElementById('verificationCodeGroup');

    if (sendVerificationButton) {
        sendVerificationButton.addEventListener('click', async () => {
            const email = document.getElementById('email').value;
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            if (!email || !username || !password) {
                alert('Lütfen tüm alanları doldurun');
                return;
            }

            // Buton durumunu değiştir
            sendVerificationButton.disabled = true;
            sendVerificationButton.textContent = 'Gönderiliyor...';

            try {
                const response = await fetch(`${API_BASE_URL}/api/auth/send-verification`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, username })
                });

                const data = await response.json();
                
                if (response.ok) {
                    // Başarılı mesajı göster
                    alert(data.message);
                    
                    // Doğrulama kodu input alanını göster
                    verificationCodeGroup.style.display = 'block';
                    sendVerificationButton.style.opacity = '0.7';
                    sendVerificationButton.textContent = 'Doğrulama Kodu Gönderildi';
                    
                    // 5 dakika sonra butonu tekrar aktif hale getir
                    setTimeout(() => {
                        sendVerificationButton.disabled = false;
                        sendVerificationButton.style.opacity = '1';
                        sendVerificationButton.textContent = 'Tekrar Gönder';
                    }, 300000); // 5 dakika = 300000 ms
                } else {
                    alert(data.error || 'Doğrulama kodu gönderilemedi');
                    // Hata durumunda butonu geri getir
                    sendVerificationButton.disabled = false;
                    sendVerificationButton.textContent = 'Doğrulama Kodu Gönder';
                }
            } catch (error) {
                console.error('Hata:', error);
                alert('Bir hata oluştu. Lütfen tekrar deneyin.');
                // Hata durumunda butonu geri getir
                sendVerificationButton.disabled = false;
                sendVerificationButton.textContent = 'Doğrulama Kodu Gönder';
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const verificationCode = document.getElementById('verificationCode').value;

            if (!email || !username || !password || !verificationCode) {
                alert('Lütfen tüm alanları doldurun');
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email,
                        username,
                        password,
                        verificationCode
                    })
                });

                const data = await response.json();
                
                if (response.ok) {
                    alert('Kayıt başarılı! Giriş yapabilirsiniz.');
                    window.location.href = '/login';
                } else {
                    alert(data.error || 'Kayıt işlemi başarısız');
                }
            } catch (error) {
                console.error('Hata:', error);
                alert('Kayıt işlemi başarısız. Lütfen tekrar deneyin.');
            }
        });
    }
}); 