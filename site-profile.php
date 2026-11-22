<?php
/* ============================================================
   SITE PROFILE: Kegzo
   The ONLY file that tells the Bulk Content Optimiser about this
   website. The engine (outside public_html) is identical on every
   site. No passwords or API keys here: those live in bco-data/,
   also outside public_html.
   Header, footer and head assets come from bco-chrome.php, which
   tools/build.js regenerates, so articles always match the site.
   ============================================================ */

$c = require __DIR__ . '/bco-chrome.php';

return [

    /* ---------- Identity ---------- */
    'site_name'   => 'Kegzo',
    'site_url'    => 'https://kegzo.com',
    'brand_html'  => 'Kegzo',
    'author'      => 'Kegzo',
    'schema_logo' => 'https://kegzo.com/assets/icons/icon-512.png',

    /* ---------- Where generated content is written ---------- */
    /* The Guides section IS the blog. The 7 original guides keep their
       own addresses (/guides/<slug>.html); new articles go to
       /guides/<slug>/ and the listing to /guides/index.html. */
    'blog_path'    => '/guides',
    'blog_label'   => 'Guides',
    'page_path'    => '/p',
    'uploads_path' => '/uploads/blog',

    /* ---------- Guides landing copy ---------- */
    'blog_h1'        => 'Kegel guides for men',
    'blog_intro'     => 'Plain-English guides to kegel and pelvic floor training: technique, timelines, mistakes, positions and staying consistent.',
    'blog_seo_title' => 'Kegel Guides for Men: Plain-English Answers | Kegzo',
    'blog_seo_desc'  => 'Plain-English guides to kegel exercises for men: how to find the right muscle, technique, common mistakes, positions and how long training takes.',
    'related_heading'=> 'Keep reading',
    'listing_extra_html' => $c['start_here'],

    /* ---------- Look ---------- */
    'theme_color'     => '#14112A',
    'og_default'      => 'https://kegzo.com/assets/og-coach.png',
    'body_class'      => 'kz-blog',
    'brand_rgb'       => [0x5A, 0x2A, 0xB0],   /* purple glow, top of branded images */
    'brand_rgb_dark'  => [0x14, 0x11, 0x2A],   /* Kegzo background */
    'brand_rgb_gold'  => [0xFF, 0x6B, 0x4A],   /* Kegzo orange accent */
    'brand_rgb_paper' => [0xF4, 0xF1, 0xFF],   /* light text */
    'image_bloom_rgb' => [0xFF, 0x8A, 0x6E],   /* soft orange glow */
    'image_line_rgb'  => [0xFF, 0x6B, 0x4A],   /* orange border and quote mark */
    'image_font'      => '/assets/fonts/outfit-700.ttf',

    'head_extra'  => $c['head'],
    'header_html' => $c['header'],
    'footer_html' => $c['footer'],

    /* ---------- Block at the foot of every article ---------- */
    'cta_html' => '<aside class="post-cta">'
        . '<h2>Train it with your coach</h2>'
        . '<p>Kegzo turns this into a 28-day plan. A talking coach guides every move and counts every second, a few minutes a day, no gym and no equipment.</p>'
        . '<a class="btn hot" href="/app.html">Start Day 1</a></aside>',

    /* ---------- Calls to action: three designs, several wordings each ---------- */
    'cta_image' => '/assets/img/coach-face.webp',
    'cta_early' => [
        ['heading' => 'Prefer to be guided?', 'text' => 'Your coach counts every squeeze and every rest for you.', 'button' => 'Try the coach', 'url' => '/app.html'],
        ['heading' => 'Not sure you are doing it right?', 'text' => 'Follow along with a talking coach, one move at a time.', 'button' => 'Train with me', 'url' => '/app.html'],
        ['heading' => 'Make it a habit, not a chore.', 'text' => 'A few minutes a day, with a coach keeping count.', 'button' => 'Start a session', 'url' => '/app.html'],
        ['heading' => 'Read it, then do it.', 'text' => 'Turn this guide into a guided workout in seconds.', 'button' => 'Open Kegzo', 'url' => '/app.html'],
    ],
    'cta_mid' => [
        ['heading' => 'Your 28-day plan is ready', 'text' => 'Short daily sessions that build up step by step, and you can track your progress as you go.', 'button' => 'See the 28-day plan', 'url' => '/app.html'],
        ['heading' => 'Turn knowing into doing', 'text' => 'Pick today in the plan and your coach takes you through every hold and every rest.', 'button' => 'Pick your day', 'url' => '/app.html'],
        ['heading' => 'Stay consistent without thinking about it', 'text' => 'Kegzo plans each day for you, so all you do is press start.', 'button' => 'Plan my week', 'url' => '/app.html'],
        ['heading' => 'Over 25 moves, one simple plan', 'text' => 'From your first squeeze to longer holds, every exercise is guided.', 'button' => 'Browse the exercises', 'url' => '/exercises/'],
    ],
    'cta_end' => [
        ['heading' => 'Train it with your coach', 'text' => 'Kegzo turns this into a 28-day plan. A talking coach guides every move and counts every second, a few minutes a day, no gym and no equipment.', 'button' => 'Start Day 1', 'url' => '/app.html'],
        ['heading' => 'Ready when you are', 'text' => 'Press start and your coach does the counting. A few minutes today, a little stronger tomorrow.', 'button' => 'Begin today', 'url' => '/app.html'],
        ['heading' => 'Put this guide into practice', 'text' => 'Day 1 takes a few minutes. Your coach shows each move, counts each hold and tracks your progress.', 'button' => 'Do Day 1 now', 'url' => '/app.html'],
    ],

    /* ---------- Sources the writer should prefer (health topic) ---------- */
    'preferred_sources' => ['nhs.uk', 'nhsinform.scot', 'nice.org.uk', 'csp.org.uk (Chartered Society of Physiotherapy)', 'bladderandbowel.org (Bladder & Bowel Community)', 'menshealthforum.org.uk (Men\'s Health Forum)'],

    /* ---------- Starter categories, seeded once ---------- */
    'categories' => [
        ['Kegel Basics',           'kegel-basics',           'What the pelvic floor is, how kegels work and how to get started.'],
        ['Technique & Mistakes',   'technique-and-mistakes', 'Doing kegels properly: finding the right muscle, breathing, and the mistakes to avoid.'],
        ['Exercises & Positions',  'exercises-and-positions','Kegel exercises and positions to train in, from lying down to walking.'],
        ['Progress & Results',     'progress-and-results',   'How long training takes, how to track progress and how to stay consistent.'],
        ['Lifestyle & Confidence', 'lifestyle-and-confidence','Fitting pelvic floor training into everyday life, with more control and confidence.'],
    ],

    /* ---------- Defaults the Settings screen starts from ---------- */
    'country'        => 'UK',
    'word_min'       => 1500,
    'word_max'       => 3000,
    'default_status' => 'draft',
    'authority_mode' => '1',   /* health topic: cite NHS-type sources, standalone paragraphs for AI answers */
    'references_box' => true,
    'pexels_fallback_query' => 'man exercising at home',
    'title_sep' => ' | ',   /* Kegzo pages never use em dashes */
    'indexnow_key' => '60ccb4a970104b1b83b9eb9cc6826746',   /* same key as tools/build.js; file is in the site root */

    'homepage_anchor'  => '28-day kegel training plan for men',
    'default_audience' => 'Men of all ages, worldwide (UK, US, Africa), reading on a phone, wanting simple practical advice',

    'house_rules' => "Kegzo is a fitness training game, not a medical service. Never diagnose, treat or promise to cure anything. Say 'can help' or 'may improve', never promise results.\n"
        . "Never use the word 'free' about Kegzo (it may become paid later). Never mention erections, erectile dysfunction or sexual performance by name. 'More stamina and confidence where it counts' is the furthest you go.\n"
        . "No medical terms or clinical advice. For pain, symptoms or after surgery, tell the reader to speak to a GP or a pelvic floor physiotherapist.\n"
        . "Keep it plain, friendly and practical, like a good coach talking to a mate. Short paragraphs, no jargon.\n"
        . "Where it fits, point readers to the 28-day plan and the talking coach in the Kegzo app.",

    /* ---------- Internal linking ---------- */
    'internal_links' => 'scan',
    'always_link'    => [
        ['url' => '/app.html',       'title' => 'Start the 28-day kegel plan'],
        ['url' => '/exercises/',     'title' => 'All kegel exercises'],
        ['url' => '/guides/how-to-find-your-pelvic-floor-muscle.html', 'title' => 'How to find your pelvic floor muscle'],
    ],
];
