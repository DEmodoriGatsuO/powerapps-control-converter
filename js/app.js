/**
 * Power Apps コントロール変換ツールのメインアプリケーションロジック
 */
document.addEventListener('DOMContentLoaded', function() {
    // DOM要素の取得
    const classicControlTextarea = document.getElementById('classicControl');
    const modernControlTextarea = document.getElementById('modernControl');
    const conversionLogDiv = document.getElementById('conversionLog');
    const convertBtn = document.getElementById('convertBtn');
    const clearBtn = document.getElementById('clearBtn');
    const sampleBtn = document.getElementById('sampleBtn');
    const copyBtn = document.getElementById('copyBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    
    // コンバーターのインスタンス化
    const converter = new ControlConverter();
    
    // 変換ボタンのイベントハンドラー
    convertBtn.addEventListener('click', function() {
        const classicYaml = classicControlTextarea.value.trim();
        
        if (!classicYaml) {
            showMessage('クラシックコントロールのYAMLを入力してください。');
            return;
        }
        
        try {
            // 入力YAMLの検証
            if (!YamlParser.validate(classicYaml)) {
                showMessage('無効なYAML形式です。構文を確認してください。');
                return;
            }
            
            // YAMLをパース
            const classicControl = YamlParser.parse(classicYaml);
            
            // コントロールを変換
            const modernControl = converter.convert(classicControl);
            
            // 変換されたYAMLを表示
            const modernYaml = YamlParser.stringify(modernControl);
            modernControlTextarea.value = modernYaml;
            
            // 変換ログを表示
            displayConversionLog(converter.getConversionLog());
            
            showMessage('変換が完了しました！', 'success');
        } catch (error) {
            showMessage(`エラー: ${error.message}`, 'error');
            console.error(error);
        }
    });
    
    // クリアボタンのイベントハンドラー
    clearBtn.addEventListener('click', function() {
        classicControlTextarea.value = '';
        modernControlTextarea.value = '';
        conversionLogDiv.innerHTML = '変換ログがここに表示されます...';
    });
    
    // サンプルボタンのイベントハンドラー
    sampleBtn.addEventListener('click', function() {
        classicControlTextarea.value = converter.getSampleClassicYaml();
    });
    
    // コピーボタンのイベントハンドラー
    copyBtn.addEventListener('click', function() {
        if (!modernControlTextarea.value) {
            showMessage('コピーする内容がありません。');
            return;
        }
        
        modernControlTextarea.select();
        document.execCommand('copy');
        
        // コピー成功メッセージ
        showMessage('変換結果をクリップボードにコピーしました！', 'success');
    });
    
    // ダウンロードボタンのイベントハンドラー
    downloadBtn.addEventListener('click', function() {
        if (!modernControlTextarea.value) {
            showMessage('ダウンロードする内容がありません。');
            return;
        }
        
        const blob = new Blob([modernControlTextarea.value], { type: 'text/yaml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        
        a.href = url;
        a.download = 'modernControl.yaml';
        document.body.appendChild(a);
        a.click();
        
        // クリーンアップ
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
        
        showMessage('YAMLファイルをダウンロードしました！', 'success');
    });
    
    /**
     * 変換ログを表示します
     * @param {string[]} logs - 表示するログメッセージの配列
     */
    function displayConversionLog(logs) {
        conversionLogDiv.innerHTML = logs.map(log => `<div>${log}</div>`).join('');
        
        // 自動スクロール
        conversionLogDiv.scrollTop = conversionLogDiv.scrollHeight;
    }
    
    /**
     * メッセージを表示します（将来的にトースターなどに置き換え可能）
     * @param {string} message - 表示するメッセージ
     * @param {string} type - メッセージのタイプ（'success', 'error'など）
     */
    function showMessage(message, type = 'info') {
        // 現在はコンソールに出力、将来的にはUIに表示
        console.log(`[${type}] ${message}`);
        
        // 変換ログにも追加
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = `[${timestamp}] ${message}`;
        
        let currentLog = conversionLogDiv.innerHTML;
        if (currentLog === '変換ログがここに表示されます...') {
            currentLog = '';
        }
        
        const messageClass = type === 'error' ? 'error-message' : 
                            type === 'success' ? 'success-message' : 'info-message';
                            
        conversionLogDiv.innerHTML = `${currentLog}<div class="${messageClass}">${logEntry}</div>`;
        
        // 自動スクロール
        conversionLogDiv.scrollTop = conversionLogDiv.scrollHeight;
    }
    
    // 初期化時のメッセージ
    showMessage('Power Apps コントロール変換ツールが初期化されました。クラシックコントロールのYAMLを入力するか、サンプルボタンを押してください。');
});