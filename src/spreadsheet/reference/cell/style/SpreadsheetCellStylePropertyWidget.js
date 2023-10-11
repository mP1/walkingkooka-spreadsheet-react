import PropTypes from 'prop-types';
import SpreadsheetCellHistoryHashToken from "../SpreadsheetCellHistoryHashToken.js";
import SpreadsheetCellStyleEditHistoryHashToken from "./SpreadsheetCellStyleEditHistoryHashToken.js";
import SpreadsheetCellStyleHistoryHashToken from "./SpreadsheetCellStyleHistoryHashToken.js";
import SpreadsheetCellWidget from "../SpreadsheetCellWidget.js";
import SpreadsheetHistoryHash from "../../../history/SpreadsheetHistoryHash.js";
import SpreadsheetHistoryHashTokens from "../../../history/SpreadsheetHistoryHashTokens.js";
import SpreadsheetLabelName from "../../label/SpreadsheetLabelName.js";
import SpreadsheetSelectionWidget from "../../SpreadsheetSelectionWidget.js";
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
            viewport: tokens[SpreadsheetHistoryHashTokens.VIEWPORT],
        };
    }

    historyTokensFromState(prevState) {
        let tokens;

        const viewport = this.state.viewport;

        const {
            propertyName,
            spreadsheetToolbarWidget
        } = this.props;

        // Need to also test propertyName otherwise a SpreadsheetCellStyleSaveHistoryHashToken will be executed multiple times.
        // FIXES https://github.com/mP1/walkingkooka-spreadsheet-react/issues/2118
        if(viewport instanceof SpreadsheetCellStyleHistoryHashToken && propertyName === viewport.propertyName()) {
            tokens = viewport.spreadsheetToolbarWidgetExecute(
                spreadsheetToolbarWidget,
                prevState.viewport
            )
        }

        return tokens;
    }

    id() {
        const {
            propertyName,
            propertyValue
        } = this.props;

        return SpreadsheetCellStylePropertyWidget.computeId(
            propertyName,
            propertyValue
        );
    }

    static computeId(propertyName, propertyValue) {
        return "cell-style-" +
            propertyName +
            (propertyValue ? ("-" + propertyValue) : "");
    }

    /**
     * If the delta includes an updated formula text for the cell being edited update text.
     */
    onSpreadsheetDelta(method, cellOrLabel, url, requestDelta, responseDelta) {
        if(responseDelta){
            const {
                viewport: viewportToken,
            } = this.state;

            // A1=TextAlign.LEFT, B1=null
            const cellToValue = Object.assign(
                {},
                this.state.cellToValue
            );

            if(viewportToken instanceof SpreadsheetCellHistoryHashToken){
                const viewport = viewportToken.viewport();
                var selection = viewport.selection();

                if(selection instanceof SpreadsheetLabelName){
                    selection = responseDelta.cellReference(selection);
                }

                const propertyName = this.props.propertyName;

                selection.values()
                    .forEach(
                        (cellReference) => {
                            const cell = responseDelta.cell(cellReference);
                            cellToValue[cellReference.toRelative().toString()] = cell ?
                                cell.style().get(propertyName) :
                                null;
                        });

                // cellToValue will be used during render
                this.setState({
                    cellOrRange: selection, // never label
                    cellToValue: cellToValue,
                });
            }
        }
    }

    // render nothing if a cell is not selected.
    render() {
        const viewport = this.state.viewport;
        return viewport instanceof SpreadsheetCellHistoryHashToken ?
            this.render0(viewport) :
            null;
    }

    render0(viewportToken) {
        const viewport = viewportToken.viewport();
        const propertyName = this.props.propertyName;

        const onFocus = () => {
            this.log(".onFocus");

            this.setState({
                focused: true,
                viewport: new SpreadsheetCellStyleEditHistoryHashToken(
                    viewport,
                    propertyName,
                )
            });
        };

        const onBlur = (e) => {
            const target = e.relatedTarget;

            if(SpreadsheetSelectionWidget.viewportContains(target) || SpreadsheetSelectionWidget.formulaContains(target) || SpreadsheetSelectionWidget.toolbarContains(target)){
                this.log(".onBlur but new target is one of viewport/formula/toolbar no update to history hash");

                this.setState({
                    focused: false,
                });
            }else {
                this.props.spreadsheetToolbarWidget.historyPushViewportSelect();
            }
        };

        return this.renderStyleWidget(
            onFocus,
            onBlur
        );
    }

    renderStyleWidget() {
        SystemObject.throwUnsupportedOperation();
    }


    isFocused() {
        return this.state.focused;
    }

    focusElement() {
        SystemObject.throwUnsupportedOperation();
    }

    spreadsheetViewportWidgetExecute(viewportWidget, previousViewport, viewportCell, width, height) {
        // NOP
    }

    prefix() {
        return super.prefix() + "." + this.props.propertyName;
    }
}


SpreadsheetCellStylePropertyWidget.propTypes = {
    history: PropTypes.instanceOf(SpreadsheetHistoryHash).isRequired,
    label: PropTypes.string.isRequired,
    propertyName: PropTypes.string.isRequired,
    spreadsheetToolbarWidget: PropTypes.object.isRequired, // PropTypes.instanceOf(SpreadsheetToolbarWidget).isRequired
}