module.exports = function () {
    let express = require('express');
    let router = express.Router();
    
    router.get('/', (req, res) => {
      console.log("In coaches");
      res.render('landing' );
    });
  
    return router;
  }();