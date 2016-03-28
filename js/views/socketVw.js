var __ = require('underscore'),
    Backbone = require('backbone'),
    $ = require('jquery'),
    messageModal = require('../utils/messageModal.js');
Backbone.$ = $;

module.exports = Backbone.View.extend({

  events: {

  },

  initialize: function(){
    "use strict";
    var self = this,
        socketAddress = this.model.getApiSocketUrl();

    //socket should be opened when view is created, and stay open
    try{
      this.socketConnection = new WebSocket(socketAddress);
      this.socketConnection.onopen = this.socketOpen();
      this.socketConnection.onmessage = function (e) {
        self.socketMessage(e);
      };
      this.socketConnection.onerror = function (e) {
        self.socketError(e);
      };
      this.socketConnection.onclose = this.socketClose();
    } catch(exception){
      console.log(socketAddress, window.polyglot.t('errorMessages.socketError') + "<br/><br/>" + exception);
      messageModal.show('The API WebSocket cannot be reached.', '<i>Interface will continue loading, but some functionality will not be available.</i>');
    }
  },

  showSocketErrorMessage: function() {

  },

  socketOpen: function() {
    "use strict";
    //placeholder
    //console.log("Websocket Opened");
  },

  waitForSocket: function(message) {
    "use strict";
    var self = this;
    if (this.socketConnection.readyState === 1){
      this.socketConnection.send(message);
    }else{
      //if socket is not ready yet, try again
      this.socketTimer = setTimeout(function(){
        self.waitForSocket(message);
      }, 1000);
    }
  },

  socketMessage: function(e){
    "use strict";
    window.obEventBus.trigger("socketMessageReceived", e);
  },

  socketError: function(e) {
    messageModal.show('The API WebSocket cannot be reached.', '<i>Interface will continue loading, but some functionality will not be available.</i>');    
    
  },

  socketClose: function(e) {
    "use strict";
    //console.log('Websocket Closed');
  },

  getItems: function(wsID, just_following){
    "use strict";
    just_following = just_following || false;
    //id should be generated by the view that asks for the request
    var message = {"request": {
      "api": "v1",
      "id": wsID,
      "command": "get_homepage_listings",
      "just_following": just_following
    }};

    this.waitForSocket(JSON.stringify(message));
  },

  getVendors: function(wsID){
    "use strict";
    //id should be generated by the view that asks for the request
    var message = {"request": {
      "api": "v1",
      "id": wsID,
      "command": "get_vendors"
    }};
    this.waitForSocket(JSON.stringify(message));
  },

  getModerators: function(wsID){
    "use strict";
    //id should be generated by the view that asks for the request
    var message = {
      "request": {
        "api": "v1",
        "id": wsID,
        "command": "get_moderators"
      }
    };
    this.waitForSocket(JSON.stringify(message));
  },

  getNotifications: function(wsID) {
    "use strict";
    //id should be generated by the view that asks for the request
    var message = {
      "request": {
        "api": "v1",
        "id": wsID,
        "command": "get_notifications"
      }
    };
    this.waitForSocket(JSON.stringify(message));
  },

  search: function(wsID, keyword) {
    "use strict";
    //id should be generated by the view that asks for the request
    var message = {
      "request": {
        "api": "v1",
        "id": wsID,
        "command": "search",
        "keyword": keyword
      }
    };
    this.waitForSocket(JSON.stringify(message));
  },

  sendMessage: function(chatMessage) {
    "use strict";
    //id should be generated by the view that asks for the request
    this.waitForSocket(JSON.stringify(chatMessage));
  },

  render: function(){
    var self = this;
    return this;
  },

  close: function(){
    "use strict";
    this.remove();
  }
});
