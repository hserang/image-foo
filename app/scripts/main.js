requirejs.config({
  baseUrl: "app/",
  paths: {
    underscore: "libs/lodash/dist/lodash.underscore",
    jquery: "libs/jquery/dist/jquery",
    backbone: "libs/backbone-amd/backbone"
  }
});

requirejs(
  ['scripts/app'],
  function(App) {
    "use strict";

    new App().init();
});
