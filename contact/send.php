<?php
declare(strict_types=1);

use Dotenv\Dotenv;
use Symfony\Component\Mailer\Mailer;
use Symfony\Component\Mailer\Transport;
use Symfony\Component\Mime\Email;
use Symfony\Component\Mime\Address;

require __DIR__ . '/../vendor/autoload.php';

Dotenv::createImmutable(__DIR__ . '/..')->safeLoad();

function back(string $query): void {
    header('Location: /contact/?' . $query, true, 303);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    back('error=method');
}

$honeypot = trim((string)($_POST['website'] ?? ''));
if ($honeypot !== '') {
    back('sent=1');
}

$name     = trim((string)($_POST['name']     ?? ''));
$email    = trim((string)($_POST['email']    ?? ''));
$company  = trim((string)($_POST['company']  ?? ''));
$interest = trim((string)($_POST['interest'] ?? ''));
$message  = trim((string)($_POST['message']  ?? ''));

if ($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    back('error=validation');
}

$allowedInterests = ['workflow', 'custom', 'enterprise', 'training', 'other'];
if ($interest !== '' && !in_array($interest, $allowedInterests, true)) {
    back('error=validation');
}

$dsn       = $_ENV['MAILER_DSN']    ?? '';
$mailFrom  = $_ENV['MAIL_FROM']     ?? '';
$mailTo    = $_ENV['MAIL_TO']       ?? '';
$replyTo   = $_ENV['MAIL_REPLY_TO'] ?? '';

if ($dsn === '' || $mailFrom === '' || $mailTo === '') {
    error_log('contact/send.php: missing MAILER_DSN, MAIL_FROM, or MAIL_TO');
    back('error=config');
}

$subject = sprintf('[FlowDaptor] New enquiry from %s', $name);

$plain = <<<TXT
New contact form submission

Name:     {$name}
Email:    {$email}
Company:  {$company}
Interest: {$interest}

Message:
{$message}
TXT;

$html = '<table cellpadding="6" style="font-family:system-ui,Arial,sans-serif;font-size:14px;border-collapse:collapse">'
    . '<tr><td><strong>Name</strong></td><td>'     . htmlspecialchars($name,     ENT_QUOTES, 'UTF-8') . '</td></tr>'
    . '<tr><td><strong>Email</strong></td><td>'    . htmlspecialchars($email,    ENT_QUOTES, 'UTF-8') . '</td></tr>'
    . '<tr><td><strong>Company</strong></td><td>'  . htmlspecialchars($company,  ENT_QUOTES, 'UTF-8') . '</td></tr>'
    . '<tr><td><strong>Interest</strong></td><td>' . htmlspecialchars($interest, ENT_QUOTES, 'UTF-8') . '</td></tr>'
    . '<tr><td valign="top"><strong>Message</strong></td><td><pre style="white-space:pre-wrap;font-family:inherit;margin:0">'
    . htmlspecialchars($message, ENT_QUOTES, 'UTF-8')
    . '</pre></td></tr></table>';

try {
    $transport = Transport::fromDsn($dsn);
    $mailer    = new Mailer($transport);

    $email_msg = (new Email())
        ->from($mailFrom)
        ->to($mailTo)
        ->subject($subject)
        ->text($plain)
        ->html($html)
        ->replyTo($replyTo !== '' ? $replyTo : new Address($email, $name));

    $mailer->send($email_msg);
} catch (\Throwable $e) {
    error_log('contact/send.php: ' . $e->getMessage());
    back('error=send');
}

back('sent=1');
