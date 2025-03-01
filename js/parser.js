/**
 * YAML Parser Class
 * Provides functionality for parsing and manipulating YAML content
 * for Power Apps control conversion
 */
class YamlParser {
    /**
     * Parse YAML text into a JavaScript object
     * @param {string} yamlText - The YAML text to parse
     * @returns {Object} The parsed object
     * @throws {Error} If parsing fails
     */
    static parse(yamlText) {
        try {
            // Use js-yaml library to parse the YAML
            const parsed = jsyaml.load(yamlText);
            console.log('Parsing result:', parsed);
            return parsed;
        } catch (error) {
            console.error('YAML parsing error:', error);
            throw new Error(`YAML parsing error: ${error.message}`);
        }
    }

    /**
     * Convert JavaScript object to YAML text
     * @param {Object} obj - The object to convert to YAML
     * @returns {string} YAML formatted string
     * @throws {Error} If conversion fails
     */
    static stringify(obj) {
        try {
            // Use js-yaml library to convert object to YAML string
            const yamlText = jsyaml.dump(obj, {
                indent: 2,
                lineWidth: -1, // Disable line wrapping
                noRefs: true,  // Don't use reference tags
                sortKeys: false // Preserve key order
            });
            return yamlText;
        } catch (error) {
            console.error('YAML conversion error:', error);
            throw new Error(`YAML conversion error: ${error.message}`);
        }
    }

    /**
     * Validate YAML syntax
     * @param {string} yamlText - The YAML text to validate
     * @returns {boolean} True if valid, false otherwise
     */
    static validate(yamlText) {
        try {
            jsyaml.load(yamlText);
            return true;
        } catch (error) {
            console.warn('YAML validation failed:', error.message);
            return false;
        }
    }

    /**
     * Detect the control type from parsed YAML
     * @param {Object} parsedYaml - The parsed YAML object
     * @returns {string} The detected control type or 'unknown'
     */
    static detectControlType(parsedYaml) {
        // Type detection logic (adjust according to actual Power Apps structure)
        if (!parsedYaml || !parsedYaml.Type) {
            return 'unknown';
        }
        
        return parsedYaml.Type;
    }
    
    /**
     * Find differences between two YAML objects
     * Useful for debugging conversions
     * @param {Object} original - Original object
     * @param {Object} converted - Converted object
     * @returns {Object} Object containing added, removed, and modified properties
     */
    static findDifferences(original, converted) {
        if (!original || !converted) {
            return { error: 'Invalid input objects' };
        }
        
        const differences = {
            added: {},
            removed: {},
            modified: {}
        };
        
        // Find added and modified properties
        for (const key in converted) {
            if (!(key in original)) {
                differences.added[key] = converted[key];
            } else if (JSON.stringify(original[key]) !== JSON.stringify(converted[key])) {
                differences.modified[key] = {
                    from: original[key],
                    to: converted[key]
                };
            }
        }
        
        // Find removed properties
        for (const key in original) {
            if (!(key in converted)) {
                differences.removed[key] = original[key];
            }
        }
        
        return differences;
    }
    
    /**
     * Merge two YAML objects
     * @param {Object} base - Base object
     * @param {Object} override - Object with properties to override or add
     * @returns {Object} Merged object
     */
    static mergeYamlObjects(base, override) {
        if (!base) return override || {};
        if (!override) return base || {};
        
        const result = { ...base };
        
        for (const key in override) {
            // If both values are objects, merge them recursively
            if (
                typeof override[key] === 'object' && 
                override[key] !== null &&
                typeof base[key] === 'object' && 
                base[key] !== null &&
                !Array.isArray(override[key]) &&
                !Array.isArray(base[key])
            ) {
                result[key] = this.mergeYamlObjects(base[key], override[key]);
            } 
            // Otherwise override the value
            else {
                result[key] = override[key];
            }
        }
        
        return result;
    }
    
    /**
     * Format YAML with consistent indentation and styling
     * @param {string} yamlText - YAML text to format
     * @returns {string} Formatted YAML text
     */
    static formatYaml(yamlText) {
        try {
            // Parse and then stringify to normalize format
            const parsed = this.parse(yamlText);
            return this.stringify(parsed);
        } catch (error) {
            console.error('Error formatting YAML:', error);
            return yamlText; // Return original if formatting fails
        }
    }
}