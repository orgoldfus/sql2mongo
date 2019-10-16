const { parseToMongoQuery } = require("../../../src/mongoParser");

describe("mongoParser", () => {
  describe("parseToMongoQuery", () => {
    it("returns a mongo query object if received query is valid", () => {
      const validQuery = "SELECT * FROM someTable";

      const result = parseToMongoQuery(validQuery);

      expect(result).toEqual({});
    });
  });
});