const { StatusCodes } = require('http-status-codes');
const statusCode = StatusCodes;


exports.getImages = async (req, res) => {

};

exports.saveImages = async (req, res) => {
    if (!req.file && (!req.files || req.files.length === 0)) {
        return res.status(statusCode.BAD_REQUEST).json({
            status: 'error',
            message: 'Invalid input data. Files not found.',
        })
    };

    const uploadedFiles = req.files.map(file => ({
        fileName: file.filename,
        path: file.path,
    }))

    return res.status(statusCode.OK).json({
        status: 'success',
        message: 'Files saved correctly.',
        files: uploadedFiles,
    });
};