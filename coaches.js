module.exports = function () {
  let express = require('express');
  let router = express.Router();

  function getCoaches(res, mysql, context, complete) {
    mysql.pool.query('SELECT * FROM coaches INNER JOIN teams WHERE ID_teams = teams_ID', (error, results, fields) => {
      if (error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.coaches = results;
      console.log(context.coaches);
      complete();
    });
  }
  function getTeams(res, mysql, context, complete) {
    mysql.pool.query('SELECT teams_ID, team_name FROM teams', (error, results, fields) => {
      if (error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.teams = results;
      console.log(context.teams);
      complete();
    });
  }

  router.get('/', (req, res) => {
    console.log("In coaches")
    let callbackCount = 0;
    let context = {};
    context.jssscripts = [];
    let mysql = req.app.get('mysql');
    getCoaches(res, mysql, context, complete);
    getTeams(res, mysql, context, complete);
    function complete() {
      callbackCount++;
      if(callbackCount >= 2){
        res.render('coaches', context);
      }
    }
  });

  router.post('/', (req,res) => {
    console.log(req.body.coaches);
    console.log(req.body);
    let mysql = req.app.get('mysql');
    let insertN2Coaches = 'INSERT INTO coaches (coach_first_name, coach_last_name, ID_teams, career_wins, career_loses) VALUES(?,?,?,?,?)';
    let inserts =[req.body.coach_first_name, req.body.coach_last_name, req.body.ID_teams, req.body.career_wins, req.body.career_loses];
    insertN2Coaches = mysql.pool.query(insertN2Coaches, inserts, (error, results, fields) => {
      if(error) {
        console.log(JSON.stringify(error));
        res.write(JSON.stringify(error));
        res.end();
      } else {
        res.redirect('/coaches');
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