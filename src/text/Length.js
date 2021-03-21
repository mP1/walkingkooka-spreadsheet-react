import SystemObject from "../SystemObject.js";

/**
 * Base class for all the Lengths, including none-length, pixel-length.
 */
export default class Length extends SystemObject {

    // eslint-disable-next-line no-useless-constructor
    constructor() {
        super();
    }

    toJson() {
        return this.toString();
    }
}
