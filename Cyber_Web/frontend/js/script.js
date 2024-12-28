document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('new-username').value; // Kullanıcı adı
    const email = document.getElementById('email').value; // E-posta
    const password = document.getElementById('new-password').value; // Şifre

    try {
        const response = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                email,
                password
            })
        });

        const data = await response.json();
        
        if (response.ok) {
            alert('Kayıt başarılı! Lütfen e-postanızı kontrol edin.');
            // Doğrulama kodu giriş alanını göster
            document.getElementById('verificationSection').style.display = 'block';
        } else {
            alert(data.message || 'Bir hata oluştu');
        }
    } catch (error) {
        console.error('Hata:', error);
        alert('Bir hata oluştu');
    }
});

// Doğrulama kodunu al butonuna tıklama işlemi
document.getElementById('send-verification-code').addEventListener('click', async () => {
    const email = document.getElementById('email').value; // E-posta alanından değeri al
    const newUsername = document.getElementById('new-username').value; // Kullanıcı adı alanından değeri al
    const password = document.getElementById('new-password').value; // Şifre alanından değeri al

    if (!email || !newUsername || !password) {
        alert('Lütfen tüm alanları doldurun.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: newUsername, email, password }),
        });

        const data = await response.json();
        alert(data.message); // Sunucudan gelen mesajı göster
    } catch (error) {
        console.error('Hata:', error);
        alert('Doğrulama kodu gönderilirken bir hata oluştu.');
    }
});
