# Chapter Jumper

A VS Code extension for navigating long chapter-based text documents (novels, scripts, transcripts). Instead of scrolling, jump straight to the quarter-points of the chapter your cursor is in — handy for editing, proofreading, or skimming through a chapter section by section.

## Features

- **Jump within a chapter** — press `Ctrl+PageDown` to move to the next quarter-point of the current chapter (1/4 → 2/4 → 3/4 → start of the next chapter), based on the chapter's character length.
- **Configurable chapter pattern** — chapters are detected with a regular expression you control, so this isn't tied to one specific document format.
- **Configurable split count** — split each chapter into as many segments as you want (not just quarters).

### How it works

On each keypress, the extension scans the full document for lines matching the chapter pattern to find the boundaries of the chapter your cursor is currently in, splits that range evenly into `quarters` segments, and moves the cursor to the next segment boundary past its current position (skipping forward by at least ~200 characters, so it always advances even if you're right next to a target point).

## Usage

1. Open a text document whose chapters follow a recognizable heading pattern.
2. Place the cursor anywhere inside a chapter.
3. Press `Ctrl+PageDown` to jump to the next quarter-point; keep pressing to step through the rest of the chapter and into the next one.

## Extension Settings

| Setting | Description | Default |
|---|---|---|
| `chapterNavigator.chapterPattern` | Regular expression used to detect chapter headings | `^제\s*\d+\s*장` (matches Korean "제N장" chapter headings) |
| `chapterNavigator.quarters` | Number of segments to split each chapter into (minimum 2) | `4` |

The default pattern is tuned for Korean novel-style chapter headings — override `chapterNavigator.chapterPattern` in your settings to match whatever heading format your documents use (e.g. `^Chapter\s+\d+` for English text).

## Requirements

None — works on any plain text document.

## Known Issues

If no line in the document matches `chapterNavigator.chapterPattern`, the command shows an information message and does nothing; make sure the pattern matches your document's actual heading format.

## Installation

Not yet published on the VS Code Marketplace. To build and run it from source:

```bash
git clone https://github.com/katalog/vscode-chapter-jumper.git
cd vscode-chapter-jumper
npm install
npm run compile
```

Then open the folder in VS Code and press `F5` to launch an Extension Development Host with the extension active, or package it yourself with [`vsce`](https://github.com/microsoft/vscode-vsce) and install the resulting `.vsix` via **Extensions: Install from VSIX...**.

## Release Notes

### 1.0.0

Stable release — no functional changes from 0.8.0.

### 0.8.0

Initial release: quarter-point chapter navigation with configurable pattern and split count.

## License

See [LICENSE](LICENSE).
