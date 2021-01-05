/**
 * Base class for all enums.
 */
import SystemObject from "./SystemObject.js";

export default class SystemEnum extends SystemObject {

    // eslint-disable-next-line no-useless-constructor
    constructor() {
        super();
    }

    label() {
        throw new Error("Not yet implemented.");
    }
}