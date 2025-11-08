import mysql from 'mysql2';
import vExpress from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import ejs from 'ejs';
import bodyParser from 'body-parser';
import path from 'path';
import { authorizationPost, authorizationGet } from './app/users/authorization.js';
import { reportGet, reportPost } from './app/users/report/index.js';
import { ticketPost, ticketGet } from './app/users/ticket/index.js';
import { mainGet } from './app/users/main/index.js';
dotenv.config();
const app = vExpress();
import { registerUserGet, registerUserPost } from './app/users/register.js';


const port = process.env.PORT || 3000;
app.engine('.html', ejs.__express);
app.set('views', 'views');
app.use(vExpress.static('./public'));
app.set('view engine', 'html');


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

function tokenGenerator(user) {

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
  registerUserGet(req, res);
});

app.post('/users/register', (req, res) => {
  registerUserPost(req, res);
});

app.post(`/users/authorization`, (req, res) => {
  authorizationPost(req, res);
});

app.get('/users/authorization', (req, res) => {
  authorizationGet(req, res);
});

app.get('/', (req, res) => {
  mainGet(req, res);
});

app.get('/purchase', (req, res) => {
  res.status(200).render('purchase', {
    title: 'Purchase Page'
  });
});

app.get('/contact', (req, res) => {
  res.status(200).render('contact', {
    title: 'Contact Page'
  });
});

app.get('/ticket', (req, res) => {
  ticketGet(req, res);
});


app.get('/report', (req, res) => {
  reportGet(req, res);
});


app.post('/report', (req, res) => {
  reportPost(req, res);
});

app.post('/ticket', (req, res) => {
  ticketPost(req, res);
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
