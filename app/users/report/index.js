export const reportPost = (req, res) => {
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
};

export const reportGet = (req, res) =>
res.status(200).render('report', {
    title: 'Report Purchase'
  });