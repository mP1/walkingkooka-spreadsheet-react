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

        return value;
    }

    /**
     * Throws an exception if the value is not a object
     */
    static requireArray(value, label) {
        Preconditions.requireNonNull(value, label);
        if(!(Array.isArray(value))){
            reportError("Expected array " + label + " got " + value);
        }

        return value;
    }

    /**
     * Throws an exception if the value is not a function
     */
    static requireFunction(value, label) {
        Preconditions.requireNonNull(value, label);
        if(typeof value !== "function"){
            reportError("Expected function " + label + " got " + value);
        }

        return value;
    }

    /**
     * Throws an exception if value not a function or null.
     */
    static optionalFunction(value, label) {
        if(null != value && typeof value !== "function"){
            reportError("Expected function " + label + " or nothing got " + value);
        }

        return value;
    }

    /**
     * Throws an exception if the value is not a boolean.
     */
    static requireBoolean(value, label) {
        Preconditions.requireNonNull(value, label);

        if(typeof value !== "boolean"){
            reportError("Expected boolean " + label + " got " + value);
        }

        return value;
    }

    /**
     * Throws an exception if the value is not a number
     */
    static requireNumber(value, label, lower, upper) {
        Preconditions.requireNonNull(value, label);
        if(typeof value !== "number"){
            reportError("Expected number " + label + " got " + value);
        }
        if(lower && value < lower) {
            reportError("Expected " + label + " " + value + " >= " + lower);
        }
        if(upper && value >= upper) {
            reportError("Expected " + label + " " + value + " < " + upper);
        }

        return value;
    }

    /**
     * Throws an exception if the value is not a positive number
     */
    static requirePositiveNumber(value, label) {
        Preconditions.requireNumber(value, label);
        if(value < 0){
            reportError("Expected number " + label + " >= 0 got " + value);
        }

        return value;
    }

    /**
     * Throws an exception if the value is not a object. Note that arrays are not considered objects.
     */
    static requireObject(value, label) {
        Preconditions.requireNonNull(value, label);
        if(typeof value !== "object" || Array.isArray(value)){
            reportError("Expected object " + label + " got " + value);
        }

        return value;
    }

    /**
     * Throws an exception if the value is null or undefined.
     */
    static requireText(value, label) {
        Preconditions.requireNonNull(value, label);
        if(typeof value !== "string"){
            reportError("Expected string " + label + " got " + value);
        }

        return value;
    }

    /**
     * Throws an exception if the text is null or empty
     */
    static requireNonEmptyText(value, label) {
        Preconditions.requireText(value, label);
        if(!value){
            reportError("Missing " + label);
        }

        return value;
    }

    /**
     * Throws an exception if value is null or not the correct type. Note that prototype may also be the prototype or
     * constructor.name as a String.
     */
    static requireInstance(value, prototype, label) {
        Preconditions.requireNonNull(value, label);

        if(typeof prototype === "string"){
            if(value.constructor.name !== prototype){
                reportError("Expected " + prototype + " " + label + " got " + value);
            }
        }else {
            if(!(value instanceof prototype)){
                reportError("Expected " + prototype.name + " " + label + " got " + value);
            }
        }

        return value;
    }

    /**
     * Throws an exception if value not the correct type, null is ok.
     */
    static optionalInstance(value, prototype, label) {
        if(null != value) {
            if(typeof prototype === "string"){
                if(value.constructor.name !== prototype){
                    reportError("Expected " + prototype + " or nothing " + label + " got " + value);
                }
            }else {
                if(!(value instanceof prototype)){
                    reportError("Expected " + prototype.name + " or nothing " + label + " got " + value);
                }
            }
        }

        return value;
    }

    /**
     * Throws an exception if non null value is not text
     */
    static optionalText(value, label) {
        if(null != value) {
            Preconditions.requireText(value, label);
        }

        return value;
    }
}
