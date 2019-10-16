const parseSelect = require("../../../src/mongoParser/selectClause");

describe("parseSelect", () => {
  it("returns an empty object if Asterisk is passed", () => {
    const asteriskSelectValue = [{ value: "*", type: "Identifier" }];

    const result = parseSelect(asteriskSelectValue);

    expect(result).toMatchObject({});
  });

  it("returns a valid object if fields are passed", () => {
    const fieldsSelectValue = [
      { value: "name", type: "Identifier" },
      { value: "age", type: "Identifier" },
      { value: "city", type: "Identifier" }
    ];

    const result = parseSelect(fieldsSelectValue);

    expect(result).toMatchObject({ name: 1, age: 1, city: 1 });
  });
});
