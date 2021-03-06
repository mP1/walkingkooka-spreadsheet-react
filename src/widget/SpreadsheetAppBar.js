import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import PropTypes from "prop-types";
import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';

/**
 * An header that displays a menu, followed by an any children which will include the spreadsheet name.
 */
export default class SpreadsheetAppBar extends React.Component {

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

    constructor(props) {
        super(props);
        this.menuClickListener = props.menuClickListener;
    }

    render() {
        return (<AppBar position="static">
            <Toolbar>
                <IconButton id="settings-icon"
                            edge="start"
                            className={SpreadsheetAppBar.classes.menuButton}
                            color="inherit"
                            aria-label="menu"
                            onClick={this.menuClickListener}>
                    <MenuIcon/>
                </IconButton>
                {this.props.children}
            </Toolbar>
        </AppBar>);
    }
}

SpreadsheetAppBar.propTypes = {
    menuClickListener: PropTypes.func.isRequired, // this is fired when the menu (settings/tools) icon is selected
}