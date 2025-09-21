import { Request, Response } from 'express'
import { db } from '../db'
import { profiles } from '../db/schema/profiles.schema'
import { UpdateProfileDtoType } from '../dto/profile.dto'
import { eq } from 'drizzle-orm'
import { deleteSingleFile, uploadSingleFile } from '../services/storage.service'

export const profileController = {
  updateProfile: async (req: Request, res: Response) => {
    const profileId = Number(req.params.id)

    const file = req.file as Express.Multer.File

    const newProfile: UpdateProfileDtoType = { ...(req.body ? req.body : {}) }

    if (file) {
      const profileResult = await db.query.profiles.findFirst({
        columns: { avatarKey: true },
        where: eq(profiles.id, profileId)
      })

      if (profileResult?.avatarKey) {
        await deleteSingleFile(profileResult.avatarKey)
      }

      const uploadResult = await uploadSingleFile(file, {
        type: 'images',
        category: 'profile',
        nameSuffix: `profile${profileId}`
      })

      if (uploadResult.error) {
        res.status(404).json({
          success: false,
          message: 'Failed to upload file',
          failedUpload: uploadResult.key
        })
      }

      newProfile.avatarUrl = uploadResult.url
      newProfile.avatarKey = uploadResult.key
    }

    const result = await db.update(profiles).set(newProfile).where(eq(profiles.id, profileId))

    if (!result || (result.length && !result[0].affectedRows)) {
      res.status(404).json({ success: false, message: 'Failed to update', data: result })
    }

    res.status(200).json({
      success: true,
      message: `Updated profile for user with ID ${profileId}`,
      data: result
    })
  }
}
