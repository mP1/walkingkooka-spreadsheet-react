import Equality from "../../../Equality.js";
import Preconditions from "../../../Preconditions.js";
import RelativeUrl from "../../../net/RelativeUrl.js";
import SpreadsheetSelection from "../SpreadsheetSelection.js";
import SpreadsheetViewportAnchor from "./SpreadsheetViewportAnchor.js";
import SpreadsheetViewportSelectionNavigation from "./SpreadsheetViewportSelectionNavigation.js";
import SystemObject from "../../../SystemObject.js";

const TYPE_NAME = "spreadsheet-viewport";

export default class SpreadsheetViewport extends SystemObject {

    static fromJson(json) {
        Preconditions.requireObject(json, "json");

        const {
            selection,
            anchor,
            navigation
        } = json;
        return new SpreadsheetViewport(
            SystemObject.fromJsonWithType(selection),
            anchor && SpreadsheetViewportAnchor.fromJson(anchor),
            navigation && SpreadsheetViewportSelectionNavigation.fromJson(navigation)
        );
    }

    constructor(selection, anchor, navigation) {
        super();
        Preconditions.requireInstance(selection, SpreadsheetSelection, "selection");
        Preconditions.optionalInstance(anchor, SpreadsheetViewportAnchor, "anchor");

        anchor && selection.checkAnchor(anchor);

        Preconditions.optionalInstance(navigation, SpreadsheetViewportSelectionNavigation, "navigation");

        this.selectionValue = selection;
        this.anchorValue = anchor;
        this.navigationValue = navigation;
    }

    selection() {
        return this.selectionValue;
    }

    anchor() {
        return this.anchorValue;
    }

    setAnchor(anchor) {
        Preconditions.optionalInstance(anchor, SpreadsheetViewportAnchor, "anchor");

        return Equality.safeEquals(this.anchor(), anchor) ?
            this :
            new SpreadsheetViewport(
                this.selection(),
                anchor,
                this.navigation()
            );
    }

    navigation() {
        return this.navigationValue;
    }

    setNavigation(navigation) {
        Preconditions.optionalInstance(navigation, SpreadsheetViewportSelectionNavigation, "navigation");

        return Equality.safeEquals(this.navigation(), navigation) ?
            this :
            new SpreadsheetViewport(
                this.selection(),
                this.anchor(),
                navigation
            );
    }

    historyHashPath() {
        var tokens = this.selection()
            .historyHashPath();

        const anchor = this.anchor();
        if(anchor) {
            tokens = tokens +
                "/" +
                anchor.historyHashPath();
        }

        return tokens;
    }

    toJson() {
        const json = {
            selection: this.selection().toJsonWithType(),
        }

        const anchor = this.anchor();
        if(anchor) {
            Object.assign(
                json,
                {
                    anchor: anchor.toJson(),
                }
            );
        }

        const navigation = this.navigation();
        if(navigation) {
            Object.assign(
                json,
                {
                    navigation: navigation.toJson(),
                }
            );
        }

        return json;
    }

    toQueryString(firstSeparator) {
        const selection = this.selection();
        const parameters = {
            selection: [selection.toString()],
            selectionType: [selection.kebabClassName()],
        };

        const anchor = this.anchor();
        if(anchor){
            Object.assign(
                parameters,
                {
                    selectionAnchor: [anchor.nameKebabCase()]
                }
            )
        }

        const navigation = this.navigation();
        if(navigation){
            Object.assign(
                parameters,
                {
                    selectionNavigation: [navigation.nameKebabCase()]
                }
            )
        }

        return RelativeUrl.toQueryString(firstSeparator, parameters);
    }

    typeName() {
        return TYPE_NAME;
    }

    equals(other) {
        return other instanceof SpreadsheetViewport &&
                this.selection().equals(other.selection()) &&
                Equality.safeEquals(this.anchor(), other.anchor()) &&
                Equality.safeEquals(this.navigation(), other.navigation());
    }

    toString() {
        const anchor = this.anchor();
        const navigation = this.navigation();

        return this.selection() + (anchor ? " " + anchor : "") + (navigation ? " " + navigation : "");
    }
}

SystemObject.register(TYPE_NAME, SpreadsheetViewport.fromJson);