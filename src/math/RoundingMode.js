/**
 * Represents instance of the java enum RoundingMode.
 */
export default class RoundingMode {

    static UP = new RoundingMode("UP");
    static DOWN = new RoundingMode("DOWN");
    static CEILING = new RoundingMode("CEILING");
    static FLOOR = new RoundingMode("FLOOR");
    static HALF_UP = new RoundingMode("HALF_UP");
    static HALF_DOWN = new RoundingMode("HALF_DOWN");
    static HALF_EVEN = new RoundingMode("HALF_EVEN");
    static UNNECESSARY = new RoundingMode("UNNECESSARY");

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

    constructor(name) {
        this.name = name;
    }

    equals(other) {
        return this === other;
    }

    toJson() {
        return this.name;
    }

    toString() {
        return this.name;
    }
}