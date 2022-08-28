import {makeStyles} from '@mui/styles';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import PropTypes from "prop-types";
import React from 'react';
import SpreadsheetHistoryAwareStateWidget from "../spreadsheet/history/SpreadsheetHistoryAwareStateWidget.js";
import SpreadsheetHistoryHash from "../spreadsheet/history/SpreadsheetHistoryHash.js";
import SpreadsheetHistoryHashTokens from "../spreadsheet/history/SpreadsheetHistoryHashTokens.js";
import SpreadsheetMetadataDrawerWidget from "../spreadsheet/meta/drawer/SpreadsheetMetadataDrawerWidget.js";
import SpreadsheetMetadataSelectHistoryHashToken
    from "../spreadsheet/meta/drawer/SpreadsheetMetadataSelectHistoryHashToken.js";
import Toolbar from '@mui/material/Toolbar';

function computeMetadataLink(historyHashTokens) {
    // flip the metadata token.
    historyHashTokens[SpreadsheetHistoryHashTokens.METADATA] = historyHashTokens[SpreadsheetHistoryHashTokens.METADATA] ?
        null :
        SpreadsheetMetadataSelectHistoryHashToken.NOTHING;
    return "#" + SpreadsheetHistoryHash.stringify(historyHashTokens);
}

/**
 * An header that displays a menu, followed by an any children which will include the spreadsheet name.
 */
export default class SpreadsheetAppBar extends SpreadsheetHistoryAwareStateWidget {

    static classes = makeStyles((theme) => ({
        root: {
            flexGrow: 1,
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
        },
    }));

    init() {
    }

    initialStateFromProps(props) {
        return {
            metadataLink: computeMetadataLink(props.history.tokens())
        };
    }

    /**
     * Re-compute the metadata link url.
     */
    stateFromHistoryTokens(historyHashTokens) {
        return {
            metadataLink: computeMetadataLink(historyHashTokens)
        };
    }

    /**
     * Never updates the history tokens.
     */
    historyTokensFromState(prevState) {
        return SpreadsheetHistoryHashTokens.emptyTokens();
    }

    render() {
        return (<AppBar position="static">
            <Toolbar>
                <IconButton id={SpreadsheetMetadataDrawerWidget.ID + "-icon"}
                            edge="start"
                            className={SpreadsheetAppBar.classes.menuButton}
                            color="inherit"
                            aria-label="menu"
                            href={this.state.metadataLink}>
                    <MenuIcon/>
                </IconButton>
                {this.props.children}
            </Toolbar>
        </AppBar>);
    }
}

SpreadsheetAppBar.propTypes = {
    history: PropTypes.instanceOf(SpreadsheetHistoryHash).isRequired,
}
