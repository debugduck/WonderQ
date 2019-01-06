'use strict';

class Queue {

  constructor(visibilityTimeout) {
    this.visibilityTimeout = visibilityTimeout; // in seconds
    this.items =[];
    this.idCount = 0;
  }

  isEmpty() {
    return this.items.length === 0;
  }

  // puts a given message at the end of the items array
  // or, pushes it to the back of the queue
  // returns a message ID as confirmation
  pushMessage(data) {
    const msg = {
      id: ++this.idCount,
      data: data
    }
    this.items.push(msg);
    return msg;
  }

  // returns the first item in the array and deletes the returned item
  // or, pops the next message in line in the queue
  popMessage() {
    const poppedItem = this.items[0];
    this.items.shift();
    return poppedItem;
  }
};

module.exports = Queue;
