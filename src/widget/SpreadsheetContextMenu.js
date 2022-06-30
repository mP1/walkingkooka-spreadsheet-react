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
}