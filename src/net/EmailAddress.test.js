import EmailAddress from "./EmailAddress";
import systemObjectTesting from "../SystemObjectTesting.js";

const text = "user@example.com";

function emailAddress() {
    return new EmailAddress(text);
}

systemObjectTesting(
    emailAddress(),
    new EmailAddress("different@example.com"),
    EmailAddress.fromJson,
    "Missing text",
    "email-address",
    text
);

// create...............................................................................................................

test("create without text fails", () => {
    expect(() => new EmailAddress(null)).toThrow("Missing text");
});

test("create empty text fails", () => {
    expect(() => new EmailAddress(null)).toThrow("Missing text");
});

test("create with non string text fails", () => {
    expect(() => new EmailAddress(1.5)).toThrow("Expected string got 1.5");
});

test("create", () => {
    const emailAddress = new EmailAddress(text);
    expect(emailAddress.text()).toBe(text);
});

// fromJson.............................................................................................................

test("fromJson empty string", () => {
    expect(() => EmailAddress.fromJson(null)).toThrow("Missing text");
});

test("fromJson string", () => {
    const text = "2000-01-01 12:58:59";
    check(EmailAddress.fromJson(text), text);
});

// equals...............................................................................................................

test("equals different false", () => {
    const e = emailAddress();
    expect(e.equals(new EmailAddress("different"))).toBeFalse();
});

test("equals equivalent true", () => {
    const e = emailAddress();
    expect(e.equals(e)).toBeTrue();
});

test("equals equivalent true #2", () => {
    const text = "different@example.com";
    const e = new EmailAddress(text);
    expect(e.equals(new EmailAddress(text))).toBeTrue();
});

// helpers..............................................................................................................

function check(emailAddress, text) {
    expect(emailAddress.text()).toStrictEqual(text);
    expect(emailAddress.text()).toBeString();

    expect(emailAddress.toJson()).toStrictEqual(text);
    expect(emailAddress.toString()).toBe(text);
    expect(EmailAddress.fromJson(emailAddress.toJson())).toStrictEqual(emailAddress);
}
