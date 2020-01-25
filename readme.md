## Installation

```bash
$ npm i geekhub-csv-parser
or
$ yarn add geekhub-csv-parser
```

## Example

```javascript
const parseCSV = require('geekhub-csv-parser')

parseCSV(pathToFile, (err, data) => {
  if (err) return console.error(data)
  console.log(data)
})