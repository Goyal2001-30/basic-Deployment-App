const express = require('express')
const routes = require('./routes/routes.js')
const path = require('path');
const app = express();
const PORT = process.env.PORT || 80;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', routes);
app.get('/login', routes);
app.get('/register', routes);
app.get('/dashboard', routes);
app.get('/logout', routes);



app.post('/login', routes);
app.post('/register', routes);


app.listen(PORT, () => {
    console.log('App successfully started', PORT);
})