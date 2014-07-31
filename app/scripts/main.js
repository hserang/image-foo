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

    //Move this to an external module
    $(document).on("dragenter dragover drop", function(e) {
      e.stopPropagation();
      e.preventDefault();
    });

    //boot the app
    new App().init();
});
