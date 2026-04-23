const sharp = require('sharp');
const archiver = require('archiver');
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

const IMAGE_SIZE_THRESHOLD = 5 * 1024 * 1024;   // 5MB
const VIDEO_SIZE_THRESHOLD = 100 * 1024 * 1024; // 100MB

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'tiff'];
const VIDEO_EXTENSIONS = ['mp4', 'mov', 'avi', 'mkv', 'webm', 'flv', 'wmv', 'm4v'];

/**
 * Compress an image file using sharp
 * Resizes and re-encodes to reduce file size with minimal quality loss
 */
async function compressImage(filePath, ext) {
    const compressedPath = filePath.replace(`.${ext}`, `-compressed.${ext}`);
    const outputFormat = ext === 'jpg' ? 'jpeg' : ext;

    await sharp(filePath)
    [outputFormat]({ quality: 80, effort: 6 }) // High quality, strong compression effort
        .toFile(compressedPath);

    const originalSize = fs.statSync(filePath).size;
    const compressedSize = fs.statSync(compressedPath).size;

    // Only replace if compression actually reduced file size
    if (compressedSize < originalSize) {
        fs.unlinkSync(filePath);
        fs.renameSync(compressedPath, filePath);
        console.log(`Image compressed: ${(originalSize / 1024 / 1024).toFixed(2)}MB → ${(compressedSize / 1024 / 1024).toFixed(2)}MB`);
    } else {
        fs.unlinkSync(compressedPath);
        console.log('Compression did not reduce size, keeping original.');
    }
}

/**
 * Compress a video file using ffmpeg
 * Re-encodes to H.264/AAC in an MP4 container with CRF-based quality control.
 * The original file is replaced with the compressed .mp4 output only if
 * the compressed version is actually smaller.
 *
 * @param {string} filePath  - Absolute path to the uploaded video file
 * @param {object} [options] - Optional ffmpeg tuning parameters
 * @param {number} [options.crf=28]          - Constant Rate Factor (0–51). Lower = better quality / larger file. 23–28 is a good range.
 * @param {string} [options.preset='fast']   - x264 encoding speed preset (ultrafast → veryslow). Slower = smaller file.
 * @param {string} [options.resolution=null] - Optional output resolution, e.g. '1280x720'. Null keeps original.
 */
async function compressVideo(filePath, options = {}) {
    const { crf = 28, preset = 'fast', resolution = null } = options;

    // Always output as .mp4 for broad compatibility
    const ext = path.extname(filePath);
    const compressedPath = filePath.replace(ext, '-compressed.mp4');

    await new Promise((resolve, reject) => {
        let command = ffmpeg(filePath)
            .videoCodec('libx264')
            .audioCodec('aac')
            .outputOptions([
                `-crf ${crf}`,
                `-preset ${preset}`,
                '-movflags +faststart', // Enables progressive playback / streaming
            ])
            .format('mp4');

        if (resolution) {
            command = command.size(resolution);
        }

        command
            .on('end', resolve)
            .on('error', reject)
            .save(compressedPath);
    });

    const originalSize = fs.statSync(filePath).size;
    const compressedSize = fs.statSync(compressedPath).size;

    if (compressedSize < originalSize) {
        fs.unlinkSync(filePath);
        // Update the multer file object path to point to the new .mp4 file
        fs.renameSync(compressedPath, filePath.replace(ext, '.mp4'));
        console.log(`Video compressed: ${(originalSize / 1024 / 1024).toFixed(2)}MB → ${(compressedSize / 1024 / 1024).toFixed(2)}MB`);
    } else {
        fs.unlinkSync(compressedPath);
        console.log('Video compression did not reduce size, keeping original.');
    }
}

/**
 * Compress a non-image, non-video file using archiver (zip)
 * Creates a .zip file and replaces the original
 */
async function compressFile(filePath) {
    const zipPath = filePath + '.zip';
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } }); // Max compression

    return new Promise((resolve, reject) => {
        output.on('close', () => {
            const originalSize = fs.statSync(filePath).size;
            const compressedSize = fs.statSync(zipPath).size;

            if (compressedSize < originalSize) {
                fs.unlinkSync(filePath);
                console.log(`File compressed: ${(originalSize / 1024 / 1024).toFixed(2)}MB → ${(compressedSize / 1024 / 1024).toFixed(2)}MB`);
            } else {
                fs.unlinkSync(zipPath);
                console.log('Compression did not reduce size, keeping original.');
            }
            resolve();
        });
        archive.on('error', reject);
        archive.pipe(output);
        archive.file(filePath, { name: path.basename(filePath) });
        archive.finalize();
    });
}

/**
 * Express middleware to compress uploaded files larger than 5MB
 * Attach after multer middleware in your route definitions
 *
 * Supports an optional `videoCompressOptions` property on req to tune ffmpeg:
 *   req.videoCompressOptions = { crf: 26, preset: 'medium', resolution: '1280x720' }
 */
async function compressIfLarge(req, res, next) {
    try {
        const files = req.files
            ? Object.values(req.files).flat() // Handle multiple file fields
            : req.file
                ? [req.file]
                : [];

        if (files.length === 0) return next();

        await Promise.all(
            files.map(async (file) => {
                const ext = path.extname(file.path).replace('.', '').toLowerCase();
                const isVideo = VIDEO_EXTENSIONS.includes(ext);
                const threshold = isVideo ? VIDEO_SIZE_THRESHOLD : IMAGE_SIZE_THRESHOLD;

                if (file.size <= threshold) return;

                if (IMAGE_EXTENSIONS.includes(ext)) {
                    await compressImage(file.path, ext);
                } else if (isVideo) {
                    await compressVideo(file.path, req.videoCompressOptions || {});
                } else {
                    await compressFile(file.path);
                }
            })
        );

        next();
    } catch (err) {
        console.error('Compression error:', err);
        next(err);
    }
}

module.exports = compressIfLarge;