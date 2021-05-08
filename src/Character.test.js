import Character from "./Character";
import systemObjectTesting from "./SystemObjectTesting.js";

const text = "A";

function character() {
    return new Character(text);
}

systemObjectTesting(
    character(),
    new Character("Z"),
    Character.fromJson,
    "Missing text",
    "character",
    text
);

// create...............................................................................................................

test("create without text fails", () => {
    expect(() => new Character(null)).toThrow("Missing text");
});

test("create empty text fails", () => {
    expect(() => new Character(null)).toThrow("Missing text");
});

test("create with non string text fails", () => {
    expect(() => new Character(1.5)).toThrow("Expected string text got 1.5");
});

test("create text length !+ 1 fails", () => {
    expect(() => new Character("abc")).toThrow("Expected string with length=1 got 3 \"abc\"");
});

test("create", () => {
    const character = new Character(text);
    expect(character.text()).toBe(text);
});

// fromJson.............................................................................................................

test("fromJson empty string", () => {
    expect(() => Character.fromJson(null)).toThrow("Missing text");
});

// equals...............................................................................................................

test("equals equivalent string false", () => {
    const c = character();
    expect(c.equals(c.text())).toBeFalse();
});

test("equals different false", () => {
    const c = character();
    expect(c.equals(new Character("Z"))).toBeFalse();
});

test("equals equivalent true", () => {
    const c = character();
    expect(c.equals(c)).toBeTrue();
});

test("equals equivalent true #2", () => {
    const text = "B";
    const c = new Character(text);
    expect(c.equals(new Character(text))).toBeTrue();
});
