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

ofAndCheck("UP", RoundingMode.UP);
ofAndCheck("DOWN", RoundingMode.DOWN);
ofAndCheck("CEILING", RoundingMode.CEILING);
ofAndCheck("FLOOR", RoundingMode.FLOOR);
ofAndCheck("HALF_UP", RoundingMode.HALF_UP);
ofAndCheck("HALF_DOWN", RoundingMode.HALF_DOWN);
ofAndCheck("HALF_EVEN", RoundingMode.HALF_EVEN);
ofAndCheck("UNNECESSARY", RoundingMode.UNNECESSARY);

function ofAndCheck(name, roundingMode) {
    test("of " + name, () => {
        expect(RoundingMode.of(name)).toStrictEqual(roundingMode);
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
    expect(RoundingMode.of("DOWN").toString()).toStrictEqual("DOWN");
});

