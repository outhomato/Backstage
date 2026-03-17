<?php
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$token = $data['token'] ?? null;

if (!$token) {
    http_response_code(400);
    echo json_encode(['error' => 'Token saknas']);
    exit;
}

$stmt = $pdo->prepare('INSERT IGNORE INTO app_tokens (at_token) VALUES (?)');
$stmt->execute([$token]);

echo json_encode(['success' => true]);
