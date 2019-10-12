const { getSqlAst, parseSelect } = require("../../lib/sql");

describe("sql", () => {
  describe("getSqlAst", () => {
    it("Throws an error if query is invalid", () => {
      const invalidQuery = "SELECT FROM someTable";

      expect(() => {
        getSqlAst(invalidQuery);
      }).toThrow();
    });

    it("Returns the AST if query is valid", () => {
      const validQuery = "SELECT * FROM someTable";

      const result = getSqlAst(validQuery);

      expect(result).toMatchSnapshot();
    });
  });

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
});
