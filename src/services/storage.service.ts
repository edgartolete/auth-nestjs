import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import dotenv from 'dotenv'

dotenv.config({ quiet: true })

const AWS_REGION = process.env.AWS_REGION
const S3_BUCKET = process.env.S3_BUCKET
const BUCKET_ROOT = 'hyc'

const client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
})

type S3UploadDirConfig = {
  type: 'images'
  category: 'profile' | 'product-thumbnails'
  nameSuffix: string
}
type S3UploadResp = { key: string | null; url: string | null; error: Error | null }
export async function uploadSingleFile(
  file: Express.Multer.File,
  dir: S3UploadDirConfig
): Promise<S3UploadResp> {
  try {
    const key = `${BUCKET_ROOT}/${dir.type}/${dir.category}/${dir.nameSuffix}-${Date.now()}-${file.originalname}`

    const command = new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype
    })

    await client.send(command)

    const url = `https://${S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${key}`

    return { key, url, error: null }
  } catch (err) {
    return { key: file.originalname, url: null, error: err as Error }
  }
}

type S3DeleteResp = { key: string; success: boolean }
export async function deleteSingleFile(key: string): Promise<S3DeleteResp> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: S3_BUCKET,
      Key: key
    })

    await client.send(command)

    return { key, success: true }
  } catch (err) {
    return { key, success: false }
  }
}

export async function uploadMultiFiles(
  files: Express.Multer.File[] = [],
  dir: S3UploadDirConfig
): Promise<S3UploadResp[]> {
  return await Promise.all(files.map((i) => uploadSingleFile(i, dir)))
}

export async function deleteMultiFiles(keys: string[] = []): Promise<S3DeleteResp[]> {
  return await Promise.all(keys.map(deleteSingleFile))
}
