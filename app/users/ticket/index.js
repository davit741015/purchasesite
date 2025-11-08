export const ticketPost = (req, res) => {  
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
};

export const ticketGet = (req, res) => {
    res.status(200).render('ticket', {
    title: 'ticket Page'
  });
};