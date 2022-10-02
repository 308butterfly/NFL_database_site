module.exports = function() {
  let express = require('express');
  let router = express.Router();

  function getPlayers(res, mysql, context, complete) {
    mysql.pool.query('SELECT * FROM players INNER JOIN teams WHERE teams_ID = ID_teams', (error, results, fields) => {
      if(error){
        res.write(JSON.stringify(error));
        res.end();
      }
      context.players = results;
      console.log(context.players);
      complete();
      
    });
  }

  function getTeams(res, mysql, context, complete) {
    mysql.pool.query('SELECT teams_ID, team_name FROM teams;', (error, results, fields) => {
      if(error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.teams = results;
      complete();
    });

  }

  router.get('/', (req, res) => {
    console.log("In players")
    let callbackCount = 0;
    let context = {};
    context.jsscripts =[];
    let mysql = req.app.get('mysql');
    getPlayers(res, mysql, context, complete);
    getTeams(res, mysql, context, complete);
    function complete() {
      callbackCount++;
      if(callbackCount >= 2){
        res.render('players', context);
      }
    } 
  });

  router.post('/', (req,res) => {
    console.log(req.body.players);
    console.log(req.body);
    let mysql = req.app.get('mysql');
    let insertN2Players = 'INSERT INTO players (player_first_name, player_last_name, position, player_number, ID_teams) VALUES(?,?,?,?,?)';
    let inserts = [req.body.player_first_name, req.body.player_last_name, req.body.position, req.body.player_number, req.body.ID_teams];
    insertN2Players = mysql.pool.query(insertN2Players, inserts, (error, results, fields) => {
      if(error) {
        console.log(JSON.stringify(error));
        res.write(JSON.stringify(error));
        res.end();
      } else {
        res.redirect('/players');
      }
    })
  });


// update router
  router.put('/:id', (req, res) => {

  });
// delete router
  router.delete('/:id', (req, res) => {

  });

  return router;
}();