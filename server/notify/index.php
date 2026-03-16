<?php
header('Content-Type: application/json');

$title = $data['title'] ?? null;
$body  = $data['body']  ?? null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data  = json_decode(file_get_contents('php://input'), true);
    $title = $data['title'] ?? null;
    $body  = $data['body']  ?? null;
}

if (!$title || !$body) {
    http_response_code(400);
    echo json_encode(['error' => 'title och body krävs']);
    exit;
}

$tokensFile = __DIR__ . '/../register/tokens.json';
if (!file_exists($tokensFile)) {
    echo json_encode(['success' => true, 'sent' => 0, 'message' => 'Inga tokens registrerade']);
    exit;
}

$tokens = json_decode(file_get_contents($tokensFile), true);
if (empty($tokens)) {
    echo json_encode(['success' => true, 'sent' => 0, 'message' => 'Inga tokens registrerade']);
    exit;
}

// Bygg meddelanden (Expo tillåter max 100 per anrop)
$messages = array_map(fn($entry) => [
    'to'    => $entry['token'],
    'title' => $title,
    'body'  => $body,
], $tokens);

$chunks = array_chunk($messages, 100);
$results = [];

foreach ($chunks as $chunk) {
    $ch = curl_init('https://exp.host/--/api/v2/push/send');
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => json_encode($chunk),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER     => [
            'Content-Type: application/json',
            'Accept: application/json',
        ],
    ]);
    $response = curl_exec($ch);
    curl_close($ch);
    $results[] = json_decode($response, true);
}

echo json_encode([
    'success' => true,
    'sent'    => count($messages),
    'results' => $results,
]);
