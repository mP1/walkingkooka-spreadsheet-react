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

testThrows("requireNumber undefined", Preconditions.requireNumber, undefined, "Label123", "Missing Label123");
testThrows("requireNumber null", Preconditions.requireNumber, null, "Label123", "Missing Label123");
testThrows("requireNumber false", Preconditions.requireNumber, false, "Label123", "Expected number Label123 got false");
testThrows("requireNumber empty string", Preconditions.requireNumber, "", "Label123", "Expected number Label123 got ");
testThrows("requireNumber string", Preconditions.requireNumber, "ABC123", "Label123", "Expected number Label123 got ABC123");
testThrows("requireNumber function", Preconditions.requireNumber, FUNCTION, "Label123", "Expected number Label123 got function () {}");
testThrows("requireNumber array", Preconditions.requireNumber, ARRAY, "Label123", "Expected number Label123 got 1,2,3");
testThrows("requireNumber object", Preconditions.requireNumber, {}, "Label123", "Expected number Label123 got [object Object]");
testNotThrows("requireNumber number 0", Preconditions.requireNumber, 0);
testNotThrows("requireNumber number 1", Preconditions.requireNumber, 1);

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

// requireInstance......................................................................................................

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
testOptionalInstanceThrows("optionalInstance instanceof false", new Test3(), "Expected Test1 or nothing Label123 got " + new Test3());
testOptionalInstanceThrows("optionalInstance instanceof false", new Test4(), "Expected Test1 or nothing Label123 got Test4!");
testOptionalInstanceNotThrows("optionalInstance instanceof class", new Test1());
testOptionalInstanceNotThrows("optionalInstance instanceof subclass", new Test2());