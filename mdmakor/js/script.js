document.addEventListener('DOMContentLoaded', () => {
    const markdownInput = document.getElementById('markdownInput');
    const outputCode = document.getElementById('outputCode');
    const downloadBtn = document.getElementById('downloadBtn');
    const cleanBtn = document.getElementById('cleanBtn');
    const copyBtn = document.getElementById('copyBtn');

    function cleanAndFormatMarkdown(rawText) {
        let text = rawText.replace(/\r\n/g, '\n');
        const lines = text.split('\n');
        let processedLines = [];
        let inCodeBlock = false;
        let braceCount = 0;
        let parenCount = 0;

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            let trimmedLine = line.trim();

            // Rattrapage absolu sur un titre si on est dans un bloc non fermé
            if (inCodeBlock && (/^#{1,6}\s*/.test(trimmedLine) || /^\d+[\.\)]\s*/.test(trimmedLine))) {
                // Auto-clôture structurelle rigoureuse
                while (braceCount > 0 || parenCount > 0) {
                    let closingStr = '';
                    if (braceCount > 0) {
                        closingStr += '}';
                        braceCount--;
                    }
                    if (parenCount > 0) {
                        closingStr += ')';
                        parenCount--;
                    }
                    processedLines.push('    ' + closingStr + ';');
                }
                processedLines.push('');
                processedLines.push('```');
                inCodeBlock = false;
                braceCount = 0;
                parenCount = 0;
                processedLines.push('');
            }

            // Détection de la balise ```
            if (trimmedLine.startsWith('```')) {
                if (inCodeBlock) {
                    while (braceCount > 0 || parenCount > 0) {
                        let closingStr = '';
                        if (braceCount > 0) {
                            closingStr += '}';
                            braceCount--;
                        }
                        if (parenCount > 0) {
                            closingStr += ')';
                            parenCount--;
                        }
                        processedLines.push('    ' + closingStr + ';');
                    }
                }
                inCodeBlock = !inCodeBlock;
                braceCount = 0;
                parenCount = 0;
                processedLines.push(line);
                continue;
            }

            // Comptage chirurgical des accolades et parenthèses dans le bloc actif
            if (inCodeBlock) {
                for (let char of line) {
                    if (char === '{') braceCount++;
                    else if (char === '}') braceCount--;
                    else if (char === '(') parenCount++;
                    else if (char === ')') parenCount--;
                }
            }

            processedLines.push(line);
        }

        // Sécurité de fin de document
        if (inCodeBlock) {
            while (braceCount > 0 || parenCount > 0) {
                let closingStr = '';
                if (braceCount > 0) {
                    closingStr += '}';
                    braceCount--;
                }
                if (parenCount > 0) {
                    closingStr += ')';
                    parenCount--;
                }
                processedLines.push('    ' + closingStr + ';');
            }
            processedLines.push('```');
        }

        let result = processedLines.join('\n');
        result = result.replace(/([^\n])\n(#{1,6}\s+|\d+[\.\)]\s+)/g, '$1\n\n$2');

        return result;
    }

    function processText() {
        const rawText = markdownInput.value;
        const cleanedMarkdown = cleanAndFormatMarkdown(rawText);
        outputCode.textContent = cleanedMarkdown;
    }

    if (cleanBtn) {
        cleanBtn.addEventListener('click', processText);
    }

    markdownInput.addEventListener('input', processText);
    processText();

    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            const content = outputCode.textContent;
            const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = 'document-propre.md';
            document.body.appendChild(a);
            a.click();
            
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }

    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const content = outputCode.textContent;
            navigator.clipboard.writeText(content).then(() => {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = '✔ Copié !';
                copyBtn.style.background = '#10b981';
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                    copyBtn.style.background = '#3b82f6';
                }, 2000);
            }).catch(err => {
                console.error('Erreur lors de la copie : ', err);
            });
        });
    }
});