import { singleFileUpload, multipleUploads } from '../../services/upload';

const uploadQueries = {};

const uploadMutations = {
    singleFileUpload: (root: any, args: any, context: any): any => {
        return singleFileUpload({ root, args, context });
    },

    multipleUploads: (root: any, args: any, context: any): any => {
        console.log('In multiple uploads');
        return multipleUploads({ root, args, context });
    }
};

export { uploadMutations, uploadQueries };
