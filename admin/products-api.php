<?php
session_start();
require_once __DIR__ . '/../admin-auth.php';
ensureAdminAuthenticated();

header('Content-Type: application/json; charset=utf-8');

$action = $_GET['action'] ?? 'list';
$root = dirname(__DIR__);
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
  // backup
  if (file_exists($file)) {
    $ts = date('Ymd-His');
    @copy($file, $backupsDir . '/' . $prefix . '-' . $ts . '.json');
  }
  $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
  return file_put_contents($file, $json, LOCK_EX) !== false;
}

if ($action === 'list') {
  $products = read_json($productsFile);
  echo json_encode([ 'products' => $products ], JSON_UNESCAPED_UNICODE);
  exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?: [];

if ($action === 'upsert') {
  $products = read_json($productsFile);

  // sanitize & default
  $id = $input['id'] ?? null;
  $name = trim($input['name'] ?? '');
  $slug = trim($input['slug'] ?? '');
  $category = trim($input['category'] ?? '');
  $image = trim($input['image'] ?? '');
  $images = $input['images'] ?? [];
  $description = trim($input['description'] ?? '');
  $tags = $input['tags'] ?? [];

  if ($name === '' || $category === '' || $image === '') {
    http_response_code(400);
    echo json_encode([ 'error' => 'Thiếu dữ liệu bắt buộc (name, category, image).' ], JSON_UNESCAPED_UNICODE);
    exit;
  }

  if ($slug === '') {
    $slug = strtolower(preg_replace('/[^a-z0-9\-]+/i', '-', iconv('UTF-8','ASCII//TRANSLIT', $name)));
    $slug = trim(preg_replace('/-+/', '-', $slug), '-');
  }

  if ($id === null) {
    // create
    $maxId = 0;
    foreach ($products as $p) { if (isset($p['id']) && $p['id'] > $maxId) $maxId = $p['id']; }
    $id = $maxId + 1;
    $new = [
      'id' => $id,
      'name' => $name,
      'slug' => $slug,
      'category' => $category,
      'image' => $image,
      'images' => array_values(array_filter($images)),
      'description' => $description,
      'tags' => array_values(array_filter($tags))
    ];
    $products[] = $new;
  } else {
    // update
    $updated = false;
    foreach ($products as &$p) {
      if (isset($p['id']) && intval($p['id']) === intval($id)) {
        $p['name'] = $name;
        $p['slug'] = $slug;
        $p['category'] = $category;
        $p['image'] = $image;
        $p['images'] = array_values(array_filter($images));
        $p['description'] = $description;
        $p['tags'] = array_values(array_filter($tags));
        $updated = true;
        break;
      }
    }
    if (!$updated) {
      http_response_code(404);
      echo json_encode([ 'error' => 'Không tìm thấy sản phẩm để cập nhật.' ], JSON_UNESCAPED_UNICODE);
      exit;
    }
  }

  if (!write_json_with_backup($productsFile, $products, $backupsDir, 'products')) {
    http_response_code(500);
    echo json_encode([ 'error' => 'Ghi file thất bại.' ], JSON_UNESCAPED_UNICODE);
    exit;
  }

  echo json_encode([ 'ok' => true, 'id' => $id ], JSON_UNESCAPED_UNICODE);
  exit;
}

if ($action === 'delete') {
  $id = $input['id'] ?? null;
  if ($id === null) {
    http_response_code(400);
    echo json_encode([ 'error' => 'Thiếu id.' ], JSON_UNESCAPED_UNICODE);
    exit;
  }
  $products = read_json($productsFile);
  $before = count($products);
  $products = array_values(array_filter($products, function($p) use ($id) {
    return intval($p['id'] ?? -1) !== intval($id);
  }));

  if ($before === count($products)) {
    http_response_code(404);
    echo json_encode([ 'error' => 'Không tìm thấy sản phẩm.' ], JSON_UNESCAPED_UNICODE);
    exit;
  }

  if (!write_json_with_backup($productsFile, $products, $backupsDir, 'products')) {
    http_response_code(500);
    echo json_encode([ 'error' => 'Ghi file thất bại.' ], JSON_UNESCAPED_UNICODE);
    exit;
  }

  echo json_encode([ 'ok' => true ], JSON_UNESCAPED_UNICODE);
  exit;
}

http_response_code(400);
echo json_encode([ 'error' => 'Hành động không hợp lệ.' ], JSON_UNESCAPED_UNICODE);
