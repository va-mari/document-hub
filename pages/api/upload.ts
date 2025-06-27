// pages/api/upload.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import dbx from '@/utils/dropboxClient'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Increase if needed
    },
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { fileName, fileContent, dropboxPath } = req.body

  if (!fileName || !fileContent || !dropboxPath) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    const fileBuffer = Buffer.from(fileContent, 'base64')

    await dbx.filesUpload({
      path: `${dropboxPath}/${fileName}`,
      contents: fileBuffer,
      mode: { '.tag': 'add' }, // or 'overwrite'
    })

    res.status(200).json({ message: 'File uploaded to Dropbox!' })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: 'Dropbox upload failed' })
  }
}
