'use strict';

const expect = require('chai').expect;
const Queue = require('../queue');
const WonderQ = require('../wonderq');
const Component = require('../component');

const maxVisibilityTimeout = 600; // pick an arbitrary number of seconds

describe('#wonderq', function() {

    before(function() {
      this.wonderq = new WonderQ(maxVisibilityTimeout);

      this.data1 = 'hello';
      this.data2 = 'world';
      this.data3 = 'potato';

      this.component1 = new Component('c1');

      this.msg1 = {
        id: 1,
        data: 'hello'
      };

      this.msg2 = {
        id: 2,
        data: 'world'
      };

      this.msg3 = {
        id: 3,
        data: 'potato'
      };
    });

    beforeEach(function() {
      this.wonderq = new WonderQ(maxVisibilityTimeout);
      this.component1 = new Component('c1');
    });

    describe('queue functions', function() {
      it('should add a message to the queue', function() {
          const returnMsg = this.wonderq.q.pushMessage(this.data1);
          const expectedResult = [this.msg1];
          expect(returnMsg).to.deep.equal(this.msg1);
          expect(this.wonderq.q.items).to.deep.equal(expectedResult);
      });

      it('should add the latest message to the back of the queue', function() {
          const returnMsg1 = this.wonderq.q.pushMessage(this.data1);
          const returnMsg2 = this.wonderq.q.pushMessage(this.data2);
          const expectedResult = [this.msg1, this.msg2];
          expect(returnMsg1).to.deep.equal(this.msg1);
          expect(returnMsg2).to.deep.equal(this.msg2);
          expect(this.wonderq.q.items).to.deep.equal(expectedResult);
      });

      it('should remove the last message from the queue', function() {
          const returnMsg = this.wonderq.q.pushMessage(this.data1);
          const result = this.wonderq.q.popMessage();
          expect(returnMsg).to.deep.equal(this.msg1);
          expect(this.wonderq.q.items).to.be.empty;
          expect(result).to.deep.equal(this.msg1);
      });

      it('should remove messages from the front of the queue', function() {
          const returnMsg1 = this.wonderq.q.pushMessage(this.data1);
          const returnMsg2 = this.wonderq.q.pushMessage(this.data2);
          const popped = this.wonderq.q.popMessage();
          const expectedResult = [this.msg2];
          expect(popped).to.deep.equal(this.msg1);
          expect(this.wonderq.q.items).to.deep.equal(expectedResult);
      });

      it('should determine whether or the queue is empty', function() {
        const returnMsg = this.wonderq.q.pushMessage(this.data1);
        const empty = this.wonderq.q.isEmpty();
        expect(empty).to.be.false;
      });
    });

    describe('component functions', function() {
      it('should process a set of messages', function() {
        this.wonderq.q.pushMessage(this.data1);
        this.wonderq.q.pushMessage(this.data2);
        this.wonderq.q.pushMessage(this.data3);
        const msgSet = [this.msg1, this.msg2, this.msg3];
        this.wonderq.q = this.component1.process(msgSet, this.wonderq.q);
        expect(this.wonderq.q.items).to.be.empty;
      });

      it('should receive messages from the queue if not locked', function () {
        this.wonderq.q.pushMessage(this.data1);
        this.wonderq.q.pushMessage(this.data2);
        this.wonderq.q.pushMessage(this.data3);
        const success = this.component1.getMessageSet(2, this.wonderq);
        expect(success).to.be.true;
        expect(this.component1.messages.length).to.equal(2);
        expect(this.wonderq.processing.length).to.equal(2);
      });

      it('should not receive messages from the queue is component is locked', function() {
        this.component1.locked = true;
        this.wonderq.q.pushMessage(this.data1);
        const success = this.component1.getMessageSet(1, this.wonder);
        expect(success).to.be.false;
      });
    });

    describe('wonderq functions', function() {
      it('should add a new component to the component list', function() {
        this.wonderq.createComponent('c1');
        const expectedResult = [this.component1];
        expect(this.wonderq.components.length).to.equal(1);
        expect(this.wonderq.components).to.deep.equal(expectedResult);
      });

      it('should release an overdue message from the queue', function() {
        const expectedQueueItems = [this.msg1];
        this.wonderq.processing.push(this.msg1);
        this.wonderq.releaseMessage(this.msg1);
        expect(this.wonderq.processing).to.be.empty;
        expect(this.wonderq.q.items).to.deep.equal(expectedQueueItems);
      });
    });

});
