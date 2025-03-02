/**
 * Power Apps YAML Parser Class
 * Specialized for parsing and generating Power Apps-specific YAML format
 */
class YamlParser {
    /**
     * Parse Power Apps YAML text into a JavaScript object
     * @param {string} yamlText - The Power Apps YAML text to parse
     * @returns {Object} The parsed object
     * @throws {Error} If parsing fails
     */
    static parse(yamlText) {
        try {
            // Pre-process the YAML to handle Power Apps-specific format
            const processedYaml = this.preProcessPowerAppsYaml(yamlText);
            
            // Use js-yaml library to parse the YAML
            const parsed = jsyaml.load(processedYaml);
            console.log('Parsing result:', parsed);
            
            // Post-process to restore Power Apps-specific structures
            const result = this.postProcessParsedYaml(parsed);
            
            return result;
        } catch (error) {
            console.error('YAML parsing error:', error);
            throw new Error(`YAML parsing error: ${error.message}`);
        }
    }

    /**
     * Pre-process Power Apps YAML to make it compatible with js-yaml parser
     * @param {string} yamlText - Power Apps YAML text
     * @returns {string} Processed YAML text
     */
    static preProcessPowerAppsYaml(yamlText) {
        // Handle formula expressions that start with =
        let processed = yamlText.replace(/: =(.*?)$/gm, ': "$$$=$1"');
        
        // Handle control references
        processed = processed.replace(/Control: ([^@\s]+)@([\d.]+)/g, 'Control: "$1@$2"');
        
        return processed;
    }
    
    /**
     * Post-process parsed YAML to restore Power Apps-specific structures
     * @param {Object} parsed - Parsed YAML object
     * @returns {Object} Post-processed object
     */
    static postProcessParsedYaml(parsed) {
        if (!parsed || typeof parsed !== 'object') {
            return parsed;
        }
        
        // Deep clone to avoid modifying the original
        const result = JSON.parse(JSON.stringify(parsed));
        
        // Process all properties recursively
        const processObject = (obj) => {
            if (!obj || typeof obj !== 'object') {
                return obj;
            }
            
            Object.keys(obj).forEach(key => {
                // Process control references
                if (key === 'Control' && typeof obj[key] === 'string') {
                    obj[key] = obj[key].replace(/^"([^@]+)@([\d.]+)"$/, '$1@$2');
                }
                
                // Process formula expressions
                if (typeof obj[key] === 'string' && obj[key].startsWith('$$$=')) {
                    obj[key] = obj[key].replace(/^\$\$\$=/, '=');
                }
                
                // Recursively process nested objects
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    processObject(obj[key]);
                }
            });
            
            return obj;
        };
        
        return processObject(result);
    }

    /**
     * Convert JavaScript object to Power Apps YAML text
     * @param {Object} obj - The object to convert to YAML
     * @param {Object} options - Options for YAML generation
     * @returns {string} Power Apps YAML formatted string
     * @throws {Error} If conversion fails
     */
    static stringify(obj, options = {}) {
        try {
            // Pre-process the object for Power Apps YAML format
            const processedObj = this.preProcessObjectForYaml(obj);
            
            // Use js-yaml library to convert object to YAML string
            const yamlOptions = {
                indent: 2,
                lineWidth: -1,  // Disable line wrapping
                noRefs: true,   // Don't use reference tags
                sortKeys: false // Preserve key order
            };
            
            let yamlText = jsyaml.dump(processedObj, yamlOptions);
            
            // Post-process the YAML text to match Power Apps format
            yamlText = this.postProcessYamlText(yamlText);
            
            return yamlText;
        } catch (error) {
            console.error('YAML conversion error:', error);
            throw new Error(`YAML conversion error: ${error.message}`);
        }
    }
    
    /**
     * Pre-process JavaScript object for Power Apps YAML generation
     * @param {Object} obj - Object to process
     * @returns {Object} Processed object
     */
    static preProcessObjectForYaml(obj) {
        if (!obj || typeof obj !== 'object') {
            return obj;
        }
        
        // Deep clone to avoid modifying the original
        const result = JSON.parse(JSON.stringify(obj));
        
        // Process all properties recursively
        const processObject = (obj) => {
            if (!obj || typeof obj !== 'object') {
                return obj;
            }
            
            Object.keys(obj).forEach(key => {
                const value = obj[key];
                
                // Quote formula expressions for the YAML generator
                if (typeof value === 'string' && value.startsWith('=')) {
                    obj[key] = `"${value}"`;
                }
                
                // Quote control references for the YAML generator
                if (key === 'Control' && typeof value === 'string' && value.includes('@')) {
                    obj[key] = `"${value}"`;
                }
                
                // Recursively process nested objects
                if (typeof value === 'object' && value !== null) {
                    processObject(value);
                }
            });
            
            return obj;
        };
        
        return processObject(result);
    }
    
    /**
     * Post-process YAML text to match Power Apps format
     * @param {string} yamlText - Generated YAML text
     * @returns {string} Post-processed YAML text
     */
    static postProcessYamlText(yamlText) {
        // Remove quotes from formula expressions
        let processed = yamlText.replace(/: "=(.*?)"$/gm, ': =$1');
        
        // Remove quotes from control references
        processed = processed.replace(/Control: "([^@\s]+)@([\d.]+)"/g, 'Control: $1@$2');
        
        // Format Power Apps YAML structure
        processed = processed.replace(/^- /gm, '- ');
        
        return processed;
    }

    /**
     * Validate if text is valid Power Apps YAML
     * @param {string} yamlText - The YAML text to validate
     * @returns {boolean} True if valid, false otherwise
     */
    static validate(yamlText) {
        try {
            // Pre-process the YAML to handle Power Apps-specific format
            const processedYaml = this.preProcessPowerAppsYaml(yamlText);
            
            // Attempt to parse
            jsyaml.load(processedYaml);
            return true;
        } catch (error) {
            console.warn('YAML validation failed:', error.message);
            return false;
        }
    }
    
    /**
     * Extract control type from Power Apps YAML
     * @param {string} yamlText - Power Apps YAML text
     * @returns {Object} Object containing controlName and controlType
     */
    static extractControlInfo(yamlText) {
        try {
            const controlRegex = /- ([^:]+):\s*\n\s*Control: ([^@\s]+)@([\d.]+)/;
            const match = yamlText.match(controlRegex);
            
            if (match) {
                return {
                    controlName: match[1],
                    controlType: match[2],
                    controlVersion: match[3],
                    fullControlType: `${match[2]}@${match[3]}`
                };
            }
            
            return null;
        } catch (error) {
            console.error('Error extracting control info:', error);
            return null;
        }
    }
    
    /**
     * Format a complete Power Apps control YAML snippet
     * @param {string} controlName - Name of the control
     * @param {string} controlType - Type of the control including version
     * @param {Object} properties - Control properties
     * @returns {string} Formatted Power Apps YAML
     */
    static formatPowerAppsControl(controlName, controlType, properties) {
        const controlObj = {
            [controlName]: {
                Control: controlType,
                Properties: properties
            }
        };
        
        // Process the object for Power Apps YAML format
        const processedObj = this.preProcessObjectForYaml(controlObj);
        
        // Generate YAML with specific formatting
        let yamlText = `- ${controlName}:\n    Control: ${controlType}\n    Properties:\n`;
        
        // Add properties with proper indentation
        Object.entries(properties).forEach(([key, value]) => {
            // Handle formula expressions
            if (typeof value === 'string' && value.startsWith('=')) {
                yamlText += `      ${key}: ${value}\n`;
            } else if (typeof value === 'boolean' || typeof value === 'number') {
                yamlText += `      ${key}: ${value}\n`;
            } else {
                yamlText += `      ${key}: "${value}"\n`;
            }
        });
        
        return yamlText;
    }
}