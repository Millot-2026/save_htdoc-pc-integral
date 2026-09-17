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
                <button id="cleanBtn" class="btn btn-primary">✨ Nettoyer & Formater</button>
                <button id="downloadBtn" class="btn btn-success">📥 Télécharger le fichier .md</button>
            </div>
        </div>
    </header>

    <main class="app-main">
        <div class="panel">
            <div class="panel-header">
                <h2>Saisie Markdown brut</h2>
            </div>
            <textarea id="markdownInput" placeholder="Collez votre Markdown brut ici..."></textarea>
        </div>

        <div class="panel">
            <div class="panel-header">
                <h2>Markdown Nettoyé (Prêt pour VS Code)</h2>
                <button id="copyBtn" class="btn btn-sm btn-info">Copier</button>
            </div>
            <pre id="outputCode"><code></code></pre>
        </div>
    </main>

    <script src="js/script.js"></script>
</body>
</html>