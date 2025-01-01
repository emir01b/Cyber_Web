const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://emir123emir:Emir123Emir@cyberweb.xivul.mongodb.net/CyberWeb?retryWrites=true&w=majority');
        console.log('MongoDB bağlantısı başarılı');
    } catch (err) {
        console.error(`Hata: ${err.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
