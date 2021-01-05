import SystemEnum from "../SystemEnum.js";
import SystemObject from "../SystemObject.js";

const TYPE_NAME = "rounding-mode";

/**
 * Represents instance of the java enum RoundingMode.
 */
export default class RoundingMode extends SystemEnum {

    static UP = new RoundingMode("UP", "Up");
    static DOWN = new RoundingMode("DOWN", "Down");
    static CEILING = new RoundingMode("CEILING", "Ceiling");
    static FLOOR = new RoundingMode("FLOOR", "Floor");
    static HALF_UP = new RoundingMode("HALF_UP", "½ Up");
    static HALF_DOWN = new RoundingMode("HALF_DOWN", "½ Down");
    static HALF_EVEN = new RoundingMode("HALF_EVEN", "½ Even");
    static UNNECESSARY = new RoundingMode("UNNECESSARY", "Unnecessary");

    static values() {
        return [
            RoundingMode.UP,
            RoundingMode.DOWN,
            RoundingMode.CEILING,
            RoundingMode.FLOOR,
            RoundingMode.HALF_UP,
            RoundingMode.HALF_DOWN,
            RoundingMode.HALF_EVEN,
            RoundingMode.UNNECESSARY,
        ];
    }

    static fromJson(name) {
        return RoundingMode.of(name);
    }

    static of(name) {
        if(!name){
            throw new Error("Missing name");
        }

        switch(name) {
            case "UP":
                return RoundingMode.UP;
            case "DOWN":
                return RoundingMode.DOWN;
            case "CEILING":
                return RoundingMode.CEILING;
            case "FLOOR":
                return RoundingMode.FLOOR;
            case "HALF_UP":
                return RoundingMode.HALF_UP;
            case "HALF_DOWN":
                return RoundingMode.HALF_DOWN;
            case "HALF_EVEN":
                return RoundingMode.HALF_EVEN;
            case "UNNECESSARY":
                return RoundingMode.UNNECESSARY;
            default:
                throw new Error("Unknown name: " + name);
        }
    }

    constructor(name, label) {
        super();
        this.name = name;
        this.labelValue = label;
    }

    label() {
        return this.labelValue;
    }

    equals(other) {
        return this === other;
    }

    toJson() {
        return this.name;
    }

    typeName() {
        return TYPE_NAME;
    }

    toString() {
        return this.name;
    }
}

SystemObject.register(TYPE_NAME, RoundingMode.fromJson);