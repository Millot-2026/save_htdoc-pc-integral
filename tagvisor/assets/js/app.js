document.addEventListener('DOMContentLoaded', () => {
    const htmlInput = document.getElementById('html-input');
    const charCount = document.getElementById('char-count');
    const btnOpenFolder = document.getElementById('btn-open-folder');
    const btnSaveFile = document.getElementById('btn-save-file');
    const fileExplorer = document.getElementById('file-explorer');
    const fileList = document.getElementById('file-list');
    const folderTitle = document.getElementById('folder-title');
    const activeFileLabel = document.getElementById('active-file-label');

    const serpUrl = document.getElementById('serp-display-url');
    const serpTitle = document.getElementById('serp-display-title');
    const serpDesc = document.getElementById('serp-display-desc');
    const metaMetrics = document.getElementById('meta-metrics');
    const structureMetrics = document.getElementById('structure-metrics');
    const a11yChecklist = document.getElementById('a11y-checklist');
    const globalScore = document.getElementById('global-score');
    const brandLogo = document.querySelector('header h1');

    let currentFileHandle = null;
    let currentFileName = 'page.html';
    const fileScores = new Map();

    // Analyse en temps réel si modification manuelle dans le textarea
    htmlInput.addEventListener('input', () => {
        updateCharCount();
        runAnalysis(htmlInput.value);
    });

    // Ouverture du dossier local via l'API du navigateur
    btnOpenFolder.addEventListener('click', async () => {
        try {
            const dirHandle = await window.showDirectoryPicker();
            folderTitle.textContent = `Projet : ${dirHandle.name}`;
            fileList.innerHTML = '';
            fileExplorer.classList.remove('hidden');
            fileScores.clear();

            await scanDirectory(dirHandle, fileList);
            updateProjectBrandStatus();
        } catch (err) {
            console.log("Sélection de dossier annulée ou non supportée.", err);
        }
    });

    async function scanDirectory(dirHandle, listEl) {
        for await (const entry of dirHandle.values()) {
            if (entry.kind === 'file' && entry.name.endsWith('.html')) {
                const file = await entry.getFile();
                const content = await file.text();
                
                // Pré-calcul du score pour chaque fichier du dossier
                const tempParser = new TagParser(content);
                fileScores.set(entry.name, tempParser.analyze().score);

                const li = document.createElement('li');
                li.textContent = `📄 ${entry.name}`;
                li.addEventListener('click', async () => {
                    currentFileHandle = entry;
                    currentFileName = entry.name;
                    activeFileLabel.textContent = `Fichier : ${entry.name}`;
                    serpUrl.textContent = `./${entry.name}`;
                    const activeFile = await entry.getFile();
                    const activeContent = await activeFile.text();
                    htmlInput.value = activeContent;
                    updateCharCount();
                    runAnalysis(activeContent);
                    btnSaveFile.removeAttribute('disabled');
                });
                listEl.appendChild(li);
            }
        }
    }

    function updateProjectBrandStatus() {
        if (!brandLogo) return;
        if (fileScores.size === 0) {
            brandLogo.textContent = 'Tagvisor';
            return;
        }

        const scores = Array.from(fileScores.values());
        const allPerfect = scores.every(s => s === 100);
        const hasCritical = scores.some(s => s < 80);

        if (allPerfect) {
            brandLogo.innerHTML = 'Tagvis<span style="color: #1abc58; font-weight: bold;">O</span>r';
        } else if (hasCritical) {
            brandLogo.innerHTML = 'Tagvis<span style="color: #ff0000; font-weight: bold;">O</span>r';
        } else {
            brandLogo.innerHTML = 'Tagvis<span style="color: #ff8800; font-weight: bold;">O</span>r';
        }
    }

    // Sauvegarde du fichier actif
    btnSaveFile.addEventListener('click', async () => {
        if (!currentFileHandle) return;
        try {
            const writable = await currentFileHandle.createWritable();
            await writable.write(htmlInput.value);
            await writable.close();
            
            // Mise à jour du score du fichier dans la map globale
            fileScores.set(currentFileName, new TagParser(htmlInput.value).analyze().score);
            updateProjectBrandStatus();
            
            // Petit feedback visuel temporaire
            const originalText = btnSaveFile.textContent;
            btnSaveFile.textContent = 'Enregistré !';
            btnSaveFile.style.backgroundColor = '#166534';
            setTimeout(() => {
                btnSaveFile.textContent = originalText;
                btnSaveFile.style.backgroundColor = '';
            }, 1500);
        } catch (err) {
            console.error("Erreur lors de la sauvegarde :", err);
            alert("Impossible de sauvegarder le fichier.");
        }
    });

    function updateCharCount() {
        const len = htmlInput.value.length;
        charCount.textContent = `${len} caractères`;
    }

    function runAnalysis(code) {
        const parser = new TagParser(code);
        const res = parser.analyze();

        // Met à jour le score du fichier courant dans la map globale en temps réel (si tapé à la main)
        if (currentFileName) {
            fileScores.set(currentFileName, res.score);
            updateProjectBrandStatus();
        }

        serpUrl.textContent = currentFileName ? `./${currentFileName}` : '';
        serpTitle.textContent = res.title.text !== 'Aucun titre défini' ? res.title.text : 'Titre de la page (Title)';
        serpDesc.textContent = res.description.text !== 'Aucune description définie' ? res.description.text : 'La description de votre page apparaîtra ici...';

        globalScore.textContent = `${res.score} / 100`;
        if (res.score >= 80) {
            globalScore.style.backgroundColor = '#dcfce7';
            globalScore.style.color = '#166534';
        } else if (res.score >= 50) {
            globalScore.style.backgroundColor = '#fef9c3';
            globalScore.style.color = '#854d0e';
        } else {
            globalScore.style.backgroundColor = '#fee2e2';
            globalScore.style.color = '#991b1b';
        }

        metaMetrics.innerHTML = `
            <li class="metric-item">
                <span>Balise <strong>&lt;title&gt;</strong></span>
                <span class="status-tag status-${res.title.status}">${res.title.message}</span>
            </li>
            <li class="metric-item">
                <span>Meta <strong>description</strong></span>
                <span class="status-tag status-${res.description.status}">${res.description.message}</span>
            </li>
            <li class="metric-item">
                <span>Meta <strong>viewport</strong></span>
                <span class="status-tag status-${res.viewport.present ? 'success' : 'error'}">${res.viewport.present ? 'Présente' : 'Manquante'}</span>
            </li>
            <li class="metric-item">
                <span>Attribut <strong>lang</strong> (html)</span>
                <span class="status-tag status-${res.lang.present ? 'success' : 'error'}">${res.lang.lang}</span>
            </li>
        `;

        let hContent = '';
        const counts = res.headings.counts;
        for (let i = 1; i <= 6; i++) {
            hContent += `<span class="tag-badge">H${i}: ${counts[`h${i}`]}</span>`;
        }
        structureMetrics.innerHTML = hContent;

        let h1Status = 'success', h1Msg = 'Présent (1 unique)';
        if (counts.h1 === 0) { h1Status = 'error'; h1Msg = 'Manquant (H1 requis)'; }
        else if (counts.h1 > 1) { h1Status = 'warning'; h1Msg = `${counts.h1} H1 trouvés`; }

        let imgStatus = 'success', imgMsg = 'Tous les alt sont présents';
        if (res.images.missingAlt > 0) { imgStatus = 'error'; imgMsg = `${res.images.missingAlt} sans alt`; }

        a11yChecklist.innerHTML = `
            <li class="check-item">
                <span>Présence d'un unique <strong>H1</strong></span>
                <span class="status-tag status-${h1Status}">${h1Msg}</span>
            </li>
            <li class="check-item">
                <span>Attributs <strong>alt</strong> sur les images</span>
                <span class="status-tag status-${imgStatus}">${imgMsg}</span>
            </li>
            <li class="check-item">
                <span>Balise <strong>canonical</strong></span>
                <span class="status-tag status-${res.canonical.present ? 'success' : 'warning'}">${res.canonical.present ? 'Présente' : 'Absente'}</span>
            </li>
        `;
    }
});