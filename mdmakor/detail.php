<?php
/* ============================================================
    MDMAKOR — Page de présentation complète du projet
    Utilise le template générique partials/page-detail.php
    ============================================================ */

$slug      = 'mdmakor';
$title     = 'MdMakor';
$subtitle  = 'Nettoyage syntaxique, réparation structurelle et auto-complétion du Markdown';
$statusKey = 'operational';
$technos   = ['PHP', 'JavaScript', 'HTML5', 'CSS3'];
$screenshot = '/images/accueil/capture-mdmakor.png';
$appHref   = 'mdmakor/';
$isStatic  = false;
$basePath  = '../';

$pitch = 'Outil utilitaire spécialisé dans le traitement instantané des fichiers Markdown, automatisant le nettoyage syntaxique, la réparation structurelle des blocs et l\'auto-complétion chirurgicale des accolades et parenthèses.';

$sections = [
    [
        'title'      => 'Correction et Auto-complétion Chirurgicale',
        'body'       => '<p>MdMakor analyse le texte en temps réel pour détecter les anomalies de structure et les blocs de code non fermés, assurant une conformité parfaite avant l\'intégration dans les environnements de développement.</p>
<ul>
<li>Auto-complétion intelligente des accolades et parenthèses pendantes</li>
<li>Rattrapage absolu sur les titres et les ruptures de blocs</li>
<li>Traitement synchrone et instantané dès la saisie</li>
</ul>',
    ],
    [
        'title'      => 'Prévisualisation et Export A4',
        'body'       => '<p>L\'application intègre un module de prévisualisation au format A4 sous forme de modale interactive, permettant un export propre et un rendu papier optimisé sans déclencher les bloqueurs de pop-up.</p>',
    ],
];

$isStatic = defined('FIREBASE_STATIC') && FIREBASE_STATIC;
$basePath = '../';

require $_SERVER['DOCUMENT_ROOT'] . '/partials/page-detail.php';