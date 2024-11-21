import { Storage } from '@google-cloud/storage';
import dotenv from 'dotenv';
dotenv.config();
const projectId = process.env.GCP_PROJECTID;
const storage = new Storage({
  projectId,
  keyFilename: process.env.GCP_KEYFILENAME, // Replace with your JSON key file
});

const bucket = storage.bucket('sellerproductimages');

export const uplodeImage = async (image) => {
  return new Promise((resolve, reject) => {
    try {
      const blob = bucket.file(image.name);
      const blobStream = blob.createWriteStream({
        resumable: false, // Disable resumable uploads for simplicity
        metadata: {
          contentType: image.mimetype, // Ensure the correct content type is set
        },
      });

      blobStream.on('finish', async () => {
        console.log('Image uploded successfully!');
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        resolve(publicUrl);
      });
      blobStream.on('error', (err) => {
        console.log('Error', err);
        reject(err); // Reject the promise on error
      });
      blobStream.end(image.buffer);
    } catch (err) {
      console.log('Error', err);
      reject(err);
    }
  });
};
export async function deleteImageFromGCP(imagePath) {
  try {
    // Delete the image using its file path (imagePath)
    await bucket.file(imagePath).delete();
    console.log(`Image at ${imagePath} deleted successfully.`);
    return { status: true, message: 'Image deleted successfully.' };
  } catch (err) {
    console.error('Error while deleting image from GCP:', err);
    throw new Error('Failed to delete image from GCP');
  }
}
