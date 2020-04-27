/* eslint-disable @typescript-eslint/explicit-function-return-type */
const cloudinary = require('cloudinary').v2;

const cloudinaryUpload = async (stream: any) => {
    try {
        return await new Promise((resolve, reject) => {
            const cloudinaryStream = cloudinary.uploader.upload_stream({ tags: 'image_upload' }, function(err: Error, image: any) {
                if (err) {
                    reject(err);
                }
                if (image) {
                    resolve({
                        url: image.secure_url
                    });
                }
            });
            stream.pipe(cloudinaryStream);
        });
    } catch (error) {
        throw new Error(error);
    }
};

const processUpload = async (file: any) => {
    const { stream } = await file;
    const result = await cloudinaryUpload(stream);
    console.log('In process upload');
    console.log(result);
    return result;
};

const singleFileUpload = async (graph: any) => {
    try {
        const {
            args: { file }
        } = graph;

        return await processUpload(file);
    } catch (error) {
        throw new Error(`Failed to upload Image ! Err:${error.message}`);
    }
};

const multipleUploads = async (graph: any) => {
    try {
        const {
            args: { files }
        } = graph;

        const uploads = await Promise.all(files.map(processUpload));
        return uploads;
    } catch (error) {
        throw new Error(`Failed to upload Images ! Err:${error.message}`);
    }
};

export { singleFileUpload, multipleUploads };
