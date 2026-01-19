# Running the Sliding Window Website (Windows, macOS, Linux)

This guide explains **only the required steps** to run and access this website on a machine **without Node.js installed**, using **Node.js from the official website** and **pnpm**.

---

## Step 1: Install Node.js

Node.js must be installed before anything else.

### Windows

1. Go to **https://nodejs.org**
2. Download the **LTS** version for Windows
3. Run the installer
4. Keep all default options checked
5. Finish the installation

Verify installation (Command Prompt or PowerShell):

```bash
node --version
```

---

### macOS

1. Go to **https://nodejs.org**
2. Download the **LTS** version for macOS
3. Open the downloaded `.pkg` file
4. Follow the installer steps using defaults

Verify installation (Terminal):

```bash
node --version
```

---

### Linux

1. Go to **https://nodejs.org**
2. Download the **LTS** version for Linux
3. Follow the installation instructions provided on the site for your distribution

Verify installation (Terminal):

```bash
node --version
```

---

## Step 2: Install pnpm

After Node.js is installed, install pnpm using npm:

```bash
npm install -g pnpm
```

Verify installation:

```bash
pnpm --version
```

---

## Step 3: Download from Canvas

Download the project files from the Canvas assignment link:
https://canvas.hw.ac.uk/courses/31909/assignments/194475

---

## Step 4: Install Dependencies

Install the required dependencies:

Note:

```
<project-folder> might be 'my-app-master'.
```

```bash
cd <project-folder>
pnpm install
```

---

## Step 5: Run the Website

Start the website:

```bash
pnpm run dev
```

---

## Step 6: Access the Website

### Stage 1

Once the command is running, open a browser and go to:

```
http://localhost:3000
```

> If a different URL or port is shown in the terminal, use that instead.

The website should now be running and accessible in your browser.

---

### Stage 2

After opening 'http://localhost:3000' in the browser, wait for these logs in the terminal before proceeding.

```bash
✓ Starting...
✓ Ready in 35.4s
○ Compiling / ...
GET / 200 in 19.3s (compile: 18.9s, render: 369ms)
GET /animation-form 200 in 947ms (compile: 893ms, render: 54ms)
```

Specific loading times may vary.
