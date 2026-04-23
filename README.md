<div align="left">
  <img src="https://github.com/user-attachments/assets/fb911b79-9749-4edb-8aea-594262ef4365" height="70" width="70" alt="ashraf704" align="left" style="vertical-align: middle; margin-right: 10px;" />
  <h3>node-initdb</h3>
  <p>CLI tool for initializing project configurations and structures in Node.js projects.</p>
</div>

---

node-initdb is a CLI tool for initializing project configurations and structures in Node.js projects. **It now requires you to select a database, a web framework, a language (JavaScript or TypeScript), and a package manager for the tool to work.** In addition to setting up your chosen database and framework, node-initdb now supports file upload functionality with automatic compression and JWT-based authentication.

![Node InitDB Plugin Demo](https://github.com/user-attachments/assets/997d5cfc-5187-49e9-8c5b-713d5ea9d9cb)

## Installation

Install node-initdb globally using npm:

```bash
npm install -g node-initdb
```

## Usage

Navigate to your project directory and run node-initdb with the appropriate options. **You must choose one option each for:**

- **Database:**
  - MongoDB: `--mongo` or `-m`
  - Sequelize: `--seque` or `-s`

- **Web Framework:**
  - Express: `--express` or `-e`
  - Fastify: `--fastify` or `-f`
  - Elysia: `--elysia` or `-el`

- **Language:**
  - JavaScript: `--javascript` or `-j`
  - TypeScript: `--typescript` or `-t`

- **Package Manager:**
  - Npm: `--npm` or `-n`
  - Bun: `--bun` or `-b`
  - Yarn: `--yarn` or `-ya`
  - Pnpm: `--pnpm` or `-pn`

**Important:** All four categories (database, framework, language, and package manager) are required. If any one is missing, node-initdb will not run.

Optionally, you can add `--yes` (or `-y`) to skip interactive prompts and use default values.

### Examples

- **MongoDB, Express, and TypeScript with npm:**

  ```bash
  node-initdb --mongo --express --typescript --npm
  # or shorthand:
  node-initdb -m -e -t -n
  ```

- **Sequelize, Fastify, and JavaScript with bun:**

  ```bash
  node-initdb --seque --fastify --javascript --bun
  # or shorthand:
  node-initdb -s -f -j -b
  ```

- **Sequelize, Elysia, and JavaScript with yarn:**

  ```bash
  node-initdb --seque --elysia --javascript --yarn
  # or shorthand:
  node-initdb -s -el -j -ya
  ```

### Add Module Task

To add a new module using `node-add`, run:

```bash
node-add <moduleName> [options]
```

Replace `<moduleName>` with your desired module name. Use the same options for database, framework, language, and package manager:

- Database: `-m` / `--mongo`, `-s` / `--seque`
- Framework: `-e` / `--express`, `-f` / `--fastify`, `-el` / `--elysia`
- Language: `-j` / `--javascript`, `-t` / `--typescript`
- Package Manager: `-n` / `--npm`, `-b` / `--bun`, `-ya` / `--yarn`, `-pn` / `--pnpm`

#### Example

```bash
node-add "user" -m -e -t
```

## Folder Structure

After running node-initdb, your project will have the following structure:

```
- config/
- Controllers/
- Routes/
- Models/
- Middleware/
- uploads/
- Utils/
```

## Files Created

node-initdb creates essential files such as controllers, routes, models, configuration files, and middleware. In addition, the setup includes:

- **File Upload:** Pre-configured file upload functionality with automatic compression.
- **JWT Authentication:** Setup for JWT-based authentication.

## File Compression

node-initdb includes an Express middleware (`compressIfLarge`) that automatically compresses uploaded files exceeding a size threshold. It is attached after the multer middleware and handles three categories of files differently.

### Images

Supported formats: `jpg`, `jpeg`, `png`, `webp`, `tiff`

Images larger than **5MB** are compressed using the [`sharp`](https://sharp.pixelplumbing.com/) library. The image is re-encoded at 80% quality with maximum compression effort. The original file is only replaced if the compressed version is actually smaller.

### Videos

Supported formats: `mp4`, `mov`, `avi`, `mkv`, `webm`, `flv`, `wmv`, `m4v`

Videos larger than **100MB** are compressed using [`fluent-ffmpeg`](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg), which re-encodes the video to H.264/AAC in an MP4 container. The output uses CRF-based quality control (`crf: 28` by default) and is optimized for streaming with `-movflags +faststart`.

You can tune compression per-request by setting `req.videoCompressOptions` before the middleware runs:

```js
req.videoCompressOptions = {
  crf: 26,           // Lower = better quality, larger file (range: 0–51)
  preset: 'fast',    // Encoding speed: ultrafast, superfast, fast, medium, slow, etc.
  resolution: '1280x720' // Optional: downscale output resolution
};
```

> **Important:** Video compression is CPU-intensive and can take anywhere from 30 seconds to several minutes depending on file size and server hardware. It is strongly recommended to handle video compression asynchronously — respond to the client immediately with a job ID and process the video in the background using a job queue like [BullMQ](https://docs.bullmq.io/).

#### FFmpeg Installation (Required for Video Compression)

`fluent-ffmpeg` is a Node.js wrapper and requires **FFmpeg to be installed on your system**.

**Ubuntu / Debian:**
```bash
sudo apt update && sudo apt install ffmpeg
```

**macOS:**
```bash
brew install ffmpeg
```

**Windows:**

Download the latest build from [https://ffmpeg.org/download.html](https://ffmpeg.org/download.html) and add the `bin/` folder to your system `PATH`.

**Verify installation:**
```bash
ffmpeg -version
```

If FFmpeg is not installed or not on `PATH`, video compression will fail with an error. Image and other file compression will continue to work normally.

### Other Files

Any non-image, non-video file exceeding **5MB** is compressed into a `.zip` archive using [`archiver`](https://www.archiverjs.com/) at maximum zlib compression level. Note that files that are already compressed internally (e.g. `.mp4`, `.zip`) will see little to no size reduction.

### Size Thresholds

| File Type | Threshold |
|-----------|-----------|
| Images    | 5 MB      |
| Videos    | 100 MB    |
| Others    | 5 MB      |

## Dependencies

Depending on your chosen configuration, node-initdb installs the following dependencies:

- **Database:**
  - **MongoDB:** `mongoose`
  - **Sequelize:** `sequelize`, `mysql2`
- **Web Framework:**
  - **Express:** `express`
  - **Fastify:** `fastify`
  - **Elysia:** `elysia`
- **File Upload & Compression:**
  - `multer` — handles multipart file uploads
  - `sharp` — image compression
  - `fluent-ffmpeg` — video compression (requires FFmpeg installed on system)
  - `archiver` — zip compression for other file types
- **JWT Authentication:** `jsonwebtoken`

## Contributing

Contributions are welcome! Fork the repository, implement your changes, and submit a pull request. Please follow the existing coding style and guidelines.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Get in Touch

For questions or support, feel free to reach out:

- **Email:** ashrafchauhan567@gmail.com
- **GitHub:** [@MohamedAshraf701](https://github.com/MohamedAshraf701)

## Support

If you find node-initdb useful, please consider supporting the project:

<p>
  <a href="https://www.buymeacoffee.com/ashraf704">
    <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" height="50" width="210" alt="ashraf704" />
  </a>
</p>