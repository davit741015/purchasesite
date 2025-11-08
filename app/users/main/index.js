export const mainGet = (req, res) => {
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
  });   
};