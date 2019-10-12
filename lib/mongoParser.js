const { getSqlAst, parseSelect } = require("./sql");

function parseToMongoQuery(sqlQuery) {
  const ast = getSqlAst(sqlQuery);
  console.log(JSON.stringify(ast));
  
  const intermediateObject = parseAst(ast);

  return {};
}

function parseAst(ast) {
  const select = parseSelect(ast.value.selectItems.value);

  return {
    select
  };
}

module.exports = parseToMongoQuery;