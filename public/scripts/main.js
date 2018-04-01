(function(window) {
  "use strict";

  var App = window.App;
  var LoadMainContent = App.LoadMainContent;
  var LoginHandler = App.LoginHandler;
  var LoadCategories =  App.LoadCategories;
  // var COMMENTS_CONTENT_SELECTOR = "[main-content=\"post-comments\"]";
  var SCROLL_BOX_SELECTOR = '[class="scroll-box"]';

  var mainContent = new LoadMainContent();
  var categories = new LoadCategories(SCROLL_BOX_SELECTOR);

  mainContent.mainContentLoader();
  mainContent.addClickHandler();
  // var commentsContent = new LoadMainContent(COMMENTS_CONTENT_SELECTOR);


  categories.loadSidebar();

})(window);
