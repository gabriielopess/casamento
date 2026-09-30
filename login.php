<?php
declare(strict_types=1);
require __DIR__ . '/config.php';
start_wedding_session();
if ($_SERVER['REQUEST_METHOD'] !== 'POST') json_response(['ok'=>false],405);
$body=json_decode(file_get_contents('php://input') ?: '{}', true) ?: [];
$user=trim((string)($body['user'] ?? ''));
$pass=(string)($body['password'] ?? '');
if (hash_equals(ADMIN_USER,$user) && password_verify($pass,ADMIN_PASSWORD_HASH)) {
  session_regenerate_id(true); $_SESSION['wedding_admin']=true; $_SESSION['wedding_admin_user']=$user;
  json_response(['ok'=>true]);
}
usleep(350000);
json_response(['ok'=>false,'error'=>'Usuário ou senha incorretos.'],401);
