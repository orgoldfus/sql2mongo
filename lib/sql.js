const sqlParser = require("js-sql-parser");

function getSqlAst(query) {
  try {
    return sqlParser.parse(query);
  } catch (error) {
    throw new Error(`Received query is invalid. ${error.message}`);
  }
}

module.exports = {
  getSqlAst
};