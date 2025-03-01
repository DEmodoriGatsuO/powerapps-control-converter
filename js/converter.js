/**
 * コントロール変換クラス
 * クラシックコントロールからモダンコントロールへの変換ロジックを実装
 */
class ControlConverter {
    constructor() {
        // 変換マッピングを定義
        this.controlTypeMapping = {
            'button': 'button_v1',
            'text': 'text_v1',
            'label': 'label_v1',
            'image': 'image_v1',
            'form': 'form_v1',
            'gallery': 'gallery_v1',
            'dropdown': 'dropdown_v1',
            'combobox': 'combobox_v1',
            'textbox': 'textinput_v1',
            'checkbox': 'checkbox_v1',
            'toggle': 'toggleswitch_v1',
            'slider': 'slider_v1',
            'datepicker': 'datepicker_v1',
            'datatable': 'datatable_v1',
            // 他のコントロールタイプも必要に応じて追加
        };

        // プロパティマッピングを定義
        this.propertyMapping = {
            // 共通プロパティ
            'Visible': 'Visible',
            'X': 'X',
            'Y': 'Y',
            'Width': 'Width',
            'Height': 'Height',
            'Fill': 'Fill',
            'BorderColor': 'BorderColor',
            'BorderThickness': 'BorderThickness',
            'OnSelect': 'OnSelect',
            
            // ボタン特有
            'Text': 'Text',
            'DisplayMode': 'DisplayMode',
            
            // テキスト入力特有
            'Default': 'DefaultText',
            'HintText': 'Placeholder',
            
            // ドロップダウン特有
            'Items': 'Items',
            'Selected': 'SelectedItem',
            
            // ギャラリー特有
            'TemplateSize': 'TemplateSize',
            'TemplateFill': 'TemplateFill',
            
            // その他必要に応じて追加
        };
        
        // 変換ログの記録用
        this.conversionLog = [];
    }

    /**
     * クラシックコントロールのYAMLをモダンコントロールのYAMLに変換します
     * @param {Object} classicControl - 変換元のクラシックコントロールオブジェクト
     * @returns {Object} 変換後のモダンコントロールオブジェクト
     * @throws {Error} 変換中にエラーが発生した場合
     */
    convert(classicControl) {
        try {
            this.conversionLog = [];
            this.logConversion('変換開始');
            
            // 入力の検証
            if (!classicControl || typeof classicControl !== 'object') {
                throw new Error('無効な入力形式です');
            }
            
            // コントロールタイプの取得と変換
            const classicType = classicControl.Type || '';
            const modernType = this.getModernControlType(classicType);
            
            if (!modernType) {
                this.logConversion(`未対応のコントロールタイプ: ${classicType}`);
                throw new Error(`未対応のコントロールタイプ: ${classicType}`);
            }
            
            // 新しいモダンコントロールオブジェクトを作成
            const modernControl = {
                Type: modernType,
                PropertyDependencies: {},
                StyleName: "",
                Name: classicControl.Name || `New${modernType}`,
                ZIndex: classicControl.ZIndex || 1,
                Version: 1
            };
            
            // プロパティの変換
            this.convertProperties(classicControl, modernControl);
            
            // 特殊なコントロールタイプに応じた追加処理
            this.applySpecialRules(classicControl, modernControl);
            
            this.logConversion('変換完了');
            return modernControl;
        } catch (error) {
            this.logConversion(`エラー: ${error.message}`);
            throw error;
        }
    }
    
    /**
     * モダンコントロールタイプを取得します
     * @param {string} classicType - クラシックコントロールタイプ
     * @returns {string|null} 対応するモダンコントロールタイプ、または未対応の場合はnull
     */
    getModernControlType(classicType) {
        const lowerCaseType = classicType.toLowerCase();
        
        if (this.controlTypeMapping[lowerCaseType]) {
            const modernType = this.controlTypeMapping[lowerCaseType];
            this.logConversion(`コントロールタイプ変換: ${classicType} -> ${modernType}`);
            return modernType;
        }
        
        return null;
    }
    
    /**
     * プロパティを変換します
     * @param {Object} classicControl - クラシックコントロールオブジェクト
     * @param {Object} modernControl - モダンコントロールオブジェクト
     */
    convertProperties(classicControl, modernControl) {
        if (!classicControl.Properties) {
            this.logConversion('プロパティがありません');
            return;
        }
        
        modernControl.Properties = {};
        
        // プロパティを変換
        Object.entries(classicControl.Properties).forEach(([key, value]) => {
            const modernKey = this.propertyMapping[key] || key;
            
            if (this.propertyMapping[key]) {
                this.logConversion(`プロパティ変換: ${key} -> ${modernKey}`);
            } else {
                this.logConversion(`未マッピングのプロパティをそのまま使用: ${key}`);
            }
            
            modernControl.Properties[modernKey] = value;
        });
    }
    
    /**
     * 特殊なコントロールタイプに応じた追加のルールを適用します
     * @param {Object} classicControl - クラシックコントロールオブジェクト
     * @param {Object} modernControl - モダンコントロールオブジェクト
     */
    applySpecialRules(classicControl, modernControl) {
        const classicType = classicControl.Type?.toLowerCase();
        
        // ボタンの場合の特別ルール
        if (classicType === 'button') {
            this.logConversion('ボタン用特別ルールを適用');
            
            // モダンボタンには ButtonType プロパティが必要かもしれない
            if (!modernControl.Properties.ButtonType) {
                modernControl.Properties.ButtonType = 'Standard';
                this.logConversion('ButtonType プロパティを追加: Standard');
            }
        }
        
        // ギャラリーの場合の特別ルール
        else if (classicType === 'gallery') {
            this.logConversion('ギャラリー用特別ルールを適用');
            
            // レイアウトを設定
            if (!modernControl.Properties.Layout) {
                modernControl.Properties.Layout = 'Vertical';
                this.logConversion('Layout プロパティを追加: Vertical');
            }
        }
        
        // フォームの場合の特別ルール
        else if (classicType === 'form') {
            this.logConversion('フォーム用特別ルールを適用');
            
            // モダンフォームでは FormMode が必要かもしれない
            if (!modernControl.Properties.FormMode) {
                modernControl.Properties.FormMode = 'Edit';
                this.logConversion('FormMode プロパティを追加: Edit');
            }
        }
        
        // 他のコントロールタイプに応じたカスタムルールも追加可能
    }
    
    /**
     * 変換ログにメッセージを追加します
     * @param {string} message - ログメッセージ
     */
    logConversion(message) {
        const timestamp = new Date().toLocaleTimeString();
        this.conversionLog.push(`[${timestamp}] ${message}`);
    }
    
    /**
     * 変換ログを取得します
     * @returns {string[]} 変換ログメッセージの配列
     */
    getConversionLog() {
        return this.conversionLog;
    }
    
    /**
     * サンプルのクラシックコントロールYAMLを取得します
     * @returns {string} サンプルYAML
     */
    getSampleClassicYaml() {
        const sampleButton = {
            Type: 'Button',
            Name: 'Button1',
            ZIndex: 1,
            Properties: {
                Text: '"送信"',
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
                OnSelect: "Notify(\"ボタンがクリックされました\", NotificationType.Information)"
            }
        };
        
        return YamlParser.stringify(sampleButton);
    }
}