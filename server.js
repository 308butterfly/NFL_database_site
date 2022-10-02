const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('./public/js/dbcon.js');

const app = express();
const handlebars = require('express-handlebars').create({
  defaultLayout: 'main'
});

app.engine('handlebars', handlebars.engine);
app.use(bodyParser.urlencoded({extended:true}));
app.use('/static', express.static('public'));
app.set('view engine', 'handlebars');
app.set('port', process.argv[2]);
app.set('mysql', mysql);
app.use('/coaches',require('./routes/coaches.js'));
app.use('/games',require('./routes/games.js'));
app.use('/players',require('./routes/players.js'));
app.use('/stadiums', require('./routes/stadiums.js'));
app.use('/teams',require('./routes/teams.js'));
app.use('/', express.static('public'));

app.use((req,res) => {
  res.status(404);
  res.render('404');
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500);
  res.render('505');
});


app.listen(app.get('port'), () =>{
  console.log("Server started on " + app.get('port'));
});