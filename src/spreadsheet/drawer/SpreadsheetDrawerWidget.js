import {withStyles} from "@material-ui/core/styles";

import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Drawer from "@material-ui/core/Drawer";
import Equality from "../../Equality.js";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FormatRequest from "../server/format/FormatRequest.js";
import MultiFormatRequest from "../server/format/MultiFormatRequest.js";
import MultiFormatResponse from "../server/format/MultiFormatResponse.js";
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import React from 'react';
import SpreadsheetDrawerWidgetCharacter from "./SpreadsheetDrawerWidgetCharacter.js";
import SpreadsheetDrawerWidgetString from "./SpreadsheetDrawerWidgetString.js";
import SpreadsheetLocaleDefaultDateTimeFormat from "../server/format/SpreadsheetLocaleDefaultDateTimeFormat.js";
import SpreadsheetMetadata from "../meta/SpreadsheetMetadata.js";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

/**
 * The drawer appears holds all general settings and tools for a spreadsheet sheet.
 */
const useStyles = theme => ({
    root: {
        width: '100%',
    },
    heading: {
        fontWeight: 700,
    },
    secondaryHeading: {
        color: theme.palette.text.secondary,
    },
    label: {
        fontWeight: 700,
        width: "150px",
        verticalAlign: "middle",
    },
    value: {
        verticalAlign: "middle",
    },
});

class SpreadsheetDrawerWidget extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            open: props.open,
            spreadsheetMetadata: props.spreadsheetMetadata,
            createDateTimeFormatted: "",
            modifiedDateTimeFormatted: "",
        };
        this.onClose = props.onClose;
        this.width = props.width;

        this.formatCreateDateTimeModifiedDateTime = props.formatCreateDateTimeModifiedDateTime;
        this.setSpreadsheetMetadata = props.setSpreadsheetMetadata;
    }

    /**
     * If the create-date-time or modified-date-time changed send a format request.
     */
    componentDidUpdate(prevProps, prevState, snapshot) {
        const state = this.state;
        console.log("componentDidUpdate", "prevState", prevState, "state", state);

        const metadata = state.spreadsheetMetadata;
        const createDateTime = metadata.get(SpreadsheetMetadata.CREATE_DATE_TIME);
        const modifiedDateTime = metadata.get(SpreadsheetMetadata.MODIFIED_DATE_TIME);

        const previousMetadata = prevState.spreadsheetMetadata;

        if(!metadata.equals(prevState)){
            this.setSpreadsheetMetadata(metadata);
        }

        // initiate requests to fetch create & modified date time.......................................................
        if(!Equality.safeEquals(createDateTime, previousMetadata.get(SpreadsheetMetadata.CREATE_DATE_TIME)) ||
            !Equality.safeEquals(modifiedDateTime, previousMetadata.get(SpreadsheetMetadata.MODIFIED_DATE_TIME))
        ){
            const formatRequests = [];
            formatRequests.push(new FormatRequest(createDateTime, SpreadsheetLocaleDefaultDateTimeFormat.INSTANCE));
            formatRequests.push(new FormatRequest(modifiedDateTime, SpreadsheetLocaleDefaultDateTimeFormat.INSTANCE));

            this.sendFormatCreateDateTimeModifiedDateTime(new MultiFormatRequest(formatRequests));
        }
    }

    /**
     * Make a request to the server to format the createDateTime & modifiedDateTime
     */
    sendFormatCreateDateTimeModifiedDateTime(request) {
        this.formatCreateDateTimeModifiedDateTime(request, this.setFormattedCreateDateTimeAndModifiedDateTime.bind(this)); // TODO handle server format errors
    }

    /**
     * This method should be called by the formatRequest handler when it receives the formatted date/times.
     */
    setFormattedCreateDateTimeAndModifiedDateTime(multiFormatResponse) {
        console.log("setFormattedCreateDateTimeAndModifiedDateTime", multiFormatResponse);

        const [createDateTime, modifiedDateTime] = MultiFormatResponse.fromJson(multiFormatResponse).responses();

        this.setState({
            createDateTimeFormatted: createDateTime, // already strings
            modifiedDateTimeFormatted: modifiedDateTime,
        });
    }

    render() {
        const {classes} = this.props;
        const {open, spreadsheetMetadata} = this.state;

        // if metadata is empty skip rendering content.
        const children = (!spreadsheetMetadata.isEmpty() && open &&
            [
                this.metadata(classes),
                this.spreadsheetText(classes),
                this.spreadsheetNumber(classes),
                this.spreadsheetDateTime(classes),
                this.spreadsheetStyle(classes)
            ]);

        return <Drawer id={"settings-tools-drawer"}
                       anchor={"right"}
                       variant={"persistent"}
                       open={this.state.open}
                       modal={"false"}
                       onClose={this.onClose}
        >
            <div className={classes.root}
                 style={{margin: 0, border: 0, padding: 0, width: this.width + "px"}}>
                {children}
            </div>
        </Drawer>;
    }

    // METADATA.........................................................................................................

    /**
     * Displays the following spreadsheet metadata.
     * <ul>
     * <li>spreadsheet-id</li>
     * <li>creator</li>
     * <li>create date time</li>
     * <li>modified by</li>
     * <li>modified date time</li>
     * <ul>
     */
    metadata(classes) {
        const rows = [
            this.row("Spreadsheet Id", SpreadsheetMetadata.SPREADSHEET_ID),
            this.row("Creator", SpreadsheetMetadata.CREATOR),
            this.row("Create Date/Time", SpreadsheetMetadata.CREATE_DATE_TIME),
            this.row("Modified by", SpreadsheetMetadata.MODIFIED_BY),
            this.row("Modified Date/Time", SpreadsheetMetadata.MODIFIED_DATE_TIME),
        ];

        return this.accordion("metadata",
            true,
            () => {
            },
            classes,
            "Spreadsheet Metadata",
            "",
            "Readonly Spreadsheet Metadata",
            rows,
        );
    }

    // TEXT.............................................................................................................

    /**
     * Displays the text and locale.
     * <ul>
     * <li>locale (Locale) TODO https://github.com/mP1/walkingkooka-spreadsheet-server/issues/124</li>
     * <li>text-format-pattern (pattern)</li>
     * <ul>
     */
    spreadsheetText(classes) {
        const rows = [
            this.row("Locale", SpreadsheetMetadata.LOCALE),
            this.row("Format", SpreadsheetMetadata.TEXT_FORMAT_PATTERN),
        ];

        return this.accordion("spreadsheet-text",
            true,
            () => {
            },
            classes,
            "Text",
            "",
            "Text",
            rows,
        );
    }

    /**
     * Displays the following editable spreadsheet date/time settings.
     * <ul>
     * <li>date-format-pattern (pattern)</li>
     * <li>date-parse-patterns (pattern)</li>
     * <li>date-time-offset (1900/1904)</li>
     * <li>date-time-format-pattern (pattern)</li>
     * <li>date-time-parse-patterns (pattern)</li>
     * <li>time-format-pattern (pattern)</li>
     * <li>time-parse-patterns (pattern)</li>
     * <li>two-digit-year (int 0-99)</li>
     * <ul>
     */
    spreadsheetDateTime(classes) {
        const rows = [
            this.row("Date Time Offset", SpreadsheetMetadata.DATETIME_OFFSET), // 1900 or 1904 date system
            this.row("Two Digit Year", SpreadsheetMetadata.TWO_DIGIT_YEAR),

            this.row("Date Format", SpreadsheetMetadata.DATE_FORMAT_PATTERN),
            this.row("Date Parse", SpreadsheetMetadata.DATE_PARSE_PATTERNS),
            this.row("Date/Time Format", SpreadsheetMetadata.DATETIME_FORMAT_PATTERN),
            this.row("Date/Time Parse", SpreadsheetMetadata.DATETIME_PARSE_PATTERNS),
            this.row("Time Format", SpreadsheetMetadata.TIME_FORMAT_PATTERN),
            this.row("Time Parse", SpreadsheetMetadata.TIME_PARSE_PATTERNS),
        ];

        return this.accordion(
            "spreadsheet-date-time",
            true,
            () => {
            },
            classes,
            "Date/Time",
            "",
            "Spreadsheet Date/Time",
            rows
        );
    }

    /**
     * Displays the following editable spreadsheet number settings.
     * <ul>
     * <li>currency (String)</li>
     * <li>decimal-separator (char)</li>
     * <li>exponent-symbol (char)</li>
     * <li>expression-number-kind (BIGDECIMAL, DECIMAL)</li>
     * <li>grouping-symbol (char)</li>
     * <li>negative-sign (char)</li>
     * <li>number-format-pattern (pattern)</li>
     * <li>number-parse-patterns (pattern)</li>
     * <li>percent-symbol (char)</li>
     * <li>positive-sign (char)</li>
     * <li>precision (int) (DECIMAL32, DECIMAL64, DECIMAL128, UNLIMITED)</li>
     * <li>rounding-mode (RoundingMode) (CEILING, DOWN, FLOOR, HALF_DOWN, HALF_EVEN, HALF_UP, UNNECESSARY, UP)</li>
     * <ul>
     */
    spreadsheetNumber(classes) {
        const rows = [
            this.row("Expression Number Kind", SpreadsheetMetadata.EXPRESSION_NUMBER_KIND),
            this.row("Precision", SpreadsheetMetadata.PRECISION),
            this.row("Rounding mode", SpreadsheetMetadata.ROUNDING_MODE),
            this.row("Currency", SpreadsheetMetadata.CURRENCY_SYMBOL),
            this.row("Decimal separator", SpreadsheetMetadata.DECIMAL_SEPARATOR),
            this.row("Exponent separator", SpreadsheetMetadata.EXPONENT_SYMBOL),
            this.row("Grouping symbol", SpreadsheetMetadata.GROUPING_SEPARATOR),
            this.row("Negative sign", SpreadsheetMetadata.NEGATIVE_SIGN),
            this.row("Percent symbol", SpreadsheetMetadata.PERCENTAGE_SYMBOL),
            this.row("Positive sign", SpreadsheetMetadata.POSITIVE_SIGN),
            this.row("Format", SpreadsheetMetadata.NUMBER_FORMAT_PATTERN),
            this.row("Parse", SpreadsheetMetadata.NUMBER_PARSE_PATTERNS),
        ];

        return this.accordion(
            "spreadsheet-number",
            true,
            () => {
            },
            classes,
            "Number",
            "",
            "Spreadsheet Number Settings",
            rows,
        );
    }

    /**
     * Displays the style.
     * <ul>
     * <li>style (TextStyle)</li>
     * <ul>
     */
    spreadsheetStyle(classes) {
        // all ids are prefixed with "spreadsheet-"
        const rows = [
            this.row("Style", SpreadsheetMetadata.STYLE),
        ];

        return this.accordion("spreadsheet-default-styles",
            true,
            () => {
            },
            classes,
            "Default style(s)",
            "",
            "Spreadsheet default Style(s)",
            rows,
        );
    }

    row(label, property) {
        return {
            label: label,
            property: property,
        }
    }

    renderRow(row, classes) {
        const {label, property} = row;

        const id = "spreadsheet-metadata-" + property;

        const state = this.state;
        let render;

        switch(property) {
            case SpreadsheetMetadata.CREATE_DATE_TIME:
                render = "" + state.createDateTimeFormatted;
                break;
            case SpreadsheetMetadata.MODIFIED_DATE_TIME:
                render = "" + state.modifiedDateTimeFormatted;
                break;
            default:
                const metadata = state.spreadsheetMetadata;
                const setValue = function(v) {
                    console.log("saving value " + property + "=" + v);

                    this.setState( // lgtm [js/react/inconsistent-state-update]
                        {
                            spreadsheetMetadata: null != v ? metadata.set(property, v) : metadata.remove(property),
                        }
                    );
                }.bind(this);

                const value = metadata.get(property);
                const defaultMetadata = metadata.get(SpreadsheetMetadata.DEFAULTS);
                const defaultValue = defaultMetadata && defaultMetadata.get(property);

                switch(property) {
                    case SpreadsheetMetadata.CURRENCY_SYMBOL:
                        render = (
                            <SpreadsheetDrawerWidgetString id={id}
                                                           value={value}
                                                           defaultValue={defaultValue}
                                                           setValue={setValue}
                            />
                        );
                        break;
                    case SpreadsheetMetadata.DECIMAL_SEPARATOR:
                    case SpreadsheetMetadata.EXPONENT_SYMBOL:
                    case SpreadsheetMetadata.GROUPING_SEPARATOR:
                    case SpreadsheetMetadata.NEGATIVE_SIGN:
                    case SpreadsheetMetadata.PERCENTAGE_SYMBOL:
                    case SpreadsheetMetadata.POSITIVE_SIGN:
                        render = (
                            <SpreadsheetDrawerWidgetCharacter id={id}
                                                              value={value}
                                                              defaultValue={defaultValue}
                                                              setValue={setValue}
                            />
                        );
                        break;
                    default:
                        render = (
                            <span id={id}>{(value && value.toString()) || ""}</span>
                        );
                        break;
                }
                break;
        }

        // hover = highlight under mouse over
        return (
            <TableRow key={label}
                      hover={true}>
                <TableCell className={classes.label}>{label}</TableCell>
                <TableCell id={id}
                           className={classes.value}>{render}</TableCell>
            </TableRow>);
    }

    // ACCORDION........................................................................................................

    // https://material-ui.com/components/accordion/

    /**
     * Creates the accordion container so all sections in the drawer have a common look and feel and history hash management.
     */
    // TODO pass onChange to update history hash
    // TODO AccordionSummary aria-control
    accordion(id,
              expanded,
              onChange,
              classes,
              heading,
              secondaryHeading,
              tableAriaLabel,
              rows) {
        return <Accordion key={id}
                          id={id}
                          expanded={expanded}
                          onChange={onChange}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon/>}
                id={id + "-icon"}
            >
                <Typography className={classes.heading}>{heading}</Typography>
                <Typography className={classes.secondaryHeading}>{secondaryHeading}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <TableContainer key={rows}
                                component={Paper}>
                    <Table className={classes.table}
                           size={"small"}
                           aria-label="{tableAriaLabel}">
                        <TableBody>
                            {
                                rows.map(r => this.renderRow(r, classes))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </AccordionDetails>
        </Accordion>;
    }
}

SpreadsheetDrawerWidget.propTypes = {
    open: PropTypes.bool.isRequired, // open=true shows the drawer
    onClose: PropTypes.func.isRequired, // fired when the drawer is closed
    width: PropTypes.number.isRequired, // the width includes px of the drawer
    formatCreateDateTimeModifiedDateTime: PropTypes.func.isRequired, // required to format date/times, parameters: MultiFormatRequest, successHandler => MultiFormatResponse
    spreadsheetMetadata: PropTypes.instanceOf(SpreadsheetMetadata).isRequired,
    setSpreadsheetMetadata: PropTypes.func.isRequired, // fired when the SpreadsheetMetadata is updated.
}

export default withStyles(useStyles)(SpreadsheetDrawerWidget);
