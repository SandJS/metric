'use strict';

module.exports = {
  /**
   * The instance of the client to use to send metrics to

   * @type {Object}
   */
  client: null,

  /**
   * An optional function to format arguments to
   * send to client. Arguments are passed in as a VA list
   * and we expect an array of arguments to send back.

   * @type {Function}
   */
  formatArgs: null,

  /**
   * If we need to do something special or you have a different
   * function for sending then you can override this config.

   * @type {Function}
   */
  send: null,

  /**
   * Override to supply agg type map to your metric types
   * Must have the same keys as Metric.AGG_TYPE

   * @type {Object}
   */
  aggType: null
};