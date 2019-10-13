const parseWhere = require("../../../lib/mongoParser/whereClause");

describe("parseWhere", () => {
  describe("type is Number", () => {
    it("should return a number", () => {
      const whereTree = { type: "Number", value: "42" };

      const result = parseWhere(whereTree);

      expect(result).toBe(42);
    });
  });

  describe("type is String", () => {
    it("should return a string", () => {
      const whereTree = { type: "String", value: "1337" };

      const result = parseWhere(whereTree);

      expect(result).toBe("1337");
    });

    it("should remove any redundant quotes", () => {
      const whereTree = { type: "String", value: "''Tooo many quates''" };

      const result = parseWhere(whereTree);

      expect(result).toBe("Tooo many quates");
    });
  });

  describe("type is InExpressionListPredicate (IN)", () => {
    it("should return a valid $in object", () => {
      const whereTree = {
        type: "InExpressionListPredicate",
        left: { type: "Identifier", value: "city" },
        right: {
          type: "ExpressionList",
          value: [
            { type: "String", value: "Jerusalem" },
            { type: "String", value: "Jaffa" }
          ]
        }
      };
      const expected = { city: { $in: ["Jerusalem", "Jaffa"] } };

      const result = parseWhere(whereTree);

      expect(result).toEqual(expected);
    });

    it("should return the correct type of values", () => {
      const whereTree = {
        type: "InExpressionListPredicate",
        left: { type: "Identifier", value: "busNumber" },
        right: {
          type: "ExpressionList",
          value: [
            { type: "Number", value: "1" },
            { type: "Number", value: "82" }
          ]
        }
      };
      const expected = { busNumber: { $in: [1, 82] } };

      const result = parseWhere(whereTree);

      expect(result).toEqual(expected);
    });
  });

  describe("type is LikePredicate (LIKE)", () => {
    it("should return a valid $regex object", () => {
      const whereTree = {
        type: "LikePredicate",
        left: { type: "Identifier", value: "city" },
        right: { type: "String", value: "%Jerusalem" }
      };
      const expected = { city: { $regex: "%Jerusalem" } };

      const result = parseWhere(whereTree);

      expect(result).toEqual(expected);
    });
  });

  describe("type is AndExpression (AND)", () => {
    it("should return a valid $or object", () => {
      const whereTree = {
        type: "AndExpression",
        operator: "AND",
        left: {
          type: "ComparisonBooleanPrimary",
          left: { type: "Identifier", value: "city" },
          operator: "=",
          right: { type: "String", value: "'Rio'" }
        },
        right: {
          type: "ComparisonBooleanPrimary",
          left: { type: "Identifier", value: "life" },
          operator: "=",
          right: { type: "Number", value: "42" }
        }
      };
      const expected = { city: "Rio", life: 42 };

      const result = parseWhere(whereTree);

      expect(result).toEqual(expected);
    });
  });

  describe("type is OrExpression (OR)", () => {
    it("should return a valid $or object", () => {
      const whereTree = {
        type: "OrExpression",
        operator: "OR",
        left: {
          type: "ComparisonBooleanPrimary",
          left: { type: "Identifier", value: "city" },
          operator: "=",
          right: { type: "String", value: "'Rio'" }
        },
        right: {
          type: "ComparisonBooleanPrimary",
          left: { type: "Identifier", value: "life" },
          operator: "=",
          right: { type: "Number", value: "42" }
        }
      };
      const expected = { $or: [{ city: "Rio" }, { life: 42 }] };

      const result = parseWhere(whereTree);

      expect(result).toEqual(expected);
    });
  });

  describe("type is ComparisonBooleanPrimary", () => {
    describe("operator is =", () => {
      it("should return a valid 'equals' object", () => {
        const whereTree = {
          type: "ComparisonBooleanPrimary",
          left: { type: "Identifier", value: "city" },
          operator: "=",
          right: { type: "String", value: "'Rio'" }
        };
        const expected = { city: "Rio" };

        const result = parseWhere(whereTree);

        expect(result).toEqual(expected);
      });
    });

    describe("operator is >", () => {
      it("should return a valid $gt object", () => {
        const whereTree = {
          type: "ComparisonBooleanPrimary",
          left: { type: "Identifier", value: "age" },
          operator: ">",
          right: { type: "Number", value: "18" }
        };
        const expected = { age: { $gt: 18 } };

        const result = parseWhere(whereTree);

        expect(result).toEqual(expected);
      });
    });

    describe("operator is <", () => {
      it("should return a valid $lt object", () => {
        const whereTree = {
          type: "ComparisonBooleanPrimary",
          left: { type: "Identifier", value: "age" },
          operator: "<",
          right: { type: "Number", value: "18" }
        };
        const expected = { age: { $lt: 18 } };

        const result = parseWhere(whereTree);

        expect(result).toEqual(expected);
      });
    });

    it("should throw an exception when operator is invalid", () => {
      const whereTree = {
        type: "ComparisonBooleanPrimary",
        left: { type: "Identifier", value: "age" },
        operator: "<>",
        right: { type: "Number", value: "18" }
      };

      expect(() => parseWhere(whereTree)).toThrow();
    });
  });

  describe("type is SimpleExprParentheses", () => {
    it("should return the value", () => {
      const whereTree = {
        type: "SimpleExprParentheses",
        value: {
          type: "ExpressionList",
          value: [{ type: "String", value: "Donald" }]
        }
      };

      const result = parseWhere(whereTree);

      expect(result).toBe("Donald");
    });
  });

  describe("type is ExpressionList", () => {
    it("should return an array of values", () => {
      const whereTree = {
        type: "ExpressionList",
        value: [
          { type: "String", value: "Ball" },
          { type: "Number", value: "18" }
        ]
      };

      const result = parseWhere(whereTree);

      expect(result).toStrictEqual(["Ball", 18]);
    });
  });
});
