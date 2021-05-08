import LocalDateTime from "./LocalDateTime";
import systemObjectTesting from "../SystemObjectTesting.js";

const text = "1999-12-31 12:58:59";

function localDateTime() {
    return new LocalDateTime(text);
}

systemObjectTesting(
    localDateTime(),
    new LocalDateTime("2000-1-1 1:01:01"),
    LocalDateTime.fromJson,
    "Missing text",
    "local-date-time",
    text
);

// create...............................................................................................................

test("create without text fails", () => {
    expect(() => new LocalDateTime(null)).toThrow("Missing text");
});

test("create empty text fails", () => {
    expect(() => new LocalDateTime(null)).toThrow("Missing text");
});

test("create with non string text fails", () => {
    expect(() => new LocalDateTime(1.5)).toThrow("Expected string text got 1.5");
});

test("create", () => {
    const localDateTime = new LocalDateTime(text);
    expect(localDateTime.text()).toBe(text);
});

// fromJson.............................................................................................................

test("fromJson empty string", () => {
    expect(() => LocalDateTime.fromJson(null)).toThrow("Missing text");
});

test("fromJson string", () => {
    const text = "2000-01-01 12:58:59";
    check(LocalDateTime.fromJson(text), text);
});

// equals...............................................................................................................

test("equals equivalent true #2", () => {
    const text = "different";
    const e = new LocalDateTime(text);
    expect(e.equals(new LocalDateTime(text))).toBeTrue();
});

// helpers..............................................................................................................

function check(localDateTime, text) {
    expect(localDateTime.text()).toStrictEqual(text);
    expect(localDateTime.text()).toBeString();

    expect(localDateTime.toJson()).toStrictEqual(text);
    expect(localDateTime.toString()).toBe(text);
    expect(LocalDateTime.fromJson(localDateTime.toJson())).toStrictEqual(localDateTime);
}
