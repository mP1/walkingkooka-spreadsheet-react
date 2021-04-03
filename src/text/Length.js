import SystemObject from "../SystemObject.js";

/**
 * Base class for all the Lengths, including none-length, pixel-length.
 */
export default class Length extends SystemObject {

    toCssValue() {
        throw new Error("Not yet implemented toCssValue()");
    }

    toJson() {
        return this.toString();
    }
}
