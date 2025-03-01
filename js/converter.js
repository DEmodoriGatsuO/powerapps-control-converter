/**
 * Control Converter Class
 * Implements conversion logic from classic Power Apps controls to modern controls
 */
class ControlConverter {
    constructor() {
        // Define control type mappings (classic to modern)
        this.controlTypeMapping = {
            // Basic controls
            'button': 'button_v1',
            'text': 'text_v1',
            'label': 'label_v1',
            'image': 'image_v1',
            'htmltext': 'html_v1',
            'rectangle': 'rectangle_v1',
            'icon': 'icon_v1',
            
            // Input controls
            'textbox': 'textinput_v1',
            'textarea': 'textarea_v1',
            'dropdown': 'dropdown_v1',
            'combobox': 'combobox_v1',
            'checkbox': 'checkbox_v1',
            'toggle': 'toggleswitch_v1',
            'radio': 'radio_v1',
            'slider': 'slider_v1',
            'datepicker': 'datepicker_v1',
            'timepicker': 'timepicker_v1',
            'datetimepicker': 'datetimepicker_v1',
            'rating': 'rating_v1',
            
            // Data visualization
            'gallery': 'gallery_v1',
            'datatable': 'datatable_v1',
            'chart': 'chart_v1',
            'piechart': 'piechart_v1',
            'barchart': 'barchart_v1',
            'lineChart': 'linechart_v1',
            
            // Navigation
            'tab': 'tabcontrol_v1',
            'navbar': 'navbar_v1',
            'menu': 'menu_v1',
            
            // Containers
            'form': 'form_v1',
            'group': 'group_v1',
            'card': 'card_v1',
            'container': 'container_v1',
            'dialog': 'dialog_v1',
            
            // Media
            'video': 'video_v1',
            'camera': 'camera_v1',
            'microphone': 'microphone_v1',
            'barcodescanner': 'barcodescanner_v1',
            
            // Advanced
            'timer': 'timer_v1',
            'pdf': 'pdf_v1',
            'powerbi': 'powerbi_v1',
            'mapcontrol': 'map_v1',
        };

        // Define property mappings (classic to modern)
        this.propertyMapping = {
            // Common properties
            'Visible': 'Visible',
            'X': 'X',
            'Y': 'Y',
            'Width': 'Width',
            'Height': 'Height',
            'Fill': 'Fill',
            'BorderColor': 'BorderColor',
            'BorderThickness': 'BorderThickness',
            'OnSelect': 'OnSelect',
            'DisplayMode': 'DisplayMode',
            'TabIndex': 'TabIndex',
            'Tooltip': 'Tooltip',
            'AccessibleLabel': 'AccessibleLabel',
            
            // Text properties
            'Text': 'Text',
            'FontWeight': 'FontWeight',
            'Font': 'Font',
            'Size': 'Size',
            'Italic': 'Italic',
            'Underline': 'Underline',
            'Strikethrough': 'Strikethrough',
            'Color': 'Color',
            'Align': 'Align',
            'VerticalAlign': 'VerticalAlign',
            'LineHeight': 'LineHeight',
            'Overflow': 'Overflow',
            
            // Input properties
            'Default': 'DefaultText',
            'HintText': 'Placeholder',
            'Format': 'Format',
            'MaxLength': 'MaxLength',
            'Mode': 'Mode',
            
            // Dropdown/Combobox properties
            'Items': 'Items',
            'Selected': 'SelectedItem',
            'AllowEmptySelection': 'AllowEmptySelection',
            'AllItems': 'AllItems',
            'SearchPlaceholder': 'Placeholder',
            
            // Gallery properties
            'TemplateSize': 'TemplateSize',
            'TemplateFill': 'TemplateFill',
            'TemplateGap': 'TemplateGap',
            'Layout': 'Layout',
            'WrapCount': 'WrapCount',
            'ShowNavigation': 'ShowNavigation',
            'ShowScrollbar': 'ShowScrollbar',
            
            // Form properties
            'DataSource': 'DataSource',
            'Item': 'Item',
            'FormMode': 'FormMode',
            'ShowHeader': 'ShowHeader',
            'ShowFooter': 'ShowFooter',
            
            // Image properties
            'Image': 'Image',
            'ImagePosition': 'ImagePosition',
            'ImageRotation': 'ImageRotation',
            
            // Button properties
            'RadiusTopLeft': 'BorderRadius.TopLeft',
            'RadiusTopRight': 'BorderRadius.TopRight',
            'RadiusBottomLeft': 'BorderRadius.BottomLeft',
            'RadiusBottomRight': 'BorderRadius.BottomRight'
        };
        
        // Log of conversion actions
        this.conversionLog = [];
    }

    /**
     * Convert classic control YAML to modern control YAML
     * @param {Object} classicControl - Classic control object
     * @returns {Object} Modern control object
     * @throws {Error} If conversion fails
     */
    convert(classicControl) {
        try {
            this.conversionLog = [];
            this.logConversion('Starting conversion');
            
            // Validate input
            if (!classicControl || typeof classicControl !== 'object') {
                throw new Error('Invalid input format');
            }
            
            // Get and convert control type
            const classicType = classicControl.Type || '';
            const modernType = this.getModernControlType(classicType);
            
            if (!modernType) {
                this.logConversion(`Unsupported control type: ${classicType}`);
                throw new Error(`Unsupported control type: ${classicType}`);
            }
            
            // Create new modern control object
            const modernControl = {
                Type: modernType,
                PropertyDependencies: {},
                StyleName: "",
                Name: classicControl.Name || `New${modernType}`,
                ZIndex: classicControl.ZIndex || 1,
                Version: 1
            };
            
            // Convert properties
            this.convertProperties(classicControl, modernControl);
            
            // Apply special rules for specific control types
            this.applySpecialRules(classicControl, modernControl);
            
            this.logConversion('Conversion completed');
            return modernControl;
        } catch (error) {
            this.logConversion(`Error: ${error.message}`);
            throw error;
        }
    }
    
    /**
     * Get modern control type from classic type
     * @param {string} classicType - Classic control type
     * @returns {string|null} Corresponding modern control type or null if not supported
     */
    getModernControlType(classicType) {
        const lowerCaseType = classicType.toLowerCase();
        
        if (this.controlTypeMapping[lowerCaseType]) {
            const modernType = this.controlTypeMapping[lowerCaseType];
            this.logConversion(`Control type conversion: ${classicType} -> ${modernType}`);
            return modernType;
        }
        
        return null;
    }
    
    /**
     * Convert properties from classic to modern format
     * @param {Object} classicControl - Classic control object
     * @param {Object} modernControl - Modern control object
     */
    convertProperties(classicControl, modernControl) {
        if (!classicControl.Properties) {
            this.logConversion('No properties found');
            return;
        }
        
        modernControl.Properties = {};
        
        // Convert properties
        Object.entries(classicControl.Properties).forEach(([key, value]) => {
            const modernKey = this.propertyMapping[key] || key;
            
            if (this.propertyMapping[key]) {
                this.logConversion(`Property conversion: ${key} -> ${modernKey}`);
            } else {
                this.logConversion(`Using unmapped property as-is: ${key}`);
            }
            
            modernControl.Properties[modernKey] = value;
        });
    }
    
    /**
     * Apply special rules for specific control types
     * @param {Object} classicControl - Classic control object
     * @param {Object} modernControl - Modern control object
     */
    applySpecialRules(classicControl, modernControl) {
        const classicType = classicControl.Type?.toLowerCase();
        
        // Button special rules
        if (classicType === 'button') {
            this.logConversion('Applying button-specific rules');
            
            // Modern buttons may need ButtonType property
            if (!modernControl.Properties.ButtonType) {
                modernControl.Properties.ButtonType = 'Standard';
                this.logConversion('Added ButtonType property: Standard');
            }
            
            // Convert border radius if present
            this.convertBorderRadius(classicControl, modernControl);
        }
        
        // Gallery special rules
        else if (classicType === 'gallery') {
            this.logConversion('Applying gallery-specific rules');
            
            // Set layout
            if (!modernControl.Properties.Layout) {
                modernControl.Properties.Layout = 'Vertical';
                this.logConversion('Added Layout property: Vertical');
            }
        }
        
        // Form special rules
        else if (classicType === 'form') {
            this.logConversion('Applying form-specific rules');
            
            // Modern forms may need FormMode
            if (!modernControl.Properties.FormMode) {
                modernControl.Properties.FormMode = 'Edit';
                this.logConversion('Added FormMode property: Edit');
            }
        }
        
        // Textbox / Text Input special rules
        else if (classicType === 'textbox') {
            this.logConversion('Applying text input-specific rules');
            
            // Convert HintText to Placeholder if needed
            if (classicControl.Properties.HintText && !modernControl.Properties.Placeholder) {
                modernControl.Properties.Placeholder = classicControl.Properties.HintText;
                this.logConversion('Converted HintText to Placeholder');
            }
        }
    }
    
    /**
     * Convert border radius properties
     * @param {Object} classicControl - Classic control object
     * @param {Object} modernControl - Modern control object
     */
    convertBorderRadius(classicControl, modernControl) {
        if (!classicControl.Properties) return;
        
        const props = classicControl.Properties;
        const hasRadius = props.RadiusTopLeft || props.RadiusTopRight || 
                          props.RadiusBottomLeft || props.RadiusBottomRight;
        
        if (hasRadius) {
            this.logConversion('Converting border radius properties');
            
            // Create BorderRadius object if it doesn't exist
            if (!modernControl.Properties.BorderRadius) {
                modernControl.Properties.BorderRadius = {
                    TopLeft: props.RadiusTopLeft || 0,
                    TopRight: props.RadiusTopRight || 0,
                    BottomLeft: props.RadiusBottomLeft || 0,
                    BottomRight: props.RadiusBottomRight || 0
                };
                
                // Remove old properties
                delete modernControl.Properties['RadiusTopLeft'];
                delete modernControl.Properties['RadiusTopRight'];
                delete modernControl.Properties['RadiusBottomLeft'];
                delete modernControl.Properties['RadiusBottomRight'];
            }
        }
    }
    
    /**
     * Add message to conversion log
     * @param {string} message - Log message
     */
    logConversion(message) {
        const timestamp = new Date().toLocaleTimeString();
        this.conversionLog.push(`[${timestamp}] ${message}`);
    }
    
    /**
     * Get the conversion log
     * @returns {string[]} Array of log messages
     */
    getConversionLog() {
        return this.conversionLog;
    }
    
    /**
     * Get sample classic control YAML for demonstration
     * @returns {string} Sample YAML
     */
    getSampleClassicYaml() {
        const sampleButton = {
            Type: 'Button',
            Name: 'Button1',
            ZIndex: 1,
            Properties: {
                Text: '"Submit"',
                X: 40,
                Y: 200,
                Width: 280,
                Height: 40,
                Fill: "RGBA(56, 96, 178, 1)",
                Color: "RGBA(255, 255, 255, 1)",
                DisabledFill: "RGBA(166, 166, 166, 1)",
                BorderColor: "RGBA(0, 0, 0, 0)",
                DisabledBorderColor: "RGBA(0, 0, 0, 0)",
                BorderThickness: 0,
                FocusedBorderThickness: 1,
                DisplayMode: "DisplayMode.Edit",
                OnSelect: "Notify(\"Button clicked\", NotificationType.Information)"
            }
        };
        
        return YamlParser.stringify(sampleButton);
    }
    
    /**
     * Get sample gallery control YAML
     * @returns {string} Sample YAML for gallery control
     */
    getSampleGalleryYaml() {
        const sampleGallery = {
            Type: 'Gallery',
            Name: 'Gallery1',
            ZIndex: 1,
            Properties: {
                X: 40,
                Y: 100,
                Width: 320,
                Height: 400,
                Layout: "Layout.Vertical",
                TemplateSize: 80,
                TemplateFill: "RGBA(255, 255, 255, 1)",
                Items: "SampleCollection",
                OnSelect: "Select(Self.Selected)",
                BorderColor: "RGBA(225, 223, 221, 1)",
                BorderThickness: 1
            }
        };
        
        return YamlParser.stringify(sampleGallery);
    }
    
    /**
     * Get sample form control YAML
     * @returns {string} Sample YAML for form control
     */
    getSampleFormYaml() {
        const sampleForm = {
            Type: 'Form',
            Name: 'Form1',
            ZIndex: 1,
            Properties: {
                X: 40,
                Y: 100,
                Width: 400,
                Height: 550,
                DataSource: "SampleTable",
                Item: "First(SampleTable)",
                BorderColor: "RGBA(225, 223, 221, 1)",
                BorderThickness: 1,
                Fill: "RGBA(255, 255, 255, 1)",
                OnSuccess: "Notify(\"Form submitted successfully\", NotificationType.Success)"
            }
        };
        
        return YamlParser.stringify(sampleForm);
    }
}