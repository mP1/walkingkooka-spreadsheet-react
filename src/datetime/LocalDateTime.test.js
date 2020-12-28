import LocalDateTime from "./LocalDateTime";

const text = "1999-12-31 12:58:59";

function localDateTime() {
    return new LocalDateTime(text);
}

test("create without text fails", () => {
    expect(() => new LocalDateTime(null)).toThrow("Missing text");
});

test("create empty text fails", () => {
    expect(() => new LocalDateTime(null)).toThrow("Missing text");
});

test("create with non string text fails", () => {
    expect(() => new LocalDateTime(1.5)).toThrow("Expected string got 1.5");
});

test("create", () => {
    const localDateTime = new LocalDateTime(text);
    expect(localDateTime.text()).toBe(text);
});

// fromJson.............................................................................................................

test("fromJson undefined", () => {
    expect(() => LocalDateTime.fromJson()).toThrow("Missing text");
});

test("fromJson null", () => {
    expect(() => LocalDateTime.fromJson(null)).toThrow("Missing text");
});

test("fromJson empty string", () => {
    expect(() => LocalDateTime.fromJson(null)).toThrow("Missing text");
});

test("fromJson string", () => {
    const text = "2000-01-01 12:58:59";
    check(LocalDateTime.fromJson(text), text);
});

// toJson...............................................................................................................

test("json", () => {
    const localDateTime = new LocalDateTime(text);

    check(localDateTime, text);
});

// equals...............................................................................................................

test("equals undefined false", () => {
    const e = localDateTime();
    expect(e.equals()).toBeFalse();
});

test("equals null false", () => {
    const e = localDateTime();
    expect(e.equals(null)).toBeFalse();
});

test("equals different type false", () => {
    const e = localDateTime();
    expect(e.equals("different")).toBeFalse();
});

test("equals self true", () => {
    const e = localDateTime();
    expect(e.equals(e)).toBeTrue();
});

test("equals different false", () => {
    const e = localDateTime();
    expect(e.equals(new LocalDateTime("different"))).toBeFalse();
});

test("equals equivalent true", () => {
    const e = localDateTime();
    expect(e.equals(e)).toBeTrue();
});

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
