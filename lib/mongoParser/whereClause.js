function parseWhere(whereTree) {
  if (!whereTree) return;

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
  case "ExpressionList":
    return handleExpressionList(whereTree);
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
      $in: parseWhere(whereTree.right)
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

function handleExpressionList(whereTree) {
  return whereTree.value.map(curr => parseWhere(curr));
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

module.exports = parseWhere;
