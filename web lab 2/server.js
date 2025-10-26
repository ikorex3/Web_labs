const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('Home', { title: 'Home' });
});

app.get('/payment', (req, res) => {
    res.render('payment', { title: 'Payment' });
});

app.get('/catalog', (req, res) => {
    res.render('prompts_catalog', { title: 'Prompts Catalog' });
});

app.get('/prompt', (req, res) => {
    res.render('prompt_detail', { title: 'Prompt Detail' });
});

app.listen(port, () => {
    console.log(`http://localhost:${port}`);});