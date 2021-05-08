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
}
