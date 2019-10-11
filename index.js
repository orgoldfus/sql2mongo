const sqlParser = require('js-sql-parser')

function parse (sqlQuery) {
  const ast = sqlParser.parse(sqlQuery)
  console.log(JSON.stringify(ast))
  return {}
}

parse("SELECT * from foo where name='Marco'")

exports.parse = parse