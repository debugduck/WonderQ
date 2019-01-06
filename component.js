'use strict';
const Queue = require('./queue');
const WonderQ = require('./wonderq')

class Component {

  constructor(name) {
    this.name = name;
    this.locked = false;
    this.messages = [];
  }

  process(messages, processingQ) {
    this.messages = messages;
    this.locked = true;
    var i;
    for(i = 0; i < messages.length; i++) {
      console.log("Message with id " + messages[i].id + " has been processed.");
      processingQ.items = processingQ.items.filter(function(msg) {
        return msg.id != messages[i].id;
      });
      this.messages = this.messages.filter(function(msg) {
        return msg.id != messages[i].id;
      });
    }
    this.locked = false;
    return processingQ;
  }

  // Retrieves a specified number of messages from the Queue
  // and gives them to a specified consumer to process
  // Returns false if the specified consumer is locked
  // and true if the consumer is not locked and thus the
  // messages have been received successfully
  getMessageSet(messages, wq) {
    if(this.locked) {
      return false;
    }
    var i;
    for(i = 0; i < messages; i++) {
      if(!wq.q.isEmpty()) {
        var popped = wq.q.popMessage();
        popped.timestamp = new Date().getTime() / 1000; // in seconds
        wq.processing.push(popped);
        this.messages.push(popped);
        wq.q.items = wq.q.items.filter(function(msg) {
          return msg.id != popped.id;
        });
      }
    }
    //wq.processing = this.process(messages, wq.processing);
    this.locked = false;
    return true;
  }
}

module.exports = Component;
