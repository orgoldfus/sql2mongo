const sql2mongo = require("./index");

sql2mongo.parse(
  `SELECT *
  FROM exampleTable
  WHERE name='Marco' OR
        (age > 15 AND
        city IS NOT NULL)
  LIMIT 5`
);
