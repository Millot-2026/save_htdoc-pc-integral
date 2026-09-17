document.addEventListener('DOMContentLoaded', () => {
    const markdownInput = document.getElementById('markdownInput');
    const outputCode = document.getElementById('outputCode');
    const downloadBtn = document.getElementById('downloadBtn');
    const copyBtn = document.getElementById('copyBtn');
    const printBtn = document.getElementById('printBtn');
    const toggleViewBtn = document.getElementById('toggleViewBtn');
    const printModal = document.getElementById('printModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const confirmPrintBtn = document.getElementById('confirmPrintBtn');
    const printPreviewContent = document.getElementById('printPreviewContent');
    const toolButtons = document.querySelectorAll('.btn-tool');

    let isHtmlView = false;

    toolButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tag = button.getAttribute('data-tag');
            insertMarkdown(tag, markdownInput);
        });
    });

    function insertMarkdown(tag, textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end) || 'texte';
        let replacement = '';

        switch (tag) {
            case 'h1':
                replacement = `\n# ${selectedText}\n`;
                break;
            case 'h2':
                replacement = `\n## ${selectedText}\n`;
                break;
            case 'h3':
                replacement = `\n### ${selectedText}\n`;
                break;
            case 'bold':
                replacement = `**${selectedText}**`;
                break;
            case 'italic':
                replacement = `*${selectedText}*`;
                break;
            case 'code':
                replacement = `\`${selectedText}\``;
                break;
            case 'list':
                replacement = `\n- ${selectedText}\n`;
                break;
            case 'quote':
                replacement = `\n> ${selectedText}\n`;
                break;
            case 'link':
                replacement = `[${selectedText}](https://url.com)`;
                break;
            case 'table':
                replacement = `\n| Colonne 1 | Colonne 2 |\n| :--- | :--- |\n| ${selectedText} | Valeur |\n`;
                break;
            case 'php':
                replacement = `\n\`\`\`php\n// Code PHP\n${selectedText}\n\`\`\`\n`;
                break;
            case 'js':
                replacement = `\n\`\`\`javascript\n// Code JavaScript\n${selectedText}\n\`\`\`\n`;
                break;
            default:
                return;
        }

        const beforeText = textarea.value.substring(0, start);
        const afterText = textarea.value.substring(end);
        
        textarea.value = beforeText + replacement + afterText;
        textarea.focus();
        textarea.setSelectionRange(start + replacement.length, start + replacement.length);
        
        textarea.dispatchEvent(new Event('input'));
    }

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

            if (inCodeBlock && (/^#{1,6}\s*/.test(trimmedLine) || /^\d+[\.\)]\s*/.test(trimmedLine))) {
                if (braceCount > 0 || parenCount > 0) {
                    let closingStr = '';
                    while (braceCount > 0) {
                        closingStr += '}';
                        braceCount--;
                    }
                    while (parenCount > 0) {
                        closingStr += ')';
                        parenCount--;
                    }
                    closingStr += ';';
                    processedLines.push('    ' + closingStr);
                }
                processedLines.push('');
                processedLines.push('```');
                inCodeBlock = false;
                braceCount = 0;
                parenCount = 0;
                processedLines.push('');
            }

            if (trimmedLine.startsWith('```')) {
                if (inCodeBlock) {
                    if (braceCount > 0 || parenCount > 0) {
                        let closingStr = '';
                        while (braceCount > 0) {
                            closingStr += '}';
                            braceCount--;
                        }
                        while (parenCount > 0) {
                            closingStr += ')';
                            parenCount--;
                        }
                        closingStr += ';';
                        processedLines.push('    ' + closingStr);
                    }
                }
                inCodeBlock = !inCodeBlock;
                braceCount = 0;
                parenCount = 0;
                processedLines.push(line);
                continue;
            }

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

        if (inCodeBlock) {
            if (braceCount > 0 || parenCount > 0) {
                let closingStr = '';
                while (braceCount > 0) {
                    closingStr += '}';
                    braceCount--;
                }
                while (parenCount > 0) {
                    closingStr += ')';
                    parenCount--;
                }
                closingStr += ';';
                processedLines.push('    ' + closingStr);
            }
            processedLines.push('```');
        }

        let result = processedLines.join('\n');
        result = result.replace(/([^\n])\n(#{1,6}\s+|\d+[\.\)]\s+)/g, '$1\n\n$2');

        return result;
    }

    function parseMarkdownToHtml(md) {
        let parts = [];
        let codeBlockRegex = /```([a-z]*)\n([\s\S]*?)```/g;
        let lastIndex = 0;
        let match;

        while ((match = codeBlockRegex.exec(md)) !== null) {
            if (match.index > lastIndex) {
                parts.push({ type: 'text', content: md.substring(lastIndex, match.index) });
            }
            let lang = match[1];
            // Nettoyage strict et immédiat de tout saut de ligne ou espace au début du contenu du bloc
            let codeContent = match[2]
                .replace(/^[\r\n\s]+/, '')
                .replace(/[\r\n\s]+$/, '')
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
            
            let highlighted = codeContent
                .replace(/\/\/.*/g, '<span class="token-comment">$&</span>')
                .replace(/\b(function|const|let|var|return|if|else|switch|case|php|echo|await|new)\b/g, '<span class="token-keyword">$1</span>')
                .replace(/('[^']*'|"[^"]*")/g, '<span class="token-string">$1</span>');
            
            let langLabel = lang ? lang.toUpperCase() : 'CODE';
            let codeHtml = `<div class="code-micro-window"><div class="code-micro-header">${langLabel}</div><div class="code-micro-body"><pre><code>${highlighted}</code></pre></div></div>`;

            parts.push({ type: 'code', content: codeHtml });
            lastIndex = codeBlockRegex.lastIndex;
        }

        if (lastIndex < md.length) {
            parts.push({ type: 'text', content: md.substring(lastIndex) });
        }

        let htmlFinal = '';
        for (let part of parts) {
            if (part.type === 'code') {
                htmlFinal += part.content;
            } else {
                let escapedText = part.content
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;');

                let textHtml = escapedText
                    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
                    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
                    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/`([^`]+)`/g, '<code>$1</code>')
                    .replace(/\n/g, '<br>');
                htmlFinal += textHtml;
            }
        }

        // Nettoyage des <br> ou espaces vides qui se retrouvent injectés juste avant l'ouverture du composant micro-fenêtre
        htmlFinal = htmlFinal.replace(/(<br\s*\/?>\s*)+<div class="code-micro-window">/g, '<div class="code-micro-window">');

        return `<div class="preview-html-container">${htmlFinal}</div>`;
    }

    function processText() {
        const rawText = markdownInput.value;
        const cleanedMarkdown = cleanAndFormatMarkdown(rawText);
        
        if (!isHtmlView) {
            updateOutputDisplay(cleanedMarkdown, false);
        } else {
            updateOutputDisplay(cleanedMarkdown, true);
        }
    }

    function updateOutputDisplay(content, isHtml) {
        let container = document.getElementById('outputCode');
        
        if (isHtml) {
            if (container.tagName.toLowerCase() === 'pre') {
                const div = document.createElement('div');
                div.id = 'outputCode';
                div.className = container.className;
                container.parentNode.replaceChild(div, container);
                container = div;
            }
            container.innerHTML = parseMarkdownToHtml(content);
        } else {
            if (container.tagName.toLowerCase() === 'div') {
                const pre = document.createElement('pre');
                pre.id = 'outputCode';
                pre.className = container.className;
                container.parentNode.replaceChild(pre, container);
                container = pre;
            }
            container.textContent = content;
        }
    }

    if (toggleViewBtn) {
        toggleViewBtn.addEventListener('click', () => {
            isHtmlView = !isHtmlView;
            if (isHtmlView) {
                toggleViewBtn.textContent = '📝 Vue Code MD';
                toggleViewBtn.style.background = '#8957e5';
                processText();
            } else {
                toggleViewBtn.textContent = '👁️ Aperçu HTML';
                toggleViewBtn.style.background = '';
                processText();
            }
        });
    }

    markdownInput.addEventListener('input', processText);
    processText();

    if (printBtn) {
        printBtn.addEventListener('click', () => {
            if (printPreviewContent) {
                printPreviewContent.textContent = cleanAndFormatMarkdown(markdownInput.value);
            }
            if (printModal) {
                printModal.style.display = 'flex';
            }
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            printModal.style.display = 'none';
        });
    }

    if (confirmPrintBtn) {
        confirmPrintBtn.addEventListener('click', () => {
            window.print();
        });
    }

    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            const content = cleanAndFormatMarkdown(markdownInput.value);
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
            const content = cleanAndFormatMarkdown(markdownInput.value);
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