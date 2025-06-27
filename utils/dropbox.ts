// utils/dropbox.ts
import { Dropbox } from 'dropbox'

const DROPBOX_ACCESS_TOKEN = process.env.DROPBOX_ACCESS_TOKEN

if (!DROPBOX_ACCESS_TOKEN) {
  throw new Error('Missing DROPBOX_ACCESS_TOKEN in environment variables.')
}

const dbx = new Dropbox({
  accessToken: DROPBOX_ACCESS_TOKEN,
  fetch,
})

export async function uploadToDropbox(path: string, file: File | Blob) {
  const fileBlob = file instanceof Blob ? file : new Blob([file], { type: file.type })

  try {
    const response = await dbx.filesUpload({
      path,
      contents: fileBlob,
      mode: { '.tag': 'add' },
      autorename: true,
      mute: true,
    })
    return response
  } catch (error) {
    console.error('Dropbox upload failed:', error)
    throw error
  }
}

export { dbx } // ✅ this is the missing piece
