import { getRandomInt, currencyFormat, expenseTypeFormat } from "./utils";

describe("Utils Functions", () => {
  describe("getRandomInt", () => {
    test("returns a random integer within the specified range", () => {
      const min = 1;
      const max = 10;
      const randomInt = getRandomInt(min, max);

      expect(randomInt).toBeGreaterThanOrEqual(min);
      expect(randomInt).toBeLessThanOrEqual(max);
      expect(Number.isInteger(randomInt)).toBe(true);
    });

    test("returns the same value when min and max are equal", () => {
      const min = 5;
      const max = 5;
      const randomInt = getRandomInt(min, max);

      expect(randomInt).toBe(5);
    });
  });

  describe("currencyFormat", () => {
    test("formats a number as currency", () => {
      expect(currencyFormat(1234.56)).toBe("$1,234.56");
      expect(currencyFormat(1000000)).toBe("$1,000,000.00");
    });

    test("returns $0.00 when the input is null or undefined", () => {
      expect(currencyFormat(null)).toBe("$0.00");
      expect(currencyFormat(undefined)).toBe("$0.00");
    });

    test("formats 0 correctly", () => {
      expect(currencyFormat(0)).toBe("$0.00");
    });
  });

  describe("expenseTypeFormat", () => {
    const expenseTypes = [
      { id: 1, name: "Fuel" },
      { id: 2, name: "Maintenance" },
      { id: 3, name: "Tolls" },
    ];

    test("returns the correct expense type name for a valid id", () => {
      expect(expenseTypeFormat(1, expenseTypes)).toBe("Fuel");
      expect(expenseTypeFormat(2, expenseTypes)).toBe("Maintenance");
      expect(expenseTypeFormat(3, expenseTypes)).toBe("Tolls");
    });

    test("returns 'Unknown' for an invalid id", () => {
      expect(expenseTypeFormat(999, expenseTypes)).toBe("Unknown");
      expect(expenseTypeFormat(null, expenseTypes)).toBe("Unknown");
    });

    test("returns 'Unknown' when expenseTypes is empty", () => {
      expect(expenseTypeFormat(1, [])).toBe("Unknown");
    });
  });
});