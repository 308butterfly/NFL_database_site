module.exports = function() {
  let express = require('express');
  let router = express.Router();

  function getStadiums(res, mysql, context, complete) {
    // mysql.pool.query('SELECT * FROM stadiums INNER JOIN teams WHERE stadiums_ID = ID_stadiums', (error, results, fields) => {
    mysql.pool.query('SELECT * FROM stadiums;', (error, results, fields) => {
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
    console.log("In stadiums")
    // let callbackCount = 0;
    let context = {};
    context.jsscripts =[];
    let mysql = req.app.get('mysql');
    getStadiums(res, mysql, context, complete);
    function complete() {
      res.render('stadiums', context);
    }
  });

  router.post('/', (req,res) => {
    console.log(req.body.stadiums);
    console.log(req.body);
    let mysql = req.app.get('mysql');
    let insertN2Stadiums = 'INSERT INTO stadiums (stadium_name, capacity, city, state, country) VALUES (?,?,?,?,?)';
    let inserts = [req.body.stadium_name, req.body.capacity, req.body.city, req.body.state, req.body.country];
    insertN2Stadiums = mysql.pool.query(insertN2Stadiums, inserts, (error, results, fields) => {
      if(error) {
        console.log(JSON.stringify(error));
        res.write(JSON.stringify(error));
        res.end();
      } else {
        res.redirect('/stadiums');
      }
    })
  });

// update router
  router.put('/:id', (req, res) => {

  });
// delete router
  router.delete('/:id', (req, res) => {
    let mysql = req.app.get('mysql');
    let deleteQuery ='DELETE FROM stadiums WHERE stadiums_ID = ?';
    let removal = [req.params.stadiums_ID];
    deleteQuery = mysql.pool.query(deleteQuery, removal, (error, results, fields) =>{
      if(error){
        console.log(error);
        res.write(JSON.stringify(error));
        res.status(400);
        res.end();
      } else{
        res.status(202).end();
      }
    })

  });

  return router;
}();