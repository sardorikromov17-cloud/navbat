const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// Public papkasidagi fayllarni ko'rsatish
app.use(express.static('public'));

// Ma'lumotlarni saqlash uchun vaqtinchalik xotira
let data = { jarayonda: [], tayyor: [] };

io.on('connection', (socket) => {
    // TV yoki Admin ulansa, unga hozirgi holatni yuboramiz
    socket.emit('update', data);

    // Admindan yangi buyruq kelsa
    socket.on('admin_action', (msg) => {
        if (msg.type === 'add_jar') {
            if(!data.jarayonda.includes(msg.id)) data.jarayonda.push(msg.id);
        } else if (msg.type === 'move_tay') {
            data.jarayonda = data.jarayonda.filter(i => i !== msg.id);
            if(!data.tayyor.includes(msg.id)) data.tayyor.push(msg.id);
        } else if (msg.type === 'remove') {
            data.jarayonda = data.jarayonda.filter(i => i !== msg.id);
            data.tayyor = data.tayyor.filter(i => i !== msg.id);
        }

        // Yangilangan ma'lumotni hamma TVlarga tarqatamiz
        io.emit('update', data);
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log('Server ' + PORT + ' portda ishladi'));