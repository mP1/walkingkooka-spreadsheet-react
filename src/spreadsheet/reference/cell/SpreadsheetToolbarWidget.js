import SpreadsheetSelectionWidget from "../SpreadsheetSelectionWidget.js";
import ButtonGroup from "@mui/material/ButtonGroup";
import SpreadsheetCellStylePropertyToggleButtonGroupWidget
    from "./style/SpreadsheetCellStylePropertyToggleButtonGroupWidget.js";
import TextStyle from "../../../text/TextStyle.js";
import TextAlign from "../../../text/TextAlign.js";
import React from "react";
import PropTypes from "prop-types";
import SpreadsheetHistoryHash from "../../history/SpreadsheetHistoryHash.js";
import SpreadsheetMessengerCrud from "../../message/SpreadsheetMessengerCrud.js";
import SpreadsheetHistoryHashTokens from "../../history/SpreadsheetHistoryHashTokens.js";

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
        return null; // never updates history.
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
                <SpreadsheetCellStylePropertyToggleButtonGroupWidget label={"Left"} propertyName={TextStyle.TEXT_ALIGN}
                                                                     propertyValue={TextAlign.LEFT} history={history}
                                                                     spreadsheetDeltaCellCrud={spreadsheetDeltaCellCrud}/>
                <SpreadsheetCellStylePropertyToggleButtonGroupWidget label={"Center"}
                                                                     propertyName={TextStyle.TEXT_ALIGN}
                                                                     propertyValue={TextAlign.CENTER} history={history}
                                                                     spreadsheetDeltaCellCrud={spreadsheetDeltaCellCrud}/>
                <SpreadsheetCellStylePropertyToggleButtonGroupWidget label={"Right"} propertyName={TextStyle.TEXT_ALIGN}
                                                                     propertyValue={TextAlign.RIGHT} history={history}
                                                                     spreadsheetDeltaCellCrud={spreadsheetDeltaCellCrud}/>
                <SpreadsheetCellStylePropertyToggleButtonGroupWidget label={"Justify"}
                                                                     propertyName={TextStyle.TEXT_ALIGN}
                                                                     propertyValue={TextAlign.JUSTIFY} history={history}
                                                                     spreadsheetDeltaCellCrud={spreadsheetDeltaCellCrud}/>
            </ButtonGroup>
        </div>
    }
}

SpreadsheetToolbarWidget.propTypes = {
    history: PropTypes.instanceOf(SpreadsheetHistoryHash).isRequired,
    spreadsheetDeltaCellCrud: PropTypes.instanceOf(SpreadsheetMessengerCrud),
    showError: PropTypes.func.isRequired,
}
