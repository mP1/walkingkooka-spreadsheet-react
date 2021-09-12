import Preconditions from "../../Preconditions.js";
import React from "react";
import SpreadsheetColumnReference from "./SpreadsheetColumnReference.js";
import SpreadsheetReferenceKind from "./SpreadsheetReferenceKind";
import SpreadsheetSelection from "./SpreadsheetSelection.js";
import TableCell from "@material-ui/core/TableCell";

// default header cell styles
const headerCell = {
    minWidth: "4ex",

    margin: "0",
    borderColor: "#000",
    borderStyle: "solid",
    borderWidth: "1px",
    padding: "0",
    fontWeight: "bold",

    textAlign: "center",
    verticalAlign: "middle",

    backgroundColor: "#ccc", // TODO take colours from theme
    color: "#333",
};

const headerCellSelected = Object.assign({},
    headerCell,
    {
        backgroundColor: "#444", // TODO take colours from theme
        color: "#bbb",
    },
);

export default class SpreadsheetColumnOrRowReference extends SpreadsheetSelection {

    constructor(value, kind) {
        super();
        const max = this.max();

        Preconditions.requireNumber(value, "value");
        if(value < 0 || value >= max){
            throw new Error("Invalid value not between 0 and " + max + " got " + value);
        }
        this.valueValue = value;

        Preconditions.requireInstance(kind, SpreadsheetReferenceKind, "kind");
        this.kindValue = kind;
    }

    kind() {
        return this.kindValue;
    }

    /**
     * Would be setter that returns a {@link SpreadsheetColumnOrRowReference} of the same type with the given {@link SpreadsheetReferenceKind}.
     */
    setKind(kind) {
        return this.kind() === kind ?
            this :
            new this.constructor(this.value(), kind);
    }

    add(delta) {
        Preconditions.requireNumber(delta, "delta");
        return this.setValue(this.value() + delta);
    }

    addSaturated(delta) {
        Preconditions.requireNumber(delta, "delta");
        return this.setValue(
            Math.min(
                Math.max(this.value() + delta, 0),
                this.max() -1
            )
        );
    }

    value() {
        return this.valueValue;
    }

    setValue(value) {
        return this.value() === value ?
            this :
            new this.constructor(value, this.kind());
    }

    /**
     * May be used to compare a column with another column or row with another row ignoring the kind property.
     */
    compareTo(other) {
        Preconditions.requireInstance(other, this.constructor, "other");

        return this.value() - other.value();
    }

    /**
     * Renders a TABLE that may be highlighted.
     */
    renderViewport(highlighted) {
        const isColumn = this instanceof SpreadsheetColumnReference;
        const columnOrRow = isColumn ? "column" : "row";
        const id = this.viewportId();

        return <TableCell key={id}
                          id={id}
                          className={(columnOrRow) + (highlighted ? " selected" : "")}
                          style={highlighted ? headerCellSelected : headerCell}
                          tabIndex={0}
                          data-selection={this}
        >{
            this.toString()
        }</TableCell>
    }

    // viewport.........................................................................................................

    viewportEnter(giveFormulaFocus) {
        // do nothing if ENTER selected on column or row.
    }

    viewportFocus(labelToReference, anchor) {
        return this;
    }

    setAnchorConditional(anchor) {
        return this.setAnchor(); // not a range ignore anchor
    }

    anchors() {
        return [];
    }

    selectOptionText() {
        return this.toString();
    }

    equals(other) {
        return this === other || (other instanceof this.constructor && this.kind().equals(other.kind()) && this.value() === other.value());
    }
}