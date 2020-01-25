const { expect } = require("chai");
const fs = require("fs");
const parseCSV = require("../");

describe("parseCSV", () => {
  describe("valid file", () => {
    const filePath = "test.csv";
    let fileData = "th1,th2\ntd, td";
    const [thead, trow] = fileData.split(/\n/);

    before(() => {
      fs.writeFileSync(filePath, fileData);
    });

    it("first line should be a header", done => {
      parseCSV(filePath, (err, data) => {
        const header = Object.keys(data[0]).join(",");
        expect(header).to.equal(thead);
        done();
      });
    });

    it("parsed data should be equal data from the file", done => {
      parseCSV(filePath, (err, data) => {
        const parsedData = data.reduce(
          (acc, row) => acc + Object.values(row).join(","),
          ""
        );
        expect(parsedData).to.equal(trow);
        done();
      });
    });

    describe("length", () => {
      for (let i = 2; i < 10; i++) {
        it(`parsed data should have ${i} objects`, done => {
          fs.appendFileSync(filePath, `\n${trow}`);
          parseCSV(filePath, (err, data) => {
            expect(data).to.lengthOf(i);
            done();
          });
        });
      }
    });

    after(() => {
      fs.unlinkSync(filePath);
    });
  });

  describe("invalid file", () => {
    const fileName = "test-invalid";
    const filesPaths = [`${fileName}.invalid`, `${fileName}.csv`];

    before(() => {
      filesPaths.forEach(path => fs.writeFileSync(path, "Invalid data"));
    });

    it("should catch invalid path", done => {
      parseCSV("./invalidPath", err => {
        expect(err).to.equal("File not found");
        done();
      });
    });

    it("should catch invalid extension", done => {
      parseCSV(filesPaths[0], err => {
        expect(err).to.equal("Invalid file");
        done();
      });
    });

    it("should catch invalid data", done => {
      parseCSV(filesPaths[1], err => {
        expect(err).to.equal("Invalid data");
        done();
      });
    });

    after(() => {
      filesPaths.forEach(path => fs.unlinkSync(path));
    });
  });
});
