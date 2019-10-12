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

module.exports = parseSelect;
