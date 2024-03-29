import Equality from "./Equality.js";

// safeEquals...........................................................................................................
test("safeEquals undefined/undefined true", () => {
    const left = undefined;
    const right = undefined;
    expect(Equality.safeEquals(left, right)).toBeTrue();
});

test("safeEquals undefined/null true", () => {
    const left = undefined;
    const right = null;
    expect(Equality.safeEquals(left, right)).toBeTrue();
});

test("safeEquals undefined/0 false", () => {
    const left = undefined;
    const right = 9;
    expect(Equality.safeEquals(left, right)).toBeFalse();
});

test("safeEquals null/null true", () => {
    const left = null;
    const right = null;
    expect(Equality.safeEquals(left, right)).toBeTrue();
});

test("safeEquals null/non null false", () => {
    const left = null;
    const right = 1;
    expect(Equality.safeEquals(left, right)).toBeFalse();
});

test("safeEquals non null/null false", () => {
    const left = 1;
    const right = null;
    expect(Equality.safeEquals(left, right)).toBeFalse();
});

test("safeEquals equals false", () => {
    const left = 1;
    const right = 2;
    expect(Equality.safeEquals(left, right)).toBeFalse();
});

test("safeEquals equals truthy false", () => {
    const left = 1;
    const right = "1";
    expect(Equality.safeEquals(left, right)).toBeFalse();
});

test("safeEquals equals true", () => {
    const left = 1;
    const right = 1;
    expect(Equality.safeEquals(left, right)).toBeTrue();
});

test("safeEquals equals implements equals false", () => {
    const right = 1;
    const left = {
        equals: function() {
            return false
        },
    }
    expect(Equality.safeEquals(left, right)).toBeFalse();
});

test("safeEquals equals implements equals true", () => {
    const right = 1;
    const left = {
        equals: function() {
            return true
        },
    }
    expect(Equality.safeEquals(left, right)).toBeTrue();
});

test("safeEquals equals objects true", () => {
    const left = {
        "a": 1,
        "b": {
            "c": 2,
        }
    };
    const right = {
        "a": 1,
        "b": {
            "c": 2,
        }
    };
    expect(Equality.safeEquals(left, right)).toBeTrue();
});

test("safeEquals equals objects false", () => {
    const left = {
        "a": 1,
        "b": {
            "c": 23,
        }
    };
    const right = {
        "a": 1,
        "b": {
            "c": 24,
        }
    };
    expect(Equality.safeEquals(left, right)).toBeFalse();
});

test("safeEquals equals Map true", () => {
    const left = new Map();
    left.set("A", 1);
    left.set("B", 2);

    const right = new Map();
    right.set("A", 1);
    right.set("B", 2);

    expect(Equality.safeEquals(left, right)).toBeTrue();
});

test("safeEquals equals Map false", () => {
    const left = new Map();
    left.set("A", 1);
    left.set("B", 2);

    const right = new Map();
    right.set("A", 1);
    right.set("B", 99);

    expect(Equality.safeEquals(left, right)).toBeFalse();
});

test("safeEquals equals Map false #2", () => {
    const left = new Map();
    left.set("A", 1);
    left.set("B", 2);

    const right = new Map();
    right.set("A", 1);
    right.set("C", 2);

    expect(Equality.safeEquals(left, right)).toBeFalse();
});

// safeEquals array......................................................................................................

test("safeEquals equals null & empty array false", () => {
    const left = null;
    const right = [];
    expect(Equality.safeEquals(left, right)).toBeFalse();
});

test("safeEquals equals empty array & null false", () => {
    const left = [];
    const right = null;
    expect(Equality.safeEquals(left, right)).toBeFalse();
});

test("safeEquals equals empty array & empty array true", () => {
    const left = [];
    const right = [];
    expect(Equality.safeEquals(left, right)).toBeTrue();
});

test("safeEquals equals array different false", () => {
    const left = [];
    const right = ["different"];
    expect(Equality.safeEquals(left, right)).toBeFalse();
});

test("safeEquals equals array different #2 false", () => {
    const left = ["same"];
    const right = ["same", "different"];
    expect(Equality.safeEquals(left, right)).toBeFalse();
});

test("safeEquals equals array different #3 false", () => {
    const left = ["a", "b"];
    const right = ["b", "a"];
    expect(Equality.safeEquals(left, right)).toBeFalse();
});

test("safeEquals equals array same true", () => {
    const left = ["same"];
    const right = ["same"];
    expect(Equality.safeEquals(left, right)).toBeTrue();
});

test("safeEquals equals array same implement equals true", () => {
    const rightElement = 1;

    const left = [{
        equals: function(e) {
            return e === rightElement
        },
    }];
    const right = [rightElement];
    expect(Equality.safeEquals(left, right)).toBeTrue();
});

test("safeEquals equals array deep true", () => {
    const left = [["same1"], "same2", 3];
    const right = [["same1"], "same2", 3];
    expect(Equality.safeEquals(left, right)).toBeTrue();
});