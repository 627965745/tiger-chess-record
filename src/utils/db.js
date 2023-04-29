const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost', 
  user: 'root', 
  password: 'pass123',
  database: 'tiger'
})

connection.connect((error) => {
  if (error) {
    console.error('连接数据库失败:', error.message);
    return;
  }
  console.log('成功连接到数据库');
});

// 在这里编写与数据库交互的代码

connection.end(); // 关闭数据库连接