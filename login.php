<?php
session_start();
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    $valid_user = 'Christophe';
    $valid_password = 'MonSuperMotDePasse2026';

    if ($username === $valid_user && $password === $valid_password) {
        $_SESSION['logged_in'] = true;
        header('Location: index.php');
        exit;
    } else {
        $error = 'CODE D’ACCÈS REFUSÉ';
    }
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Chambre Forte — L'Atelier Numérique</title>
    <style>
        :root {
            --steel-dark: #1e2530;
            --steel-base: #2a3442;
            --steel-border: #11151c;
            --accent-glow: #38bdf8;
            --danger: #ef4444;
        }

        html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100vh;
            background-color: #0b0f17;
            color: #f8fafc;
            font-family: system-ui, -apple-system, sans-serif;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .vault-door {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, var(--steel-base) 0%, var(--steel-dark) 100%);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 20px;
            box-sizing: border-box;
            box-shadow: inset 0 0 120px rgba(0,0,0,0.9);
        }

        .vault-panel {
            width: 360px;
            max-width: 90vw;
            background: rgba(15, 23, 42, 0.88);
            border: 2px solid #334155;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 25px 50px rgba(0,0,0,0.85), inset 0 0 15px rgba(0,0,0,0.6);
            box-sizing: border-box;
        }
        
        .vault-header {
            text-align: center;
            border-bottom: 2px dashed rgba(255,255,255,0.15);
            padding-bottom: 15px;
            margin-bottom: 25px;
        }

        .vault-title {
            font-family: Georgia, serif;
            font-size: 1rem;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #cbd5e1;
            margin: 0 0 5px 0;
        }

        .vault-subtitle {
            font-size: 0.65rem;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: var(--accent-glow);
        }

        .vault-handle-container {
            display: flex;
            justify-content: center;
            margin-bottom: 25px;
        }

        .vault-wheel {
            width: 65px; height: 65px;
            border-radius: 50%;
            background: radial-gradient(circle, #475569 0%, #1e293b 70%);
            border: 4px solid #0f172a;
            box-shadow: 0 4px 10px rgba(0,0,0,0.6), inset 0 2px 4px rgba(255,255,255,0.2);
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .vault-wheel::before, .vault-wheel::after {
            content: '';
            position: absolute;
            background: linear-gradient(90deg, #334155, #64748b, #334155);
        }
        .vault-wheel::before { width: 100%; height: 8px; border-radius: 2px; }
        .vault-wheel::after { width: 8px; height: 100%; border-radius: 2px; }

        .vault-wheel-center {
            width: 20px; height: 20px;
            background: radial-gradient(circle, #0f172a 50%, #020617 100%);
            border: 2px solid #475569;
            border-radius: 50%;
            z-index: 2;
            box-shadow: inset 0 2px 3px rgba(0,0,0,0.9);
        }

        .error-box {
            background: rgba(239, 68, 68, 0.15);
            border: 1px solid var(--danger);
            color: #fca5a5;
            padding: 8px;
            font-size: 0.75rem;
            text-align: center;
            text-transform: uppercase;
            font-weight: bold;
            border-radius: 4px;
            margin-bottom: 15px;
            letter-spacing: 1px;
        }

        .form-group {
            margin-bottom: 15px;
        }

        label {
            display: block;
            font-size: 0.7rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #94a3b8;
            margin-bottom: 6px;
            font-weight: bold;
        }

        input[type="text"], input[type="password"] {
            width: 100%;
            background: #0f172a;
            border: 1px solid #334155;
            color: var(--accent-glow);
            padding: 10px 12px;
            box-sizing: border-box;
            border-radius: 4px;
            font-family: monospace;
            font-size: 0.95rem;
            letter-spacing: 1px;
            outline: none;
        }

        .vault-btn {
            width: 100%;
            background: linear-gradient(to bottom, #334155, #1e293b);
            color: #f8fafc;
            border: 1px solid #475569;
            padding: 12px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 2px;
            font-size: 0.75rem;
            cursor: pointer;
            border-radius: 4px;
            margin-top: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
            transition: background 0.2s, border-color 0.2s, color 0.2s;
        }

        .vault-btn:hover {
            background: linear-gradient(to bottom, #0ea5e9, #0284c7);
            border-color: var(--accent-glow);
            color: #0f172a;
        }
    </style>
</head>
<body>

    <div class="vault-door">
        <div class="vault-panel">
            <div class="vault-header">
                <h1 class="vault-title">L'Atelier Numérique</h1>
                <div class="vault-subtitle">Système de Sécurité — Chambre Forte</div>
            </div>

            <div class="vault-handle-container">
                <div class="vault-wheel">
                    <div class="vault-wheel-center"></div>
                </div>
            </div>

            <?php if ($error): ?>
                <div class="error-box"><?php echo $error; ?></div>
            <?php endif; ?>

            <form method="POST">
                <div class="form-group">
                    <label>Identifiant Opérateur</label>
                    <input type="text" name="username" autocomplete="off" autofocus required>
                </div>
                <div class="form-group">
                    <label>Code de Combinaison</label>
                    <input type="password" name="password" required>
                </div>
                <button type="submit" class="vault-btn">Déverrouiller le sas</button>
            </form>
        </div>
    </div>

</body>
</html>