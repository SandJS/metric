# sand-metric

A Sand Grain for connecting to your metric library and standardizing events to send

## Usage

```js
sand.metric.increment('my.metric');
```

## Methods
All methods of the Metric class return a promise.

Several convience methods are available for specifiing the type of aggregation that should be used for a metric.

Methods:

- `increment` - simple counter
- `decrement` - simple counter
- `min`
- `max`
- `mean`
- `gauge` - last value wins (and persists)
- `timing` - track mean, standard deviation, min, max, and count
- `unique`- count of unique values

# Metric Libraries

The only tested libraries:

- [eventsd-metric](https://github.com/sazze/node-eventsd-metric)