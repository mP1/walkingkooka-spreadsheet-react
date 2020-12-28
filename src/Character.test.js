import Character from "./Character";

const text = "A";

function character() {
    return new Character(text);
}

test("create without text fails", () => {
    expect(() => new Character(null)).toThrow("Missing text");
});

test("create empty text fails", () => {
    expect(() => new Character(null)).toThrow("Missing text");
});

test("create with non string text fails", () => {
    expect(() => new Character(1.5)).toThrow("Expected string got 1.5");
});

test("create text length !+ 1 fails", () => {
    expect(() => new Character("abc")).toThrow("Expected string with length 3 got \"abc\"");
});

test("create", () => {
    const character = new Character(text);
    expect(character.text()).toBe(text);
});

// fromJson.............................................................................................................

test("fromJson undefined", () => {
    expect(() => Character.fromJson()).toThrow("Missing text");
});

test("fromJson null", () => {
    expect(() => Character.fromJson(null)).toThrow("Missing text");
});

test("fromJson empty string", () => {
    expect(() => Character.fromJson(null)).toThrow("Missing text");
});

test("fromJson string", () => {
    check(Character.fromJson(text), text);
});

// toJson...............................................................................................................

test("toJson", () => {
    const character = new Character(text);
    check(character, text);
});

// equals...............................................................................................................

test("equals undefined false", () => {
    const c = character();
    expect(c.equals()).toBeFalse();
});

test("equals null false", () => {
    const c = character();
    expect(c.equals(null)).toBeFalse();
});

test("equals different type false", () => {
    const c = character();
    expect(c.equals("different")).toBeFalse();
});

test("equals self true", () => {
    const c = character();
    expect(c.equals(c)).toBeTrue();
});

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

// helpers..............................................................................................................

function check(character, text) {
    expect(character.text()).toStrictEqual(text);
    expect(character.text()).toBeString();

    expect(character.toJson()).toStrictEqual(text);
    expect(character.toString()).toBe(text);
    expect(Character.fromJson(character.toJson())).toStrictEqual(character);
}
