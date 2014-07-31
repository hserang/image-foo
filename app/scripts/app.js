define(
  ["backbone"],
  function(Backbone) {
    "use strict";

    var App = function() {
    };

    App.prototype.init = function() {
      console.log("init called");
    };

    return App;
});
