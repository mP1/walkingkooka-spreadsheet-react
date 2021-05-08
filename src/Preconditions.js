export default class Preconditions {

    /**
     * Throws an exception if the value is null or undefined.
     */
    static requireNonNull(value, label) {
        if(null == value){
            throw new Error("Missing " + label);
        }
    }
}
