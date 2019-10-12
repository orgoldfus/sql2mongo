const sqlParser = require("js-sql-parser");

function getSqlAst(query) {
  try {
    return sqlParser.parse(query);
  } catch (error) {
    throw new Error(`Received query is invalid. ${error.message}`);
  }
}

function parseSelect(selectValues) {
  if(selectValues.length === 1 && selectValues[0].value === "*") {
    return {};
  }

  // _id = 1 by default
  return selectValues.reduce((acc, field) => {
    acc[field.value] = 1;
    return acc;
    // TODO: Handle functions
  }, {});
}

module.exports = {
  getSqlAst,
  parseSelect
};