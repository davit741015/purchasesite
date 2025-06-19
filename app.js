const mysql = require('mysql2');
const vExpress = require('express')
const app = vExpress()
const port = 3000
app.engine('.html', require('ejs').__express);
app.set('views', 'views');
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

app.get('/users/register', (req, res) => {
  res.status(200).render('users/register', {
    title: 'Register Page'
  })
});

app.post(`/users/register`, (req, res) => {
  const { username, password, first_name, last_name, birthday, email,ticket,report } = req.body;
  const sql = 'INSERT INTO users (username, password, first_name, last_name, birthday, email, create_date) VALUES (?, ?, ?, ? , ?, ?, Now())';
  connection.query(sql, [username, password, first_name, last_name, birthday, email], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err.message);
      return res.status(500).send('Error inserting data');
    }
    res.status(200).send('User registered successfully');
  });
});

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Home Page',
  })
})


app.get('/purchase', (req, res) => {
  res.status(200).render('purchase', {
    title: 'Purchase Page'
  })
})

app.get('/contact', (req, res) => {
  res.status(200).render('contact', {
    title: 'Contact Page'
  })
})

app.get('/ticket', (req, res) => {
  res.status(200).render('ticket', {
    title: 'ticket Page'
  })
})


app.get('/report', (req, res) => {
  res.status(200).render('report', {
    title: 'Report Purchase'
  });
});


app.post('/report', (req, res) => {
  const reported_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const reporter_ip = req.ip || req.connection.remoteAddress;
  const { purchase_link, description } = req.body;
  const sql = "INSERT INTO reports (`purchase_link`, `reported_at`, `reporter_ip`, `status`, `report_date`) VALUES (?,?,?,'accepted', NOW())";
  connection.query(sql, [purchase_link, reported_at, reporter_ip], (err, result) => {
    if (err) {
      console.error('Error inserting report:', err.message);
      return res.status(500).send('Error inserting report');
    }
    res.status(200).send('Purchase reported successfully');
  });
});

app.post('/ticket', (req, res) => {
  const { issue } = req.body;
  if (!issue || typeof issue !== 'string' || !issue.trim()) {
    return res.status(400).send('Issue description is required');
  }
  const sql = 'INSERT INTO tickets (issue, created_at) VALUES (?, NOW())';
  connection.query(sql, [issue.trim()], (err, result) => {
    if (err) {
      console.error('Error inserting ticket:', err.message);
      return res.status(500).send('Error inserting ticket');
    }
    res.status(200).send('Ticket submitted successfully');
  });
});



app.listen(port, () => {
  console.log(`the server is on the port ${port}`)
})
