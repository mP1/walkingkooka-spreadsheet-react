import Character from "./Character.js";
import SystemObject from "./SystemObject.js";

// register.............................................................................................................

test("register missing typeName fails", () => {
    const t = undefined;
    const f = Character.fromJson;
    expect(
        () => SystemObject.register(t, f)
    ).toThrow("Missing typeName");
});

test("register null typeName fails", () => {
    const t = null;
    const f = Character.fromJson;
    expect(
        () => SystemObject.register(t, f)
    ).toThrow("Missing typeName");
});

test("register empty typeName fails", () => {
    const t = "";
    const f = Character.fromJson;
    expect(
        () => SystemObject.register(t, f)
    ).toThrow("Missing typeName");
});

test("register missing unmarshall function fails", () => {
    const t = "test-123";
    const f = undefined;
    expect(
        () => SystemObject.register(t, f)
    ).toThrow("Missing function fromJson");
});

test("register null unmarshall function fails", () => {
    const t = "test-123";
    const f = null;
    expect(
        () => SystemObject.register(t, f)
    ).toThrow("Missing function fromJson");
});

test("register invalid unmarshall function fails", () => {
    const t = "test-123";
    const f = "!invalid";
    expect(
        () => SystemObject.register(t, f)
    ).toThrow("Expected function fromJson got !invalid");
});

// fromJsonWithType.....................................................................................................

test("fromJsonWithType missing json fails", () => {
    expect(
        () => SystemObject.fromJsonWithType()
    ).toThrow("Missing json");
});

test("fromJsonWithType missing type fails", () => {
    expect(
        () => SystemObject.fromJsonWithType({value: 1})
    ).toThrow("Missing type got [object Object]");
});

test("fromJsonWithType string", () => {
    const string = "ABC123";
    expect(SystemObject.fromJsonWithType({
        type: "string",
        value: string,
    }))
        .toStrictEqual(string);
})

test("fromJsonWithType", () => {
    const character = new Character("A");
    expect(SystemObject.fromJsonWithType({
        type: character.typeName(),
        value: character.toJson(),
    }))
        .toStrictEqual(character);
});

test("toJsonWithType", () => {
    const character = new Character("A");
    expect(character.toJsonWithType())
        .toStrictEqual({
            type: character.typeName(),
            value: character.toJson(),
        });
});
