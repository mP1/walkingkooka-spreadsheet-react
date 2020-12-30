import {withStyles} from "@material-ui/core/styles";

import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Drawer from "@material-ui/core/Drawer";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import React from 'react';
import SpreadsheetMetadata from "./meta/SpreadsheetMetadata.js";
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
        fontSize: theme.typography.pxToRem(13),
        fontWeight: 700,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(12),
        color: theme.palette.text.secondary,
    },
    label: {
        fontSize: theme.typography.pxToRem(12),
        fontWeight: 700,
        width: "150px",
        verticalAlign: "top",
    },
    value: {
        fontSize: theme.typography.pxToRem(12),
        verticalAlign: "top",
    },
});

class SpreadsheetDrawerWidget extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            open: props.open,
            spreadsheetMetadata: props.spreadsheetMetadata,
        };
        this.onClose = props.onClose;
        this.width = props.width;
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
        const metadata = this.state.spreadsheetMetadata;

        const id = metadata.get(SpreadsheetMetadata.SPREADSHEET_ID);
        const creator = textOrEmpty(metadata.get(SpreadsheetMetadata.CREATOR));
        const createDateTime = "" + metadata.get(SpreadsheetMetadata.CREATE_DATE_TIME); // TODO format date/time https://github.com/mP1/walkingkooka-spreadsheet-react/issues/351
        const modifiedBy = textOrEmpty(metadata.get(SpreadsheetMetadata.MODIFIED_BY));
        const modifiedDateTime = "" + metadata.get(SpreadsheetMetadata.MODIFIED_DATE_TIME); // TODO format date/time https://github.com/mP1/walkingkooka-spreadsheet-react/issues/351

        const rows = [
            this.labelAndTextRow("Spreadsheet Id", "spreadsheet-metadata-id", id),
            this.labelAndTextRow("Creator", "spreadsheet-metadata-creator", creator),
            this.labelAndTextRow("Create Date/Time", "spreadsheet-metadata-create-date-time", createDateTime),
            this.labelAndTextRow("Modified by", "spreadsheet-metadata-modified-by", modifiedBy),
            this.labelAndTextRow("Modified Date/Time", "spreadsheet-metadata-modified-date-time", modifiedDateTime),
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
        const metadata = this.state.spreadsheetMetadata;

        const locale = metadata.get(SpreadsheetMetadata.LOCALE);
        const textFormatPattern = metadata.get(SpreadsheetMetadata.TEXT_FORMAT_PATTERN);

        // all ids are prefixed with "spreadsheet-"
        const rows = [
            this.labelAndTextRow("Locale", "spreadsheet-locale", locale),
            this.labelAndTextRow("Format", "spreadsheet-text-format-pattern", textFormatPattern),
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
        const metadata = this.state.spreadsheetMetadata;

        const dateFormatPattern = metadata.get(SpreadsheetMetadata.DATETIME_FORMAT_PATTERN);
        const dateParsePatterns = metadata.get(SpreadsheetMetadata.DATE_PARSE_PATTERNS);
        const dateTimeOffset = metadata.get(SpreadsheetMetadata.DATETIME_OFFSET);
        const dateTimeFormatPattern = metadata.get(SpreadsheetMetadata.DATETIME_FORMAT_PATTERN);
        const dateTimeParsePatterns = metadata.get(SpreadsheetMetadata.DATETIME_PARSE_PATTERNS);
        const timeFormatPattern = metadata.get(SpreadsheetMetadata.TIME_FORMAT_PATTERN);
        const timeParsePatterns = metadata.get(SpreadsheetMetadata.TIME_PARSE_PATTERNS);
        const twoDigitYear = metadata.get(SpreadsheetMetadata.TWO_DIGIT_YEAR);

        // all ids are prefixed with "spreadsheet-"
        const rows = [
            this.labelAndTextRow("Date Time Offset", "spreadsheet-date-time-offset", dateTimeOffset), // 1900 or 1904 date system
            this.labelAndTextRow("Two Digit Year", "spreadsheet-two-digit-year", twoDigitYear),

            this.labelAndTextRow("Date Format", "spreadsheet-date-format-pattern", dateFormatPattern),
            this.labelAndTextRow("Date Parse", "spreadsheet-date-parse-patterns", dateParsePatterns),
            this.labelAndTextRow("Date/Time Format", "spreadsheet-date-time-format-pattern", dateTimeFormatPattern),
            this.labelAndTextRow("Date/Time Parse", "spreadsheet-date-time-parse-patterns", dateTimeParsePatterns),
            this.labelAndTextRow("Time Format", "spreadsheet-time-format-pattern", timeFormatPattern),
            this.labelAndTextRow("Time Parse", "spreadsheet-time-parse-patterns", timeParsePatterns),
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
        const metadata = this.state.spreadsheetMetadata;

        const currency = metadata.get(SpreadsheetMetadata.CURRENCY_SYMBOL);
        const decimalSeparator = metadata.get(SpreadsheetMetadata.DECIMAL_SEPARATOR);
        const exponentSeparator = metadata.get(SpreadsheetMetadata.EXPONENT_SYMBOL);
        const expressionNumberKind = metadata.get(SpreadsheetMetadata.EXPRESSION_NUMBER_KIND);
        const groupingSymbol = metadata.get(SpreadsheetMetadata.GROUPING_SEPARATOR);
        const negativeSign = metadata.get(SpreadsheetMetadata.NEGATIVE_SIGN);
        const numberFormatPattern = metadata.get(SpreadsheetMetadata.NUMBER_FORMAT_PATTERN);
        const numberParsePatterns = metadata.get(SpreadsheetMetadata.NUMBER_PARSE_PATTERNS);
        const percentSymbol = metadata.get(SpreadsheetMetadata.PERCENTAGE_SYMBOL);
        const positiveSign = metadata.get(SpreadsheetMetadata.POSITIVE_SIGN);
        const precision = metadata.get(SpreadsheetMetadata.PRECISION);
        const roundingMode = metadata.get(SpreadsheetMetadata.ROUNDING_MODE);

        // all ids are prefixed with "spreadsheet-"
        const rows = [
            this.labelAndTextRow("Expression Number Kind", "spreadsheet-exponent-number-kind", expressionNumberKind),
            this.labelAndTextRow("Precision", "spreadsheet-precision", precision),
            this.labelAndTextRow("Rounding mode", "spreadsheet-rounding-mode", roundingMode),
            this.labelAndTextRow("Currency", "spreadsheet-currency", currency),
            this.labelAndTextRow("Decimal separator", "spreadsheet-decimal-separator", decimalSeparator),
            this.labelAndTextRow("Exponent separator", "spreadsheet-exponent-separator", exponentSeparator),
            this.labelAndTextRow("Grouping symbol", "spreadsheet-grouping-symbol", groupingSymbol),
            this.labelAndTextRow("Negative sign", "spreadsheet-negative-sign", negativeSign),
            this.labelAndTextRow("Percent symbol", "spreadsheet-percent-symbol", percentSymbol),
            this.labelAndTextRow("Positive sign", "spreadsheet-positive-sign", positiveSign),
            this.labelAndTextRow("Format", "spreadsheet-number-format-pattern", numberFormatPattern),
            this.labelAndTextRow("Parse", "spreadsheet-number-parse-patterns", numberParsePatterns),
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
        const metadata = this.state.spreadsheetMetadata;

        const style = metadata.get(SpreadsheetMetadata.STYLE);

        // all ids are prefixed with "spreadsheet-"
        const rows = [
            this.labelAndTextRow("Style", "spreadsheet-style", style),
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

    labelAndTextRow(label, id, value) {
        return {
            label: label,
            id: id,
            value: value,
        }
    }

    renderLabelAndTextRow(row, classes) {
        const {label, id, value} = row;

        // hover = highlight under mouse over
        return (
            <TableRow key={label}
                      hover={true}>
                <TableCell className={classes.label}>{label}</TableCell>
                <TableCell id={id}
                           className={classes.value}>{(value.render && value.render()) || value.toString()}</TableCell>
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
                                rows.map(r => this.renderLabelAndTextRow(r, classes))
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
}

export default withStyles(useStyles)(SpreadsheetDrawerWidget);

function textOrEmpty(localDateTime) {
    return (localDateTime && localDateTime.text()) || "";
}