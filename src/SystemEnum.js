/**
 * Base class for all enums.
 */
import SystemObject from "./SystemObject.js";

export default class SystemEnum extends SystemObject {

    /**
     * Helper that finds an enum with the given text(name) or throws an Error.
     */
    static valueOf(name, enumValues) {
        if(!name){
            throw new Error("Missing name");
        }
        if(typeof name !== "string"){
            throw new Error("Expected string text got " + name);
        }

        for(var i = 0; i < enumValues.length; i++) {
            const possible = enumValues[i];
            if(possible.name() === name){
                return possible;
            }
        }
        throw new Error("Unknown enum got " + name);
    }

    // eslint-disable-next-line no-useless-constructor
    constructor(name, label) {
        super();
        this.nameValue = name;
        this.labelValue = label;
    }

    name() {
        return this.nameValue;
    }

    /**
     * Returns the name in kebab case, ie ABC_DEF becomes abc-def.
     */
    nameKebabCase() {
        return this.name().toLowerCase().replace(/_/g, '-');
    }

    label() {
        return this.labelValue;
    }

    equals(other) {
        return this === other;
    }

    toJson() {
        return this.name();
    }

    typeName() {
        throw new Error("Not yet implemented");
    }

    toString() {
        return this.name();
    }
}