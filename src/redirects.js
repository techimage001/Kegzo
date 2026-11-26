/* Kegzo redirects: single source of truth (v57).
   tools/build.js turns this into 301 rules in guides/.htaccess and into
   guides-redirects.php, which the Bulk Content Optimiser reads to retire
   the duplicate articles and rewrite internal links that point at them.

   MOVED:  thin original guides (/guides/<slug>.html) -> the stronger
           writer article on the same question.
   RETIRE: writer articles (/guides/<slug>/) that duplicate another
           article -> the article that stays (the "keeper").
   Keepers were chosen by depth, sources and the clearest title. */

const MOVED = {
  'how-long-do-kegels-take-to-work':      '/guides/how-long-does-it-take-kegels/',
  'how-to-find-your-pelvic-floor-muscle': '/guides/how-find-pelvic-floor-muscles-men/',
  'kegel-mistakes':                       '/guides/common-kegel-mistakes-men-make/',
  'kegel-positions':                      '/guides/best-position-kegels-men-7-easy/',
  'tight-pelvic-floor-men':               '/guides/tight-pelvic-floor-exercises-men-relax/',
  'what-is-a-reverse-kegel':              '/guides/reverse-kegels-men/',
};

const CORNERSTONE = '/guides/kegel-exercises-for-men.html';

const RETIRE = {
  /* exact duplicates: same title on two addresses */
  'pelvic-floor-baseball-health':          '/guides/pelvic-floor-baseball/',
  'pelvic-floor-hockey-player-health':     '/guides/pelvic-floor-hockey-players/',
  'pelvic-floor-skateboarding-2':          '/guides/pelvic-floor-skateboarding/',
  'pelvic-floor-volleyball-core':          '/guides/pelvic-floor-volleyball/',
  'pull-ups-pelvic-floor-training':        '/guides/pull-ups-pelvic-floor-safe-form/',
  'how-many-kegels-day-men-safe-2':        '/guides/how-many-kegels-day-men-safe/',

  /* near duplicates: same question, different wording */
  'how-many-kegels-should-man-do':         '/guides/how-many-kegels-day-men-safe/',
  'how-many-sets-kegels-per-day':          '/guides/how-many-kegels-day-men-safe/',
  'what-kegel-rep-definition':             '/guides/kegel-sets-reps-routine-guide/',
  'what-kegel-set-guide':                  '/guides/kegel-sets-reps-routine-guide/',
  'what-kegel-session-exercises':          '/guides/kegel-sets-reps-routine-guide/',
  'how-many-kegels-set-guide':             '/guides/kegel-sets-reps-routine-guide/',
  'do-kegels-need-be-done-daily':          '/guides/how-often-should-men-do-kegels/',
  'kegel-workouts-per-week-ideal-frequency':'/guides/how-often-should-men-do-kegels/',
  'can-do-kegels-lying-down':              '/guides/lying-down-kegel-exercises-how-do/',
  'kegels-lying-back-pelvic-floor':        '/guides/lying-down-kegel-exercises-how-do/',
  'supine-kegel-how-do-it':                '/guides/lying-down-kegel-exercises-how-do/',
  'can-do-kegels-while-sitting':           '/guides/seated-kegel-exercises-technique/',
  'kegels-sitting-chair-how-guide':        '/guides/seated-kegel-exercises-technique/',
  'can-do-kegels-standing-up-guide':       '/guides/standing-kegel-exercises/',
  'can-do-kegels-public-quiet-tips':       '/guides/can-do-kegels-anywhere/',
  'can-do-kegels-too-slowly':              '/guides/quick-flicks-vs-long-holds-kegels/',
  'should-kegels-be-fast-or-slow':         '/guides/quick-flicks-vs-long-holds-kegels/',
  'how-locate-pc-muscle':                  '/guides/how-find-pelvic-floor-muscles-men/',
  'pelvic-floor-activation-basics':        '/guides/how-engage-pelvic-floor/',
  'kegel-breathing-technique-how-do-it':   '/guides/how-breathe-during-kegels/',
  'kegels-inhale-or-exhale-timing-guide':  '/guides/how-breathe-during-kegels/',
  'pelvic-floor-exercises-men-list-7':     CORNERSTONE,
  'male-pelvic-floor-exercises-guide-men': CORNERSTONE,
  'kegel-exercises-men-step-pelvic-floor': CORNERSTONE,
  'kegel-exercises-men-home-simple-guide': CORNERSTONE,
  'easy-kegel-exercises-simple-moves':     '/guides/kegel-exercises-beginners-men-start-guide/',
  'signs-pelvic-floor-getting-stronger':   '/guides/how-know-if-kegels-working-signs/',
  'kegels-feel-like-nothing-happening':    '/guides/cant-feel-kegel-contraction-fix/',
  'why-cant-i-do-kegel-7':                 '/guides/cant-feel-kegel-contraction-fix/',
  'why-men-should-do-kegels-pelvic':       '/guides/what-do-kegels-men-benefits/',
  'do-kegels-help-core-strength-pelvic':   '/guides/pelvic-floor-core-strength-men/',
  'kegels-seniors-pelvic-floor-exercises': '/guides/kegel-exercises-older-men-pelvic-strength/',
  'kegel-technique-older-men-exercises':   '/guides/kegel-exercises-older-men-pelvic-strength/',
  'kegels-office-workers-desk-exercise-guide':'/guides/kegels-desk-kegel-exercises/',
  'kegel-stats-track-progress':            '/guides/kegel-benchmarks-pelvic-floor-progress/',
  'kegel-scorecard-how-guide':             '/guides/kegel-fitness-score/',
  'daily-kegel-checklist-pelvic-floor':    '/guides/kegel-success-checklist-7-steps/',
  'kegel-cheat-sheet-simple-moves':        '/guides/kegel-instructions-beginners/',
};

if (typeof module !== 'undefined') module.exports = { MOVED, RETIRE, CORNERSTONE };
