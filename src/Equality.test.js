import Equality from "./Equality.js";

// safeEquals...........................................................................................................
test("safeEquals undefined/undefined true", () => {
    const left = undefined;
    const right = undefined;
    expect(Equality.safeEquals(left, right)).toBeTrue();
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
        equals: function() { return false},
    }
    expect(Equality.safeEquals(left, right)).toBeFalse();
});

test("safeEquals equals implements equals true", () => {
    const right = 1;
    const left = {
        equals: function() { return true},
    }
    expect(Equality.safeEquals(left, right)).toBeTrue();
});