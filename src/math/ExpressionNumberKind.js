export default class ExpressionNumberKind {

    static BIG_DECIMAL = new ExpressionNumberKind("BIG_DECIMAL");
    static DOUBLE = new ExpressionNumberKind("DOUBLE");

    static fromJson(name) {
        return ExpressionNumberKind.of(name);
    }

    static of(name) {
        if(!name){
            throw new Error("Missing name");
        }

        switch(name) {
            case "BIG_DECIMAL":
                return ExpressionNumberKind.BIG_DECIMAL;
            case "DOUBLE":
                return ExpressionNumberKind.DOUBLE;
            default:
                throw new Error("Unknown name: " + name);
        }
    }

    constructor(name) {
        this.name = name;
    }

    equals(other) {
        return this === other;
    }

    toJson() {
        return this.name;
    }

    toString() {
        return this.name;
    }
}