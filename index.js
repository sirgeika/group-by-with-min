'use strict';

const groupBy = require('group-by-with');

module.exports = groupBy({
  rowCalculator: function(target, value, key) {
    const normalized = Number(value);

    if (
      !isNaN(normalized) &&
      (target[key] === undefined || normalized < target[key])
    ) {
      target[key] = normalized;
    }
  }
});