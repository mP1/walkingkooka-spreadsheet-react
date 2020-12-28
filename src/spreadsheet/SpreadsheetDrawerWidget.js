import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from "@material-ui/core/styles";

import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Drawer from "@material-ui/core/Drawer";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Paper from '@material-ui/core/Paper';
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
    },
    value: {
        fontSize: theme.typography.pxToRem(12),
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

        return <Drawer id={"settings-tools-drawer"}
                       anchor={"right"}
                       variant={"persistent"}
                       open={this.state.open}
                       modal={"false"}
                       onClose={this.onClose}
        >
            <div className={classes.root}
                 style={{margin: 0, border: 0, padding: 0, width: this.width + "px"}}>
                {[
                    this.metadata(classes),
                ]}
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

        const id = metadata.spreadsheetId();
        const creator = textOrEmpty(metadata.creator());
        const createDateTime = "" + metadata.createDateTime(); // TODO format date/time https://github.com/mP1/walkingkooka-spreadsheet-react/issues/351
        const modifiedBy = textOrEmpty(metadata.modifiedBy());
        const modifiedDateTime = "" + metadata.modifiedDateTime(); // TODO format date/time https://github.com/mP1/walkingkooka-spreadsheet-react/issues/351

        const rows = [
            this.labelAndTextRow("Spreadsheet Id", "spreadsheet-metadata-id", id),
            this.labelAndTextRow("Creator", "spreadsheet-metadata-creator", creator),
            this.labelAndTextRow("Create Date/Time", "spreadsheet-metadata-create-date-time", createDateTime),
            this.labelAndTextRow("Modified by", "spreadsheet-metadata-modified-by", modifiedBy),
            this.labelAndTextRow("Modified Date/Time", "spreadsheet-metadata-modified-date-time", modifiedDateTime),
        ];

        // TODO table area-label
        return this.accordion("metadata",
            true,
            () => {
            },
            classes,
            "Spreadsheet Metadata",
            "",
            [
                <TableContainer key={rows}
                                component={Paper}>
                    <Table className={classes.table}
                           size={"small"}
                           aria-label="Readonly Spreadsheet Metadata">
                        <TableBody>
                            {
                                rows.map(r => this.renderLabelAndTextRow(r, classes))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            ]
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
                       className={classes.value}>{value}</TableCell>
        </TableRow>);
    }

    // ACCORDION........................................................................................................

    // https://material-ui.com/components/accordion/

    /**
     * Creates the accordion container so all sections in the drawer have a common look and feel and history hash management.
     */
    // TODO pass onChange to update history hash
    // TODO AccordionSummary aria-control
    accordion(id, expanded, onChange, classes, heading, secondaryHeading, children) {
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
                {children}
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