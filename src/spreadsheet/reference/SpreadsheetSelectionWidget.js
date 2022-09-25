import Preconditions from "../../Preconditions.js";
import PropTypes from 'prop-types';
import SpreadsheetHistoryAwareStateWidget from "../history/SpreadsheetHistoryAwareStateWidget.js";
import SpreadsheetHistoryHash from "../history/SpreadsheetHistoryHash.js";
import SpreadsheetMessengerCrud from "../message/SpreadsheetMessengerCrud.js";
import SystemObject from "../../SystemObject.js";

/**
 * An abstract widget that contains some cell related helper methods..
 */
export default class SpreadsheetSelectionWidget extends SpreadsheetHistoryAwareStateWidget {

    static FORMULA_TEXT_FIELD_ID = "formula-TextField";

    /**
     * Returns true if the given element is a child of the root of this widget.
     */
    static formulaContains(element) {
        return document.getElementById(SpreadsheetSelectionWidget.FORMULA_TEXT_FIELD_ID)
            .contains(element);
    }

    static TOOLBAR_ID = "toolbar";

    /**
     * Returns true if the given element is a child of the root of this widget.
     */
    static toolbarContains(element) {
        return document.getElementById(SpreadsheetSelectionWidget.TOOLBAR_ID)
            .contains(element);
    }

    static VIEWPORT_ID = "viewport";

    /**
     * Returns true if the given element is a child of the root of this widget.
     */
    static viewportContains(element) {
        return document.getElementById(SpreadsheetSelectionWidget.VIEWPORT_ID)
            .contains(element);
    }

    componentDidMount() {
        super.componentDidMount();

        this.onSpreadsheetDeltaRemover = this.props.spreadsheetDeltaCellCrud.addListener(this.onSpreadsheetDelta.bind(this));
    }

    componentWillUnmount() {
        super.componentWillUnmount();

        this.onSpreadsheetDeltaRemover && this.onSpreadsheetDeltaRemover();
        delete this.onSpreadsheetDeltaRemover;
    }

    onSpreadsheetDelta(method, cellOrLabel, url, requestDelta, responseDelta) {
        SystemObject.throwUnsupportedOperation();
    }

    /**
     * {
     *     style: {
     *         text-align: "LEFT"
     *     }
     * }
     */
    patchStyle(selection, stylePropertyName, stylePropertyValue) {
        Preconditions.requireNonNull(selection, "selection");
        Preconditions.requireNonNull(stylePropertyName, "stylePropertyName");

        const style = {};
        style[stylePropertyName] = stylePropertyValue ?
            stylePropertyValue.toJson ?
                stylePropertyValue.toJson() :
                stylePropertyValue :
            stylePropertyValue;

        this.patch(
            selection,
            {
                "style": style
            }
        )
    }

    patch(selection, delta) {
        Preconditions.requireNonNull(selection, "selection");
        Preconditions.requireNonNull(delta, "delta");

        const props = this.props;
        props.spreadsheetDeltaCellCrud.patch(
            selection,
            delta,
            this.unknownLabelErrorHandler(props.showError),
        );
    }
}

SpreadsheetSelectionWidget.propTypes = {
    history: PropTypes.instanceOf(SpreadsheetHistoryHash).isRequired,
    spreadsheetDeltaCellCrud: PropTypes.instanceOf(SpreadsheetMessengerCrud),
    showError: PropTypes.func.isRequired,
}