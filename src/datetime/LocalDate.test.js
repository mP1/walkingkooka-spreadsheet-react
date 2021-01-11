import LocalDate from "./LocalDate";
import systemObjectTesting from "../SystemObjectTesting.js";

const text = "1999-12-31";

function localDate() {
    return new LocalDate(text);
}

systemObjectTesting(
    localDate(),
    new LocalDate("2000-1-1 1:01:01"),
    LocalDate.fromJson,
    "Missing text",
    "local-date",
    text
);

// create...............................................................................................................

test("create without text fails", () => {
    expect(() => new LocalDate(null)).toThrow("Missing text");
});

test("create empty text fails", () => {
    expect(() => new LocalDate(null)).toThrow("Missing text");
});

test("create with non string text fails", () => {
    expect(() => new LocalDate(1.5)).toThrow("Expected string got 1.5");
});

test("create", () => {
    const localDate = new LocalDate(text);
    expect(localDate.text()).toBe(text);
});

// fromJson.............................................................................................................

test("fromJson empty string", () => {
    expect(() => LocalDate.fromJson(null)).toThrow("Missing text");
});

test("fromJson string", () => {
    const text = "2000-01-01";
    check(LocalDate.fromJson(text), text);
});

// equals...............................................................................................................

test("equals equivalent true #2", () => {
    const text = "different";
    const e = new LocalDate(text);
    expect(e.equals(new LocalDate(text))).toBeTrue();
});

// helpers..............................................................................................................

function check(localDate, text) {
    expect(localDate.text()).toStrictEqual(text);
    expect(localDate.text()).toBeString();

    expect(localDate.toJson()).toStrictEqual(text);
    expect(localDate.toString()).toBe(text);
    expect(LocalDate.fromJson(localDate.toJson())).toStrictEqual(localDate);
}
