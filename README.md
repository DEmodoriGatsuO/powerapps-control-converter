# Power Apps Control Converter

A modern web application to help Power Apps developers convert classic controls to modern controls. This tool takes YAML source code from classic controls and transforms it to the equivalent modern control format.

## Features

- Intuitive user interface with light and dark themes
- Conversion from classic control YAML to modern control YAML format
- Detailed conversion logs to track the transformation process
- Copy and download functionality for converted results
- Sample controls to demonstrate the conversion process
- Customizable mapping configurations via import/export
- Local storage to remember user preferences and custom mappings

## Supported Controls

Currently supports conversion for the following control types:

### Basic Controls
- Button (button_v1)
- Text (text_v1)
- Label (label_v1)
- Image (image_v1)
- HTML Text (html_v1)
- Rectangle (rectangle_v1)
- Icon (icon_v1)

### Input Controls
- Text Input (textinput_v1)
- Text Area (textarea_v1)
- Dropdown (dropdown_v1)
- Combo Box (combobox_v1)
- Checkbox (checkbox_v1)
- Toggle Switch (toggleswitch_v1)
- Radio (radio_v1)
- Slider (slider_v1)
- Date Picker (datepicker_v1)
- Time Picker (timepicker_v1)
- Date Time Picker (datetimepicker_v1)
- Rating (rating_v1)

### Data Visualization
- Gallery (gallery_v1)
- Data Table (datatable_v1)
- Charts (various chart types)

### Containers & Navigation
- Form (form_v1)
- Tab Control (tabcontrol_v1)
- Group (group_v1)
- Container (container_v1)
- Card (card_v1)
- Dialog (dialog_v1)

And many more...

## How to Use

1. Open the application in your web browser.
2. Paste your classic control YAML in the left input area (or click "Load Sample" to see an example).
3. Click the "Convert" button to transform it to the modern control format.
4. The converted YAML will appear in the right output area.
5. Use the "Copy" button to copy the result to your clipboard or "Download" to save it as a file.
6. View the conversion details in the log section below.

## Customizing Mappings

You can customize how controls and properties are mapped:

1. Click the "Settings" button in the top bar.
2. Use "Export Mappings" to download your current configuration.
3. Modify the JSON file to add or change mappings.
4. Use "Import Mappings" to load your custom configuration.

Custom mappings are saved in your browser's local storage and will persist between sessions.

## Running Locally

To run this application locally:

```bash
# Clone the repository
git clone https://github.com/yourusername/powerapps-control-converter.git

# Navigate to the project directory
cd powerapps-control-converter

# Open index.html in your browser
# No build process required - just open the file
```

## Deployment

This application is designed to be hosted on GitHub Pages:

1. Fork this repository.
2. Go to the Settings tab of your fork.
3. Navigate to the Pages section.
4. Select the main branch as the source.
5. Your application will be available at `https://<yourusername>.github.io/powerapps-control-converter/`

## Project Structure

- `index.html` - Main HTML file
- `css/styles.css` - Stylesheet with light/dark theme support
- `js/app.js` - Main application logic
- `js/parser.js` - YAML parsing functionality
- `js/converter.js` - Conversion logic for control types and properties

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a new branch for your feature
3. Make your changes
4. Submit a pull request

## License

MIT

## Disclaimer

This tool is created to assist Power Apps developers in converting classic controls to modern controls. While it covers many control types and properties, it may not support all possible scenarios. Always review the converted output before using it in your production applications.

The tool is not affiliated with or endorsed by Microsoft.