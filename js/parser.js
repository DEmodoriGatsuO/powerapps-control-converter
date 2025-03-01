/**
 * YAMLパーサークラス
 * クラシックコントロールのYAMLを解析する機能を提供
 */
class YamlParser {
    /**
     * YAMLテキストを解析してJavaScriptオブジェクトに変換します
     * @param {string} yamlText - 解析するYAMLテキスト
     * @returns {Object} 解析されたオブジェクト
     * @throws {Error} 解析エラーが発生した場合
     */
    static parse(yamlText) {
        try {
            // js-yamlライブラリを使用してYAMLをパース
            const parsed = jsyaml.load(yamlText);
            console.log('解析結果:', parsed);
            return parsed;
        } catch (error) {
            console.error('YAML解析エラー:', error);
            throw new Error(`YAML解析エラー: ${error.message}`);
        }
    }

    /**
     * JavaScriptオブジェクトをYAMLテキストに変換します
     * @param {Object} obj - YAML文字列に変換するオブジェクト
     * @returns {string} YAML形式の文字列
     * @throws {Error} 変換エラーが発生した場合
     */
    static stringify(obj) {
        try {
            // js-yamlライブラリを使用してオブジェクトをYAML文字列に変換
            const yamlText = jsyaml.dump(obj, {
                indent: 2,
                lineWidth: -1, // 行の折り返しを無効化
                noRefs: true,  // 参照を使用しない
            });
            return yamlText;
        } catch (error) {
            console.error('YAML変換エラー:', error);
            throw new Error(`YAML変換エラー: ${error.message}`);
        }
    }

    /**
     * YAMLの構文検証を行います
     * @param {string} yamlText - 検証するYAMLテキスト
     * @returns {boolean} 検証結果（有効な場合はtrue）
     */
    static validate(yamlText) {
        try {
            jsyaml.load(yamlText);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * コントロールタイプを判定します
     * @param {Object} parsedYaml - 解析されたYAMLオブジェクト
     * @returns {string} コントロールタイプ
     */
    static detectControlType(parsedYaml) {
        // 型の判定ロジック（実際のPower Apps構造に合わせて調整が必要）
        if (!parsedYaml || !parsedYaml.Type) {
            return 'unknown';
        }
        
        return parsedYaml.Type;
    }
}