const express = require('express');
const app = express ();
const cors = require('cors');
const routes = require('./routes/router')

const PORT = process.env.PORT || 3000;

//middlewares
app.use(cors());
app.use(express.json());

app.use('/', routes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});