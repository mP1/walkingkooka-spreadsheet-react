import ButtonGroup from "@mui/material/ButtonGroup";
import PropTypes from "prop-types";
import React from "react";
import SpreadsheetCellStylePropertyToggleButtonWidget from "./style/SpreadsheetCellStylePropertyToggleButtonWidget.js";
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

    init() {
        // NOP
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

    historyTokensFromState(prevState) {
        return SpreadsheetHistoryHashTokens.emptyTokens();
    }

    render() {
        const {
            history,
            spreadsheetDeltaCellCrud
        } = this.props;

        return <div style={{
            border: 0,
            margin: 0,
            padding: 0,
        }}>
            <ButtonGroup variant="contained" aria-label="outlined primary button group">
                <SpreadsheetCellStylePropertyToggleButtonWidget label={"Left"} propertyName={TextStyle.TEXT_ALIGN}
                                                                propertyValue={TextAlign.LEFT} history={history}
                                                                spreadsheetDeltaCellCrud={spreadsheetDeltaCellCrud}/>
                <SpreadsheetCellStylePropertyToggleButtonWidget label={"Center"}
                                                                propertyName={TextStyle.TEXT_ALIGN}
                                                                propertyValue={TextAlign.CENTER} history={history}
                                                                spreadsheetDeltaCellCrud={spreadsheetDeltaCellCrud}/>
                <SpreadsheetCellStylePropertyToggleButtonWidget label={"Right"} propertyName={TextStyle.TEXT_ALIGN}
                                                                propertyValue={TextAlign.RIGHT} history={history}
                                                                spreadsheetDeltaCellCrud={spreadsheetDeltaCellCrud}/>
                <SpreadsheetCellStylePropertyToggleButtonWidget label={"Justify"}
                                                                propertyName={TextStyle.TEXT_ALIGN}
                                                                propertyValue={TextAlign.JUSTIFY} history={history}
                                                                spreadsheetDeltaCellCrud={spreadsheetDeltaCellCrud}/>
            </ButtonGroup>
        </div>
    }

    onSpreadsheetDelta(method, cellOrLabel, url, requestDelta, responseDelta) {
        // nop
    }
}

SpreadsheetToolbarWidget.propTypes = {
    history: PropTypes.instanceOf(SpreadsheetHistoryHash).isRequired,
    spreadsheetDeltaCellCrud: PropTypes.instanceOf(SpreadsheetMessengerCrud),
    showError: PropTypes.func.isRequired,
}
