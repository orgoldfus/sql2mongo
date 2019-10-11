const { getSqlAst } = require("./sql");

function parseToMongoQuery(sqlQuery) {
  const ast = getSqlAst(sqlQuery);
  console.log(JSON.stringify(ast));

  return {};
}

module.exports = parseToMongoQuery;