const { getSqlAst } = require("../../lib/sql");

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
});