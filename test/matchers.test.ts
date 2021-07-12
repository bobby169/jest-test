describe("expect matchers", () => {
  test("two plus two is four", () => {
    console.dir(jest);
    expect(2 + 2).toBe(4);
  });
  test("adding positive numbers is not zero", () => {
    for (let a = 1; a < 10; a++) {
      for (let b = 1; b < 10; b++) {
        expect(a + b).not.toBe(0);
      }
    }
  });
  test("object assignment", () => {
    const data = { one: 1 };
    data["two"] = 2;
    // If you want to check the value of an object, use `toEqual` instead
    // `toEqual` recursively checks every field of an object or array
    expect(data).toEqual({ one: 1, two: 2 });
  });

  describe("Truthiness", () => {
    test("null", () => {
      const n = null;
      expect(n).toBeNull();
      expect(n).toBeDefined();
      expect(n).not.toBeUndefined();
      expect(n).not.toBeTruthy();
      expect(n).toBeFalsy();
    });
    test("zero", () => {
      const z = 0;
      expect(z).not.toBeNull();
      expect(z).toBeDefined();
      expect(z).not.toBeUndefined();
      expect(z).not.toBeTruthy();
      expect(z).toBeFalsy();
    });
  });

  describe("numbers", () => {
    test("two plus two", () => {
      const value = 2 + 2;
      expect(value).toBeGreaterThan(3);
      expect(value).toBeGreaterThanOrEqual(3.5);
      expect(value).toBeLessThan(5);
      expect(value).toBeLessThanOrEqual(4.5);

      // toBe and toEqual are equivalent for numbers
      expect(value).toBe(4);
      expect(value).toEqual(4);
    });
    test("adding floating point numbers", () => {
      const value = 0.1 + 0.2;
      //expect(value).toBe(0.3); // This won't work because of rounding error
      expect(value).toBeCloseTo(0.3); // This works.
    });
  });

  describe("Strings", () => {
    test("there is no I in team", () => {
      expect("team").not.toMatch(/I/);
    });

    test('but there is a "stop" in Christoph', () => {
      expect("Christoph").toMatch(/stop/);
    });
  });

  describe("Arrays and iterables", () => {
    const shoppingList = [
      "diapers",
      "kleenex",
      "trash bags",
      "paper towels",
      "milk",
    ];

    test("the shopping list has milk on it", () => {
      expect(shoppingList).toContain("milk");
      expect(new Set(shoppingList)).toContain("milk");
    });
  });

  describe("Exceptions", () => {
    function compileAndroidCode() {
      throw new Error("you are using the wrong JDK");
    }

    test("compiling android goes as expected", () => {
      expect(() => compileAndroidCode()).toThrow();
      expect(() => compileAndroidCode()).toThrow(Error);

      // You can also use the exact error message or a regexp
      expect(() => compileAndroidCode()).toThrow("you are using the wrong JDK");
      expect(() => compileAndroidCode()).toThrow(/JDK/);
    });
  });

  describe("async", () => {
    function fetchData(bool = true) {
      return new Promise((resolve, reject) => {
        if (bool) {
          resolve("peanut butter");
        } else {
          reject("error test");
        }
      });
    }
    test("callback", (done) => {
      async function fetchData(callback) {
        const promise = new Promise((resolve, reject) => {
          resolve("peanut butter");
          // reject("error test");
        });
        const data = await promise;
        callback(data);
      }

      function callback(data) {
        try {
          expect(data).toBe("peanut butter");
          done();
        } catch (error) {
          done(error);
        }
      }

      fetchData(callback);
    });

    test("then", () => {
      return fetchData().then((data) => {
        expect(data).toBe("peanut butter");
      });
    });

    test("catch", () => {
      expect.assertions(1); // 确保添加expect.assertions以验证调用了一定数量的断言。否则，已完成的promise不会通过测试。
      return fetchData(false).catch((e) => expect(e).toMatch("error"));
    });

    test("resolves", () => {
      // use the .resolves matcher in your expect statement, and Jest will wait for that promise to resolve.
      // If the promise is rejected, the test will automatically fail.
      return expect(fetchData()).resolves.toBe("peanut butter");
    });

    test("rejects", () => {
      return expect(fetchData(false)).rejects.toMatch("error");
    });

    test("async/await", async () => {
      const data = await fetchData();
      expect(data).toBe("peanut butter");
    });

    test("async/await", async () => {
      expect.assertions(1);
      try {
        await fetchData(false);
      } catch (e) {
        expect(e).toMatch("error");
      }
    });

    test("combine async and await with .resolves or .rejects.", async () => {
      await expect(fetchData()).resolves.toBe("peanut butter");
    });

    test("combine async and await with .resolves or .rejects.", async () => {
      await expect(fetchData(false)).rejects.toMatch("error");
    });
  });
});
