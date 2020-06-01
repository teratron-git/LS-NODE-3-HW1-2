const fs = require('fs');
const path = require('path');
const del = require('del');

const src = path.join(__dirname, process.argv[2] || 'DATA');
const dest = path.join(__dirname, process.argv[3] || 'SORTED');
const isDeleteNeeded = process.argv[4] || false;
const data = [];
let countDir = 0;

console.log('Исходная папка:', src);
console.log('Конечная папка:', dest);
console.log('Удалить исходную папку после сортировки :', isDeleteNeeded, '\n');

const isFile = (currentFile) => {
  const stats = fs.statSync(currentFile);
  const isCurrentFile = stats.isFile();
  return isCurrentFile;
};

async function createFolder(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
}

async function readFolder(src) {
  let len = 0;
  countDir++;
  const files = fs.readdirSync(src);
  len = files.length;
  files.map((file) => {
    const currentFile = path.join(src, file);
    const res = isFile(currentFile);
    data.push({ file, res });
    len--;
    if (!res) {
      readFolder(path.join(src, file));
    } else {
      const rename = () => {
        fs.rename(
          path.join(src, file),
          path.join(dest, file[0].toUpperCase(), file),
          (err) => {
            if (err) console.error(err);
          }
        );
      };
      const copy = () => {
        fs.copyFile(
          path.join(src, file),
          path.join(dest, file[0].toUpperCase(), file),
          (err) => {
            if (err) console.error(err);
          }
        );
      };
      createFolder(path.join(dest, file[0].toUpperCase()));
      isDeleteNeeded ? rename() : copy();
    }
    if (len === 0) countDir--;
  });
  return true;
}

createFolder(dest);
readFolder(src).then((isEnd) => {
  if (isEnd) {
    isDeleteNeeded ? del(src) : null;
    console.log('== Сортировка завершена! ==');
  }
});
