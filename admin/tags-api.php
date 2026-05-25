<?php
session_start();
require_once __DIR__ . '/../admin-auth.php';
ensureAdminAuthenticated();

header('Content-Type: application/json; charset=utf-8');

$action = $_GET['action'] ?? 'list';
$root = dirname(__DIR__);
$tagsFile = $root . '/data/product-tags.json';
$productsFile = $root . '/data/products.json';
$backupsDir = $root . '/data/backups';

if (!file_exists($backupsDir)) {
  @mkdir($backupsDir, 0775, true);
}

function read_json($file) {
  if (!file_exists($file)) return [];
  $raw = file_get_contents($file);
  $data = json_decode($raw, true);
  return $data ?: [];
}

function write_json_with_backup($file, $data, $backupsDir, $prefix) {
  if (file_exists($file)) {
    $ts = date('Ymd-His');
    @copy($file, $backupsDir . '/' . $prefix . '-' . $ts . '.json');
  }
  $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
  return file_put_contents($file, $json, LOCK_EX) !== false;
}

if ($action === 'list') {
  $tags = read_json($tagsFile);
  echo json_encode([ 'tags' => $tags ], JSON_UNESCAPED_UNICODE);
  exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?: [];

if ($action === 'upsert') {
  $tags = read_json($tagsFile);
  $id = $input['id'] ?? null;
  $name = trim($input['name'] ?? '');
  $icon = trim($input['icon'] ?? 'tag');
  $color = trim($input['color'] ?? 'bg-gray-100');
  $textColor = trim($input['textColor'] ?? 'text-gray-700');

  if ($name === '') {
    http_response_code(400);
    echo json_encode([ 'error' => 'Thiếu tên thẻ.' ], JSON_UNESCAPED_UNICODE);
    exit;
  }

  if ($id === null || $id === '') {
    // create
    $maxId = 0;
    foreach ($tags as $t) { 
      $tid = is_numeric($t['id'] ?? null) ? intval($t['id']) : 0;
      if ($tid > $maxId) $maxId = $tid;
    }
    $id = $maxId + 1;
    $tags[] = [
      'id' => $id,
      'name' => $name,
      'icon' => $icon,
      'color' => $color,
      'textColor' => $textColor
    ];
  } else {
    // update
    $updated = false;
    foreach ($tags as &$t) {
      if (strval($t['id']) === strval($id)) {
        $t['name'] = $name;
        $t['icon'] = $icon;
        $t['color'] = $color;
        $t['textColor'] = $textColor;
        $updated = true;
        break;
      }
    }
    if (!$updated) {
      http_response_code(404);
      echo json_encode([ 'error' => 'Không tìm thấy thẻ để cập nhật.' ], JSON_UNESCAPED_UNICODE);
      exit;
    }
  }

  if (!write_json_with_backup($tagsFile, $tags, $backupsDir, 'product-tags')) {
    http_response_code(500);
    echo json_encode([ 'error' => 'Ghi file thất bại.' ], JSON_UNESCAPED_UNICODE);
    exit;
  }

  echo json_encode([ 'ok' => true, 'id' => $id ], JSON_UNESCAPED_UNICODE);
  exit;
}

if ($action === 'delete') {
  $id = $input['id'] ?? null;
  if ($id === null || $id === '') {
    http_response_code(400);
    echo json_encode([ 'error' => 'Thiếu id.' ], JSON_UNESCAPED_UNICODE);
    exit;
  }

  // remove tag from tags file
  $tags = read_json($tagsFile);
  $before = count($tags);
  $tags = array_values(array_filter($tags, function($t) use ($id) {
    return strval($t['id'] ?? '') !== strval($id);
  }));

  if ($before === count($tags)) {
    http_response_code(404);
    echo json_encode([ 'error' => 'Không tìm thấy thẻ.' ], JSON_UNESCAPED_UNICODE);
    exit;
  }

  // remove tag reference from all products
  $products = read_json($productsFile);
  foreach ($products as &$p) {
    if (isset($p['tags']) && is_array($p['tags'])) {
      $p['tags'] = array_values(array_filter($p['tags'], function($tid) use ($id) {
        return strval($tid) !== strval($id);
      }));
    }
  }

  $ok1 = write_json_with_backup($tagsFile, $tags, $backupsDir, 'product-tags');
  $ok2 = write_json_with_backup($productsFile, $products, $backupsDir, 'products');

  if (!$ok1 || !$ok2) {
    http_response_code(500);
    echo json_encode([ 'error' => 'Ghi file thất bại.' ], JSON_UNESCAPED_UNICODE);
    exit;
  }

  echo json_encode([ 'ok' => true ], JSON_UNESCAPED_UNICODE);
  exit;
}

http_response_code(400);
echo json_encode([ 'error' => 'Hành động không hợp lệ.' ], JSON_UNESCAPED_UNICODE);
