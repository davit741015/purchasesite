const mysql = require('mysql2');
const vExpress = require('express');
const cookieParser = require('cookie-parser');
const app = vExpress();
require('dotenv').config();

const port = process.env.PORT || 3000; // Use environment variable or default to 3000
app.engine('.html', require('ejs').__express);
app.set('views', 'views');
app.use(vExpress.static(__dirname + '/public'));
app.set('view engine', 'html');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  try {
    const userRec = req.cookies && req.cookies.userRec;
    res.locals.userName = userRec || null;
    res.locals.authorized = Boolean(userRec);
  } catch (e) {
    res.locals.userName = null;
    res.locals.authorized = false;
  }
  next();
});

function tokenGenerator(user){
  
}

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_user,
  password: process.env.DB_password,
  database: process.env.DB_name
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

app.post('/users/register', (req, res) => {
  console.log('Request body:', req.body);
  const { username, password, first_name, last_name, birthday, email } = req.body;
  if (!username || !password) {
    return res.status(400).send('Username and password required');
  }
  const checkSql = 'SELECT id FROM users WHERE username = ?';
  connection.query(checkSql, [username], (err, rows) => {
    if (err) {
      console.error('Error checking user:', err.message);
      return res.status(500).send('Error registering user');
    }
    if (rows.length > 0) {
      return res.status(409).send('User already exists');
    }
    const sql = 'INSERT INTO users (username, password, first_name, last_name, birthday, email, create_date) VALUES (?, ?, ?, ? , ?, ?, Now())';
    connection.query(sql, [username, password, first_name, last_name, birthday, email], (err, result) => {
      if (err) {
        console.error('Error inserting data:', err.message);
        return res.status(500).send('Error inserting data');
      }
      res.status(200).send('User registered successfully');
    });
  });
});

app.post(`/users/authorization`, (req, res) => {
  console.log('Request body:', req.body);
  const { username, password } = req.body;
  const sql = 'SELECT * FROM users WHERE  username=? and password=?';
  connection.query(sql, [username, password], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err.message);
      return res.status(500).json({
        status: false,
        result: 'authorization failed'
      });
    }
    if (result.length === 0) {
      res.status(401).redirect('/?error=1');
      // return res.status(401).json({
      //   status: false,
      //   result: 'authorization failed'
      // });
    } else {
      const userRec = result[0];
      const userFlnames = userRec.first_name + ' ' + userRec.last_name;
      res.status(200).cookie('userRec',userFlnames).redirect('/?auth=1');
      
      // res.status(200).json({
      //   status: true,
      //   result: userRec.first_name + ' ' + userRec.last_name,
      // });
    }
  });
});

app.get('/users/authorization', (req, res) => {
  res.status(200).render('users/authorization', {
    title: 'Authorization Page'    
  });
});

app.get('/', (req, res) => {
  const error = req.query.error;
  let authMesage = "";
  if (error) {
    authMesage = 'Authorization failed. Please check your credentials.';
  } else if (req.query.auth) {
    authMesage = 'Authorization successfully';
  }
  res.render('index', {
    title: 'Home Page',
    authMesage: authMesage
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
  const { purchase_link, description, user_id } = req.body;
  if (!user_id) {
    return res.status(400).send('User ID is required');
  }
  const sql = "INSERT INTO reports (purchase_link, reported_at, reporter_ip, status, report_date, user_id) VALUES (?,?,?,'accepted', NOW(), ?)";
  connection.query(sql, [purchase_link, reported_at, reporter_ip, user_id], (err, result) => {
    if (err) {
      console.error('Error inserting report:', err.message);
      return res.status(500).send('Error inserting report');
    }
    res.status(200).send('Purchase reported successfully');
  });
});

app.post('/ticket', (req, res) => {
  const { issue, user_id } = req.body;
  if (!issue || typeof issue !== 'string' || !issue.trim()) {
    return res.status(400).send('Issue description is required');
  }
  if (!user_id) {
    return res.status(400).send('User ID is required');
  }
  const sql = 'INSERT INTO tickets (issue, user_id, created_at) VALUES (?, ?, NOW())';
  connection.query(sql, [issue.trim(), user_id], (err, result) => {
    if (err) {
      console.error('Error inserting ticket:', err.message);
      return res.status(500).send('Error inserting ticket');
    }
    res.status(200).send('Ticket submitted successfully');
  });
});

app.get('/set-cookie', (req, res) => {
  res.cookie('username', 'JohnDoe', { maxAge: 86400, httpOnly: true });
  res.send('Cookie has been set');
});

app.get('/get-cookie', (req, res) => {
  const username = req.cookies.username;
  if (username) {
    res.send(`Cookie retrieved: ${username}`);
  } else {
    res.send('No cookie found');
  }
});

app.get('/clear-cookie', (req, res) => {
  res.clearCookie('username');
  res.send('Cookie has been cleared');
});



app.listen(port, () => {
  console.log(`the server is on the port ${port}`)
})
