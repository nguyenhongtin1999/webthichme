<?php
session_start();
require_once __DIR__ . '/../admin-auth.php';
ensureAdminAuthenticated();

header('Content-Type: application/json; charset=utf-8');

$action = $_GET['action'] ?? 'list';
$root = dirname(__DIR__);
$file = $root . '/data/categories.json';
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
  $items = read_json($file);
  // sort by name
  usort($items, function($a, $b) {
    return strcmp($a['name'] ?? '', $b['name'] ?? '');
  });
  echo json_encode([ 'categories' => $items ], JSON_UNESCAPED_UNICODE);
  exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?: [];

if ($action === 'upsert') {
  $items = read_json($file);
  $id = $input['id'] ?? null;
  $name = trim($input['name'] ?? '');

  if ($name === '') {
    http_response_code(400);
    echo json_encode([ 'error' => 'Thiếu tên danh mục.' ], JSON_UNESCAPED_UNICODE);
    exit;
  }

  // Check duplicate by name (case-insensitive)
  foreach ($items as $it) {
    if (strcasecmp($it['name'] ?? '', $name) === 0) {
      echo json_encode([ 'ok' => true, 'id' => $it['id'], 'name' => $it['name'] ], JSON_UNESCAPED_UNICODE);
      exit;
    }
  }

  if ($id === null) {
    $maxId = 0;
    foreach ($items as $it) { if (isset($it['id']) && $it['id'] > $maxId) $maxId = $it['id']; }
    $id = $maxId + 1;
    $items[] = [ 'id' => $id, 'name' => $name ];
  } else {
    $updated = false;
    foreach ($items as &$it) {
      if (intval($it['id']) === intval($id)) {
        $it['name'] = $name;
        $updated = true;
        break;
      }
    }
    if (!$updated) {
      http_response_code(404);
      echo json_encode([ 'error' => 'Không tìm thấy danh mục.' ], JSON_UNESCAPED_UNICODE);
      exit;
    }
  }

  if (!write_json_with_backup($file, $items, $backupsDir, 'categories')) {
    http_response_code(500);
    echo json_encode([ 'error' => 'Ghi file thất bại.' ], JSON_UNESCAPED_UNICODE);
    exit;
  }

  echo json_encode([ 'ok' => true, 'id' => $id, 'name' => $name ], JSON_UNESCAPED_UNICODE);
  exit;
}

if ($action === 'delete') {
  $id = $input['id'] ?? null;
  if ($id === null) {
    http_response_code(400);
    echo json_encode([ 'error' => 'Thiếu id.' ], JSON_UNESCAPED_UNICODE);
    exit;
  }
  $items = read_json($file);
  $before = count($items);
  $items = array_values(array_filter($items, function($it) use ($id) {
    return intval($it['id'] ?? -1) !== intval($id);
  }));

  if ($before === count($items)) {
    http_response_code(404);
    echo json_encode([ 'error' => 'Không tìm thấy danh mục.' ], JSON_UNESCAPED_UNICODE);
    exit;
  }

  if (!write_json_with_backup($file, $items, $backupsDir, 'categories')) {
    http_response_code(500);
    echo json_encode([ 'error' => 'Ghi file thất bại.' ], JSON_UNESCAPED_UNICODE);
    exit;
  }

  echo json_encode([ 'ok' => true ], JSON_UNESCAPED_UNICODE);
  exit;
}

http_response_code(400);
echo json_encode([ 'error' => 'Hành động không hợp lệ.' ], JSON_UNESCAPED_UNICODE);
