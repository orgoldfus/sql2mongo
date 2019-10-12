const sqlParser = require("js-sql-parser");

function getSqlAst(query) {
  try {
    return sqlParser.parse(query);
  } catch (error) {
    throw new Error(`Received query is invalid. ${error.message}`);
  }
}

function parseSelect(selectValues) {
  if (selectValues.length === 1 && selectValues[0].value === "*") {
    return {};
  }

  // _id = 1 by default
  return selectValues.reduce((acc, field) => {
    acc[field.value] = 1;
    return acc;
    // TODO: Handle functions
  }, {});
}

function parseWhere(whereTree) {
  switch (whereTree.type) {
  case "InExpressionListPredicate":
    return handleInOperator(whereTree);
  case "LikePredicate":
    return handleLikeOperator(whereTree);
  case "AndExpression":
    return handleAndExpression(whereTree);
  case "OrExpression":
    return handleOrExpression(whereTree);
  case "ComparisonBooleanPrimary":
    return handleComparisonOperator(whereTree);
  case "SimpleExprParentheses":
    return parseWhere(whereTree.value.value[0]);
  case "FunctionCall":
    return "HandleFunctionCall"; // TODO: Handle function call
  case "String":
    return whereTree.value.replace(/['"]+/g, "");
  case "Number":
    return +whereTree.value;
  default:
    throw new Error(`Unsupported expression type: ${whereTree.type}`);
  }
}

function handleAndExpression(whereTree) {
  return Object.assign(
    {},
    parseWhere(whereTree.left),
    parseWhere(whereTree.right)
  );
}

function handleOrExpression(whereTree) {
  return {
    $or: [parseWhere(whereTree.left), parseWhere(whereTree.right)]
  };
}

function handleInOperator(whereTree) {
  return {
    [whereTree.left.value]: {
      $in: whereTree.right.value.map(curr => parseWhere(curr))
    }
  };
}

function handleLikeOperator(whereTree) {
  return {
    [whereTree.left.value]: {
      // TODO: convert SQL to Mongo regex
      $regex: parseWhere(whereTree.right)
    }
  };
}

function handleComparisonOperator(whereTree) {
  switch (whereTree.operator) {
  case "=":
    return {
      [whereTree.left.value]: parseWhere(whereTree.right)
    };
  case "<":
  case ">":
    return {
      [whereTree.left.value]: {
        [getEqulityOperator(whereTree.operator)]: parseWhere(whereTree.right)
      }
    };
  default:
    throw new Error(`Unsupported operator: ${whereTree.operator}`);
  }
}

function getEqulityOperator(sqlOperator) {
  switch (sqlOperator) {
  case ">":
    return "$gt";
  case "<":
    return "$lt";
  default:
    throw new Error(`Unsupported operator: ${sqlOperator}`);
  }
}

module.exports = {
  getSqlAst,
  parseSelect,
  parseWhere
};
