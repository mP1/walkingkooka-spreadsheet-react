import SpreadsheetNotification from "./SpreadsheetNotification.js";

const text = "Hello 123";
const level = "error";

// create...............................................................................................................

test("create without text fails", () => {
    expect(() => new SpreadsheetNotification(null, level)).toThrow("Missing text");
});

test("create with non string text fails", () => {
    expect(() => new SpreadsheetNotification(123, level)).toThrow("Expected string text got 123");
});

test("create without level fails", () => {
    expect(() => new SpreadsheetNotification(text, null)).toThrow("Missing level");
});

test("create with non string level fails", () => {
    expect(() => new SpreadsheetNotification(text, 456)).toThrow("Expected string level got 456");
});

test("create", () => {
    const notification = new SpreadsheetNotification(text, level);
    expect(notification.text()).toBe(text);
    expect(notification.level()).toBe(level);
});
