import RoundingMode from "./RoundingMode";
import systemObjectTesting from "../SystemObjectTesting.js";

systemObjectTesting(
    RoundingMode.UP,
    RoundingMode.DOWN,
    RoundingMode.fromJson,
    "Missing name",
    "rounding-mode",
    "UP"
);

valueOfAndCheck("UP", RoundingMode.UP);
valueOfAndCheck("DOWN", RoundingMode.DOWN);
valueOfAndCheck("CEILING", RoundingMode.CEILING);
valueOfAndCheck("FLOOR", RoundingMode.FLOOR);
valueOfAndCheck("HALF_UP", RoundingMode.HALF_UP);
valueOfAndCheck("HALF_DOWN", RoundingMode.HALF_DOWN);
valueOfAndCheck("HALF_EVEN", RoundingMode.HALF_EVEN);
valueOfAndCheck("UNNECESSARY", RoundingMode.UNNECESSARY);

function valueOfAndCheck(name, roundingMode) {
    test("valueOf " + name, () => {
        expect(RoundingMode.valueOf(name)).toStrictEqual(roundingMode);
    });
}

// equals................................................................................................................

test("equals DOWN true", () => {
    expect(RoundingMode.UP.equals(RoundingMode.UP)).toStrictEqual(true);
});

test("equals DOWN true", () => {
    expect(RoundingMode.DOWN.equals(RoundingMode.DOWN)).toStrictEqual(true);
});

// toString.............................................................................................................

test("toString", () => {
    expect(RoundingMode.valueOf("DOWN").name()).toStrictEqual("DOWN");
});

