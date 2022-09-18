import PropTypes from "prop-types";
import React from "react";
import SpreadsheetCellHistoryHashToken from "./SpreadsheetCellHistoryHashToken.js";
import SpreadsheetCellStylePropertyButtonGroupWidget from "./style/SpreadsheetCellStylePropertyButtonGroupWidget.js";
import SpreadsheetHistoryHash from "../../history/SpreadsheetHistoryHash.js";
import SpreadsheetHistoryHashTokens from "../../history/SpreadsheetHistoryHashTokens.js";
import SpreadsheetMessengerCrud from "../../message/SpreadsheetMessengerCrud.js";
import SpreadsheetSelectionWidget from "../SpreadsheetSelectionWidget.js";
import TextAlign from "../../../text/TextAlign.js";
import TextStyle from "../../../text/TextStyle.js";

/**
 * A container that holds all format and style widgets.
 */
export default class SpreadsheetToolbarWidget extends SpreadsheetSelectionWidget {

    static ID = "toolbar";

    /**
     * Returns true if the given element is a child of the root of this widget.
     */
    static contains(element) {
        return document.getElementById(SpreadsheetToolbarWidget.ID)
            .contains(element);
    }

    init() {
        this.textAlign = React.createRef();
    }

    initialStateFromProps() {
        return {
            viewportSelection: null,
        };
    }

    stateFromHistoryTokens(historyTokens) {
        return {
            viewportSelection: historyTokens[SpreadsheetHistoryHashTokens.VIEWPORT_SELECTION],
        }
    }

    // SpreadsheetToolbarWidget never updates the history hash tokens.
    historyTokensFromState(prevState) {
        return null;
    }

    // if the viewportSelection is NOT a cell render the outer DIV as hidden.
    // this is necessary so SpreadsheetCellStylePropertyButtonGroupWidget is registered and handles history such as
    // /style/text-align/save/CENTER
    render() {
        const {
            history,
            spreadsheetDeltaCellCrud
        } = this.props;

        const {
            viewportSelection
        } = this.state

        return <div id={SpreadsheetToolbarWidget.ID}
                    style={{
                        border: 0,
                        margin: 0,
                        padding: 0,
                        visibility: viewportSelection instanceof SpreadsheetCellHistoryHashToken ? "visible" : "hidden"
                    }}><SpreadsheetCellStylePropertyButtonGroupWidget ref={this.textAlign}
                                                                      variant="contained"
                                                                      aria-label="outlined primary button group"
                                                                      history={history}
                                                                      propertyName={TextStyle.TEXT_ALIGN}
                                                                      labels={["left", "center", "right", "justify"]}
                                                                      values={[TextAlign.LEFT, TextAlign.CENTER, TextAlign.RIGHT, TextAlign.JUSTIFY]}
                                                                      spreadsheetDeltaCellCrud={spreadsheetDeltaCellCrud}
                                                                      spreadsheetToolbarWidget={this}
        />
        </div>
    }

    onSpreadsheetDelta(method, cellOrLabel, url, requestDelta, responseDelta) {
        // nop
    }

    giveSelectedFocus(propertyName) {
        let style;

        switch(propertyName) {
            case TextStyle.TEXT_ALIGN:
                style = this.textAlign.current;
                break;
            default:
                break;
        }

        style && style.giveFocus(() => style.focusElement())
    }
}

SpreadsheetToolbarWidget.propTypes = {
    history: PropTypes.instanceOf(SpreadsheetHistoryHash).isRequired,
    spreadsheetDeltaCellCrud: PropTypes.instanceOf(SpreadsheetMessengerCrud),
    showError: PropTypes.func.isRequired,
}
