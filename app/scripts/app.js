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
        _.bindAll(this, "mungeImageData", "loopData");

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
        var file = e.originalEvent.dataTransfer.files[0],
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

      loopData: function(width, height, cb) {
        var i, j;

        for (i=0; i<width; i++) {
          for (j=0; j<height; j++) {
            cb(i, j);
          }
        }
      },

      isContiguous: function() {
      },

      //express rgb as single binary given the x y
      getColor: function(imageData, x, y) {
        var data = imageData.data,
            cel = ((y * (imageData.width * 4)) + (x * 4)),
            colorBin;

        colorBin = data[cel + 0] << 24;
        colorBin |= data[cel + 1] << 16;
        colorBin |= data[cel + 2] << 8;

        return colorBin;
      },

      // setup our traversal iterations
      mungeImageData: function(imageData) {
        var data = imageData.data,
            width = imageData.height,
            height = imageData.width,
            stack = [3, 3], //bootstrap search
            perimeterX = [0, -1, +1, 0],
            perimeterY = [-1, 0, 0, +1],
            startColor = this.getColor(imageData, stack[0], stack[1]),
            visited = {},
            pixelCount = 0,
            checkStartX, checkStartY, checkNextX, checkNextY, offset;


        console.log("startColor RGB", (startColor>>24) & 0xFF, (startColor>>16) & 0xFF,(startColor>>8) & 0xFF);

        while (stack.length > 0) {
          checkStartY = stack.pop();
          checkStartX = stack.pop();

          //loop 4x to check viable points around current
          for (i=0; i < 4; i++) {
            checkNextX = checkStartX + perimeterX[i];
            checkNextY = checkStartY + perimeterY[i];

            //if out of range, skip test
            if (checkNextX < 0 || checkNextY < 0 || checkNextX >= width
                || checkNextY >= height) {
              continue;
            }

            offset = (checkNextY * width + checkNextX) * 4;

            if (data[offset + 0] === ((startColor >> 24) & 0xFF)
                  && data[offset + 1] === ((startColor >> 16) & 0xFF)
                  && data[offset + 2] === ((startColor >> 8) & 0xFF)) {
              stack.push(checkNextX);
              stack.push(checkNextY);

              if (pixelCount > 100000) {
                console.log("color", data[offset + 0]);
                console.log("pixelCount", pixelCount);
                throw new Error("ooops, hard stop");
              }

              pixelCount++;
            } else {
              //if not matching, record x.y. for next color start
            }
          }
        }

        console.log("pixelCount", pixelCount);

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
