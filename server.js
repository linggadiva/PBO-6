const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const server = express();
server.use(bodyParser.urlencoded({extended : false}));
server.use(bodyParser.json());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pbo6'
});

connection.connect((err)=>{
    if(err) {
        console.error('Terjadi kesalahan dalam koneksi ke MySQL:', err.stack);
        return;
    }
    console.log('Koneksi MySQL berhasil dengan id' + connection.threadId);
});

server.set('view engine', 'ejs');

//read
server.get('/', (req, res) =>{
    const query = 'SELECT * FROM ikan';
    connection.query(query, (err, results) =>{
        res.render('index',{ikan: results});
    });
});

//create / input / insert
server.post('/add', (req, res)=> {
    const {nama, berat, wtangkap} = req.body;
    const query = 'INSERT INTO ikan (nama, berat, wtangkap) VALUES (?,?,?)';
    connection.query(query, [nama, berat, wtangkap], (err, result)=>{
        if(err) throw err;
        res.redirect('/')
    });
});

//update
server.get('/edit/:id', (req, res)=>{
    const query = 'SELECT * FROM ikan WHERE id = ?';
    connection.query(query, [req.params.id], (err, result) =>{
        res.render('edit',{user: result[0]})
    })
});

server.post('/update/:id', (req, res) =>{
    const {nama, berat, wtangkap} = req.body;
    const query = 'UPDATE ikan SET nama = ?, berat = ?, wtangkap = ? WHERE id = ?';
    connection.query(query, [nama, berat, wtangkap, req.params.id], (err, result)=>{
        if(err) throw err;
        res.redirect('/')
    });
});

//delete
server.get('/delete/:id', (req, res)=>{
    const query = 'DELETE FROM ikan WHERE id = ?';
    connection.query(query, [req.params.id], (err, result) =>{
        res.redirect('/');
    });
});

server.listen(3000,()=>{
    console.log('Server berjalan di port 3000, buka web melalui http://localhost:3000')
});