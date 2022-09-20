# group-by-with-min
Collapses an array of objects at the specified object properties
and counts minimal values of specified fields.

```bash
npm install group-by-with-min
```

```js
const groupBy = require('group-by-with-min');

const arr = [
  { name: 'Vasya', who: 'man', weight: 100, height: 100 },
  { name: 'Vasya', who: 'man', weight: 90, height: 101 },
  { name: 'Kolya', who: 'man', weight: 50, height: 102 },
  
  { name: 'Katya', who: 'woman', weight: 90, height: 104 },
  { name: 'Olya', who: 'woman', weight: 100, height: 120 }
];

const whoWithWeight = groupBy(arr, 'who', 'weight, height');
/* [
    { who: 'man', weight: 50, height: 100 },
    { who: 'woman', weight: 90, height: 104 }
  ]
*/ 
```

For more examples of using groupBy see [groupByWithSum](https://github.com/sirgeika/group-by-with-sum).