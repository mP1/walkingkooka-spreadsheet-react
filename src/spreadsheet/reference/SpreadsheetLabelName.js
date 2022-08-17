import Character from "../../Character.js";
import CharSequences from "../../CharSequences.js";
import Preconditions from "../../Preconditions.js";
import SpreadsheetCellReference from "./SpreadsheetCellReference.js";
import SpreadsheetExpressionReference from "./SpreadsheetExpressionReference.js";
import SpreadsheetLabelMapping from "./SpreadsheetLabelMapping.js";
import SpreadsheetViewport from "./viewport/SpreadsheetViewport.js";
import SystemObject from "../../SystemObject.js";
import SpreadsheetViewportSelectionAnchor from "./viewport/SpreadsheetViewportSelectionAnchor.js";

const TYPE_NAME = "spreadsheet-label-name";
const MAX_LENGTH = 255;

export default class SpreadsheetLabelName extends SpreadsheetExpressionReference {

    static fromJson(json) {
        return SpreadsheetLabelName.parse(json);
    }

    static parse(text) {
        Preconditions.requireNonEmptyText(text, "text");

        const length = text.length;
        if(length > MAX_LENGTH){
            throw new Error("Invalid label length " + length + " > " + MAX_LENGTH);
        }
        if(SpreadsheetCellReference.isCellReferenceText(text)){
            throw new Error("Label is a valid cell reference=" + CharSequences.quoteAndEscape(text));
        }

        Next:
            for(var i = 0; i < length; i++) {
                const c = text.charAt(i);

                if(c >= 'A' && c <= 'Z'){
                    continue;
                }
                if(c >= 'a' && c <= 'z'){
                    continue;
                }
                if(i > 0){
                    switch(c) {
                        case '0':
                        case '1':
                        case '2':
                        case '3':
                        case '4':
                        case '5':
                        case '6':
                        case '7':
                        case '8':
                        case '9':
                        case '_':
                            continue Next;
                        default:
                            break;
                    }
                }
                throw new Error("Invalid character " + CharSequences.quoteAndEscape(Character.fromJson(c)) + " at " + i);
            }

        return new SpreadsheetLabelName(text);
    }

    constructor(text) {
        super();
        this.textValue = text;
    }

    value() {
        return this.textValue;
    }

    mapping(reference) {
        return new SpreadsheetLabelMapping(this, reference);
    }

    canFreeze() {
        return true;
    }

    cellOrRange() {
        return this;
    }

    cellMapKeys(labels) {
        var keys = [];

        labels.forEach(m => {
            if(this.equals(m.label())){
                keys =
                    m.reference()
                        .cellMapKeys(labels);
            }
        });

        return keys;
    }

    testCell(cellReference) {
        return false;
    }

    testColumn(columnReference) {
        return false;
    }

    testRow(rowReference) {
        return false;
    }

    toRelative() {
        return this;
    }

    // viewport.........................................................................................................

    viewport(width, height) {
        return new SpreadsheetViewport(this, width, height);
    }

    viewportFocus(labelToReference, anchor) {
        const target = labelToReference.get(this);
        return target && target.viewportFocus(labelToReference, anchor);
    }

    defaultAnchor() {
        return SpreadsheetViewportSelectionAnchor.NONE;
    }

    setAnchorConditional(anchor) {
        return this.setAnchor(anchor);// keep
    }

    checkAnchor(anchor) {
        // nop
    }

    anchors() {
        return [];
    }

    kebabClassName() {
        return "label";
    }

    compareTo(other) {
        Preconditions.requireInstance(other, this.constructor, "other");

        return this.value()
            .toUpperCase()
            .localeCompare(
                other.value()
                    .toUpperCase(),
                "en"
            );
    }

    // JSON.............................................................................................................

    toJson() {
        return this.toString();
    }

    typeName() {
        return TYPE_NAME;
    }

    equals(other) {
        return other instanceof SpreadsheetLabelName &&
            this.value().toLocaleLowerCase() === other.value().toLocaleLowerCase();
    }

    equalsIgnoringKind(other) {
        return this.equals(other);
    }

    toString() {
        return this.value();
    }
}

SystemObject.register(TYPE_NAME, SpreadsheetLabelName.fromJson);