const fs = require("fs");
const path = require("path");

function parseCSV(filePath, done) {
  if (!fs.existsSync(filePath)) return done("File not found");
  if (path.extname(filePath) !== ".csv") return done("Invalid file");

  let rows = [];
  fs.createReadStream(filePath)
    .on("data", chunk => {
      rows = [...rows, ...chunk.toString().split(/\n/)];
    })
    .on("end", () => {
      if (rows.length < 2) return done("Invalid data");

      const theads = rows.shift().split(",");
      const json = rows.map(row => {
        const cols = row.split(",");

        return cols.reduce(
          (obj, row, index) => ({
            ...obj,
            [theads[index]]: row || ""
          }),
          {}
        );
      });
      done(null, json);
    })
    .on("error", err => done(err));
}

module.exports = parseCSV;
