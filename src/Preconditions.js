function reportError(message) {
    throw new Error(message);
}

export default class Preconditions {

    /**
     * Throws an exception if the value is null or undefined.
     */
    static requireNonNull(value, label) {
        if(null == value){
            reportError("Missing " + label);
        }
    }

    /**
     * Throws an exception if the value is not a object
     */
    static requireArray(value, label) {
        Preconditions.requireNonNull(value, label);
        if(!(Array.isArray(value))){
            reportError("Expected array " + label + " got " + value);
        }
    }

    /**
     * Throws an exception if the value is not a function
     */
    static requireFunction(value, label) {
        Preconditions.requireNonNull(value, label);
        if(typeof value !== "function"){
            reportError("Expected function " + label + " got " + value);
        }
    }

    /**
     * Throws an exception if value not a function or null.
     */
    static optionalFunction(value, label) {
        if(null != value && typeof value !== "function"){
            reportError("Expected function " + label + " or nothing got " + value);
        }
    }
    
    /**
     * Throws an exception if the value is not a number
     */
    static requireNumber(value, label) {
        Preconditions.requireNonNull(value, label);
        if(typeof value !== "number"){
            reportError("Expected number " + label + " got " + value);
        }
    }

    /**
     * Throws an exception if the value is not a object. Note that arrays are not considered objects.
     */
    static requireObject(value, label) {
        Preconditions.requireNonNull(value, label);
        if(typeof value !== "object" || Array.isArray(value)){
            reportError("Expected object " + label + " got " + value);
        }
    }

    /**
     * Throws an exception if the value is null or undefined.
     */
    static requireText(value, label) {
        Preconditions.requireNonNull(value, label);
        if(typeof value !== "string"){
            reportError("Expected string " + label + " got " + value);
        }
    }

    /**
     * Throws an exception if the text is null or empty
     */
    static requireNonEmptyText(value, label) {
        Preconditions.requireText(value, label);
        if(!value){
            reportError("Missing " + label);
        }
    }

    /**
     * Throws an exception if value is null or not the correct type
     */
    static requireInstance(value, prototype, label) {
        Preconditions.requireNonNull(value, label);

        if(!(value instanceof prototype)){
            reportError("Expected " + prototype.name + " "  + label + " got " + value);
        }
    }

    /**
     * Throws an exception if value not the correct type, null is ok.
     */
    static optionalInstance(value, prototype, label) {
        if(null != value && !(value instanceof prototype)){
            reportError("Expected " + prototype.name + " or nothing "  + label + " got " + value);
        }
    }
}
