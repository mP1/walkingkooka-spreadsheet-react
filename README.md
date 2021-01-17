[![Build Status](https://travis-ci.com/mP1/walkingkooka-spreadsheet-react.svg?branch=master)](https://travis-ci.com/mP1/walkingkooka-spreadsheet-react.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/mP1/walkingkooka-spreadsheet-react/badge.svg?branch=master)](https://coveralls.io/repos/github/mP1/walkingkooka-spreadsheet-react?branch=master)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Language grade: Java](https://img.shields.io/lgtm/grade/java/g/mP1/walkingkooka-spreadsheet-react.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/mP1/walkingkooka-spreadsheet-react/context:java)
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


### walkingkooka-spreadsheet-webworker

During development this assumes that a http server is available on `https://localhost:12345/walkingkooka-walkingkooka-spreadsheet-webworker.js`
serving the javascript engine.



## Architecture
This project aims to be as lightweight as possible implementing a true MVC design. Minimal if any business logic is performed 
in javascript within code belonging to this project. This point is important as the [walking-spreadsheet-server](https://github.com/mP1/walkingkooka-spreadsheet-server) 
can also be translated into javascript but its does not contain any presentation logic. This project only aims to build
and display react components or widgets and react to events, which results in payloads to a messaging abstraction. The
messaging abstraction may be a webworker or a java web server in both case the same project is executed [walkingkooka-spreadsheet-server](https://github.com/mP1/walkingkooka-spreadsheet-server)
with different extras. Every service required to interact, update or view portions or other spreadsheet like functions
are performed on the server via messages, each having its own separate rich type.

New support projects will be created to extend the server experience for example a true RDBMs implementation of the various
Store interface will be implemented and used in the java web server. It would not make sense to offer this in a browser,
but perhaps a browser based [LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) solution
may be available for local storage. Constraints, limitations and features of browser vs a real JVM server mean different provides of key interfaces will be 
created and used appropriate. These have not be documented, projects will be created and are future efforts.



## History hash format

Components within a hash that begin with dollar sign '$' represent a variable of some sort related to the context. Other
components are actual literals.

- $spreadsheet-id / $spreadsheet name  viewing spreadsheet with nothing selected for editing
- $spreadsheet-id / $spreadsheet name / name / edit  editing the spreadsheet name
- $spreadsheet-id / $spreadsheet name / cellReference / $cellReference-reference / formula  editing the formula belonging to a cellReference. 


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

Formulas are the content entered for each individual cell and may be text, date, date-time, time or a numeric value or an expression.
All parsing and resolution of reference and function is performed by [walkingkooka-spreadsheet](https://github.com/mP1/walkingkooka-spreadsheet).

- Parsing / tokenizing a formula into a [Expression](https://github.com/mP1/walkingkooka-tree/tree/master/src/main/java/walkingkooka/tree/expression) has been completed.
- Formulas or expression may be executed honouring spreadsheet and cell localisation and pattern selection.  
- Tokenizing of dates, date-times, time and numbers into individual components to support localised entry needs to be done [TODO](https://github.com/mP1/walkingkooka-spreadsheet/issues).
- Interactive auto-complete of function names [TODO](https://github.com/mP1/walkingkooka-spreadsheet-react/issues/556)



## Navigation

- Support APIs on the server exists to jump to any cell.
- Adding a smart text box to support navigation using a cell reference or label, APIs are available to resolve labels to cell references. [TODO](https://github.com/mP1/walkingkooka-spreadsheet-react/issues/557)
- Scrollbars to pan horizontally and vertically have not been added to the UI. [TODO](https://github.com/mP1/walkingkooka-spreadsheet-react/issues/324)
- APIs are available to compute the exact cell range for any given home (top left) cell and screen dimensions to fill the display in a single API request.
- Keyboard navigation and range selection [TODO](https://github.com/mP1/walkingkooka-spreadsheet-react/issues/315)



## Cypress Integration testing

Integration tests are available using the popular [Cypress testing tool](https://www.cypress.io/)

```bash
cypress open
```
