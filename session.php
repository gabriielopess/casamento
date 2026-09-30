<?php
declare(strict_types=1);
require __DIR__ . '/config.php';
start_wedding_session();
json_response(['ok'=>true,'loggedIn'=>!empty($_SESSION['wedding_admin'])]);
