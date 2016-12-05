'use strict';

const SandGrain = require('sand-grain');

class Metric extends SandGrain {
  constructor() {
    super();
    this.name = this.configName = 'profiler';
    this.defaultConfig = require('./defaultConfig');
    this.version = require('../package').version;
  }

  init(config, done) {
    super.init(config);

    this.aggType = this.config.aggType || Metric.AGG_TYPE;

    done();
  }

  /**
   * Send a metric event to eventsD
   *
   * @param {String} name - name of the event
   * @param {Number} value - value for event
   * @param {Metric.AGG_TYPE.} aggType - the aggregation type for this metric
   * @param {Object|null} [meta={}] Extra meta data to attach to event
   * @param {String} [time=Current Time] the ISO 8601 time of event, defaults to current time
   * @param {Object} [extra] Extra data to append to eventsD message
   * @returns {Promise}
   */
  send(name, value, aggType, meta = {}, time = (new Date()).toISOString(), extra = {}) {
    let args = [name, value, aggType, meta, time, extra];

    if (typeof this.config.formatArgs === 'function') {
      // If config has a format args function we get back and array
      // of args to send to client
      args = this.config.formatArgs(...args);
    }

    if (typeof this.config.send === 'function') {
      // If the config has own send function send client and args
      this.config.send(...args);
    } else {
      // If the client has a send function we use it.
      this.config.client.send(...args);
    }
  }

  /**
   * Increment a counter
   *
   * @param {String} name - name of the event
   * @param {Number} value - value for event
   * @param {Object|null} [meta={}] Extra meta data to attach to event
   * @param {String} [time=Current Time] the ISO 8601 time of event, defaults to current time
   * @param {Object} [extra] Extra data to append to eventsD message
   * @returns {Promise}
   */
  increment(name, value = 1, meta = {}, time = (new Date()).toISOString(), extra = {}) {
    return this.send(name, value, this.aggType.SUM, meta, time, extra);
  }

  /**
   * Decrement a counter
   *
   * @param {String} name - name of the event
   * @param {Number} value - value for event
   * @param {Object|null} [meta={}] Extra meta data to attach to event
   * @param {String} [time=Current Time] the ISO 8601 time of event, defaults to current time
   * @param {Object} [extra] Extra data to append to eventsD message
   * @returns {Promise}
   */
  decrement(name, value = 1, meta = {}, time = (new Date()).toISOString(), extra = {}) {
    return this.increment(name, (value * -1), meta, time, extra);
  }

  /**
   * Track the minimum value
   *
   * @param {String} name - name of the event
   * @param {Number} value - value for event
   * @param {Object|null} [meta={}] Extra meta data to attach to event
   * @param {String} [time=Current Time] the ISO 8601 time of event, defaults to current time
   * @param {Object} [extra] Extra data to append to eventsD message
   * @returns {Promise}
   */
  min(name, value, meta = {}, time = (new Date()).toISOString(), extra = {}) {
    return this.send(name, value, this.aggType.MIN, meta, time, extra);
  }

  /**
   * Track the maximum value
   *
   * @param {String} name - name of the event
   * @param {Number} value - value for event
   * @param {Object|null} [meta={}] Extra meta data to attach to event
   * @param {String} [time=Current Time] the ISO 8601 time of event, defaults to current time
   * @param {Object} [extra] Extra data to append to eventsD message
   * @returns {Promise}
   */
  max(name, value, meta = {}, time = (new Date()).toISOString(), extra = {}) {
    return this.send(name, value, this.aggType.MAX, meta, time, extra);
  }

  /**
   * Track the mean/average value
   *
   * @param {String} name - name of the event
   * @param {Number} value - value for event
   * @param {Object|null} [meta={}] Extra meta data to attach to event
   * @param {String} [time=Current Time] the ISO 8601 time of event, defaults to current time
   * @param {Object} [extra] Extra data to append to eventsD message
   * @returns {Promise}
   */
  mean(name, value, meta = {}, time = (new Date()).toISOString(), extra = {}) {
    return this.send(name, value, this.aggType.MEAN, meta, time, extra);
  }

  /**
   * Should use mean instead of average
   */
  average(...args) {
    this.mean(...args);
  }

  /**
   * A gauge stat is always set to the last value that it was set too
   *
   * @param {String} name - name of the event
   * @param {Number} value - value for event
   * @param {Object|null} [meta={}] Extra meta data to attach to event
   * @param {String} [time=Current Time] the ISO 8601 time of event, defaults to current time
   * @param {Object} [extra] Extra data to append to eventsD message
   * @returns {Promise}
   */
  gauge(name, value, meta = {}, time = (new Date()).toISOString(), extra = {}) {
    return this.send(name, value, this.aggType.GAUGE, meta, time, extra);
  }

  /**
   * Track the mean, standard deviation, min, max, and count of the values
   *
   * @param {String} name - name of the event
   * @param {Number} value - value for event
   * @param {Object|null} [meta={}] Extra meta data to attach to event
   * @param {String} [time=Current Time] the ISO 8601 time of event, defaults to current time
   * @param {Object} [extra] Extra data to append to eventsD message
   * @returns {Promise}
   */
  timing(name, value, meta = {}, time = (new Date()).toISOString(), extra = {}) {
    return this.send(name, value, this.aggType.TIMING, meta, time, extra);
  }

  /**
   * Track the count of unique values
   *
   * @param {String} name - name of the event
   * @param {Number} value - value for event
   * @param {Object|null} [meta={}] Extra meta data to attach to event
   * @param {String} [time=Current Time] the ISO 8601 time of event, defaults to current time
   * @param {Object} [extra] Extra data to append to eventsD message
   * @returns {Promise}
   */
  unique(name, value, meta = {}, time = (new Date()).toISOString(), extra = {}) {
    return this.send(name, value, this.aggType.UNIQUE, meta, time, extra);
  }
}

/**
 * Aggregation Types
 * @type {Object}
 */
Metric.AGG_TYPE = Object.freeze({
  SUM: 'sum',
  MIN: 'min',
  MAX: 'max',
  MEAN: 'mean',
  TIMING: 'timing',
  GAUGE: 'gauge',
  UNIQUE: 'unique'
});

module.exports = Metric;