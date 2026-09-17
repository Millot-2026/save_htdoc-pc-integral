<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MdMakor — Nettoyeur de Markdown</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <header class="app-header">
        <div class="header-container">
            <h1>MdMakor — Nettoyeur de Markdown</h1>
            <div class="header-actions">
                <button id="printBtn" class="btn btn-info">🖨️ Imprimer A4</button>
                <button id="downloadBtn" class="btn btn-success">📥 Télécharger le fichier .md</button>
            </div>
        </div>
    </header>

    <main class="app-main">
        <!-- Panneau de gauche : Saisie et barre d'outils -->
        <div class="panel">
            <div class="panel-header">
                <h2>Saisie Markdown brut</h2>
            </div>
            
            <div class="toolbar">
                <div class="toolbar-group">
                    <span class="toolbar-label">Mise en forme :</span>
                    <button type="button" class="btn-tool" data-tag="h1">H1</button>
                    <button type="button" class="btn-tool" data-tag="h2">H2</button>
                    <button type="button" class="btn-tool" data-tag="h3">H3</button>
                    <button type="button" class="btn-tool" data-tag="bold">Gras</button>
                    <button type="button" class="btn-tool" data-tag="italic">Italique</button>
                    <button type="button" class="btn-tool" data-tag="code">Code</button>
                </div>
                <div class="toolbar-group">
                    <span class="toolbar-label">Structure & Blocs :</span>
                    <button type="button" class="btn-tool" data-tag="list">Liste</button>
                    <button type="button" class="btn-tool" data-tag="quote">Citation</button>
                    <button type="button" class="btn-tool" data-tag="link">Lien</button>
                    <button type="button" class="btn-tool" data-tag="table">Tableau</button>
                    <button type="button" class="btn-tool" data-tag="php">PHP</button>
                    <button type="button" class="btn-tool" data-tag="js">JS</button>
                </div>
            </div>

            <textarea id="markdownInput" placeholder="Collez votre Markdown brut ici..."></textarea>
        </div>

        <!-- Panneau de droite : Résultat Nettoyé et bouton de switch -->
        <div class="panel">
            <div class="panel-header">
                <h2>Markdown Nettoyé (Prêt pour VS Code)</h2>
                <div class="panel-actions">
                    <button id="toggleViewBtn" class="btn btn-sm btn-secondary">👁️ Aperçu HTML</button>
                    <button id="copyBtn" class="btn btn-sm btn-info">Copier</button>
                </div>
            </div>
            <pre id="outputCode"><code></code></pre>
        </div>
    </main>

    <!-- Modale de Prévisualisation A4 -->
    <div id="printModal" class="modal-overlay" style="display: none;">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Prévisualisation Impression A4</h3>
                <div>
                    <button id="confirmPrintBtn" class="btn btn-primary">🖨️ Imprimer</button>
                    <button id="closeModalBtn" class="btn btn-secondary">✖ Fermer</button>
                </div>
            </div>
            <div class="modal-body">
                <div class="page-a4" id="printPreviewContent"></div>
            </div>
        </div>
    </div>

    <script src="js/script.js"></script>
</body>
</html>