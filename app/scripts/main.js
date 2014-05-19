requirejs.config({
  baseUrl: "app/",
  paths: {
    underscore: "libs/lodash/dist/lodash.underscore",
    jquery: "libs/jquery/dist/jquery",
    backbone: "libs/backbone-amd/backbone",
    "backbone.wreqr": "libs/backbone.wreqr/lib/backbone.wreqr",
    "backbone.babysitter": "libs/backbone.babysitter/lib/backbone.babysitter",
    marionette: "libs/marionette/lib/core/amd/backbone.marionette"
  }
});

requirejs(
  ['scripts/app'],
  function(App) {
    "use strict";

    new App().init();
});
