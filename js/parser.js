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
        // First, handle formula expressions that start with =
        let processed = yamlText.replace(/: =(.*?)$/gm, ': "__FORMULA__$1"');
        
        // Handle control references
        processed = processed.replace(/Control: ([^@\s]+)@([\d.]+)/g, 'Control: "$1@$2"');
        
        // Handle special YAML characters in property values
        processed = processed.replace(/: (true|false|yes|no|on|off)$/gim, ': "$1"');
        
        // Handle property values with special characters that need quotes
        processed = processed.replace(/: ([^"\n]*[\[\]{}|>*&!%:,].*?)$/gm, ': "$1"');
        
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
                if (typeof obj[key] === 'string' && obj[key].startsWith('__FORMULA__')) {
                    obj[key] = obj[key].replace(/^__FORMULA__/, '=');
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
        // For Power Apps YAML, perform a basic structure check rather than full parsing
        try {
            // Check for basic structure patterns that indicate valid Power Apps YAML
            const hasControlDefinition = yamlText.includes('Control:');
            const hasPropertiesSection = yamlText.includes('Properties:');
            
            // Simple validation - at minimum should have control definition and properties
            if (hasControlDefinition && hasPropertiesSection) {
                return true;
            }
            
            // If it doesn't match Power Apps pattern, try standard YAML validation
            const processedYaml = this.preProcessPowerAppsYaml(yamlText);
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
            
            // Try an alternative regex for controls with "Classic/" prefix
            const alternativeRegex = /- ([^:]+):\s*\n\s*Control: (Classic\/[^@\s]+)@([\d.]+)/;
            const altMatch = yamlText.match(alternativeRegex);
            
            if (altMatch) {
                return {
                    controlName: altMatch[1],
                    controlType: altMatch[2],
                    controlVersion: altMatch[3],
                    fullControlType: `${altMatch[2]}@${altMatch[3]}`
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
        // Start building the YAML
        let yamlText = `- ${controlName}:\n    Control: ${controlType}\n    Properties:\n`;
        
        // Add properties with proper indentation
        Object.entries(properties).forEach(([key, value]) => {
            // Handle formula expressions
            if (typeof value === 'string' && value.startsWith('=')) {
                yamlText += `      ${key}: ${value}\n`;
            } else if (typeof value === 'boolean' || typeof value === 'number') {
                yamlText += `      ${key}: ${value}\n`;
            } else {
                // For string values, check if they need quotes
                const needsQuotes = typeof value === 'string' && 
                                    (value.includes(':') || 
                                     value.includes('{') || 
                                     value.includes('}') ||
                                     value.includes('[') ||
                                     value.includes(']') ||
                                     value.includes('!') ||
                                     value.includes('#') ||
                                     value.includes('*'));
                
                if (needsQuotes) {
                    yamlText += `      ${key}: "${value}"\n`;
                } else {
                    yamlText += `      ${key}: ${value}\n`;
                }
            }
        });
        
        return yamlText;
    }
    
    /**
     * Extract properties directly from YAML text
     * @param {string} yamlText - Power Apps YAML text
     * @returns {Object} Extracted properties or null if not found
     */
    static extractProperties(yamlText) {
        try {
            // Extract the Properties section
            const propertiesMatch = yamlText.match(/Properties:([\s\S]*?)(?=\n\w|$)/);
            if (!propertiesMatch) {
                return null;
            }
            
            const propertiesYaml = propertiesMatch[1];
            return this.parsePropertiesFromYaml(propertiesYaml);
        } catch (error) {
            console.error('Error extracting properties:', error);
            return null;
        }
    }
    
    /**
     * Parse properties from YAML string
     * @param {string} propertiesYaml - YAML string containing properties
     * @returns {Object} Parsed properties object
     */
    static parsePropertiesFromYaml(propertiesYaml) {
        const properties = {};
        const propertyLines = propertiesYaml.split('\n');
        
        for (const line of propertyLines) {
            const trimmedLine = line.trim();
            if (!trimmedLine || !trimmedLine.includes(':')) continue;
            
            const [key, ...valueParts] = trimmedLine.split(':');
            let value = valueParts.join(':').trim();
            
            // Skip empty values
            if (!value) continue;
            
            if (value.startsWith('=')) {
                // Formula value
                properties[key.trim()] = value;
            } else if (value === 'true' || value === 'false') {
                // Boolean value
                properties[key.trim()] = value === 'true';
            } else if (!isNaN(Number(value)) && value !== '') {
                // Numeric value
                properties[key.trim()] = Number(value);
            } else {
                // String value, remove quotes if present
                value = value.replace(/^"(.*)"$/, '$1');
                properties[key.trim()] = value;
            }
        }
        
        return properties;
    }
}