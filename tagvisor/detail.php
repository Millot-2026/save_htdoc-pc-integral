<?php
/* ============================================================
   TAGVISOR — Page de présentation complète du projet
   Utilise le template générique partials/page-detail.php
   ============================================================ */

$slug      = 'tagvisor';
$title     = 'tagvisor';
$subtitle  = 'Outil d\'analyse, d\'étiquetage et de supervision des métadonnées';
$statusKey = 'operational';
$technos   = ['PHP', 'JavaScript', 'JSON'];
$screenshot = '/images/accueil/logo-tagvisor.svg';
$appHref   = 'tagvisor/';
$isStatic  = false;
$basePath  = '../';

$pitch = 'Outil d\'analyse, d\'étiquetage et de supervision des métadonnées pour structurer proprement l\'indexation de l\'ensemble des contenus de l\'atelier.';

$sections = [
    [
        'title'      => 'Supervision des Métadonnées',
        'body'       => '<p>Tagvisor centralise la gestion des étiquettes et des taxonomies. Il permet de parcourir, d\'assigner et de corriger les tags sur l\'ensemble des contenus de l\'atelier pour assurer une cohérence globale.</p>
<ul>
<li>Interface de gestion de mots-clés</li>
<li>Recherche et filtrage multicritères</li>
<li>Analyse des tendances et des usages des tags</li>
</ul>',
    ],
    [
        'title'      => 'Structuration de l\'Information',
        'body'       => '<p>En s\'appuyant sur un étiquetage sémantique rigoureux, l\'outil améliore la découvrabilité des ressources et facilite l\'intégration avec le CMS et les autres modules de l\'atelier nomade.</p>',
    ],
];

$isStatic = defined('FIREBASE_STATIC') && FIREBASE_STATIC;
$basePath = '../';

require $_SERVER['DOCUMENT_ROOT'] . '/partials/page-detail.php';
