const getSqlAst = require("../sql");

function parseWhere(whereTree) {
  if (!whereTree) return;
  else if (whereTree.hasNot && whereTree.type !== "InExpressionListPredicate") {
    const notValueTree = Object.assign({}, whereTree, { hasNot: false });
    const notValue = parseWhere(notValueTree);

    return handleNotExpression(notValue);
  }

  switch (whereTree.type) {
  case "InExpressionListPredicate":
    return handleInOperator(whereTree);
  case "LikePredicate":
    return handleLikeOperator(whereTree);
  case "AndExpression":
    return handleAndExpression(whereTree);
  case "OrExpression":
    return handleOrExpression(whereTree);
  case "NotExpression":
    return handleNotExpression(parseWhere(whereTree.value));
  case "IsNullBooleanPrimary":
    return handleIsNullExpression(whereTree);
  case "ComparisonBooleanPrimary":
    return handleComparisonOperator(whereTree);
  case "SimpleExprParentheses":
    return parseWhere(whereTree.value.value[0]);
  case "FunctionCall":
    return handleFunctionCall(whereTree);
  case "ExpressionList":
    return handleExpressionList(whereTree);
  case "BetweenPredicate":
    return handleBetweenPredicate(whereTree);
  case "Identifier":
  case "String":
    return whereTree.value.replace(/['"]+/g, "");
  case "Number":
    return +whereTree.value;
  case "Boolean":
    return whereTree.value.toLowerCase() === "true";
  case "Null":
    return null;
  default:
    throw new Error(`Unsupported expression type: ${whereTree.type}`);
  }
}

function handleAndExpression(whereTree) {
  const left = parseWhere(whereTree.left);
  const right = parseWhere(whereTree.right);

  if (Object.keys(left)[0] === "$and") {
    left["$and"].push(right);
    return left;
  }

  return {
    $and: [left, right]
  };
}

function handleOrExpression(whereTree) {
  const left = parseWhere(whereTree.left);
  const right = parseWhere(whereTree.right);

  if (Object.keys(left)[0] === "$or") {
    left["$or"].push(right);
    return left;
  }

  return {
    $or: [left, right]
  };
}

function handleNotExpression(notValue) {
  const field = Object.keys(notValue)[0];
  const value = Object.values(notValue)[0];

  return { [field]: { [typeof value !== Object ? "$ne" : "$not"]: value } };
}

function handleInOperator(whereTree) {
  return {
    [whereTree.left.value]: {
      [whereTree.hasNot ? "$nin" : "$in"]: parseWhere(whereTree.right)
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

function handleFunctionCall(whereTree) {
  if (whereTree.name === "NESTED") {
    try {
      let nestedWhereTree;
      const nestedWhereStr = whereTree.params[0].value;
      if (nestedWhereStr) {
        const nestedQuery = composeNestedQuery(nestedWhereStr);
        const nestedQueryAST = getSqlAst(nestedQuery);
        nestedWhereTree = nestedQueryAST.value.where;
      } else {
        nestedWhereTree = whereTree.params[0];
      }

      return parseWhere(nestedWhereTree);
    } catch (error) {
      throw new Error(`Invalid nested query. ${error.message}`);
    }
  }

  throw new Error(`Function ${whereTree.name} is not supported`);
}

function handleExpressionList(whereTree) {
  return whereTree.value.map(curr => parseWhere(curr));
}

function handleIsNullExpression(whereTree) {
  return { [whereTree.value.value]: null };
}

function handleBetweenPredicate(whereTree) {
  return {
    [whereTree.left.value]: {
      $gt: parseWhere(whereTree.right.left),
      $lt: parseWhere(whereTree.right.right)
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
  case "<=":
  case ">":
  case ">=":
  case "<>":
  case "!=":
    return {
      [whereTree.left.value]: {
        [getEqulityOperator(whereTree.operator)]: parseWhere(whereTree.right)
      }
    };
  default:
    throw new Error(`Unsupported operator: ${whereTree.operator}`);
  }
}

function composeNestedQuery(where) {
  return `
    SELECT * 
    FROM nested 
    WHERE ${where}
    `
    .replace(/(\r\n|\n|\r|['"]+)/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getEqulityOperator(sqlOperator) {
  switch (sqlOperator) {
  case ">":
    return "$gt";
  case ">=":
    return "$gte";
  case "<":
    return "$lt";
  case "<=":
    return "$lte";
  case "<>":
  case "!=":
    return "$ne";
  default:
    throw new Error(`Unsupported operator: ${sqlOperator}`);
  }
}

module.exports = parseWhere;
