import Character from "./Character.js";
import LocalDateTime from "./datetime/LocalDateTime.js";
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

test("fromJsonWithType double", () => {
    const double = 1.5;
    expect(
        SystemObject.fromJsonWithType(
            {
                type: "double",
                value: double,
            }
        )
    ).toStrictEqual(double);
});

test("fromJsonWithType string", () => {
    const string = "ABC123";
    expect(
        SystemObject.fromJsonWithType(
            {
                type: "string",
                value: string,
            }
        )
    ).toStrictEqual(string);
});

test("fromJsonWithType", () => {
    const character = new Character("A");
    expect(SystemObject.fromJsonWithType({
        type: character.typeName(),
        value: character.toJson(),
    }))
        .toStrictEqual(character);
});

// fromJsonList.........................................................................................................

test("fromJsonList missing array undefined fails", () => {
    expect(
        () => SystemObject.fromJsonList(undefined, Character.fromJson)
    ).toThrow("Missing array");
});

test("fromJsonList missing array null fails", () => {
    expect(
        () => SystemObject.fromJsonList(null, Character.fromJson)
    ).toThrow("Missing array");
});

test("fromJsonList missing element factory undefined fails", () => {
    expect(
        () => SystemObject.fromJsonList([], undefined)
    ).toThrow("Missing element");
});

test("fromJsonList missing element factory null fails", () => {
    expect(
        () => SystemObject.fromJsonList([], null)
    ).toThrow("Missing element");
});

test("fromJsonList empty array", () => {
    const neverHappens = function(json) {
        throw new Error("Shouldnt happen");
    }
    expect(
        SystemObject.fromJsonList(
            [],
            neverHappens
        )
    ).toStrictEqual([]);
});

test("fromJsonList Character", () => {
    expect(
        SystemObject.fromJsonList(
            [
                "M",
                "N",
                "O"
            ],
            Character.fromJson)
    ).toStrictEqual([
        Character.fromJson("M"),
        Character.fromJson("N"),
        Character.fromJson("O"),
    ]);
});

test("fromJsonList LocalDateTime", () => {
    const localDateTime1 = LocalDateTime.fromJson("1999-1-31 12:58:59");
    const localDateTime2 = LocalDateTime.fromJson("2000-2-28 12:58:59");
    const localDateTime3 = LocalDateTime.fromJson("2000-3-28 12:58:59");

    expect(
        SystemObject.fromJsonList(
            [
                localDateTime1.toJson(),
                localDateTime2.toJson(),
                localDateTime3.toJson()
            ],
            LocalDateTime.fromJson)
    ).toStrictEqual([
        localDateTime1,
        localDateTime2,
        localDateTime3
    ]);
});

// fromJsonListWithType.................................................................................................

test("fromJsonListWithType missing array undefined fails", () => {
    expect(
        () => SystemObject.fromJsonListWithType(undefined)
    ).toThrow("Missing array");
});

test("fromJsonListWithType missing array null fails", () => {
    expect(
        () => SystemObject.fromJsonListWithType(null)
    ).toThrow("Missing array");
});

test("fromJsonListWithType", () => {
    const localDateTime1 = LocalDateTime.fromJson("1999-1-31 12:58:59");
    const character2 = Character.fromJson("X");

    expect(
        SystemObject.fromJsonListWithType([
            localDateTime1.toJsonWithType(),
            character2.toJsonWithType()
        ])
    ).toStrictEqual([
        localDateTime1,
        character2
    ]);
});

// toJsonWithType.......................................................................................................

test("toJsonWithType", () => {
    const character = new Character("A");
    expect(character.toJsonWithType())
        .toStrictEqual({
            type: character.typeName(),
            value: character.toJson(),
        });
});

// static toJsonWithType................................................................................................

test("static toJsonWithType with undefined fails", () => {
    expect(
        () => SystemObject.toJsonWithType(undefined)
    ).toThrow("Missing value");
});

test("static toJsonWithType with null fails", () => {
    expect(
        () => SystemObject.toJsonWithType(null)
    ).toThrow("Missing value");
});

test("static toJsonWithType SystemObject", () => {
    const character = new Character("A");
    expect(
        SystemObject.toJsonWithType(character)
    ).toStrictEqual(
        {
            type: character.typeName(),
            value: character.toJson(),
        }
    );
});

test("static toJsonWithType SystemObject #2", () => {
    const localDateTime = LocalDateTime.fromJson("2000-12-31 12:58:59")
    expect(
        SystemObject.toJsonWithType(localDateTime)
    ).toStrictEqual(
        {
            type: localDateTime.typeName(),
            value: localDateTime.toJson(),
        }
    );
});

test("static toJsonWithType empty string", () => {
    const string = "";

    expect(
        SystemObject.toJsonWithType(string)
    ).toStrictEqual(
        {
            type: "string",
            value: string,
        }
    );
});

test("static toJsonWithType string", () => {
    const string = "ABC123";

    expect(
        SystemObject.toJsonWithType(string)
    ).toStrictEqual(
        {
            type: "string",
            value: string,
        }
    );
});

test("static toJsonWithType zero number", () => {
    const number = 0;

    expect(
        SystemObject.toJsonWithType(number)
    ).toStrictEqual(
        {
            type: "double",
            value: number,
        }
    );
});

test("static toJsonWithType number", () => {
    const number = 123.5;

    expect(
        SystemObject.toJsonWithType(number)
    ).toStrictEqual(
        {
            type: "double",
            value: number,
        }
    );
});