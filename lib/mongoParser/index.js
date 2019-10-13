const getSqlAst = require("../sql");
const parseSelect = require("./selectClause");
const parseWhere = require("./whereClause");

function parseToMongoQuery(sqlQuery) {
  const ast = getSqlAst(sqlQuery);
  // console.log(JSON.stringify(ast));
  
  const intermediateObject = parseAst(ast);

  return {};
}

function parseAst(ast) {
  const select = parseSelect(ast.value.selectItems.value);
  const where = parseWhere(ast.value.where);

  return {
    select,
    where
  };
}

function getMongoQueryObject(sqlQuery) {
  const ast = getSqlAst(sqlQuery);
  const mongoQuery = parseWhere(ast.value.where);

  return mongoQuery;
}

module.exports = {
  parseToMongoQuery,
  getMongoQueryObject
};