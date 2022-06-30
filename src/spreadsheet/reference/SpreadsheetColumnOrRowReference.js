import Preconditions from "../../Preconditions.js";
import React from "react";
import SpreadsheetReferenceKind from "./SpreadsheetReferenceKind";
import SpreadsheetSelection from "./SpreadsheetSelection.js";
import SpreadsheetViewportSelectionAnchor from "./SpreadsheetViewportSelectionAnchor.js";
import TableCell from "@mui/material/TableCell";

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
     * Only COLUMN A or ROW 1 can be frozen.
     */
    canFreeze() {
        return this.value() === 0;
    }

    // selection........................................................................................................

    isColumnOrRowScalarOrRange() {
        return true;
    }

    // selection........................................................................................................

    /**
     * Renders a TABLE CELL that may be highlighted.
     */
    renderViewport(style) {
        const id = this.viewportId();

        return <TableCell key={id}
                          id={id}
                          style={style}
                          tabIndex={0}
                          data-selection={this}
        >{
            this.toString()
        }</TableCell>
    }

    // viewport.........................................................................................................

    // context menu events..............................................................................................

    /**
     * Only returns true if the given clicked is equal to this column or row
     */
    viewportContextMenuClick(clicked) {
        return this.equals(clicked);
    }

    viewportFocus(labelToReference, anchor) {
        return this;
    }

    setAnchorConditional(anchor) {
        return this.setAnchor(); // not a range ignore anchor
    }

    defaultAnchor() {
        return SpreadsheetViewportSelectionAnchor.NONE;
    }

    anchors() {
        return [
            SpreadsheetViewportSelectionAnchor.NONE,
        ];
    }

    // move the column or row to the right/down by count.
    viewportInsertBeforePostSuccessSelection(count) {
        return this.addSaturated(count);
    }

    selectOptionText() {
        return this.toString();
    }

    equals(other) {
        return super.equals(other) &&
            this.kind().equals(other.kind()) &&
            this.value() === other.value();
    }

    equalsIgnoringKind(other) {
        return super.equals(other) && this.value() === other.value();
    }
}