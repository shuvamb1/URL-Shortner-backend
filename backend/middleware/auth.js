export function adminAuth(req, res, next) {
  const token = req.headers["authorization"];

  if (token === process.env.ADMIN_SECRET) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
}
