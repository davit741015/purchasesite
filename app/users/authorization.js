export const authorizationPost = (req, res) => {
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

        } else {
            const userRec = result[0];
            const userFlnames = userRec.first_name + ' ' + userRec.last_name;
            res.status(200).cookie('userRec', userFlnames).redirect('/?auth=1');


        }
    });
};

export const authorizationGet = (req, res) => {
  res.status(200).render('users/authorization', {
    title: 'Authorization Page'
  });
};