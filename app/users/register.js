export const registerUserGet = (req, res) => {
    res.status(200).render('users/register', {
    title: 'Register Page'
  })
};

export const registerUserPost = (req, res) => {
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
};