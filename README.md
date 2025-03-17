
<div align="left">
  <img src="https://github.com/user-attachments/assets/fb911b79-9749-4edb-8aea-594262ef4365" height="70" width="70" alt="ashraf704" align="left" style="vertical-align: middle; margin-right: 10px;" />
  <h3>node-initdb</h3>
  <p>CLI tool for initializing project configurations and structures in Node.js projects.</p>
</div>

---

node-initdb is a CLI tool for initializing project configurations and structures in Node.js projects. **It now requires you to select a database, a web framework, a language (JavaScript or TypeScript), and a package manager for the tool to work.** In addition to setting up your chosen database and framework, node-initdb now supports file upload functionality and JWT-based authentication.

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

- **File Upload:** Pre-configured file upload functionality.
- **JWT Authentication:** Setup for JWT-based authentication.

## Dependencies

Depending on your chosen configuration, node-initdb installs the following dependencies:

- **Database:**
  - **MongoDB:** `mongoose`
  - **Sequelize:** `sequelize`, `mysql2`
- **Web Framework:**
  - **Express:** `express`
  - **Fastify:** `fastify`
  - **Elysia:** `elysia`
- **New Features:**
  - **File Upload:** `multer`
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

