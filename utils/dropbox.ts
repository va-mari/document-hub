import { Dropbox } from 'dropbox'

const DROPBOX_ACCESS_TOKEN = process.env.DROPBOX_ACCESS_TOKEN

if (!DROPBOX_ACCESS_TOKEN) {
  throw new Error('Missing DROPBOX_ACCESS_TOKEN in environment variables.')
}

export const dbx = new Dropbox({
  accessToken: DROPBOX_ACCESS_TOKEN,
  fetch,
})

// Explicitly declare file has `.type` by using `Blob` type only
export async function uploadToDropbox(path: string, file: Blob) {
  try {
    const fileBlob = new Blob([file], { type: file.type })

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