'use strict';
const Queue = require('./queue');
const Component = require('./component');
const WonderQ = require('./wonderq');

var wq = new WonderQ();

// Continuously checks processing for messages that have
// exceeded the timeout limit
setInterval(function() { counter() }, 0);

function counter()
{
  var i;
  for(i = 0; i < wq.processing.length; i++) {
    const currentTime = new Date().getTime() / 1000; // in seconds
    const elapsedTime = currentTime - wq.processing[i].timestamp;
    if(elapsedTime > wq.q.visibilityTimeout) {
      wq.releaseMessage(wq.q[i]);
    }
  }
}
