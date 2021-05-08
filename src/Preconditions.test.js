import Preconditions from "./Preconditions.js";

test("requireNonNull undefined", () => {
    expect(
        () => Preconditions.requireNonNull(undefined, "Label123")
    ).toThrow("Missing Label123");
});

test("requireNonNull null", () => {
    expect(
        () => Preconditions.requireNonNull(null, "Label123")
    ).toThrow("Missing Label123");
});

test("requireNonNull non null", () => {
    expect(
        () => Preconditions.requireNonNull({}, "label1")
    ).not
        .toThrow();
});

test("requireNonNull empty", () => {
    expect(
        () => Preconditions.requireNonNull("", "label1")
    ).not
        .toThrow();
});

test("requireNonNull false", () => {
    expect(
        () => Preconditions.requireNonNull(false, "label1")
    ).not
        .toThrow();
});

test("requireNonNull 0", () => {
    expect(
        () => Preconditions.requireNonNull(0, "label1")
    ).not
        .toThrow();
});
