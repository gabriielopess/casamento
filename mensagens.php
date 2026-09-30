<?php
declare(strict_types=1);
require __DIR__ . '/config.php';
$method=$_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'POST') {
    $raw=file_get_contents('php://input') ?: '';
    if (strlen($raw) > 20000) json_response(['ok'=>false,'error'=>'Mensagem muito grande.'],413);
    $body=json_decode($raw ?: '{}', true);
    if (!is_array($body)) json_response(['ok'=>false,'error'=>'Dados inválidos.'],400);
    $name=trim((string)($body['name'] ?? ''));
    $message=trim((string)($body['message'] ?? ''));
    if ($name==='' && $message==='') json_response(['ok'=>false,'error'=>'Nada para salvar.'],422);
    $name=text_cut($name,80);
    $message=text_cut($message,500);
    $giftName=text_cut(trim((string)($body['giftName'] ?? 'Presente Especial')),160);
    $giftId=isset($body['giftId']) && is_numeric($body['giftId']) ? (int)$body['giftId'] : null;
    $amount=isset($body['amount']) && is_numeric($body['amount']) ? round((float)$body['amount'],2) : 0;
    $id=bin2hex(random_bytes(12));
    $card=[
      'id'=>$id,'name'=>$name,'message'=>$message,'giftId'=>$giftId,'giftName'=>$giftName,
      'amount'=>$amount,'createdAt'=>gmdate('c'),'paymentStatus'=>'não verificado'
    ];
    $list=read_messages();
    array_unshift($list,$card);
    $list=array_slice($list,0,MAX_MESSAGES);
    if (!write_messages($list)) json_response(['ok'=>false,'error'=>'Falha ao salvar.'],500);
    json_response(['ok'=>true,'id'=>$id],201);
}

if ($method === 'GET') {
    require_admin();
    json_response(['ok'=>true,'messages'=>read_messages()]);
}

if ($method === 'DELETE') {
    require_admin();
    $body=json_decode(file_get_contents('php://input') ?: '{}', true) ?: [];
    $id=(string)($body['id'] ?? '');
    if ($id==='') json_response(['ok'=>false,'error'=>'ID ausente.'],400);
    $list=read_messages();
    $new=array_values(array_filter($list, fn($m)=>(string)($m['id']??'') !== $id));
    write_messages($new);
    json_response(['ok'=>true]);
}

json_response(['ok'=>false,'error'=>'Método não permitido.'],405);
