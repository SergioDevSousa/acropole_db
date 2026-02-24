require('dotenv').config();
const jwt = require('jsonwebtoken');



function autenticar(req, res, next) {
    console.log('Header recebido:', req.headers.authorization); // <-- log do header para depuração');
  
    const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ erro: 'Token não fornecido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decodificado:', decoded);
    req.usuario = decoded; // <-- aqui nasce o req.usuario
    next();
  } catch (err) {
    return res.status(401).json({ erro: 'Token inválido' });
  }
}

module.exports = autenticar;