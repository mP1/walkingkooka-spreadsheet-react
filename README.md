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


## History hash format

Components within a hash that begin with dollar sign '$' represent a variable of some sort related to the context. Other
components are actual literals.

- $spreadsheet-id / $spreadsheet name  viewing spreadsheet with nothing selected for editing
- $spreadsheet-id / $spreadsheet name / name / edit  editing the spreadsheet name
- $spreadsheet-id / $spreadsheet name / cellReference / $cellReference-reference / formula  editing the formula belonging to a cellReference. 


## Value types

Some value types particularly those defined in [spreadsheet](https://github.com/mP1/walkingkooka-spreadsheet) and core values 
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



## Cypress Integration testing

Integration tests are available using the popular [Cypress testing tool](https://www.cypress.io/)

```bash
cypress open
```
