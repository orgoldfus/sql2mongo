const { getMongoQueryObject } = require("./lib/mongoParser");

function getMongoQuery(whereClause) {
  const query = `SELECT * FROM table WHERE ${whereClause}`;
  return getMongoQueryObject(query);
}

module.exports = {
  getMongoQuery
};
