import Preconditions from "./Preconditions.js";

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
testNotThrows("requireNonNull object", Preconditions.requireNonNull, {});

// requireText.......................................................................................................

testThrows("requireText undefined", Preconditions.requireText, undefined, "Label123", "Missing Label123");
testThrows("requireText null", Preconditions.requireText, null, "Label123", "Missing Label123");
testThrows("requireText false", Preconditions.requireText, false, "Label123", "Expected string Label123 got false");
testThrows("requireText 0", Preconditions.requireText, 0, "Label123", "Expected string Label123 got 0");
testThrows("requireText object", Preconditions.requireText, {}, "Label123", "Expected string Label123 got [object Object]");
testNotThrows("requireText empty string", Preconditions.requireText, "");
testNotThrows("requireText non empty string", Preconditions.requireText, "abc123");

// requireNonEmptyText.......................................................................................................

testThrows("requireNonEmptyText undefined", Preconditions.requireNonEmptyText, undefined, "Label123", "Missing Label123");
testThrows("requireNonEmptyText null", Preconditions.requireNonEmptyText, null, "Label123", "Missing Label123");
testThrows("requireNonEmptyText false", Preconditions.requireNonEmptyText, false, "Label123", "Expected string Label123 got false");
testThrows("requireNonEmptyText 0", Preconditions.requireNonEmptyText, 0, "Label123", "Expected string Label123 got 0");
testThrows("requireNonEmptyText object", Preconditions.requireNonEmptyText, {}, "Label123", "Expected string Label123 got [object Object]");
testThrows("requireNonEmptyText empty string", Preconditions.requireNonEmptyText, "", "Label123", "Expected non empty string Label123");
testNotThrows("requireNonEmptyText non empty string", Preconditions.requireNonEmptyText, "abc123");

// requireNonNullInstance......................................................................................................

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

function testRequireNonNullInstanceThrows(title, value, message) {
    test(title, () => {
        expect(
            () => Preconditions.requireNonNullInstance(value, Test1, "Label123")
        ).toThrow(message);
    });
}

function testRequireNonNullInstanceNotThrows(title, value) {
    test(title, () => {
        expect(
            () => Preconditions.requireNonNullInstance(value, Test1,"Label123")
        ).not
            .toThrow();
    });
}

testRequireNonNullInstanceThrows("requireNonNullInstance undefined",undefined, "Missing Label123");
testRequireNonNullInstanceThrows("requireNonNullInstance null",  null, "Missing Label123");
testRequireNonNullInstanceThrows("requireNonNullInstance false",  false, "Expected Test1 Label123 got false");
testRequireNonNullInstanceThrows("requireNonNullInstance instanceof false",  new Test3(), "Expected Test1 Label123 got " + new Test3());
testRequireNonNullInstanceThrows("requireNonNullInstance instanceof false",  new Test4(), "Expected Test1 Label123 got Test4!");
testRequireNonNullInstanceNotThrows("requireNonNullInstance instanceof class",  new Test1());
testRequireNonNullInstanceNotThrows("requireNonNullInstance instanceof subclass",  new Test2());