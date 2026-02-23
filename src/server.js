require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);

const responsavelRoutes = require('./routes/responsavelRoutes');
app.use('/responsaveis', responsavelRoutes);

// Rotas organizadas
app.use('/mapa', require('./routes/mapa.routes'));
app.use('/sepultamentos', require('./routes/sepultamentos.routes'));
app.use('/falecidos', require('./routes/falecidos.routes'));
app.use('/lotes', require('./routes/lotes.routes'));
app.use('/gavetas', require('./routes/gavetas.routes'));

app.get('/', (req, res) => {
  res.json({ status: 'API rodando' });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});