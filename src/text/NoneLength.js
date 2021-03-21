import Length from "./Length";
import SystemObject from "../SystemObject.js";

const TYPE_NAME = "none-length";
const TEXT = "none";
/**
 * Holds a none-length value.
 */
export default class NoneLength extends Length {

    static fromJson(text) {
        return NoneLength.parse(text);
    }

    static parse(text) {
        if(!text){
            throw new Error("Missing text");
        }
        if(typeof text !== "string"){
            throw new Error("Expected string got " + text);
        }
        if(text !== TEXT){
            throw new Error("Expected string \"" + TEXT + "\" got " + text);
        }

        return NoneLength.INSTANCE;
    }

    /**
     * The singleton
     */
    static INSTANCE = new NoneLength();

    constructor(value) {
        super();
    }

    value() {
        return TEXT;
    }

    typeName() {
        return TYPE_NAME;
    }

    equals(other) {
        return this === other ||
            (other instanceof NoneLength &&
                this.value() === other.value());
    }

    toString() {
        return this.value();
    }
}
