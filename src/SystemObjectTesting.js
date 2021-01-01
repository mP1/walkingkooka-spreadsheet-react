export default function systemObjectTesting(instance,
                                            different,
                                            fromJson,
                                            missingJsonMessage,
                                            typeName,
                                            json) {

// fromJson.............................................................................................................

    test("fromJson undefined fails", () => {
        expect(
            () => fromJson(undefined)
        ).toThrow(missingJsonMessage);
    });

    test("fromJson null fails", () => {
        expect(
            () => fromJson(null)
        ).toThrow(missingJsonMessage);
    });

    test("fromJson", () => {
        const i = fromJson(json);
        expect(
            i
        ).toStrictEqual(instance);
    });

// typeName.............................................................................................................

    test("typeName", () => {
        expect(
            instance.typeName()
        ).toStrictEqual(typeName);
    });

// toJson...............................................................................................................

    test("toJson", () => {
        expect(
            instance.toJson()
        ).toStrictEqual(json);
    });

// equals...............................................................................................................

    test("equals undefined false", () => {
        expect(instance.equals()
        ).toBeFalse();
    });

    test("equals null false", () => {
        expect(
            instance.equals(null)
        ).toBeFalse();
    });

    test("equals different type false", () => {
        expect(instance
            .equals("different")
        ).toBeFalse();
    });

    test("equals different type false #2", () => {
        class Different {
        };

        expect(instance
            .equals(new Different())
        ).toBeFalse();
    });

    test("equals self true", () => {
        const t = instance;
        expect(
            t.equals(t)
        ).toBeTrue();
    });

    test("equals different false", () => {
        expect(
            instance.equals(different)
        ).toBeFalse();
    });
};
