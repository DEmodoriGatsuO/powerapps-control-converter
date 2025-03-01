/**
 * Power Apps Control Converter - Main Application Logic
 */
document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const classicControlTextarea = document.getElementById('classicControl');
    const modernControlTextarea = document.getElementById('modernControl');
    const conversionLogDiv = document.getElementById('conversionLog');
    const convertBtn = document.getElementById('convertBtn');
    const clearBtn = document.getElementById('clearBtn');
    const clearLogBtn = document.getElementById('clearLogBtn');
    const sampleBtn = document.getElementById('sampleBtn');
    const copyBtn = document.getElementById('copyBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettingsBtn = document.getElementById('closeSettingsBtn');
    const exportMappingsBtn = document.getElementById('exportMappingsBtn');
    const importMappingsInput = document.getElementById('importMappingsInput');
    const themeOptions = document.querySelectorAll('.theme-option');
    
    // Initialize the converter
    const converter = new ControlConverter();
    
    // Initialize UI state
    initializeUI();
    
    // Event Listeners
    convertBtn.addEventListener('click', handleConversion);
    clearBtn.addEventListener('click', clearInputs);
    clearLogBtn.addEventListener('click', clearLog);
    sampleBtn.addEventListener('click', loadSample);
    copyBtn.addEventListener('click', copyOutput);
    downloadBtn.addEventListener('click', downloadOutput);
    settingsBtn.addEventListener('click', showSettings);
    closeSettingsBtn.addEventListener('click', hideSettings);
    exportMappingsBtn.addEventListener('click', exportMappings);
    importMappingsInput.addEventListener('change', importMappings);
    
    // Theme selectors
    themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            setTheme(option.getAttribute('data-theme'));
        });
    });
    
    // Click outside modal to close
    window.addEventListener('click', function(event) {
        if (event.target === settingsModal) {
            hideSettings();
        }
    });
    
    /**
     * Initialize UI state and load saved preferences
     */
    function initializeUI() {
        // Load saved mappings from localStorage
        loadUserMappings();
        
        // Set initial theme
        const savedTheme = localStorage.getItem('theme') || 'system';
        setTheme(savedTheme);
        
        // Initialize toast container
        createToastContainer();
        
        // Clear any previous log
        conversionLogDiv.innerHTML = 'Conversion logs will appear here...';
        
        // Show welcome message
        showToast('Welcome', 'Power Apps Control Converter is ready to use.', 'info');
    }
    
    /**
     * Handle the conversion process
     */
    function handleConversion() {
        const classicYaml = classicControlTextarea.value.trim();
        
        if (!classicYaml) {
            showToast('Error', 'Please enter classic control YAML.', 'error');
            return;
        }
        
        try {
            // Validate YAML format
            if (!YamlParser.validate(classicYaml)) {
                showToast('Invalid YAML', 'Please check the syntax of your input.', 'error');
                return;
            }
            
            // Parse YAML
            const classicControl = YamlParser.parse(classicYaml);
            
            // Convert control
            const modernControl = converter.convert(classicControl);
            
            // Display converted YAML
            const modernYaml = YamlParser.stringify(modernControl);
            modernControlTextarea.value = modernYaml;
            
            // Display conversion log
            displayConversionLog(converter.getConversionLog());
            
            showToast('Success', 'Conversion completed successfully!', 'success');
        } catch (error) {
            showToast('Error', error.message, 'error');
            console.error(error);
            
            // Still update log even in case of error
            displayConversionLog(converter.getConversionLog());
        }
    }
    
    /**
     * Clear input and output fields
     */
    function clearInputs() {
        classicControlTextarea.value = '';
        modernControlTextarea.value = '';
        showToast('Cleared', 'Input and output have been cleared.', 'info');
    }
    
    /**
     * Clear the conversion log
     */
    function clearLog() {
        conversionLogDiv.innerHTML = 'Conversion logs will appear here...';
        showToast('Cleared', 'Conversion log has been cleared.', 'info');
    }
    
    /**
     * Load sample YAML data
     */
    function loadSample() {
        classicControlTextarea.value = converter.getSampleClassicYaml();
        showToast('Sample Loaded', 'Sample classic control YAML has been loaded.', 'info');
    }
    
    /**
     * Copy output to clipboard
     */
    function copyOutput() {
        if (!modernControlTextarea.value) {
            showToast('Nothing to Copy', 'No output available to copy.', 'warning');
            return;
        }
        
        // Use modern clipboard API if available
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(modernControlTextarea.value)
                .then(() => {
                    showToast('Copied!', 'Output copied to clipboard.', 'success');
                })
                .catch(error => {
                    console.error('Failed to copy: ', error);
                    fallbackCopy();
                });
        } else {
            fallbackCopy();
        }
        
        function fallbackCopy() {
            modernControlTextarea.select();
            document.execCommand('copy');
            showToast('Copied!', 'Output copied to clipboard.', 'success');
        }
    }
    
    /**
     * Download output as YAML file
     */
    function downloadOutput() {
        if (!modernControlTextarea.value) {
            showToast('Nothing to Download', 'No output available to download.', 'warning');
            return;
        }
        
        const blob = new Blob([modernControlTextarea.value], { type: 'text/yaml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        
        a.href = url;
        a.download = 'modernControl.yaml';
        document.body.appendChild(a);
        a.click();
        
        // Cleanup
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
        
        showToast('Downloaded', 'YAML file has been downloaded.', 'success');
    }
    
    /**
     * Show settings modal
     */
    function showSettings() {
        settingsModal.style.display = 'flex';
        
        // Highlight the current theme
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'system';
        themeOptions.forEach(option => {
            if (option.getAttribute('data-theme') === currentTheme) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }
    
    /**
     * Hide settings modal
     */
    function hideSettings() {
        settingsModal.style.display = 'none';
    }
    
    /**
     * Export mappings as JSON file
     */
    function exportMappings() {
        const mappings = {
            controlTypes: converter.controlTypeMapping,
            properties: converter.propertyMapping
        };
        
        const blob = new Blob([JSON.stringify(mappings, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        
        a.href = url;
        a.download = 'control-mappings.json';
        document.body.appendChild(a);
        a.click();
        
        // Cleanup
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
        
        showToast('Exported', 'Mappings configuration has been exported.', 'success');
    }
    
    /**
     * Import mappings from JSON file
     */
    function importMappings(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const mappings = JSON.parse(e.target.result);
                
                // Validate the mappings file structure
                if (!mappings.controlTypes || !mappings.properties) {
                    throw new Error('Invalid mappings file format');
                }
                
                // Apply the imported mappings
                converter.controlTypeMapping = mappings.controlTypes;
                converter.propertyMapping = mappings.properties;
                
                // Save to localStorage
                saveUserMappings();
                
                showToast('Imported', 'Mappings configuration has been imported.', 'success');
            } catch (error) {
                showToast('Import Failed', `Could not import mappings: ${error.message}`, 'error');
                console.error('Error importing mappings:', error);
            }
            
            // Reset the file input
            event.target.value = '';
        };
        
        reader.onerror = function() {
            showToast('Import Failed', 'Could not read the file.', 'error');
        };
        
        reader.readAsText(file);
    }
    
    /**
     * Set the theme
     * @param {string} theme - The theme to set ('light', 'dark', or 'system')
     */
    function setTheme(theme) {
        // Store the preference
        localStorage.setItem('theme', theme);
        
        let effectiveTheme = theme;
        // If system preference, check user's OS setting
        if (theme === 'system') {
            effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        
        // Apply the theme
        document.documentElement.setAttribute('data-theme', effectiveTheme);
        
        // Update active state in settings
        themeOptions.forEach(option => {
            if (option.getAttribute('data-theme') === theme) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }
    
    /**
     * Display conversion log
     * @param {string[]} logs - Array of log messages to display
     */
    function displayConversionLog(logs) {
        if (!logs || logs.length === 0) {
            conversionLogDiv.innerHTML = 'No conversion logs available.';
            return;
        }
        
        // Create log entries with appropriate styling
        const logEntries = logs.map(log => {
            let messageClass = 'info-message';
            
            if (log.includes('Error:') || log.includes('error')) {
                messageClass = 'error-message';
            } else if (log.includes('Success') || log.includes('completed')) {
                messageClass = 'success-message';
            } else if (log.includes('Warning') || log.includes('caution')) {
                messageClass = 'warning-message';
            }
            
            return `<div class="${messageClass}">${log}</div>`;
        });
        
        conversionLogDiv.innerHTML = logEntries.join('');
        
        // Auto-scroll to bottom
        conversionLogDiv.scrollTop = conversionLogDiv.scrollHeight;
    }
    
    /**
     * Create toast container if it doesn't exist
     */
    function createToastContainer() {
        let container = document.querySelector('.toast-container');
        
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        
        return container;
    }
    
    /**
     * Show a toast notification
     * @param {string} title - Toast title
     * @param {string} message - Toast message
     * @param {string} type - Toast type ('success', 'error', 'warning', 'info')
     */
    function showToast(title, message, type = 'info') {
        const container = createToastContainer();
        
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        // Set icon based on type
        let icon = 'fa-info-circle';
        if (type === 'success') icon = 'fa-check-circle';
        if (type === 'error') icon = 'fa-exclamation-circle';
        if (type === 'warning') icon = 'fa-exclamation-triangle';
        
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas ${icon}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
        `;
        
        // Add to container
        container.appendChild(toast);
        
        // Remove after timeout
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            
            setTimeout(() => {
                container.removeChild(toast);
            }, 300);
        }, 5000);
    }
    
    /**
     * Save user mappings to localStorage
     */
    function saveUserMappings() {
        const userMappings = {
            controlTypes: converter.controlTypeMapping,
            properties: converter.propertyMapping
        };
        
        localStorage.setItem('userMappings', JSON.stringify(userMappings));
    }
    
    /**
     * Load user mappings from localStorage
     */
    function loadUserMappings() {
        const savedMappings = localStorage.getItem('userMappings');
        
        if (savedMappings) {
            try {
                const mappings = JSON.parse(savedMappings);
                
                // Merge saved mappings with defaults
                if (mappings.controlTypes) {
                    converter.controlTypeMapping = {
                        ...converter.controlTypeMapping,
                        ...mappings.controlTypes
                    };
                }
                
                if (mappings.properties) {
                    converter.propertyMapping = {
                        ...converter.propertyMapping,
                        ...mappings.properties
                    };
                }
                
                console.log('User mappings loaded from localStorage');
            } catch (error) {
                console.error('Error loading user mappings:', error);
            }
        }
    }
    
    // Initial welcome log
    logWelcomeMessage();
    
    /**
     * Log welcome message
     */
    function logWelcomeMessage() {
        const logs = [
            `[${new Date().toLocaleTimeString()}] Power Apps Control Converter initialized`,
            `[${new Date().toLocaleTimeString()}] Ready to convert classic controls to modern controls`,
            `[${new Date().toLocaleTimeString()}] Click 'Load Sample' to see an example or paste your YAML directly`
        ];
        
        displayConversionLog(logs);
    }
});