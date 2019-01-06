'use strict';
const Queue = require('./queue');
const Component = require('./component');

class WonderQ {

  constructor(maxVisibilityTimeout) {
    this.q = new Queue(maxVisibilityTimeout); // messages sent but not consumed
    this.processing = []; // messages being currently processed
    this.components = []; // represents number of components utilizing the queue
  }

  // Makes a new component
  // Call this from the UI and make some sort of
  // front end representation of this new component
  createComponent(name) {
    this.components.push(new Component(name));
  }

  // Returns a message to the queue and
  // removes it from the processing list
  // Called when the max visibility timeout
  // has been exceeded
  releaseMessage(msg) {
    this.q.items.push(msg);
    this.processing = this.processing.filter(function(processingMsg) {
      return processingMsg.id != msg.id;
    });
  }
}

module.exports = WonderQ;
