document.addEventListener('DOMContentLoaded', function() {
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

            try {
                const response = await fetch('http://localhost:5001/api/auth/send-verification', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, username })
                });

                const data = await response.json();
                
                if (response.ok) {
                    // Test amacıyla doğrulama kodunu göster
                    alert(`Doğrulama kodu: ${data.code}\nGerçek bir uygulamada bu e-posta ile gönderilir.`);
                    
                    verificationCodeGroup.style.display = 'block';
                    sendVerificationButton.disabled = true;
                    sendVerificationButton.style.opacity = '0.7';
                    
                    // Doğrulama kodunu otomatik olarak input alanına ekle
                    document.getElementById('verificationCode').value = data.code;
                } else {
                    alert(data.error || 'Doğrulama kodu gönderilemedi');
                }
            } catch (error) {
                console.error('Hata:', error);
                alert('Bir hata oluştu. Lütfen tekrar deneyin.');
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
                const response = await fetch('http://localhost:5001/api/auth/register', {
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