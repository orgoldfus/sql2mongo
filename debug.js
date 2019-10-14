const sql2mongo = require("./index");

// sql2mongo.parse(
//   `
//   SELECT * 
//   FROM inventory 
//   WHERE city = NESTED("{a: 13, abv: 15, dol: 'hi'}")
//   `
// );

const result = sql2mongo.getMongoQuery(`
  NOT age > 4
`);

console.log(JSON.stringify(result, null, 2));