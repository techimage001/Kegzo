<?php
/* Copy this file to:  /home/<your-user>/domains/<your-domain>/kegzo_private/secrets.php
   (the folder NEXT TO public_html, not inside it). Git deploys never touch it.
   Never commit the real file. */
define('SITE_URL', 'https://kegzo.com');          /* your live address, no trailing slash */
define('MAIL_FROM', 'hello@kegzo.com');           /* a real mailbox on this domain (create it in hPanel > Emails) */
define('MAIL_FROM_NAME', 'Kegzo');
define('CONTACT_TO', 'you@example.com');          /* where contact-form messages are sent; never shown on the site */
define('ADMIN_PASSWORD', 'choose-a-long-password'); /* for /api/admin.php */
define('HASH_SALT', 'type-any-long-random-text-here');
/* Recommended: send through Hostinger SMTP (better inbox delivery than PHP mail) */
define('SMTP_HOST', 'smtp.hostinger.com');
define('SMTP_PORT', 465);
define('SMTP_USER', 'info@kegzo.com');
define('SMTP_PASS', 'the-mailbox-password');
/* Optional: define('DB_PATH', __DIR__ . '/kegzo.sqlite'); */
