import Equality from "../Equality.js";

export default class SpreadsheetContextMenu {

    constructor(left, top, items) {
        this.leftValue = left;
        this.topValue = top;
        this.itemsValue = items;
    }

    left() {
        return this.leftValue;
    }

    top() {
        return this.topValue;
    }

    items() {
        return this.itemsValue;
    }

    equals(other) {
        return other instanceof SpreadsheetContextMenu &&
            this.left() === other.left() &&
            this.top() === other.top() &&
            Equality.safeEquals(this.items(), other.items());
    }
}