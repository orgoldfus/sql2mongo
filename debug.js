const sql2mongo = require("./index");

// sql2mongo.parse(
//   `
//   SELECT * 
//   FROM inventory 
//   WHERE city = NESTED("{a: 13, abv: 15, dol: 'hi'}")
//   `
// );

const result = sql2mongo.getMongoQuery(`
  (age > 10 AND
  city = NESTED("
    postcode = 1234 AND 
    population > 1000 AND 
    country = NESTED('yearOfStart > 1984')
  ")) OR
  city.population > 9999999`);

console.log(JSON.stringify(result, null, 2));