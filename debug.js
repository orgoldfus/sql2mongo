const sql2mongo = require("./index");

// sql2mongo.parse(
//   `
//   SELECT * 
//   FROM inventory 
//   WHERE city = NESTED("{a: 13, abv: 15, dol: 'hi'}")
//   `
// );

sql2mongo.getMongoQuery("city = 'Jerusalem' AND (age > 18 OR name = 'Moses')");