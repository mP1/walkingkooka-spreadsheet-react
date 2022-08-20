import Preconditions from "./Preconditions.js";

const FUNCTION = function() {
};
const ARRAY = [
    1, 2, 3
]

function testThrows(title, f, value, label, message) {
    test(title, () => {
        expect(
            () => f(value, label)
        ).toThrow(message);
    });
}

function testNotThrows(title, f, value) {
    test(title, () => {
        expect(
            () => f(value, "Label123")
        ).not
            .toThrow();
    });
}

// requireNonNull.......................................................................................................

testThrows("requireNonNull undefined", Preconditions.requireNonNull, undefined, "Label123", "Missing Label123");
testThrows("requireNonNull null", Preconditions.requireNonNull, null, "Label123", "Missing Label123");
testNotThrows("requireNonNull empty string", Preconditions.requireNonNull, "");
testNotThrows("requireNonNull false", Preconditions.requireNonNull, false);
testNotThrows("requireNonNull 0", Preconditions.requireNonNull, 0);
testNotThrows("requireNonNull array", Preconditions.requireNonNull, ARRAY);
testNotThrows("requireNonNull object", Preconditions.requireNonNull, {});

// requireArray.......................................................................................................

testThrows("requireArray undefined", Preconditions.requireArray, undefined, "Label123", "Missing Label123");
testThrows("requireArray null", Preconditions.requireArray, null, "Label123", "Missing Label123");
testThrows("requireArray false", Preconditions.requireArray, false, "Label123", "Expected array Label123 got false");
testThrows("requireArray 0", Preconditions.requireArray, 0, "Label123", "Expected array Label123 got 0");
testThrows("requireArray empty string", Preconditions.requireArray, "", "Label123", "Expected array Label123 got ");
testThrows("requireArray string", Preconditions.requireArray, "ABC123", "Label123", "Expected array Label123 got ABC123");
testThrows("requireArray function", Preconditions.requireArray, FUNCTION, "Label123", "Expected array Label123 got function () {}");
testThrows("requireArray object", Preconditions.requireArray, {}, "Label123", "Expected array Label123 got [object Object]");
testNotThrows("requireArray array", Preconditions.requireArray, ARRAY);

// requireBoolean.......................................................................................................

testThrows("requireBoolean undefined", Preconditions.requireBoolean, undefined, "Label123", "Missing Label123");
testThrows("requireBoolean null", Preconditions.requireBoolean, null, "Label123", "Missing Label123");
testNotThrows("requireBoolean false", Preconditions.requireBoolean, false);
testNotThrows("requireBoolean true", Preconditions.requireBoolean, true);
testThrows("requireBoolean 0", Preconditions.requireBoolean, 0, "Label123", "Expected boolean Label123 got 0");
testThrows("requireBoolean empty string", Preconditions.requireBoolean, "", "Label123", "Expected boolean Label123 got ");
testThrows("requireBoolean string", Preconditions.requireBoolean, "ABC123", "Label123", "Expected boolean Label123 got ABC123");
testThrows("requireBoolean function", Preconditions.requireBoolean, FUNCTION, "Label123", "Expected boolean Label123 got function () {}");
testThrows("requireBoolean object", Preconditions.requireBoolean, {}, "Label123", "Expected boolean Label123 got [object Object]");
testThrows("requireBoolean array", Preconditions.requireBoolean, [], "Label123", "Expected boolean Label123 got ");

// requireFunction.......................................................................................................

testThrows("requireFunction undefined", Preconditions.requireFunction, undefined, "Label123", "Missing Label123");
testThrows("requireFunction null", Preconditions.requireFunction, null, "Label123", "Missing Label123");
testThrows("requireFunction false", Preconditions.requireFunction, false, "Label123", "Expected function Label123 got false");
testThrows("requireFunction 0", Preconditions.requireFunction, 0, "Label123", "Expected function Label123 got 0");
testThrows("requireFunction empty string", Preconditions.requireFunction, "", "Label123", "Expected function Label123 got ");
testThrows("requireFunction string", Preconditions.requireFunction, "ABC123", "Label123", "Expected function Label123 got ABC123");
testThrows("requireFunction array", Preconditions.requireFunction, ARRAY, "Label123", "Expected function Label123 got 1,2,3");
testThrows("requireFunction object", Preconditions.requireFunction, {}, "Label123", "Expected function Label123 got [object Object]");
testNotThrows("requireFunction function", Preconditions.requireFunction, FUNCTION);

// requireNumber.......................................................................................................

function testRequireNumberThrows(title, value, lower, upper, message) {
    test(title, () => {
        expect(
            () => Preconditions.requireNumber(value, "Label123", lower, upper)
        ).toThrow(message);
    });
}

function testRequireNumberNotThrows(title, value, lower, upper) {
    test(title, () => {
        expect(
            () => Preconditions.requireNumber(value, "Label123", lower, upper)
        ).not
            .toThrow();
    });
}

testRequireNumberThrows("requireNumber undefined",  undefined, null, null, "Missing Label123");
testRequireNumberThrows("requireNumber null",  null, null, null, "Missing Label123");
testRequireNumberThrows("requireNumber false",  false, null, null, "Expected number Label123 got false");
testRequireNumberThrows("requireNumber empty string",  "", null, null, "Expected number Label123 got ");
testRequireNumberThrows("requireNumber string",  "ABC123", null, null, "Expected number Label123 got ABC123");
testRequireNumberThrows("requireNumber function",  FUNCTION, null, null, "Expected number Label123 got function () {}");
testRequireNumberThrows("requireNumber array",  ARRAY, null, null, "Expected number Label123 got 1,2,3");
testRequireNumberThrows("requireNumber object",  {}, null, null, "Expected number Label123 got [object Object]");
testRequireNumberThrows("requireNumber number < lower",  1, 2, null, "Expected Label123 1 >= 2");
testRequireNumberThrows("requireNumber number > upper",  2, null, 2, "Expected Label123 2 < 2");
testRequireNumberThrows("requireNumber number > upper #2",  3, null, 2, "Expected Label123 3 < 2");
testRequireNumberNotThrows("requireNumber number 0",  0);
testRequireNumberNotThrows("requireNumber number 1",  1);
testRequireNumberNotThrows("requireNumber number 1 lower=1",  1, 1);
testRequireNumberNotThrows("requireNumber number 2 lower=1",  2, 1);
testRequireNumberNotThrows("requireNumber number 1 upper=2",  1, null, 2);
testRequireNumberNotThrows("requireNumber number 2 upper=3",  2, null, 3);
testRequireNumberNotThrows("requireNumber number 2 lower1, upper=3",  2, 1, 3);
testRequireNumberNotThrows("requireNumber number 2 lower2, upper=3",  2, 2, 3);

// requirePositiveNumber.......................................................................................................

testThrows("requirePositiveNumber undefined", Preconditions.requirePositiveNumber, undefined, "Label123", "Missing Label123");
testThrows("requirePositiveNumber null", Preconditions.requirePositiveNumber, null, "Label123", "Missing Label123");
testThrows("requirePositiveNumber false", Preconditions.requirePositiveNumber, false, "Label123", "Expected number Label123 got false");
testThrows("requirePositiveNumber empty string", Preconditions.requirePositiveNumber, "", "Label123", "Expected number Label123 got ");
testThrows("requirePositiveNumber string", Preconditions.requirePositiveNumber, "ABC123", "Label123", "Expected number Label123 got ABC123");
testThrows("requirePositiveNumber function", Preconditions.requirePositiveNumber, FUNCTION, "Label123", "Expected number Label123 got function () {}");
testThrows("requirePositiveNumber array", Preconditions.requirePositiveNumber, ARRAY, "Label123", "Expected number Label123 got 1,2,3");
testThrows("requirePositiveNumber object", Preconditions.requirePositiveNumber, {}, "Label123", "Expected number Label123 got [object Object]");
testThrows("requirePositiveNumber number < 0", Preconditions.requirePositiveNumber, -1, "Label123", "Expected number Label123 >= 0 got -1");
testNotThrows("requirePositiveNumber number 0", Preconditions.requirePositiveNumber, 0);
testNotThrows("requirePositiveNumber number 1", Preconditions.requirePositiveNumber, 1);

// requireObject.......................................................................................................

testThrows("requireObject undefined", Preconditions.requireObject, undefined, "Label123", "Missing Label123");
testThrows("requireObject null", Preconditions.requireObject, null, "Label123", "Missing Label123");
testThrows("requireObject false", Preconditions.requireObject, false, "Label123", "Expected object Label123 got false");
testThrows("requireObject 0", Preconditions.requireObject, 0, "Label123", "Expected object Label123 got 0");
testThrows("requireObject empty string", Preconditions.requireObject, "", "Label123", "Expected object Label123 got ");
testThrows("requireObject string", Preconditions.requireObject, "ABC123", "Label123", "Expected object Label123 got ABC123");
testThrows("requireObject array", Preconditions.requireObject, ARRAY, "Label123", "Expected object Label123 got 1,2,3");
testThrows("requireObject function", Preconditions.requireObject, FUNCTION, "Label123", "Expected object Label123 got function () {}");
testNotThrows("requireObject object", Preconditions.requireObject, {});

// requireText.......................................................................................................

testThrows("requireText undefined", Preconditions.requireText, undefined, "Label123", "Missing Label123");
testThrows("requireText null", Preconditions.requireText, null, "Label123", "Missing Label123");
testThrows("requireText false", Preconditions.requireText, false, "Label123", "Expected string Label123 got false");
testThrows("requireText 0", Preconditions.requireText, 0, "Label123", "Expected string Label123 got 0");
testThrows("requireText array", Preconditions.requireText, ARRAY, "Label123", "Expected string Label123 got 1,2,3");
testThrows("requireText function", Preconditions.requireText, FUNCTION, "Label123", "Expected string Label123 got function () {}");
testThrows("requireText object", Preconditions.requireText, {}, "Label123", "Expected string Label123 got [object Object]");
testNotThrows("requireText empty string", Preconditions.requireText, "");
testNotThrows("requireText non empty string", Preconditions.requireText, "abc123");

// requireNonEmptyText.......................................................................................................

testThrows("requireNonEmptyText undefined", Preconditions.requireNonEmptyText, undefined, "Label123", "Missing Label123");
testThrows("requireNonEmptyText null", Preconditions.requireNonEmptyText, null, "Label123", "Missing Label123");
testThrows("requireNonEmptyText false", Preconditions.requireNonEmptyText, false, "Label123", "Expected string Label123 got false");
testThrows("requireNonEmptyText 0", Preconditions.requireNonEmptyText, 0, "Label123", "Expected string Label123 got 0");
testThrows("requireNonEmptyText array", Preconditions.requireNonEmptyText, ARRAY, "Label123", "Expected string Label123 got 1,2,3");
testThrows("requireNonEmptyText function", Preconditions.requireNonEmptyText, FUNCTION, "Label123", "Expected string Label123 got function () {}");
testThrows("requireNonEmptyText object", Preconditions.requireNonEmptyText, {}, "Label123", "Expected string Label123 got [object Object]");
testThrows("requireNonEmptyText empty string", Preconditions.requireNonEmptyText, "", "Label123", "Missing Label123");
testNotThrows("requireNonEmptyText non empty string", Preconditions.requireNonEmptyText, "abc123");

// optionalText.......................................................................................................

testNotThrows("optionalText undefined", Preconditions.optionalText, undefined, "Label123", "Missing Label123");
testNotThrows("optionalText null", Preconditions.optionalText, null, "Label123", "Missing Label123");
testThrows("optionalText false", Preconditions.optionalText, false, "Label123", "Expected string Label123 got false");
testThrows("optionalText 0", Preconditions.optionalText, 0, "Label123", "Expected string Label123 got 0");
testThrows("optionalText array", Preconditions.optionalText, ARRAY, "Label123", "Expected string Label123 got 1,2,3");
testThrows("optionalText function", Preconditions.optionalText, FUNCTION, "Label123", "Expected string Label123 got function () {}");
testThrows("optionalText object", Preconditions.optionalText, {}, "Label123", "Expected string Label123 got [object Object]");
testNotThrows("optionalText empty string", Preconditions.optionalText, "");
testNotThrows("optionalText non empty string", Preconditions.optionalText, "abc123");

// requireInstance......................................................................................................

class Test1 {

}

class Test2 extends Test1 {
}

class Test3 {
}

class Test4 {
    toString() {
        return "Test4!";
    }
}

function testRequireInstanceThrows(title, value, message) {
    test(title, () => {
        expect(
            () => Preconditions.requireInstance(value, Test1, "Label123")
        ).toThrow(message);
    });
}

function testRequireInstanceNotThrows(title, value) {
    test(title, () => {
        expect(
            () => Preconditions.requireInstance(value, Test1, "Label123")
        ).not
            .toThrow();
    });
}

testRequireInstanceThrows("requireInstance undefined", undefined, "Missing Label123");
testRequireInstanceThrows("requireInstance null", null, "Missing Label123");
testRequireInstanceThrows("requireInstance false", false, "Expected Test1 Label123 got false");
testRequireInstanceThrows("requireInstance instanceof false", new Test3(), "Expected Test1 Label123 got " + new Test3());
testRequireInstanceThrows("requireInstance instanceof false", new Test4(), "Expected Test1 Label123 got Test4!");
testRequireInstanceNotThrows("requireInstance instanceof class", new Test1());
testRequireInstanceNotThrows("requireInstance instanceof subclass", new Test2());

// optionalInstance......................................................................................................

function testOptionalInstanceThrows(title, value, message) {
    test(title, () => {
        expect(
            () => Preconditions.optionalInstance(value, Test1, "Label123")
        ).toThrow(message);
    });
}

function testOptionalInstanceNotThrows(title, value) {
    test(title, () => {
        expect(
            () => Preconditions.optionalInstance(value, Test1, "Label123")
        ).not
            .toThrow();
    });
}

testOptionalInstanceNotThrows("optionalInstance undefined", undefined);
testOptionalInstanceNotThrows("optionalInstance null", null);
testOptionalInstanceThrows("optionalInstance false", false, "Expected Test1 or nothing Label123 got false");
testOptionalInstanceThrows("optionalInstance instanceof false", 12.3, "Expected Test1 or nothing Label123 got 12.3");
testOptionalInstanceThrows("optionalInstance instanceof false", new Test3(), "Expected Test1 or nothing Label123 got " + new Test3());
testOptionalInstanceThrows("optionalInstance instanceof false", new Test4(), "Expected Test1 or nothing Label123 got Test4!");
testOptionalInstanceNotThrows("optionalInstance instanceof class", new Test1());
testOptionalInstanceNotThrows("optionalInstance instanceof subclass", new Test2());

// optionalFunction......................................................................................................

function testOptionalFunctionThrows(title, value, message) {
    test(title, () => {
        expect(
            () => Preconditions.optionalFunction(value, "Label123")
        ).toThrow(message);
    });
}

function testOptionalFunctionNotThrows(title, value) {
    test(title, () => {
        expect(
            () => Preconditions.optionalFunction(value, "Label123")
        ).not
            .toThrow();
    });
}

testOptionalFunctionNotThrows("optionalFunction undefined", undefined);
testOptionalFunctionNotThrows("optionalFunction null", null);
testOptionalFunctionThrows("optionalFunction array", ARRAY, "Expected function Label123 or nothing got 1,2,3");
testOptionalFunctionThrows("optionalFunction false", false, "Expected function Label123 or nothing got false");
testOptionalFunctionThrows("optionalFunction class", new Test1(), "Expected function Label123 or nothing got [object Object]");
testOptionalFunctionNotThrows("optionalFunction function", FUNCTION);
testOptionalFunctionThrows("optionalFunction number", 123, "Expected function Label123 or nothing got 123");
testOptionalFunctionThrows("optionalFunction object", {}, "Expected function Label123 or nothing got ");
testOptionalFunctionThrows("optionalFunction string", "abc123", "Expected function Label123 or nothing got abc123");