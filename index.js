const parseToMongoQuery = require("./lib/mongoParser");

function parse (sqlQuery) {
  return parseToMongoQuery(sqlQuery);
}

module.exports = {
  parse
};