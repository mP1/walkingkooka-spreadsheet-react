/**
 * Base class for all enums.
 */
import Preconditions from "./Preconditions.js";
import SystemObject from "./SystemObject.js";

export default class SystemEnum extends SystemObject {

    /**
     * Helper that finds an enum with the given text(name) or throws an Error.
     */
    static valueOf(name, enumValues) {
        Preconditions.requireNonEmptyText(name, "name");

        for(var i = 0; i < enumValues.length; i++) {
            const possible = enumValues[i];
            if(possible.name() === name){
                return possible;
            }
        }
        throw new Error("Unknown enum got " + name);
    }

    // eslint-disable-next-line no-useless-constructor
    constructor(name) {
        super();
        this.nameValue = name;
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

    /**
     * Returns the name in capital case case, ie ABC_DEF becomes Abc Def.
     */
    nameCapitalCase() {
        const name = this.name().toLowerCase();
        var s = "";
        var previous = "_";

        for (let i = 0; i < name.length; i++) {
            const c = name.charAt(i);
            switch(c) {
                case '_':
                    s = s + " ";
                    break;
                default:
                    s = s +
                        ( "_" === previous ?
                        c.toUpperCase() :
                        c.toLowerCase());
                    break;
            }
            previous = c;
        }
        return s;
    }

    toCssValue() {
        return this.nameKebabCase();
    }

    /**
     * TOP_LEFT -> top-left, TOP_RIGHT -> top-right
     */
    toHistoryHashToken() {
        return this.nameKebabCase();
    }

    equals(other) {
        return this === other;
    }

    toJson() {
        return this.name();
    }

    typeName() {
        SystemObject.throwUnsupportedOperation();
    }

    toString() {
        return this.name();
    }
}