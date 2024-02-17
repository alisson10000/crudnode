const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Conectar ao banco de dados MySQL (certifique-se de ajustar as credenciais)
const sequelize = new Sequelize({
  dialect: 'mariadb',
  host: 'localhost',
  username: 'root',
  password: '',
  database: 'minha_api'
});

// Definir modelo usando Sequelize
const Item = sequelize.define('Item', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

// Sincronizar o modelo com o banco de dados (criar a tabela)
sequelize.sync()
  .then(() => {
    console.log('Tabela sincronizada');
  })
  .catch((error) => {
    console.error('Erro ao sincronizar tabela:', error);
  });

// Rotas CRUD básicas
app.post('/items', async (req, res) => {
  try {
    const { name, description } = req.body;
    const newItem = await Item.create({ name, description });
    res.json(newItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/items', async (req, res) => {
  try {
    const items = await Item.findAll();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/items/:id', async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/items/:id', async (req, res) => {
  try {
    const { name, description } = req.body;
    await Item.update({ name, description }, { where: { id: req.params.id } });
    const updatedItem = await Item.findByPk(req.params.id);
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/items/:id', async (req, res) => {
  try {
    await Item.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Item removido com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
