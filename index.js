const { parseToMongoQuery, getMongoQueryObject } = require("./lib/mongoParser");

function parse(sqlQuery) {
  return parseToMongoQuery(sqlQuery);
}

function getMongoQuery(whereClause) {
  const query = `SELECT * FROM table WHERE ${whereClause}`;
  return getMongoQueryObject(query);
}

module.exports = {
  parse,
  getMongoQuery
};
