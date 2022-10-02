module.exports = function () {
  let express = require('express');
  let router = express.Router();

  function getGames(res, mysql, context, complete) {
    // need to add date formatting and stadium query
    let queryString = 'SELECT ht.games_ID, \
                              ht.team_name AS home_team, \
                              gt.team_name AS guest_team, \
                              ht.home_score, \
                              ht.guest_score, \
                        DATE_FORMAT(ht.game_date, "%M %d, %Y") AS game_date\
                        FROM (SELECT games_ID, team_name, home_score, guest_score, game_date \
                        FROM games INNER JOIN teams ON ID_teams_home = teams_ID) AS ht \
                        INNER JOIN (SELECT games_ID, team_name FROM games \
                        INNER JOIN teams ON ID_teams_guest = teams_ID) \
                        AS gt WHERE gt.games_ID = ht.games_ID;';

    mysql.pool.query(queryString, (error, results, fields) => {
      if (error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.games = results;
      console.log(context.games);
      complete();
    });
  }

  function getTeams(res, mysql, context, complete) {
    mysql.pool.query('SELECT teams_ID, team_name FROM teams;', (error, results, fields) => {
      if (error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.teams = results;
      complete();
    });

  }

  function getStadiums(res, mysql, context, complete) {
    mysql.pool.query('SELECT stadiums_ID, stadium_name FROM stadiums;', (error, results, fields) => {
      if (error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.stadiums = results;
      complete();
    });

  }


  router.get('/', (req, res) => {
    console.log("In games")
    let callbackCount = 0;
    let context = {};
    context.jsscripts = ["delete.js", "insert.js", "validate.js"];
    let mysql = req.app.get('mysql');
    getGames(res, mysql, context, complete);
    getTeams(res, mysql, context, complete);
    getStadiums(res, mysql, context, complete);
    function complete() {
      callbackCount++;
      if (callbackCount >= 3){
        console.log(context);
        res.render('games', context);
        
      }
    }
  });

  router.post('/', (req, res) => {
    console.log(req.body.games);
    console.log(req.body);
    let mysql = req.app.get('mysql');
    let insertN2Games = 'INSERT INTO games (ID_teams_home, ID_teams_guest, home_score, guest_score, game_date) VALUES (?,?,?,?,?)';
    let inserts = [req.body.ID_teams_home, req.body.ID_teams_guest, req.body.home_score, req.body.guest_score, req.body.game_date];
    insertN2Games = mysql.pool.query(insertN2Games, inserts, (error, results, fields) => {
      if (error) {
        console.log(JSON.stringify(error));
        res.write(JSON.stringify(error));
        res.end();
      } else {
        res.redirect('/games');
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