import multer, { FileFilterCallback } from 'multer'
import { Request } from 'express'

const storage = multer.memoryStorage()

const fileFilterPhoto = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (file.mimetype.split('/')[0] == 'image') {
    cb(null, true)
  } else {
    cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE'))
  }
}

export const upload = multer({
  storage,
  fileFilter: fileFilterPhoto,
  limits: {
    fileSize: 1024 * 1024 * 10 // 10 MB limit
  }
})
