import utils from "./utils";
// 如果在jest.config.ts开启了automock: true可以注释掉下面
jest.mock("./utils"); // 自动把utils中的函数变成jest.fn()，拥有jest.fn()的属性和方法

// jest.disableAutomock(); // 如果开启自动模拟，可以用jest.disableAutomock()关闭自动模拟。这个应该放到最顶层，

describe("mock function", () => {
  function forEach(items, callback) {
    for (let index = 0; index < items.length; index++) {
      callback(items[index]);
    }
  }

  test("mock", () => {
    const mockCallback = jest.fn((x) => 42 + x);
    console.dir(mockCallback);
    forEach([0, 1], mockCallback);

    // The mock function is called twice
    console.info(mockCallback.mock);
    expect(mockCallback.mock.calls.length).toBe(2);

    // The first argument of the first call to the function was 0
    expect(mockCallback.mock.calls[0][0]).toBe(0);

    // The first argument of the second call to the function was 1
    expect(mockCallback.mock.calls[1][0]).toBe(1);

    // The return value of the first call to the function was 42
    expect(mockCallback.mock.results[0].value).toBe(42);
  });

  test("mock.instances", () => {
    const myMock = jest.fn();

    const a = new myMock();
    const b = {};
    const bound = myMock.bind(b);
    bound();

    console.log(myMock.mock.instances);
    // > [ <a>, <b> ]
    expect(myMock.mock.instances.length).toBe(2);
    expect(myMock.mock.instances[0]).toEqual(a);
    expect(myMock.mock.instances[1]).toEqual(b);
  });

  test("Mock Return Values", () => {
    const myMock = jest.fn();
    console.log(myMock());
    // > undefined

    myMock
      .mockReturnValueOnce(10)
      .mockReturnValueOnce("x")
      .mockReturnValue(true);

    // console.log(myMock(), myMock(), myMock(), myMock());
    // > 10, 'x', true, true
    expect(myMock()).toBe(10);
    expect(myMock()).toBe("x");
    expect(myMock()).toBe(true);
    expect(myMock()).toBe(true);
  });

  test("Mock Return Values", () => {
    const filterTestFn = jest.fn();

    // Make the mock return `true` for the first call,
    // and `false` for the second call
    filterTestFn.mockReturnValueOnce(true).mockReturnValueOnce(false);

    const result = [11, 12].filter((num) => filterTestFn(num));
    expect(result).toStrictEqual([11]);
    expect(filterTestFn.mock.calls[0][0]).toBe(11);
    expect(filterTestFn.mock.calls[1][0]).toBe(12);
  });

  describe("auto mock", () => {
    test("if utils are mocked", () => {
      // console.dir(utils);
      expect(utils.authorize.mock).toBeTruthy();
      expect(utils.isAuthorized.mock).toBeTruthy();
    });

    test("mocked implementation", () => {
      utils.authorize.mockReturnValue("mocked_token");
      utils.isAuthorized.mockReturnValue(true);

      expect(utils.authorize()).toBe("mocked_token");
      expect(utils.isAuthorized("not_wizard")).toBeTruthy();
    });
  });

  describe("disable auto mocking", () => {
    // jest.autoMockOff();
    // jest.unmock("./utils");

    test("original implementation", () => {
      expect(utils.authorize()).toBe("token");
    });
  });

  describe("create mock from module", () => {
    test("implementation created by automock", () => {
      expect(utils.authorize("wizzard")).toBeUndefined();
      expect(utils.isAuthorized()).toBeUndefined();
    });

    test("implementation created by jest.createMockFromModule", () => {
      const utils = jest.createMockFromModule("./utils").default;
      utils.isAuthorized = jest.fn((secret) => secret === "not wizard");

      expect(utils.authorize.mock).toBeTruthy();
      expect(utils.isAuthorized("not wizard")).toEqual(true);
    });
  });
});
