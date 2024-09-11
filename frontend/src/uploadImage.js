import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from './firebase';
import { toast } from 'react-hot-toast';

let loadingToast = null;

// Sanitize file name function
const sanitizeFileName = (fileName) => {
    return fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  };

const uploadImage = async (file) => {
    // Define valid file types
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const fileType = file.type;

    // Check if the file type is valid
    if (!validTypes.includes(fileType)) {
        toast.error('Invalid file type. Please upload an image file (PNG, JPEG, or WebP).');
        return Promise.reject(new Error('Invalid file type.'));
    }
    
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
    
    // Check if file exceeds the maximum size
    if (file.size > MAX_FILE_SIZE) {
        toast.error('File is too large. Maximum size is 2 MB.');
        return Promise.reject(new Error('File size exceeds the maximum limit.'));
    }

    // Sanitize the file name
    const sanitizedFileName = sanitizeFileName(new Date().getTime() + "_" + file.name);

    // Log the sanitized file name to the console
    console.log("Sanitized file name:", sanitizedFileName);

    const storage = getStorage(app)
    const storageRef = ref(storage, sanitizedFileName)

    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        uploadTask.on('state_changed', 
        (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
            case 'paused':
                console.log('Upload is paused');
                break;
            case 'running':
                if (!loadingToast) {
                    loadingToast = toast.loading('Image uploading in progress');
                }
                console.log('Upload is running');
                break;
            }
        }, 
        (error) => {
            // Handle unsuccessful uploads
            toast.error('Image uploading failed');
            console.log(error)
            reject(error);
        }, 
        () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                toast.success('Image uploaded successfully');
                toast.dismiss(loadingToast);
                loadingToast = null;
                resolve(downloadURL);
            }).catch((error) => {
                toast.error('Image uploading failed');
                console.log(error)
                reject(error);
            });
        });
    });
}

export default uploadImage
