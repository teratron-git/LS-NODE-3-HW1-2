const fs = require('fs')
const path = require('path')

let src = path.join(__dirname, 'DATA');
let dest = path.join(__dirname, 'SORTED');
console.log('src', src)
console.log('dest', dest)

const isFile = (currentFile, cb) => {
	let isCurrentFile;
	fs.stat(currentFile, (err, stats) => {
		if (err) {
			console.error('!ОШИБКА', err)
			cb(err, null)
			return
		} else {
			isCurrentFile = stats.isFile()
			cb(err, isCurrentFile)
		}
	})
	return isCurrentFile;
}

let data = []
let len;

const createFolder = (path, readFolder) => {
	fs.access(path, err => {
		if (!err) {
			console.log(`Папка ${path} уже создана ранее!`)
			readFolder(src)
		} else {
			// console.log('!!!err', err)
			fs.mkdir(path, err => {
				if (err) {
					// console.error(err)
					return
				}
				console.log(`Папка ${path} создана`)
				readFolder(src)
			})
		}
	});
}

const readFolder = (src) => {
	fs.readdir(src, (err, files) => {
		if (err) {
			console.log(err)
			process.exit(1)
		}
		len = files.length
		files.map(file => {
			let currentFile = path.join(src, file)

			isFile(currentFile, (err, isCurrentFile) => {
				if (err) console.log(err);
				data.push({ file, isCurrentFile })
				len--
				if (!isCurrentFile) {
					console.log('ПАПКА', file)

					readFolder(path.join(src, file))
				} else {
					console.log('ФАЙЛ', file)
					createFolder(path.join(dest, file[0].toUpperCase()), readFolder)
				}
			})

			// console.log(`${currentFile} - ${isCurrentFile}`)
		})
	})
	// createFolder(dest);
}

createFolder(dest, readFolder)





// const interval = setInterval(() => {
// 	if (len === 0) {
// 		createFolder(dest)
// 		clearInterval(interval)
// 	}
// }, 0)



// const interval = setInterval(() => {
// 	if (len === 0) {
// 		console.log(data)
// 		clearInterval(interval)
// 	}
// }, 100)



// let copy = (src, dest, file) => {
// 	fs.copyFile(path.join(src, file), path.join(dest, file), (err) => {
// 		if (err) {
// 			console.error(err)
// 			return
// 		}
// 		console.log('Файл скопирован');
// 	});
// }