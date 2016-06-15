// Write your package code here!

// Variables exported by this module can be imported by other packages and
// applications. See npm-packages-tests.js for an example of importing.
export const name = 'npm-packages';

Meteor.npmPackage = function( npmPackage ) {
  var package = Npm.require( npmPackage );
  return package;
};
