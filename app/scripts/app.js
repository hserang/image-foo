// General todos - migrate all library methods
// to external modules
define(
  ["backbone"],
  function(Backbone) {
    "use strict";

    var App = function() {
    };

    App.prototype = {

      events: {
        "drop .image-drop": "handleDrop"
      },

      init: function() {
        this.$el = $("#image-analyzer-wrapper");

        // init dom
        this.setBindings();
        this.initDomEvents();

        //data structure to hold our results
        this.counts = [];
      },

      handleDrop: function(e) {
        e.stopPropagation();
        e.preventDefault();

        //todo: handle error and edge cases
        var file = e.originalEvent.dataTransfer.files[0];
            img = new Image(),
            fileReader = new FileReader(),
            $targ = $(e.target),
            _this = this;

        // load image in the dom
        fileReader.onload = function(e) {
          img.src = e.target.result;
          $targ.html(img);

          //not the clearest - refactor later. promises?
          _this.processFile(img);
        };

        fileReader.readAsDataURL(file);
      },

      processFile: function(img) {
        var width = img.width,
            height = img.height,
            canvasContext = this.getCanvasContext(width, height),
            imageData;

        canvasContext.drawImage(img, 0, 0, width, height);
        imageData = canvasContext.getImageData(0, 0, width, height);

        this.mungeImageData(imageData);
      },

      // setup our traversal iterations
      mungeImageData: function(imageData) {
        this.canvasHeight = imageData.height;
        this.canvasWidth = imageData.width;


      },

      // traverse array, comparing all cels (array index * 4)
      // in each step check adjacent pixels and compare color
      // use a loop to prevent stack/memory issues
      checkContiguous: function(r, g, b, a) {
        var pixelStack = [[startX, startY]],
            newPos, x, y, pixelPos, reachLeft, reachRight;

        // create array of position that we will use to anchor our traversals
        // we will update the stack as we traverse to the next x,y to test
        while (pixelStack.length) {
          newPos = pixelStack.pop();
          x = newPos[0];
          y = newPos[1];

          pixelPos = (y * this.canvasWidth + x) * 4;

          // this is non-working frankencode
          // skeletons of ideas
          //while (y >= drawingBoundTop && this.matchColor(prevColor, curColor)) {
            //y -= 1;
            //pixelPos -= canvasWidth * 4;
          //}

          //pixelPos += canvasWidth *4;
          //y += 1;

          //reachLeft = false;
          //reachRight = false;

          //while (y <= drawingBoundBottom && matchStartColor(pixelPos, startR, startG, startB)) {
            //y += 1;

            //this.countColor(pixelPos, {color: {r:startR, g:startG, b:startB}});

            //if (x > drawingBoundLeft) {
              //if (matchStartColor(pixelPos - 4, startR, startG, startB)) {
                //if (!reachLeft) {
                  //// Add pixel to stack
                  //pixelStack.push([x - 1, y]);
                  //reachLeft = true;
                //}
              //} else if (reachLeft) {
                //reachLeft = false;
              //}
            //}

            //if (x < drawingBoundRight) {
              //if (matchStartColor(pixelPos + 4, startR, startG, startB)) {
                //if (!reachRight) {
                  //// Add pixel to stack
                  //pixelStack.push([x + 1, y]);
                  //reachRight = true;
                //}
              //} else if (reachRight) {
                //reachRight = false;
              //}
            //}

            //pixelPos += canvasWidth * 4;
        //}

        }
      },

      // push cel counts and rgb data into an object
      // we will index by pass#
      countColor: function(pass, rgbData) {
      },

      // test if colors match return bool
      matchColor: function() {
      },

      getCanvasContext: function(width, height) {
        var canvas = document.createElement("canvas");

        canvas.width = width;
        canvas.height = height;

        return canvas.getContext("2d");
      },

      // inits and internal methods
      setBindings: function() {
        this.$dropBox = this.get$El(".image-drop");
      },

      initDomEvents: function() {

        var _this = this;

        _.each(this.events, function(method, event) {

          //todo: add error checking for data
          var eventArr = event.split(/\s/),
              event = eventArr[0],
              el = eventArr[1];

          if (_.isFunction(_this[method])) {
            _this.get$El(el).on(event, _this[method].bind(_this));
          } else {
            // todo handle error
          }

        });
      },

      get$El: function(el) {
        return this.$el.find(el);
      }
    };

    return App;
});
