# codepens


# CodePen Collection

A curated collection of HTML/CSS/JavaScript demos organized by category.

## Overview

This project is a gallery of static web demos including:
- Background effects and backdrop filters
- Buttons and toggle switches
- Cards and glassmorphism effects
- Color utilities
- Definition lists
- Font and typography demos
- And more

## Project Structure

```
/
├── server.js          # Express static file server with gallery index
├── codepen/           # All demos organized by category
│   ├── background/    # Backdrop filter demos
│   ├── buttons-toggle-switches/  # Button and switch demos
│   ├── card/          # Card and glass effect demos
│   ├── color/         # Color utility demos
│   ├── definition-list/  # Definition list styling
│   ├── font/          # Font feature demos
│   ├── hr/            # Horizontal rule styling
│   ├── photo-grid/    # Photo grid layouts
│   └── typography/    # Typography effects
└── package.json       # Node.js dependencies
```

## Running Locally

```bash
node server.js
```

Server runs on port 5000 and serves:
- `/` - Gallery index with all demos
- `/codepen/...` - Individual demo files

## Notes

- Some demos use SCSS/LESS/Pug source files (not compiled)
- Most demos load external fonts and images from CDNs
- Demos are standalone HTML files that can be viewed directly
