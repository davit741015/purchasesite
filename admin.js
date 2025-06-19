const mysql = require('mysql2');
const vExpress = require('express')
const app = vExpress()
const port = 3300
app.engine('.html', require('ejs').__express);
app.set('views', 'admin_views');
app.use(vExpress.static(__dirname + '/public'));
app.set('view engine', 'html');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'site'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
    return;
  }
  console.log('Connected to MySQL!');
});

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Admin Dashboard',
    message: 'Welcome to the Admin Dashboard!'
  });
});

// Admin reports dashboard page
app.get('/Areport', (req, res) => {
  res.render('Areport', {
    title: 'Admin Reports'
  });
});


app.get('/admin/reports', (req, res) => {
  connection.query('SELECT id, purchase_link, reported_at, status FROM reports ORDER BY reported_at DESC', (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
});


app.post('/admin/reports/:id/accept', (req, res) => {
  const id = req.params.id;
  connection.query('UPDATE reports SET status = "accepted" WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ success: true });
  });
});

// API: Deny a report
app.post('/admin/reports/:id/deny', (req, res) => {
  const id = req.params.id;
  connection.query('UPDATE reports SET status = "denied" WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ success: true });
  });
});

app.get('/admin/users', (req, res) => {
  connection.query('SELECT id, name FROM users', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});


app.listen(port, () => {
  console.log(`the server is on the port ${port}`)
})
