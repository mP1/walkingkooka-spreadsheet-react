import SystemObject from "../SystemObject.js";

const TYPE_NAME = "font-family";

/**
 * Holds a font-family name
 */
export default class FontFamily extends SystemObject {

    static fromJson(name) {
        if(!name){
            throw new Error("Missing name");
        }
        if(typeof name !== "string"){
            throw new Error("Expected string got " + name);
        }
        return new FontFamily(name);
    }

    constructor(name) {
        super();
        this.nameValue = name;
    }

    name() {
        return this.nameValue;
    }

    toJson() {
        return this.name();
    }

    typeName() {
        return TYPE_NAME;
    }

    equals(other) {
        return this === other ||
            (other instanceof FontFamily &&
                this.name() === other.name());
    }

    toString() {
        return this.name();
    }
}

SystemObject.register(TYPE_NAME, FontFamily.fromJson);