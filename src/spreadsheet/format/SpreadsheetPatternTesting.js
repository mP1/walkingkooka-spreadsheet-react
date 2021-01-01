export default function spreadsheetPatternTesting(newInstance, fromJson, parse) {

    function pattern() {
        return "Hello";
    };

    const spreadsheetPattern = function() {
        return newInstance(pattern());
    };

    test("create without pattern fails", () => {
        expect(() => newInstance().toThrow("Missing pattern"));
    });

    test("create invalid pattern type fails", () => {
        const pattern = 123;
        expect(() => newInstance(pattern)).toThrow("Expected string pattern got " + pattern);
    });

    test("create empty pattern", () => {
        const t = "";
        check(newInstance(t),
            t);
    });

    test("create pattern", () => {
        const t = pattern();
        check(newInstance(t),
            t);
    });

// parse.............................................................................................................

    test("parse undefined fails", () => {
        expect(() => parse(undefined)).toThrow("Missing pattern");
    });

    test("parse null fails", () => {
        expect(() => parse(null)).toThrow("Missing pattern");
    });

    test("parse non string fails", () => {
        expect(() => parse(123)).toThrow("Expected string pattern got 123");
    });

    test("parse pattern", () => {
        const t = pattern();
        const spreadsheetPattern = parse(t);
        check(spreadsheetPattern, t);
    });

// fromJson.............................................................................................................

    test("fromJson undefined fails", () => {
        expect(() => fromJson(undefined)).toThrow("Missing pattern");
    });

    test("fromJson null fails", () => {
        expect(() => fromJson(null)).toThrow("Missing pattern");
    });

    test("fromJson non string fails", () => {
        expect(() => fromJson(123)).toThrow("Expected string pattern got 123");
    });

    test("fromJson pattern", () => {
        const t = pattern();
        const spreadsheetPattern = fromJson(t);
        check(spreadsheetPattern, t);
    });

// toJson...............................................................................................................

    test("toJson", () => {
        const t = pattern();

        expect(newInstance(t)
            .toJson()).toStrictEqual(t);
    });

// equals...............................................................................................................

    test("equals undefined false", () => {
        expect(spreadsheetPattern()
            .equals())
            .toBeFalse();
    });

    test("equals null false", () => {
        expect(spreadsheetPattern()
            .equals(null))
            .toBeFalse();
    });

    test("equals different type false", () => {
        expect(spreadsheetPattern()
            .equals("different"))
            .toBeFalse();
    });

    test("equals self true", () => {
        const t = spreadsheetPattern();
        expect(t.equals(t))
            .toBeTrue();
    });

    test("equals different pattern false", () => {
        expect(spreadsheetPattern()
            .equals(newInstance("different")))
            .toBeFalse();
    });
};

// helpers..............................................................................................................

function check(spreadsheetPattern, pattern) {
    expect(spreadsheetPattern.pattern()).toStrictEqual(pattern);
}