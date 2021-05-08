export default class Preconditions {

    /**
     * Throws an exception if the value is null or undefined.
     */
    static requireNonNull(value, label) {
        if(null == value){
            throw new Error("Missing " + label);
        }
    }

    /**
     * Throws an exception if the value is null or undefined.
     */
    static requireText(value, label) {
        Preconditions.requireNonNull(value, label);
        if(typeof value !== "string"){
            throw new Error("Expected string " + label + " got " + value);
        }
    }

    /**
     * Throws an exception if the text is null or empty
     */
    static requireNonEmptyText(value, label) {
        Preconditions.requireText(value, label);
        if(!value){
            throw new Error("Expected non empty string " + label);
        }
    }

    /**
     * Throws an exception if value is null or not the correct type
     */
    static requireNonNullInstance(value, prototype, label) {
        Preconditions.requireNonNull(value, label);

        if(!(value instanceof prototype)){
            throw new Error("Expected " + prototype.name + " "  + label + " got " + value);
        }
    }
}
