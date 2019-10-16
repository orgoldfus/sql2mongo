# sql2mongo [![Build Status][travis-image]][travis-url]

Using SQL to query MongoDB

## Installation
```
npm install sql2mongo
```

## Usage
### getMongoQuery
Parses an SQL WHERE clause to a mongo query object.

Example:
```js
const { getMongoQuery } = require("sql2mongo");

const mongoQuery = getMongoQuery(`
  show = "Friends" OR
  (city = "New York" AND
  year BETWEEN 2005 AND 2014 AND
  name IN ("Ted", "Marshall", "Barney"))
`)
```

Result:
```js
{
  $or: [
    { show: "Friends" },
    {
      city: "New York",
      year: { $gt: 2005, $lt: 2014 },
      name: { $in: ["Ted", "Marshall", "Barney"] },
    }
  ]
}
```

#### Nested objects
If you need to query a nested object, use the `NESTED` function inside your query.
The `NESTED` function receives a string with a WHERE clause for the nested object.

Example:
If you would like to query the following nested document:
```js
{
  item: 'journal',
  qty: 25,
  size: { h: 14, w: 21, uom: 'cm' },
  status: 'A'
}
```

You can use the `NESTED` function like this:
```js
const { getMongoQuery } = require("sql2mongo");

const mongoQuery = getMongoQuery(`
  size = NESTED("h = 14 AND w > 20")
`)
```

Result:
```js
{
  size: {
    h: 14,
    w: { $gt: 20 }
  }
}
```

Otherwise, you can use the dot annotation:
```js
const { getMongoQuery } = require("sql2mongo");

const mongoQuery = getMongoQuery(`
  size.h = 14 AND 
  size.w > 20
`)
```

Result:
```js
{
  "size.h": 14,
  "size.w": { $gt: 20 }
}
```

## TODO
- Add support for all DML commands (insert, update, etc.)

## Build
- Run `npm run build` to build the package.

## LICENSE
MIT

[travis-image]: https://travis-ci.com/orgoldfus/sql2mongo.svg?branch=master
[travis-url]: https://travis-ci.com/orgoldfus/sql2mongo