[![Build Status](https://travis-ci.com/mP1/walkingkooka-spreadsheet-react.svg?branch=master)](https://travis-ci.com/mP1/walkingkooka-spreadsheet-react.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/mP1/walkingkooka-spreadsheet-react/badge.svg?branch=master)](https://coveralls.io/repos/github/mP1/walkingkooka-spreadsheet-react?branch=master)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Language grade: Javascript](https://img.shields.io/lgtm/grade/javascript/g/mP1/walkingkooka-spreadsheet-react.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/mP1/walkingkooka-spreadsheet-react/context:javascript)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/mP1/walkingkooka-spreadsheet-react.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/mP1/walkingkooka-spreadsheet-react/alerts/)



## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.


## [walkingkooka-spreadsheet-server-platform](https://github.com/mP1/walkingkooka-spreadsheet-server-platform)

Development assumes `npm-start` is running on http://localhost:3000 which include a proxy to [walkingkooka-spreadsheet-server-platform](https://github.com/mP1/walkingkooka-spreadsheet-server-platform).


## Architecture

This project aims to be as lightweight as possible implementing a true MVC design. Minimal if any business logic is performed 
in javascript within code belonging to this project. This point is important as the [walking-spreadsheet-server](https://github.com/mP1/walkingkooka-spreadsheet-server-platform) 
can also be translated into javascript but its does not contain any presentation logic. This project only aims to build
and display react components or widgets and react to events, which results in payloads to a messaging abstraction. The
messaging abstraction may be a webworker or a java web server in both case the same project is executed [walkingkooka-spreadsheet-server-platform](https://github.com/mP1/walkingkooka-spreadsheet-server-platform)
with different extras. Every service required to interact, update or view portions or other spreadsheet like functions
are performed on the server via messages, each having its own separate rich type.

New support projects will be created to extend the server experience for example a true RDBMs implementation of the various
Store interface will be implemented and used in the java web server. It would not make sense to offer this in a browser,
but perhaps a browser based [LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) solution
may be available for local storage. Constraints, limitations and features of browser vs a real JVM server mean different provides of key interfaces will be 
created and used appropriate. These have not be documented, projects will be created and are future efforts.



## History hash format

Components within a hash that begin with dollar sign '$' represent a variable of some sort related to the context. Other
components are actual literals. Note the examples below dont show values with url-encoding but in reality string literals will be url-encoded.



### Design goals

The UI is being built so that each button or link results in an update to the history hash, this hash is watched and causes
actions to happen. The goal is that ALL spreadsheet actions will be driven primarily by updating the history hash. This means
the browser history for this site will actually contain an audit log of all major edit and similar actions that occurred to the spreadsheet.


### Available history hash tokens

All the urls below assume the first two path components are the following:

- spreadsheet id
- spreadsheet name

The history hash tokens are evolving and more will be available shortly to make server apis available within the UI.



#### /spreadsheet-id/spreadsheet-name/name

> /#123/Untitled/name

Activates editing of the spreadsheet name.

> /#123/Untitled/name/NewSpreadsheetName

Saves a new spreadsheet name



#### /spreadsheet-id/spreadsheet-name/cell/cell-or-cell-range-or-label

> /#123/Untitled/cell/A1
> 
> /#123/Untitled/cell/B2:C3
> 
> /#123/Untitled/cell/Label123

Following the selection of a cell, the following commands are possible

- /delete Deletes the cell or cell-range
- /formula Loads the formula text box with the current value for this cell
- /formula/$formula Saves the given $formula for the cell.
- /menu Displays a context menu

> /#123/Untitled/cell/D4/delete
> 
> /#123/Untitled/cell/E5:F6/formula
> 
> /#123/Untitled/cell/G7/formula
> 
> /#123/Untitled/cell/H8/formula/=1+2

> /#123/Untitled/cell/I9/menu
>
> /#123/Untitled/cell/J10:K11/menu


#### /spreadsheet-id/spreadsheet-name/column/column-or-column-range

> /#123/Untitled/column/A
> 
> /#123/Untitled/column/B:C

Selects the column or column range.

Following the selection of a column or column range, the following commands are possible

- /clear Clears the selected column or column range
- /delete Deletes the selected column or column range
- /freeze Freezes the selected column or column range
- /hidden/true|false Updates the hidden property for the column or column range to the new value.
- /insert-after/$count Inserts the requested number of columns after the column/column range
- /insert-before/$count Inserts the requested number of columns before the column/column range. Once the operation completes the selected column/column-range will be updated to account for the insertion.
- /menu Displays a context menu
- /unfreeze Unfreezes or clears any selected column or column range.

> /#123/Untitled/column/A/clear
>
> /#123/Untitled/column/B:C/clear

> /#123/Untitled/column/A/delete
> 
> /#123/Untitled/column/B:C/delete

> /#123/Untitled/column/A/freeze
>
> /#123/Untitled/column/A:C/freeze

> /#123/Untitled/column/A/hidden/false
>
> /#123/Untitled/column/B:C/hidden/true

> /#123/Untitled/column/A/insert-after/2
> 
> /#123/Untitled/column/B:C/insert-after/2

> /#123/Untitled/column/A/insert-before/3
> 
> /#123/Untitled/column/B:C/insert-before/3

> /#123/Untitled/column/A/menu
>
> /#123/Untitled/column/B:C/menu

> /#123/Untitled/column/A/unfreeze
>
> /#123/Untitled/column/A:C/unfreeze

#### /spreadsheet-id/spreadsheet-name/label/label-name

Supports numerous actions relating to creating, updating or deleting a label mapping to another cell/cell-range or label.

- /label-name Opens a dialog allowing entering of a new label mapping.
- /$old-label-name/save/$new-label-name/$target Saves or updates the OLD label name with the new label name and target cell/cell-range or label & closes the Dialog.
- /$old-label-name/delete Deletes $old-label-name if it exists & closes the Dialog.

> /#123/Untitled/label/Label123
> 
> /#123/Untitled/label/OldLabelName1/save/NewLabelName2/C3
> 
> /#123/Untitled/label/Label456/delete



#### /spreadsheet-id/spreadsheet-name/row/row-or-row-range

> /#123/Untitled/row/1
> 
> /#123/Untitled/row/2:3

Selects the row or row range.

Following the selection of a row or row range, the following commands are possible

- /clear Clears the selected row or row range
- /delete Deletes the selected row or row range
- /freeze Freezes the selected row or row range.
- /hidden/true|false Updates the hidden property for the row or row range to the new value.
- /insert-after/$count Inserts the requested number of rows after the row/row range
- /insert-before/$count Inserts the requested number of rows before the row/row range. Once the operation completes the selected row/row-range will be updated to account for the insertion.
- /menu Displays a context menu
- /unfreeze Clear any frozen row or row range.

> /#123/Untitled/row/1/clear
>
> /#123/Untitled/row/2:3/clear
 
> /#123/Untitled/row/1/delete
> 
> /#123/Untitled/row/2:3/delete

> /#123/Untitled/row/1/freeze
>
> /#123/Untitled/row/1:3/freeze

> /#123/Untitled/row/1/hidden/false
>
> /#123/Untitled/row/2:3/hidden/true

> /#123/Untitled/row/1/insert-after/2
> 
> /#123/Untitled/row/2:3/insert-after/2

> /#123/Untitled/row/1/insert-before/3
> 
> /#123/Untitled/row/2:3/insert-before/3

> /#123/Untitled/row/1/menu
>
> /#123/Untitled/row/2:3/menu

> /#123/Untitled/row/1/unfreeze
>
> /#123/Untitled/row/1:3/unfreeze

#### /spreadsheet-id/spreadsheet-name/select

Opens a dialog that allows entering of a selection such as cell, cell-range, column, column-range, label, row or row-range. As text is entered
buttons with links will be enabled to select or edit (for labels).

Note the labels will have links as described above for the various label components. The Goto Label button will have a link of

> /#123/Untitled/cell/Label123



#### /spreadsheet-id/spreadsheet-name/metadata

Opens the right panel that holds global or shared settings (called metadata internally) for this spreadsheet.

- Metadata
- Text
- Number
- Date/Time
- Style

Each of these sections will hold appropriate key/values. For example Number will have default parsing and formatting patterns.

> /#123/Untitled/metadata/
> 
> /#123/Untitled/metadata/metadata
>
> /#123/Untitled/metadata/text
> 
> /#123/Untitled/metadata/number
>
> /#123/Untitled/metadata/date-Time
>
> /#123/Untitled/metadata/style
>
> /#123/Untitled/metadata/$property-name eg: color, background-color, text-align etc.
> 
> /#123/Untitled/metadata/$property-name/$property-value or empty to remove and use default.

## Value types

Some value types particularly those defined in [walkingkooka-spreadsheet](https://github.com/mP1/walkingkooka-spreadsheet) and core values 
such as LocalDate have had equivalent but simplified in javascript form. Most include minimal logic and are just containers
to hold the value often in JSON form useful for communicating with a server to perform some service or computation. Using
LocalDate as an example, it does NOT contain any date math, formatting or parsing it only holds a type safe String holding the date.
One common minimal feature that all value types support are:

- Direct java to javascript class to class mapping.
- Immutability
- JSON
- Type safety

Not all types from the JDK or spreadsheet projects are included. One considered possible option is to translate the java 
source using the [j2cl-maven-plugin](https://github.com/mP1/j2cl-maven-plugin) into javascript. However this has been
judged to be non practical because the dependency graph becomes quite large in file count and source code size, reducing
basically instant turnaround between changing javascript source and viewing the updated browser experience. A type such
as LocalDate actually require many other supported classes such as Locale, TimeZone, java.text.* and much much more. The 
footprint for this would require some effort to reduce to a minimal form resulting in something no that different from the
basic forms found in this project.



## Formulas

Formulas are the content entered for each individual cell and may be text, date, date-time, time or a numeric value or 
an expression.  All parsing and resolution of reference and function is performed by 
[walkingkooka-spreadsheet](https://github.com/mP1/walkingkooka-spreadsheet).

- Parsing & tokenizing a formula into a [Expression](https://github.com/mP1/walkingkooka-tree/tree/master/src/main/java/walkingkooka/tree/expression).
- Formulas or expression may be executed honouring spreadsheet and cell localisation and pattern selection. **DONE**
- Tokenizing of dates, date-times, time and numbers into individual components to support localised when re-displayed. **DONE**
- Interactive auto-complete of available function names [TODO](https://github.com/mP1/walkingkooka-spreadsheet-react/issues/556)



## Selection & Navigation

- Support APIs on the server exists to jump to any cell. **DONE**
- Adding a smart text box to support navigation using a cell reference or label, APIs are available to resolve labels to cell references. **DONE**
- Scrollbars to pan horizontally and vertically around viewport. **DONE**
- Keyboard cell, column, row navigation & cell, column and row range selection. **DONE**
- Mouse based [TODO cell](https://github.com/mP1/walkingkooka-spreadsheet-react/issues/1144), [TODO column](https://github.com/mP1/walkingkooka-spreadsheet-react/issues/1145), [TODO row](https://github.com/mP1/walkingkooka-spreadsheet-react/issues/1146) selection


## Editing

- Label management **DONE**
- Expressions already support cell reference and labels. **DONE**
- Cut, copy, paste cell content including formula, styling etc [TODO](https://github.com/mP1/walkingkooka-spreadsheet-react/issues/562)
- Spreadsheet **DONE** and cell style editor [TODO](https://github.com/mP1/walkingkooka-spreadsheet-react/issues/563)



## Cypress Integration testing

Integration tests are available using the popular [Cypress testing tool](https://www.cypress.io/)

```bash
cypress open
```
