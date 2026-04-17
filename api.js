// 棉花调研问卷 API 服务
// 使用 Node.js + Express + MySQL

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// 配置数据库连接
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'cotton_survey'
});

// 连接数据库
db.connect((err) => {
    if (err) {
        console.error('数据库连接失败:', err);
        return;
    }
    console.log('数据库连接成功');
});

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 提交问卷
app.post('/api/survey', (req, res) => {
    const { name, gender, age, occupation, products, frequency, priority, premium, phone, email, suggestion } = req.body;
    
    const sql = 'INSERT INTO survey_responses (name, gender, age, occupation, products, frequency, priority, premium, phone, email, suggestion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    
    db.query(sql, [name, gender, age, occupation, JSON.stringify(products), frequency, priority, premium, phone, email, suggestion], (err, result) => {
        if (err) {
            console.error('插入数据失败:', err);
            return res.status(500).json({ success: false, message: '提交失败' });
        }
        res.json({ success: true, message: '提交成功', id: result.insertId });
    });
});

// 获取所有问卷数据
app.get('/api/survey', (req, res) => {
    const sql = 'SELECT * FROM survey_responses ORDER BY created_at DESC';
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error('查询数据失败:', err);
            return res.status(500).json({ success: false, message: '查询失败' });
        }
        res.json({ success: true, data: results });
    });
});

// 获取统计数据
app.get('/api/stats', (req, res) => {
    const stats = {};
    
    // 总问卷数
    db.query('SELECT COUNT(*) as total FROM survey_responses', (err, result) => {
        if (err) return res.status(500).json({ success: false });
        stats.total = result[0].total;
        
        // 性别统计
        db.query('SELECT gender, COUNT(*) as count FROM survey_responses GROUP BY gender', (err, result) => {
            if (err) return res.status(500).json({ success: false });
            stats.gender = result;
            
            // 年龄统计
            db.query('SELECT age, COUNT(*) as count FROM survey_responses GROUP BY age', (err, result) => {
                if (err) return res.status(500).json({ success: false });
                stats.age = result;
                
                // 购买偏好统计
                db.query('SELECT priority, COUNT(*) as count FROM survey_responses GROUP BY priority', (err, result) => {
                    if (err) return res.status(500).json({ success: false });
                    stats.priority = result;
                    
                    // 溢价意愿统计
                    db.query('SELECT premium, COUNT(*) as count FROM survey_responses GROUP BY premium', (err, result) => {
                        if (err) return res.status(500).json({ success: false });
                        stats.premium = result;
                        
                        res.json({ success: true, data: stats });
                    });
                });
            });
        });
    });
});

// 获取单个问卷
app.get('/api/survey/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'SELECT * FROM survey_responses WHERE id = ?';
    
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('查询数据失败:', err);
            return res.status(500).json({ success: false, message: '查询失败' });
        }
        if (result.length === 0) {
            return res.status(404).json({ success: false, message: '数据不存在' });
        }
        res.json({ success: true, data: result[0] });
    });
});

// 更新问卷
app.put('/api/survey/:id', (req, res) => {
    const id = req.params.id;
    const { name, gender, age, occupation, products, frequency, priority, premium, phone, email, suggestion } = req.body;
    
    const sql = 'UPDATE survey_responses SET name=?, gender=?, age=?, occupation=?, products=?, frequency=?, priority=?, premium=?, phone=?, email=?, suggestion=? WHERE id=?';
    
    db.query(sql, [name, gender, age, occupation, JSON.stringify(products), frequency, priority, premium, phone, email, suggestion, id], (err, result) => {
        if (err) {
            console.error('更新数据失败:', err);
            return res.status(500).json({ success: false, message: '更新失败' });
        }
        res.json({ success: true, message: '更新成功' });
    });
});

// 删除问卷
app.delete('/api/survey/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM survey_responses WHERE id = ?';
    
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('删除数据失败:', err);
            return res.status(500).json({ success: false, message: '删除失败' });
        }
        res.json({ success: true, message: '删除成功' });
    });
});

// 静态文件服务
app.use(express.static('public'));

// 启动服务器
app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
});

module.exports = app;