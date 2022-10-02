module.exports = function() {
  let express = require('express');
  let router = express.Router();

  function getTeams(res, mysql, context, complete) {
    // mysql.pool.query('SELECT * FROM teams INNER JOIN coaches ON ID_teams = teams_ID INNER JOIN stadiums ON stadiums_ID = ID_stadiums; ', (error, results, fields) => {
    mysql.pool.query('SELECT * FROM teams INNER JOIN stadiums ON stadiums_ID = ID_stadiums; ', (error, results, fields) => {
      if(error){
        res.write(JSON.stringify(error));
        res.end();
      }
      context.teams = results;
      console.log(context.teams);
      complete();
      
    });
  }

  function getStadiums(res, mysql, context, complete) {
    mysql.pool.query('SELECT * FROM stadiums ORDER BY stadium_name ASC', (error, results, fields) => {
      if(error){
        res.write(JSON.stringify(error));
        res.end();
      }
      context.stadiums = results;
      console.log(context.stadiums);
      complete();
      
    });
  }

  router.get('/', (req, res) => {
    console.log("In teams")
    let callbackCount = 0;
    let context = {};
    context.jsscripts =[];
    let mysql = req.app.get('mysql');
    getTeams(res, mysql, context, complete);
    getStadiums(res, mysql, context, complete);
    function complete() {
      callbackCount++;
      if(callbackCount >= 2) {
        res.render('teams', context);
      }
    }
  });

  router.post('/', (req,res) => {
    console.log(req.body.teams);
    console.log(req.body);
    let mysql = req.app.get('mysql');
    let insertN2Teams = 'INSERT INTO teams (team_name, owner_first_name, owner_last_name, team_wins, team_loses, team_ties, ID_stadiums) VALUES (?,?,?,?,?,?,?)';
    let inserts = [req.body.team_name, req.body.owner_first_name, req.body.owner_last_name, req.body.team_wins, req.body.team_loses, req.body.team_ties, req.body.ID_stadiums];
    insertN2Teams = mysql.pool.query(insertN2Teams, inserts, (error, results, fields) => {
      if(error) {
        console.log(JSON.stringify(error));
        res.write(JSON.stringify(error));
        res.end();
      } else {
        res.redirect('/teams');
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