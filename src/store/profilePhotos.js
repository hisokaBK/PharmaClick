const databaseName = "pharmaclick-profile-photos";
const storeName = "photos";
const maxFileSize = 8 * 1024 * 1024;
const side = 256;

export class ProfilePhotoError extends Error {}

function openPhotos() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new ProfilePhotoError("This browser does not allow local photo storage."));
      return;
    }
    const request = window.indexedDB.open(databaseName, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(storeName);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function transact(mode, operate) {
  const db = await openPhotos();
  try {
    return await new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, mode);
      const request = operate(transaction.objectStore(storeName));
      transaction.oncomplete = () => resolve(request.result);
      transaction.onabort = () => reject(transaction.error || new Error("Photo transaction aborted."));
    });
  } finally {
    db.close();
  }
}

export function readProfilePhoto(accountId) {
  return transact("readonly", (store) => store.get(accountId));
}

export function writeProfilePhoto(accountId, blob) {
  return transact("readwrite", (store) => blob ? store.put(blob, accountId) : store.delete(accountId));
}

function supportedImage(type, bytes) {
  if (type === "image/jpeg") return bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  if (type === "image/png") return [137, 80, 78, 71, 13, 10, 26, 10].every((byte, i) => bytes[i] === byte);
  if (type === "image/webp") {
    return String.fromCharCode(...bytes.slice(0, 4)) === "RIFF"
      && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  }
  return false;
}

export async function prepareProfilePhoto(file) {
  if (file.size > maxFileSize) throw new ProfilePhotoError("Choose an image up to 8 MB.");
  const header = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  if (!supportedImage(file.type, header)) throw new ProfilePhotoError("Choose a JPEG, PNG, or WebP image.");

  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    const { naturalWidth: width, naturalHeight: height } = image;
    if (!width || !height || width * height > 40000000) {
      throw new ProfilePhotoError("Choose an image with smaller dimensions.");
    }
    const canvas = document.createElement("canvas");
    // Avoid enlarging small source images. Crop to match the circular avatar.
    const crop = Math.min(width, height);
    const output = Math.min(crop, side);
    canvas.width = output;
    canvas.height = output;
    canvas.getContext("2d").drawImage(image, (width - crop) / 2, (height - crop) / 2, crop, crop, 0, 0, output, output);
    return await new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new ProfilePhotoError("The photo could not be prepared."));
      }, "image/webp", 0.84);
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}
