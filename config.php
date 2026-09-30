<?php
declare(strict_types=1);

const ADMIN_USER = 'noivos';
const ADMIN_PASSWORD_HASH = '$2y$12$eEKCs.YFggdrwQ74Bi1dbO0jPcR7p32zlsrjcLjl6mqXBCdd2B2tu';
const STORAGE_FILE = __DIR__ . '/data/mensagens.json';
const MAX_MESSAGES = 5000;

function start_wedding_session(): void {
    if (session_status() === PHP_SESSION_ACTIVE) return;
    $secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
    session_name('tc_noivos');
    session_set_cookie_params([
        'lifetime' => 0, 'path' => '/', 'secure' => $secure,
        'httponly' => true, 'samesite' => 'Lax'
    ]);
    session_start();
}


function text_cut(string $value, int $max): string {
    if (function_exists('mb_substr')) return mb_substr($value, 0, $max, 'UTF-8');
    return substr($value, 0, $max);
}

function json_response(array $data, int $status = 200): never {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function require_admin(): void {
    start_wedding_session();
    if (empty($_SESSION['wedding_admin'])) json_response(['ok'=>false,'error'=>'Não autorizado.'], 401);
}

function read_messages(): array {
    if (!is_file(STORAGE_FILE)) return [];
    $raw = file_get_contents(STORAGE_FILE);
    $decoded = json_decode($raw ?: '[]', true);
    return is_array($decoded) ? $decoded : [];
}

function write_messages(array $messages): bool {
    $dir = dirname(STORAGE_FILE);
    if (!is_dir($dir)) mkdir($dir, 0750, true);
    $json = json_encode($messages, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    return file_put_contents(STORAGE_FILE, $json, LOCK_EX) !== false;
}
