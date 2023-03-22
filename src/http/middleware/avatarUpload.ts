import multer, { diskStorage } from "multer"

const upload = multer({
	storage: diskStorage({
		destination: '.temp/',
		filename(req, file, cb) {
			cb(null, `${req.user.name.split(' ').join('-')}.${file.mimetype.split('/').pop()}`)
		},
	}),
	fileFilter(req, file, callback) {

		if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype)) {
			return callback(new Error('File not supported!'))
		}
		if (file.size > 3000000) {
			return callback(new Error('File too large!'))
		}

		callback(null, true)
	}
}).single('avatar')


export default (req, res, next) => {
	upload(req, res, (err) => {
		if (err) return res.status(400).json({ message: err.message })

		next()
	})
}
