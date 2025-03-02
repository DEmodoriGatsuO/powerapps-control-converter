/**
 * Power Apps Control Converter Class
 * Specialized for converting between classic and modern Power Apps controls
 */
class ControlConverter {
    constructor() {
        // Define control type mappings based on the provided table
        this.controlTypeMapping = {
            // Format: 'ClassicType@Version': 'ModernType@Version'
            'Label@2.5.1': 'Text@0.0.50',
            'Classic/TextInput@2.3.2': 'TextInput@0.0.53',
            'Classic/Button@2.2.0': 'Button@0.0.44',
            'Classic/DropDown@2.3.1': 'DropDown@0.0.44',
            'Classic/ComboBox@2.4.0': 'ComboBox@0.0.49',
            'Classic/DatePicker@2.6.0': 'DatePicker@0.0.42',
            'Classic/CheckBox@2.1.0': 'CheckBox@0.0.27',
            'Classic/Radio@2.3.0': 'Radio@0.0.24',
            'Classic/Toggle@2.1.0': 'Toggle@1.1.4',
            'Classic/Slider@2.1.0': 'Slider@1.0.31',
            
            // Add fallbacks without version numbers for flexibility
            'Label': 'Text@0.0.50',
            'TextInput': 'TextInput@0.0.53',
            'Button': 'Button@0.0.44',
            'DropDown': 'DropDown@0.0.44',
            'ComboBox': 'ComboBox@0.0.49',
            'DatePicker': 'DatePicker@0.0.42',
            'CheckBox': 'CheckBox@0.0.27',
            'Radio': 'Radio@0.0.24',
            'Toggle': 'Toggle@1.1.4',
            'Slider': 'Slider@1.0.31'
        };

        // Define property mappings by control type
        this.propertyMappingByControl = {
            // Label to Text conversion
            'Label': {
                'Align': 'Align',
                'AutoHeight': 'AutoHeight',
                'BorderColor': 'BorderColor',
                'BorderStyle': 'BorderStyle',
                'BorderThickness': 'BorderThickness',
                'Color': 'FontColor',
                'ContentLanguage': 'ContentLanguage',
                'DisabledBorderColor': null, // No direct equivalent
                'DisabledColor': null, // No direct equivalent
                'DisabledFill': null, // No direct equivalent
                'DisplayMode': 'DisplayMode',
                'Fill': 'Fill',
                'FocusedBorderColor': null, // No direct equivalent
                'FocusedBorderThickness': null, // No direct equivalent
                'FontWeight': 'Weight',
                'Height': 'Height',
                'HoverBorderColor': null, // No direct equivalent
                'HoverColor': null, // No direct equivalent
                'HoverFill': null, // No direct equivalent
                'Italic': 'FontItalic',
                'LineHeight': 'LineHeight',
                'Live': null, // No direct equivalent
                'PaddingBottom': 'PaddingBottom',
                'PaddingLeft': 'PaddingLeft',
                'PaddingRight': 'PaddingRight',
                'PaddingTop': 'PaddingTop',
                'Size': 'Size',
                'Text': 'Text',
                'VerticalAlign': 'VerticalAlign',
                'Visible': 'Visible',
                'Width': 'Width',
                'Wrap': 'Wrap',
                'X': 'X',
                'Y': 'Y'
            },
            
            // TextInput conversion
            'TextInput': {
                'BorderColor': 'BorderColor',
                'BorderStyle': 'BorderStyle',
                'BorderThickness': 'BorderThickness',
                'Color': 'FontColor',
                'Default': 'DefaultText',
                'DisplayMode': 'DisplayMode',
                'Fill': 'Fill',
                'Font': 'Font',
                'FontWeight': 'Weight',
                'Height': 'Height',
                'HintText': 'Placeholder',
                'MaxLength': 'MaxLength',
                'Size': 'Size',
                'Width': 'Width',
                'X': 'X',
                'Y': 'Y'
            },
            
            // Button conversion
            'Button': {
                'BorderColor': 'BorderColor',
                'BorderStyle': 'BorderStyle',
                'BorderThickness': 'BorderThickness',
                'Color': 'FontColor',
                'DisabledBorderColor': 'DisabledBorderColor',
                'DisabledColor': 'DisabledFontColor',
                'DisabledFill': 'DisabledFill',
                'DisplayMode': 'DisplayMode',
                'Fill': 'Fill',
                'Font': 'Font',
                'FontWeight': 'Weight',
                'Height': 'Height',
                'HoverBorderColor': 'HoverBorderColor',
                'HoverColor': 'HoverFontColor',
                'HoverFill': 'HoverFill',
                'OnSelect': 'OnSelect',
                'RadiusBottomLeft': 'BorderRadiusBottomLeft',
                'RadiusBottomRight': 'BorderRadiusBottomRight',
                'RadiusTopLeft': 'BorderRadiusTopLeft',
                'RadiusTopRight': 'BorderRadiusTopRight',
                'Size': 'Size',
                'Text': 'Text',
                'Visible': 'Visible',
                'Width': 'Width',
                'X': 'X',
                'Y': 'Y'
            }
            
            // Add other control mappings as needed
        };
        
        // Fallback property mapping for all controls
        this.commonPropertyMapping = {
            'Align': 'Align',
            'AutoHeight': 'AutoHeight',
            'BorderColor': 'BorderColor',
            'BorderStyle': 'BorderStyle',
            'BorderThickness': 'BorderThickness',
            'Color': 'FontColor',
            'DisplayMode': 'DisplayMode',
            'Fill': 'Fill',
            'FontWeight': 'Weight',
            'Height': 'Height',
            'Italic': 'FontItalic',
            'Size': 'Size',
            'Visible': 'Visible',
            'Width': 'Width',
            'X': 'X',
            'Y': 'Y'
        };
        
        // Default values for modern controls (properties that need to be added)
        this.modernDefaultValues = {
            'Text': {
                'BorderRadius': '=8',
                'BorderStyle': '=BorderStyle.Solid',
                'Font': "=Font.'Segoe UI'",
                'Size': '=15',
                'Weight': "='TextCanvas.Weight'.Semibold",
                'Wrap': '=And(true,true)'
            },
            'Button': {
                'BorderRadius': '=8',
                'ButtonType': '=ButtonType.Standard',
                'Font': "=Font.'Segoe UI'",
                'Size': '=15'
            },
            'TextInput': {
                'BorderRadius': '=8',
                'Font': "=Font.'Segoe UI'",
                'Size': '=15'
            }
        };
        
        // Log of conversion actions
        this.conversionLog = [];
    }

    /**
     * Convert Power Apps YAML from classic to modern format
     * @param {string} classicYaml - Classic control YAML text
     * @returns {string} Modern control YAML text
     * @throws {Error} If conversion fails
     */
    convert(classicYaml) {
        try {
            this.conversionLog = [];
            this.logConversion('Starting conversion of Power Apps control');
            
            // Extract control information
            const controlInfo = YamlParser.extractControlInfo(classicYaml);
            if (!controlInfo) {
                throw new Error('Could not extract control information from YAML');
            }
            
            // Log the detected control
            this.logConversion(`Detected control: ${controlInfo.controlName} of type ${controlInfo.fullControlType}`);
            
            // Parse the YAML to get the control object
            const parsed = YamlParser.parse(classicYaml);
            if (!parsed || !parsed[controlInfo.controlName]) {
                throw new Error('Invalid Power Apps YAML structure');
            }
            
            // Get the control data
            const classicControl = parsed[controlInfo.controlName];
            
            // Get the target modern control type
            const modernControlType = this.getModernControlType(controlInfo.fullControlType);
            if (!modernControlType) {
                throw new Error(`Unsupported control type: ${controlInfo.fullControlType}`);
            }
            
            // Generate a new name for the modern control
            const modernControlName = this.generateModernControlName(controlInfo.controlName, modernControlType);
            
            // Convert properties
            const modernProperties = this.convertProperties(
                classicControl.Properties || {},
                controlInfo.controlType
            );
            
            // Format the result as Power Apps YAML
            const modernYaml = YamlParser.formatPowerAppsControl(
                modernControlName, 
                modernControlType,
                modernProperties
            );
            
            this.logConversion('Conversion completed successfully');
            return modernYaml;
        } catch (error) {
            this.logConversion(`Error: ${error.message}`);
            throw error;
        }
    }
    
    /**
     * Generate a name for the modern control based on the classic control name
     * @param {string} classicName - Classic control name
     * @param {string} modernType - Modern control type
     * @returns {string} Generated modern control name
     */
    generateModernControlName(classicName, modernType) {
        // Extract the base type without version
        const baseType = modernType.split('@')[0];
        
        // Check if the name already includes the control type
        if (classicName.includes(baseType)) {
            return classicName;
        }
        
        // Create a new name based on the modern control type
        return `${baseType}${Math.floor(Math.random() * 1000)}`;
    }
    
    /**
     * Get modern control type from classic type
     * @param {string} classicType - Classic control type with version
     * @returns {string|null} Corresponding modern control type or null if not supported
     */
    getModernControlType(classicType) {
        // First try the exact match with version
        if (this.controlTypeMapping[classicType]) {
            const modernType = this.controlTypeMapping[classicType];
            this.logConversion(`Control type conversion: ${classicType} -> ${modernType}`);
            return modernType;
        }
        
        // Try matching without version
        const baseType = classicType.split('@')[0];
        if (this.controlTypeMapping[baseType]) {
            const modernType = this.controlTypeMapping[baseType];
            this.logConversion(`Control type conversion (using base type): ${baseType} -> ${modernType}`);
            return modernType;
        }
        
        return null;
    }
    
    /**
     * Convert properties from classic to modern format
     * @param {Object} classicProperties - Classic control properties
     * @param {string} controlType - Type of the control being converted
     * @returns {Object} Modern control properties
     */
    convertProperties(classicProperties, controlType) {
        // Create a new properties object
        const modernProperties = {};
        
        // Get the property mapping for this control type
        const propertyMapping = this.propertyMappingByControl[controlType] || this.commonPropertyMapping;
        
        // Apply mappings for existing properties
        Object.entries(classicProperties).forEach(([key, value]) => {
            // Skip null or undefined values
            if (value === null || value === undefined) {
                return;
            }
            
            // If there's a mapping for this property
            if (key in propertyMapping) {
                const modernKey = propertyMapping[key];
                
                // Skip properties that don't have a modern equivalent
                if (modernKey === null) {
                    this.logConversion(`Skipping property with no modern equivalent: ${key}`);
                    return;
                }
                
                this.logConversion(`Converting property: ${key} -> ${modernKey}`);
                modernProperties[modernKey] = value;
            } else {
                // For properties without specific mappings, keep them as-is
                this.logConversion(`Keeping unmapped property as-is: ${key}`);
                modernProperties[key] = value;
            }
        });
        
        // Add default modern properties if they don't exist
        this.addDefaultModernProperties(modernProperties, controlType);
        
        return modernProperties;
    }
    
    /**
     * Add default properties for modern controls
     * @param {Object} properties - Properties object to augment
     * @param {string} controlType - Control type
     */
    addDefaultModernProperties(properties, controlType) {
        // Get the base control type without version
        const baseType = controlType.split('@')[0];
        
        // Get default values for this control type
        const defaults = this.modernDefaultValues[baseType];
        if (!defaults) {
            return;
        }
        
        // Add default properties if they don't exist
        Object.entries(defaults).forEach(([key, value]) => {
            if (!(key in properties)) {
                this.logConversion(`Adding default modern property: ${key} = ${value}`);
                properties[key] = value;
            }
        });
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
     * Get sample classic Label YAML for demonstration
     * @returns {string} Sample YAML
     */
    getSampleClassicYaml() {
        return `- Label1:
    Control: Label@2.5.1
    Properties:
      Align: =Align.Center
      AutoHeight: =true
      BorderColor: =App.Theme.Colors.Primary
      BorderStyle: =BorderStyle.Dashed
      BorderThickness: =0.5
      Color: =Color.Black
      ContentLanguage: ="ja-jp"
      DisabledBorderColor: =Self.BorderColor
      DisabledColor: =Color.Beige
      DisabledFill: =Self.Fill
      DisplayMode: =DisplayMode.View
      Fill: =Color.Transparent
      FocusedBorderColor: =Color.Transparent
      FocusedBorderThickness: =Self.BorderThickness * 2
      FontWeight: =FontWeight.Bold
      Height: =42
      HoverBorderColor: =Self.Fill
      HoverColor: =Self.Fill
      HoverFill: =Self.BorderColor
      Italic: =true
      LineHeight: =1.4
      Live: =Live.Polite
      OnSelect: =true
      Tooltip: =Self.Text
      Width: =320
      X: =40
      Y: =17`;
    }
    
    /**
     * Get sample classic Button YAML for demonstration
     * @returns {string} Sample YAML
     */
    getSampleClassicButtonYaml() {
        return `- Button1:
    Control: Classic/Button@2.2.0
    Properties:
      BorderColor: =RGBA(0, 18, 107, 1)
      BorderStyle: =BorderStyle.Solid
      BorderThickness: =2
      Color: =RGBA(255, 255, 255, 1)
      DisabledBorderColor: =RGBA(166, 166, 166, 1)
      DisabledColor: =RGBA(166, 166, 166, 1)
      DisabledFill: =RGBA(244, 244, 244, 1)
      DisplayMode: =DisplayMode.Edit
      Fill: =RGBA(0, 98, 214, 1)
      FontWeight: =FontWeight.Bold
      Height: =40
      HoverBorderColor: =RGBA(0, 18, 107, 1)
      HoverColor: =RGBA(255, 255, 255, 1)
      HoverFill: =RGBA(0, 72, 156, 1)
      OnSelect: =Set(varClicked, true)
      RadiusBottomLeft: =5
      RadiusBottomRight: =5
      RadiusTopLeft: =5
      RadiusTopRight: =5
      Size: =13
      Text: ="Submit Form"
      Width: =150
      X: =40
      Y: =300`;
    }
    
    /**
     * Get sample classic TextInput YAML for demonstration
     * @returns {string} Sample YAML
     */
    getSampleClassicTextInputYaml() {
        return `- TextInput1:
    Control: Classic/TextInput@2.3.2
    Properties:
      BorderColor: =RGBA(166, 166, 166, 1)
      BorderStyle: =BorderStyle.Solid
      BorderThickness: =1
      Color: =RGBA(51, 51, 51, 1)
      Default: =""
      DisplayMode: =DisplayMode.Edit
      Fill: =RGBA(255, 255, 255, 1)
      FontWeight: =FontWeight.Normal
      Height: =35
      HintText: ="Enter your name"
      MaxLength: =50
      PaddingLeft: =10
      RadiusBottomLeft: =4
      RadiusBottomRight: =4
      RadiusTopLeft: =4
      RadiusTopRight: =4
      Size: =12
      Width: =280
      X: =40
      Y: =120`;
    }
}