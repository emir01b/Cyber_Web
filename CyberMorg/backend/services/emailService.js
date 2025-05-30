const nodemailer = require('nodemailer');

// E-posta yapılandırması
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'cybermorg23@gmail.com',
        pass: 'yzaz mbkz tbye kqjc'
    }
});

// E-posta şablonu
const createVerificationEmailHTML = (verificationCode, username) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CyberMorg - Hesap Doğrulama</title>
        <style>
            body {
                margin: 0;
                padding: 0;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #0a0a0a;
                color: #ffffff;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
                border-radius: 15px;
                overflow: hidden;
                box-shadow: 0 10px 30px rgba(0, 255, 0, 0.1);
            }
            .header {
                background: linear-gradient(135deg, #00ff00 0%, #00cc00 100%);
                padding: 30px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                color: #000000;
                font-size: 28px;
                font-weight: bold;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
            }
            .shield-icon {
                width: 32px;
                height: 32px;
                background: #000000;
                border-radius: 50%;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                color: #00ff00;
                font-weight: bold;
            }
            .content {
                padding: 40px 30px;
            }
            .welcome-text {
                font-size: 20px;
                color: #00ff00;
                margin-bottom: 20px;
                font-weight: bold;
            }
            .message {
                font-size: 16px;
                line-height: 1.6;
                color: #cccccc;
                margin-bottom: 30px;
            }
            .verification-code {
                background: linear-gradient(135deg, #00ff00 0%, #00cc00 100%);
                color: #000000;
                font-size: 32px;
                font-weight: bold;
                padding: 20px;
                text-align: center;
                border-radius: 10px;
                margin: 30px 0;
                letter-spacing: 8px;
                font-family: 'Courier New', monospace;
                box-shadow: 0 5px 15px rgba(0, 255, 0, 0.3);
            }
            .warning {
                background: #ff4444;
                color: #ffffff;
                padding: 15px;
                border-radius: 8px;
                margin: 20px 0;
                font-size: 14px;
                text-align: center;
            }
            .footer {
                background: #111111;
                padding: 20px 30px;
                text-align: center;
                border-top: 2px solid #00ff00;
            }
            .footer p {
                margin: 0;
                color: #888888;
                font-size: 12px;
            }
            .security-tips {
                background: #1a1a2e;
                border-left: 4px solid #00ff00;
                padding: 15px;
                margin: 20px 0;
                border-radius: 0 8px 8px 0;
            }
            .security-tips h3 {
                color: #00ff00;
                margin-top: 0;
                font-size: 16px;
            }
            .security-tips ul {
                color: #cccccc;
                font-size: 14px;
                margin: 0;
                padding-left: 20px;
            }
            .cyber-bg {
                background: linear-gradient(45deg, #0a0a0a 25%, transparent 25%), 
                           linear-gradient(-45deg, #0a0a0a 25%, transparent 25%), 
                           linear-gradient(45deg, transparent 75%, #0a0a0a 75%), 
                           linear-gradient(-45deg, transparent 75%, #0a0a0a 75%);
                background-size: 20px 20px;
                background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
                padding: 2px;
            }
        </style>
    </head>
    <body>
        <div class="cyber-bg">
            <div class="container">
                <div class="header">
                    <h1>
                        <div class="shield-icon">🛡</div>
                        CyberMorg
                    </h1>
                </div>
                
                <div class="content">
                    <div class="welcome-text">Hoş geldin ${username}! 🎯</div>
                    
                    <div class="message">
                        CyberMorg ailesine katıldığın için teşekkürler! Siber güvenlik dünyasında bilgi ve deneyim paylaşımının en güvenli adresi olan platformumuza hoş geldin.
                    </div>
                    
                    <div class="message">
                        Hesabınızı doğrulamak için aşağıdaki 6 haneli kodu kullanın:
                    </div>
                    
                    <div class="verification-code">
                        ${verificationCode}
                    </div>
                    
                    <div class="warning">
                        ⚠️ Bu kod 5 dakika içinde sona erecektir. Güvenliğiniz için bu kodu kimseyle paylaşmayın!
                    </div>
                    
                    <div class="security-tips">
                        <h3>🔒 Güvenlik İpuçları</h3>
                        <ul>
                            <li>Bu e-postayı CyberMorg'dan beklemiyorsanız, lütfen görmezden gelin</li>
                            <li>Doğrulama kodunuzu asla başkalarıyla paylaşmayın</li>
                            <li>Şüpheli e-postalar için spam klasörünüzü kontrol edin</li>
                            <li>Güçlü şifreler kullanmayı unutmayın</li>
                        </ul>
                    </div>
                    
                    <div class="message">
                        Hesabınız doğrulandıktan sonra platformumuzda:
                        <br>• 📰 En güncel siber güvenlik haberlerini takip edebilir
                        <br>• 💬 Toplulukla forum üzerinden etkileşim kurabilir
                        <br>• 🎓 Kapsamlı eğitim materyallerine erişebilir
                        <br>• 🔧 Pratik araçlar ve ipuçları keşfedebilirsiniz
                    </div>
                </div>
                
                <div class="footer">
                    <p>Bu e-posta CyberMorg güvenlik platformu tarafından gönderilmiştir.</p>
                    <p>Sorularınız için bize ulaşabilirsiniz: cybermorg23@gmail.com</p>
                    <p>© 2024 CyberMorg - Siber Güvenlik Platformu</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
};

// E-posta gönderme fonksiyonu
const sendVerificationEmail = async (email, verificationCode, username) => {
    try {
        const mailOptions = {
            from: {
                name: 'CyberMorg Güvenlik Platformu',
                address: 'cybermorg23@gmail.com'
            },
            to: email,
            subject: '🛡️ CyberMorg - Hesap Doğrulama Kodu',
            html: createVerificationEmailHTML(verificationCode, username),
            text: `
CyberMorg - Hesap Doğrulama

Merhaba ${username},

CyberMorg platformuna hoş geldin! Hesabını doğrulamak için aşağıdaki kodu kullan:

Doğrulama Kodu: ${verificationCode}

Bu kod 5 dakika içinde sona erecek. Güvenliğin için bu kodu kimseyle paylaşma!

Eğer bu e-postayı beklemiyorsan, lütfen görmezden gel.

CyberMorg Ekibi
cybermorg23@gmail.com
            `
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Doğrulama e-postası gönderildi:', result.messageId);
        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error('E-posta gönderme hatası:', error);
        return { success: false, error: error.message };
    }
};

module.exports = {
    sendVerificationEmail
}; 