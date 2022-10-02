var mysql = require('mysql');
// var pool = mysql.createPool({
//   connectionLimit : 10,
//   host            : 'classmysql.engr.oregonstate.edu',
//   user            : 'cs340_thielea',
//   password        : '4799',
//   database        : 'cs340_thielea'
// });
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'root',
  password        : 'qEAfs7WD40',
  database        : 'nfl_db'
});
module.exports.pool = pool;