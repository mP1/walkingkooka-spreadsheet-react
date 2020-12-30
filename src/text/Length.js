import SystemObject from "../SystemObject.js";

export default class Length extends SystemObject {

    // eslint-disable-next-line no-useless-constructor
    constructor() {
        super();
    }

    toJson() {
        return this.toString();
    }
}