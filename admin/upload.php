<?php
session_start();
require_once __DIR__ . '/../admin-auth.php';
ensureAdminAuthenticated();

header('Content-Type: application/json; charset=utf-8');

$root = dirname(__DIR__);
$uploadDir = $root . '/uploads';

if (!file_exists($uploadDir)) {
  @mkdir($uploadDir, 0775, true);
}

function error_out($msg, $code = 400) {
  http_response_code($code);
  echo json_encode([ 'error' => $msg ], JSON_UNESCAPED_UNICODE);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  error_out('Phương thức không hợp lệ', 405);
}

$maxSize = 5 * 1024 * 1024; // 5MB
$allowed = ['image/jpeg','image/png','image/gif','image/webp','image/svg+xml'];

function save_file($file, $uploadDir, $allowed, $maxSize) {
  if (!isset($file) || !isset($file['tmp_name'])) return [null, 'Không có tệp'];
  if ($file['error'] !== UPLOAD_ERR_OK) return [null, 'Lỗi tải lên'];
  if ($file['size'] > $maxSize) return [null, 'Kích thước vượt 5MB'];

  $finfo = finfo_open(FILEINFO_MIME_TYPE);
  $mime = finfo_file($finfo, $file['tmp_name']);
  finfo_close($finfo);

  if (!in_array($mime, $allowed, true)) return [null, 'Định dạng không hỗ trợ'];

  $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
  $safeExt = preg_replace('/[^a-zA-Z0-9]/', '', $ext);
  $name = uniqid('img_', true) . ($safeExt ? ('.' . strtolower($safeExt)) : '');
  $target = rtrim($uploadDir, '/\\') . DIRECTORY_SEPARATOR . $name;

  if (!move_uploaded_file($file['tmp_name'], $target)) {
    return [null, 'Không thể lưu tệp'];
  }
  $publicUrl = '/uploads/' . $name;
  return [$publicUrl, null];
}

if (isset($_FILES['file'])) {
  [$url, $err] = save_file($_FILES['file'], $uploadDir, $allowed, $maxSize);
  if ($err) error_out($err, 400);
  echo json_encode([ 'url' => $url ], JSON_UNESCAPED_UNICODE);
  exit;
}

if (isset($_FILES['files'])) {
  $urls = [];
  foreach ($_FILES['files']['tmp_name'] as $i => $tmp) {
    $file = [
      'name' => $_FILES['files']['name'][$i],
      'type' => $_FILES['files']['type'][$i],
      'tmp_name' => $tmp,
      'error' => $_FILES['files']['error'][$i],
      'size' => $_FILES['files']['size'][$i],
    ];
    [$url, $err] = save_file($file, $uploadDir, $allowed, $maxSize);
    if (!$err && $url) $urls[] = $url;
  }
  echo json_encode([ 'urls' => $urls ], JSON_UNESCAPED_UNICODE);
  exit;
}

error_out('Không có tệp tải lên');
