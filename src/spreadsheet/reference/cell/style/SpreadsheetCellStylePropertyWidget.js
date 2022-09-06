import Equality from "../../../../Equality.js";
import PropTypes from 'prop-types';
import SpreadsheetCellHistoryHashToken from "../SpreadsheetCellHistoryHashToken.js";
import SpreadsheetCellStyleSaveHistoryHashToken from "./SpreadsheetCellStyleSaveHistoryHashToken.js";
import SpreadsheetCellWidget from "../SpreadsheetCellWidget.js";
import SpreadsheetExpressionReference from "../../SpreadsheetExpressionReference.js";
import SpreadsheetHistoryHash from "../../../history/SpreadsheetHistoryHash.js";
import SpreadsheetHistoryHashTokens from "../../../history/SpreadsheetHistoryHashTokens.js";
import SpreadsheetLabelName from "../../label/SpreadsheetLabelName.js";
import SystemObject from "../../../../SystemObject.js";

/**
 * Common base class for any style widget that represents a single style property and value.
 */
export default class SpreadsheetCellStylePropertyWidget extends SpreadsheetCellWidget {

    init() {
    }

    initialStateFromProps(props) {
        return this.stateFromHistoryTokens(props.history.tokens());
    }

    stateFromHistoryTokens(tokens) {
        return {
            spreadsheetId: tokens[SpreadsheetHistoryHash.SPREADSHEET_ID],
            spreadsheetName: tokens[SpreadsheetHistoryHash.SPREADSHEET_NAME],
            viewportSelection: tokens[SpreadsheetHistoryHashTokens.VIEWPORT_SELECTION],
        };
    }

    historyTokensFromState(prevState) {
        return SpreadsheetHistoryHashTokens.emptyTokens(); // never update history from state.
    }

    id() {
        const {
            propertyName,
            propertyValue
        } = this.props;

        return "cell-style-" + propertyName + "-" + propertyValue;
    }

    /**
     * If the delta includes an updated formula text for the cell being edited update text.
     */
    onSpreadsheetDelta(method, cellOrLabel, url, requestDelta, responseDelta) {
        const viewportSelectionToken = this.state.viewportSelection;

        if(viewportSelectionToken instanceof SpreadsheetCellHistoryHashToken){
            const viewportSelection = viewportSelectionToken.viewportSelection();
            var selection = viewportSelection.selection();

            if(selection instanceof SpreadsheetLabelName) {
                selection = responseDelta.cellReference(selection);
            }

            const propertyName = this.props.propertyName;
            const propertyValue = this.props.propertyValue;
            const selected = -1 !== selection.values()
                .findIndex(
                    (cellReference) => {
                        const cell = responseDelta.cell(cellReference);
                        return Boolean(
                            cell && Equality.safeEquals(
                                propertyValue,
                                cell.style()
                                    .get(propertyName)
                            )
                        );
                    });

            // selection might be a cell or cell-range
            this.setState({
               selected: selected,
            });
        }
    }

    render() {
        const state = this.state;
        const selected = Boolean(state.selected);

        const {
            history,
            propertyName,
            propertyValue
        } = this.props;

        // must be a SpreadsheetExpressionReference
        const viewportSelectionToken = state.viewportSelection && state.viewportSelection.viewportSelection();
        const enabled = null != viewportSelectionToken &&
            viewportSelectionToken.selection() instanceof SpreadsheetExpressionReference;

        var linkUrl;
        var clicked;

        if(enabled) {
            const tokens = SpreadsheetHistoryHash.emptyTokens();
            tokens[SpreadsheetHistoryHashTokens.SPREADSHEET_ID] = state.spreadsheetId;
            tokens[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME] = state.spreadsheetName;
            tokens[SpreadsheetHistoryHashTokens.VIEWPORT_SELECTION] =  new SpreadsheetCellStyleSaveHistoryHashToken(
                viewportSelectionToken,
                propertyName,
                propertyValue,
            );

            linkUrl = "#" + SpreadsheetHistoryHash.stringify(tokens);
            clicked = () => {
                history.mergeAndPush(tokens)
            };
        }
        this.log(".render enabled=" + enabled + " selected=" + selected + " linkUrl=" + linkUrl);
        return this.render0(
            enabled,
            selected,
            linkUrl,
            clicked,
        );
    }

    render0(enabled, selected, linkUrl, clicked) {
        SystemObject.throwUnsupportedOperation();
    }
}


SpreadsheetCellStylePropertyWidget.propTypes = {
    history: PropTypes.instanceOf(SpreadsheetHistoryHash).isRequired,
    label: PropTypes.string.isRequired,
    propertyName: PropTypes.string.isRequired,
    propertyValues: PropTypes.object, // might be null
}