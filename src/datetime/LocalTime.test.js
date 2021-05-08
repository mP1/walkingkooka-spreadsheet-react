import LocalTime from "./LocalTime";
import systemObjectTesting from "../SystemObjectTesting.js";

const text = "12:58:59";

function localTime() {
    return new LocalTime(text);
}

systemObjectTesting(
    localTime(),
    new LocalTime("2000-1-1 1:01:01"),
    LocalTime.fromJson,
    "Missing text",
    "local-time",
    text
);

// create...............................................................................................................

test("create without text fails", () => {
    expect(() => new LocalTime(null)).toThrow("Missing text");
});

test("create empty text fails", () => {
    expect(() => new LocalTime(null)).toThrow("Missing text");
});

test("create with non string text fails", () => {
    expect(() => new LocalTime(1.5)).toThrow("Expected string text got 1.5");
});

test("create", () => {
    const localTime = new LocalTime(text);
    expect(localTime.text()).toBe(text);
});

// fromJson.............................................................................................................

test("fromJson empty string", () => {
    expect(() => LocalTime.fromJson(null)).toThrow("Missing text");
});

test("fromJson string", () => {
    const text = "18:28:29";
    check(LocalTime.fromJson(text), text);
});

// equals...............................................................................................................

test("equals equivalent true #2", () => {
    const text = "different";
    const e = new LocalTime(text);
    expect(e.equals(new LocalTime(text))).toBeTrue();
});

// helpers..............................................................................................................

function check(localTime, text) {
    expect(localTime.text()).toStrictEqual(text);
    expect(localTime.text()).toBeString();

    expect(localTime.toJson()).toStrictEqual(text);
    expect(localTime.toString()).toBe(text);
    expect(LocalTime.fromJson(localTime.toJson())).toStrictEqual(localTime);
}
