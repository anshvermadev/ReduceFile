# ReduceFile 🗜️

ReduceFile is a lightning-fast, privacy-first, cross-browser extension that compresses your images entirely offline using WebAssembly.

## Features ✨

- **100% Offline & Private:** Your files never leave your browser. All compression is done locally on your machine.
- **Vibrant UI:** Features a beautifully crafted, highly attractive, vibrant Neumorphism design. 
- **Format Support:** Specifically tailored for compressing **JPG**, **PNG**, and **WEBP** images.
- **Multiple Modes:** Choose between "Smart" (Auto), "Balanced" (Best ratio), or "Maximum" (Smallest size) compression modes.
- **Auto-Download:** Seamlessly process your queue and download compressed files instantly.
- **Dark & Light Mode:** Fully supports both light and dark system preferences with specifically curated palettes.

## Tech Stack 🛠️

- **Framework:** [Plasmo](https://docs.plasmo.com/)
- **UI:** React 19 + Tailwind CSS + Lucide Icons
- **Compression Engine:** Squoosh WebAssembly (`@jsquash`) running natively in the browser.
- **State Management:** Zustand

## Installation 🚀

You can install the latest version of ReduceFile directly from GitHub Releases:

1. Go to the [Releases page](../../releases) on this GitHub repository.
2. Download the latest `reducefile-extension.zip` file from the **Assets** section.
3. Extract the downloaded ZIP file to a folder on your computer.
4. Open Google Chrome and navigate to `chrome://extensions/`.
5. Enable **Developer mode** in the top right corner.
6. Click on **Load unpacked**.
7. Select the folder where you extracted the extension.

## Privacy Policy 🔒
ReduceFile operates 100% locally on your device. It does not collect telemetry, it does not send your images to any external servers, and requires absolutely no backend infrastructure. Your files remain yours.

## Contributing 🤝
We welcome contributions! Whether you're fixing bugs, improving the UI, or adding new features, we'd love your help.

Please read our [Contributing Guide](CONTRIBUTING.md) for details on how to set up the development environment, guidelines, and how to submit a Pull Request.
