function isAuthenticated(req, res, next) {
  console.log(req.session)
  
  if (req.session && req.session.user) return next();
  return res.status(401).json({ error: "Giriş yapılmadı" });
}

module.exports = isAuthenticated;