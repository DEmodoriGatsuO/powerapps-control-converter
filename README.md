# Power Apps Control Converter

A web-based tool that converts Power Apps classic controls to modern controls, preserving functionality while embracing the latest Power Apps features.

## Overview

Power Apps Control Converter is a specialized tool designed to help Power Apps developers easily migrate their classic controls to modern equivalents. The tool processes YAML source code from classic controls and transforms it into the corresponding modern control format, handling all the necessary property mappings and adding required modern properties.

## Features

- **Intuitive Interface**: A clean, modern UI with light and dark themes
- **YAML Conversion**: Accurately converts Power Apps-specific YAML format
- **Control Type Support**: Handles multiple control types including Label, Button, TextInput, and more
- **Property Mapping**: Intelligently maps properties between classic and modern controls
- **Detailed Logging**: Provides transparent conversion steps with detailed logs
- **Sample Controls**: Pre-loaded examples to demonstrate the conversion process
- **Customizable Mappings**: Export and import mapping configurations
- **Responsive Design**: Works on desktop and mobile devices

## Supported Controls

The converter currently supports the following control conversions:

| Classic Control | Modern Control |
|-----------------|----------------|
| Label@2.5.1 | Text@0.0.50 |
| Classic/TextInput@2.3.2 | TextInput@0.0.53 |
| Classic/Button@2.2.0 | Button@0.0.44 |
| Classic/DropDown@2.3.1 | DropDown@0.0.44 |
| Classic/ComboBox@2.4.0 | ComboBox@0.0.49 |
| Classic/DatePicker@2.6.0 | DatePicker@0.0.42 |
| Classic/CheckBox@2.1.0 | CheckBox@0.0.27 |
| Classic/Radio@2.3.0 | Radio@0.0.24 |
| Classic/Toggle@2.1.0 | Toggle@1.1.4 |
| Classic/Slider@2.1.0 | Slider@1.0.31 |

## How to Use

1. Open the application in your web browser
2. Choose a classic control to convert:
   - Paste your own Power Apps YAML code in the input area
   - Or click "Load Sample" to see example controls
3. Click "Convert" to transform the classic control to its modern equivalent
4. Review the conversion output and log details
5. Use "Copy" to copy the result to your clipboard or "Download" to save as a file

## Technical Implementation

The converter consists of three main components:

1. **YAML Parser (parser.js)**: Specialized to handle Power Apps' unique YAML format, including formula expressions and control references
2. **Control Converter (converter.js)**: Implements the mapping logic between classic and modern controls
3. **User Interface (app.js)**: Provides an intuitive interface for performing conversions

The conversion process follows these steps:
1. Extract control information from the YAML
2. Determine the appropriate modern control type
3. Map properties from classic to modern format
4. Add required modern properties
5. Format the result as Power Apps YAML

## Extending the Tool

You can extend the tool to support additional control types or customize property mappings:

1. Click the "Settings" button
2. Export current mappings
3. Modify the JSON file to add or change mappings
4. Import your custom mappings

Custom mappings are saved in your browser's local storage for future use.

## Deployment

The application is designed to be hosted on GitHub Pages or any static hosting service. No server-side processing is required.

## License

MIT

## Disclaimer

This tool is created by a community developer and is not officially affiliated with Microsoft Power Apps. Always review generated code before using it in production environments.