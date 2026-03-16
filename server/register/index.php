<?php
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$token = $data['token'] ?? null;

if (!$token) {
    http_response_code(400);
    echo json_encode(['error' => 'Token saknas']);
    exit;
}

$file = __DIR__ . '/tokens.json';
$tokens = file_exists($file) ? json_decode(file_get_contents($file), true) : [];

// Uppdatera befintlig token eller lägg till ny
$found = false;
foreach ($tokens as &$entry) {
    if ($entry['token'] === $token) {
        $entry['updated_at'] = date('c');
        $found = true;
        break;
    }
}

if (!$found) {
    $tokens[] = [
        'token'         => $token,
        'platform'      => $data['platform'] ?? 'unknown',
        'registered_at' => date('c'),
        'updated_at'    => date('c'),
    ];
}

file_put_contents($file, json_encode($tokens, JSON_PRETTY_PRINT));

echo json_encode(['success' => true]);
