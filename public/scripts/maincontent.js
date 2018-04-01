(function(window) {
  "use strict";
  var App = window.App || {};

  var $ = window.jQuery;

  function LoadMainContent() {}

  function LoadCategories(selector) {
    if (!selector) {
      throw new Error("No selector provided");
    }
    this.$element = $(selector);
    if (this.$element.length === 0) {
      throw new Error("Could not find element with selector: " + selector);
    }
  }

  LoadMainContent.prototype.mainContentLoader = function() {

    dpd.picturedata.get(function(data) {
      console.log(data);
      for (var i = data.length - 1; i >= 0; i--) {
        console.log(data[i]);
        var rowElement = new addPicDom(data[i]);

        $(".user-content").append(rowElement.$element);
      }

      $(".reply").click(function() {
        getComments(this);
      });

    });

    // dpd.picturedata.del("0b91762c16dd98db", function(data, status) {
    //   console.log("deleted!");
    //   console.log(status);
    // });
  };

  function getComments(self) {
    console.log("Selfid: " + self);
    console.log("I'm in getComments");
    var input="";
    var picId = self.id.toString() + "CID";
    input = document.getElementById(self.id).value;
    document.getElementById(self.id).value="";

    var dateTime = new Date();
    dpd.users.me(function(results) {
      dpd.comments.post({
        "text": input,
        "pictureId": self.id,
        "timestamp": dateTime,
        "username": results.username
      }, function(result, error) {
        if (error) {
          alert("Tis an error");
        } else {
          $("#" + picId).append("<div class=\"user-comment\"><div class=\"user-info\"><a>" + results.username + "</a><span class=\"time\">" + dateTime.toLocaleDateString() + " at " + dateTime.toLocaleTimeString() + "</div><div class=\"append-comment\">" + input + "</div>");
        }
      });
    });
  }

  LoadMainContent.prototype.addClickHandler = function () {

    $("#food-feed").click(function () {

      $(".widget-box.post").remove();

      dpd.picturedata.get(function(data) {
        // console.log(data[0].creationDate);

        for (var i = data.length-1; i >= 0; i--) {
          var mainElement = new addPicDom(data[i]);

          $(".user-content").append(mainElement.$element);
        }

        $(".reply").click(function() {
          getComments(this);
        });
      });
    });

    $("#my-foods").click(function () {

      $(".widget-box.post").remove();
      dpd.users.me(function(response) {
        dpd.picturedata.get({username: response.username}, function(data) {
          for (var i = data.length-1; i >= 0; i--) {
            var mainElement = new addPicDom(data[i]);
            $(".user-content").append(mainElement.$element);
          }

          $(".reply").click(function() {
            getComments(this);
          });

        });
      });

    });
  };


  LoadCategories.prototype.loadSidebar = function () {
    var temp = this;

    dpd.categories.get(function(results, error) {
      if (error) {
        alert(error.message);
      } else {
        console.log(results);
        for(var i = 0; i < results.length; i++) {
          var foodCategory = new Row(results[i]);
          temp.$element.append(foodCategory.$element);
        }
      }
    });
  };

  function Row(category) {
    var $div = $("<div></div>", {
      "class": "pics",
      "id": category.name + "-category"
    });

    var $img = $("<img>", {
      src: category.picURL,
      alt: "pic"
    });

    var $button = $("<button></button>", {
      class: "catbtn",
      value: category.name,
      text: category.name
    });

    $button.click(function() {
      loadToMain($button.val());
    });

    $div.append($img);
    $div.append($button);
    this.$element = $div;
  }

  function loadToMain(categoryClicked) {
    console.log(categoryClicked);
    $(".widget-box.post").remove();
    dpd.picturedata.get({category:categoryClicked}, function(results, error) {
      if (error) {
        alert(error.message);
      } else {
        console.log(results);
        //name = "L@gmail.com";
        //name = results[0].username;
        //console.log(name);
        for (var i = 0; i < results.length; i++) {
          var rowElement = new addPicDom(results[i],results[i].username);
          $(".user-content").append(rowElement.$element);
        }

      }
    });
  }

  function addPicDom(mainContentData) {
    var $divWidgetBox = $("<div></div>", {
      "class": "widget-box post"
    });

    var $divHead = $("<div></div>", {
      "class": "head"
    });

    var $divPostInfo = $("<div></div>", {
      "class": "post-info"
    });

    var $spanUsrInfo = $("<span></span>", {
      "class": "user-info"
    });

    var $aUsrName = $("<a></a>", {
      "href": "#",
      "text": mainContentData.username
    });

    var dateTime = new Date(mainContentData.creationDate);

    var $spanPostDate = $("<span></span>", {
      "class": "post-date",
      "text": dateTime.toLocaleDateString() + " at " + dateTime.toLocaleTimeString()
    });

    var $divBody = $("<div></div>", {
      "class": "body"
    });

    var $divPostImg = $("<div></div>", {
      "class": "post-img"
    });

    var $img = $("<img></img>", {
      src: "http://localhost:2403/uploads/" + mainContentData.filename,
      alt: "post"
    });

    var $spanCommentSpan = $("<span></span>", {
      "class": "comment-span"
    });

    var $iComment = $("<i></i>", {
      "class": "fa fa-comment",
      "aria-hidden": "true"
    });
    var $divPostComments = $("<div></div>", {
      "id": mainContentData.id + "CID",
      "class": "post-comments"
    });

    var $divPostForm = $("<div></div>", {
      "class": "post-form"
    });

    var $divFormInfo = $("<div></div>", {
      "class": "form-info"
    });

    var $inputCOMMENTCHUNK = $("<input></input>", {
      "id": mainContentData.id,
      "class": "input-comment",
      "type": "text",
      "placeholder": "Write a reply..",
      "name": "",
      "value": ""
    });

    var $divIcons = $("<div></div>", {
      "class": "icons"
    });

    var $iRep = $("<i></i>", {
      "class": "fa fa-reply reply",
      "aria-hidden": "true",
      "id": mainContentData.id
    });

    dpd.comments.get({
      pictureId: mainContentData.id
    }, function(results) {
      for(var i = 0; i < results.length; i++) {
        var $divUserComment = $("<div></div>", {
          "class": "user-comment",
        });

        var $divUserInfo = $("<div></div>", {
          "class": "user-info"
        });

        var $aUserName = $("<a></a>", {
          "text": results[i].username
        });

        var $spanTime = $("<span></span>", {
          "class": "time",
          "text": dateTime.toLocaleDateString() + " at " + dateTime.toLocaleTimeString()
        });

        var $divAppendComment = $("<div></div>", {
          "class": "append-comment",
          "text": results[i].text
        });

        $divUserInfo.append($aUserName, $spanTime);
        $divUserComment.append($divUserInfo, $divAppendComment);
        $divPostComments.append($divUserComment);
      }
    });

    $divIcons.append($iRep);
    $divFormInfo.append($inputCOMMENTCHUNK, $divIcons);
    $divPostForm.append($divFormInfo);
    $spanCommentSpan.append($iComment);

    $divPostImg.append($img);
    $spanUsrInfo.append($aUsrName);
    $divPostInfo.append($spanUsrInfo, $spanPostDate);
    $divHead.append($divPostInfo);
    $divBody.append($divPostImg, $divPostComments, $divPostForm);
    $divWidgetBox.append($divHead, $divBody);

    this.$element = $divWidgetBox;
  }

  App.LoadCategories = LoadCategories;
  App.LoadMainContent = LoadMainContent;
  window.App = App;
})(window);
