/* Extra depth for every exercise page (v57).
   who:       who the exercise suits and when to use it
   breathe:   how to breathe through it
   progress:  how to make it harder once it feels easy, and how to scale it down
   mistakes:  [mistake, fix] pairs, in plain words
   House rules: general fitness information only, no medical terms, no promises. */
const EXTRA = {
find: {
 who: 'Everyone starts here, including men who have done kegels before. If you have never trained the pelvic floor, or you are not sure you are squeezing the right muscle, spend your first few sessions on this move alone. It is also worth coming back to whenever a harder exercise starts to feel vague.',
 breathe: 'Breathe in through your nose and let your belly rise. As you breathe out, gently draw up and in. Keep breathing normally while you hold, and let the lift go fully on the next breath in.',
 progress: 'Once you can feel the lift every time without your bum or belly joining in, try it sitting, then standing. When you can find it in any position within a second or two, you are ready for power holds.',
 mistakes: [['Squeezing as hard as possible to make sure it is working.','Use about half effort. A gentle lift is easier to feel and teaches the right muscle, and strength comes later.'],['Not letting go fully before the next lift.','Pause after each one and feel the area soften and settle before you start again.']]
},
power: {
 who: 'Power holds are the main strength exercise in the programme and suit anyone who can already find the muscle with find and lift. They are the backbone of most sessions in weeks one and two.',
 breathe: 'Breathe out as you squeeze, then keep breathing quietly through the hold. If you notice you have stopped breathing, the squeeze is too hard, so ease off a little.',
 progress: 'Add one second to your hold each week, up to ten seconds, keeping the rest as long as the hold. To make it easier, hold for three seconds and do fewer repetitions with good form.',
 mistakes: [['Letting the hold fade but still counting it.','If the squeeze drops before the count ends, let go, rest and start the next one. Quality beats the number.'],['Rushing the rest between holds.','Rest for as long as you held. The muscle needs that time to recover so the next hold is just as strong.']]
},
flicks: {
 who: 'Quick flicks suit everyone once the basic lift feels familiar. They train the fast part of the pelvic floor, the part that reacts quickly when you cough, laugh or lift something.',
 breathe: 'Breathe normally and do not try to match each flick to a breath. Let the flicks run at their own rhythm while your breathing stays slow and easy.',
 progress: 'Build from 10 to 15 flicks per set, then add a third set. To make it easier, slow the rhythm down so each flick is a clean squeeze and a clean release.',
 mistakes: [['Flicks that turn into a tight buzz that never lets go.','Slow down until you can feel a clear release between every squeeze.'],['Using your whole body to make each flick.','Keep your shoulders, belly and legs still. Only the pelvic floor should move.']]
},
drop: {
 who: 'Every man should do reverse kegels, and they matter most for anyone who tends to hold tension, sits for long hours or finds squeezing easier than letting go. They come in every Kegzo session and fill most of the Relax track.',
 breathe: 'The breath does the work here. Breathe in slowly and deeply into your belly and let the pelvic floor soften and drop with it. Breathe out without squeezing and simply let it return to rest.',
 progress: 'Make each breath longer, up to a slow count of five in and five out. Try it sitting and standing as well as lying down. There is no harder version: the aim is a softer, more complete release.',
 mistakes: [['Pushing down hard, as if straining.','The drop is gentle. Think of letting go, not pushing.'],['Squeezing on the way back up.','On the out-breath, do nothing. Let the area return to neutral on its own.']]
},
endure: {
 who: 'Endurance holds suit anyone who has the basics of find and lift and power holds. They train the muscle to keep working for longer at a light level, which is how it works for most of the day.',
 breathe: 'Keep breathing slowly and steadily the whole way through. A good test is whether you could hold a conversation while you hold the squeeze.',
 progress: 'Lengthen each hold by five seconds a week, up to around 30 seconds. To make it easier, use a lighter squeeze or a shorter hold rather than holding your breath to get through it.',
 mistakes: [['Starting too hard and fading halfway.','Begin at about half strength so you can keep the same level to the end.'],['Tensing your shoulders or jaw as the hold goes on.','Do a quick check halfway through and soften anything that is not the pelvic floor.']]
},
elevator: {
 who: 'The elevator suits men who are comfortable with holds and want better control. It arrives in week two and is a good test of how well you can grade the squeeze rather than just switch it on and off.',
 breathe: 'Take a breath at each floor and keep the lift steady while you breathe. On the way down, breathe out slowly as you lower one floor at a time.',
 progress: 'Add a fourth floor, or pause for longer at each one. To make it easier, use just two floors, halfway and full, and lower slowly from each.',
 mistakes: [['Dropping straight from the top floor to the ground.','The slow way down is the most useful part. Lower one floor, pause, then the next.'],['Using your belly to lift higher.','Keep your belly soft. If it hardens, go back down a floor.']]
},
pyramid: {
 who: 'The pyramid suits men who can already hold a squeeze for around six seconds. It tests strength and stamina in one set, and arrives in week two of the programme.',
 breathe: 'Breathe normally through every hold, even the eight-second one at the top. Use the rests to take a slow, easy breath before the next hold.',
 progress: 'Raise the top of the pyramid to ten seconds, then add a second pyramid. To make it easier, build it from 2 to 6 seconds and back.',
 mistakes: [['Letting the long holds fade.','If the squeeze fades, let go and rest. Next time, peak at a shorter hold you can keep strong.'],['Cutting the rests short to finish faster.','Rest for as long as each hold lasted. The rests are part of the exercise.']]
},
wave: {
 who: 'Wave squeezes suit men who can do clean flicks and steady holds on their own. They join the two skills together and arrive in week three.',
 breathe: 'Keep breathing through the quick squeezes and the hold. A useful rhythm is a normal breath out across the two flicks and the start of the hold.',
 progress: 'Add a third quick squeeze before the hold, or hold for longer at the end. To make it easier, do one quick squeeze then the hold.',
 mistakes: [['Blurring the quick squeezes into one long squeeze.','Make each flick a full squeeze and a full release before the next.'],['Skipping the release at the end of each wave.','Let go completely and rest before you start the next wave.']]
},
bridgek: {
 who: 'Bridge plus kegel suits men who can isolate the pelvic floor while lying still and want to keep it isolated while bigger muscles work. It is a good choice for anyone who already does glute bridges in the gym.',
 breathe: 'Breathe out as you lift your hips. At the top, keep breathing normally through the kegel hold, then breathe in as you lower.',
 progress: 'Hold the kegel for longer at the top, or try a single-leg bridge once two legs feel easy. To make it easier, do a smaller bridge and a shorter hold.',
 mistakes: [['Thinking the bridge squeeze is the kegel.','The bridge is your glutes. Once you are up, add the pelvic floor lift as a separate squeeze.'],['Arching the lower back at the top.','Lift only until your body is in a straight line from shoulders to knees.']]
},
walk: {
 who: 'Walking holds suit men in the final stage of the programme who want the pelvic floor to work during everyday movement. They are the last step from the floor into real life.',
 breathe: 'Breathe naturally as you walk. If you notice your breath getting shallow or held, lighten the squeeze until your breathing settles.',
 progress: 'Hold for longer, walk a little faster, or try a gentle slope or stairs. To make it easier, hold at half strength for a shorter count.',
 mistakes: [['Changing how you walk to keep the squeeze.','Walk normally. If your stride changes, the squeeze is too hard.'],['Clenching your glutes with each step.','Keep your bum relaxed and let the lift come from deep between your legs.']]
},
plankk: {
 who: 'Plank lift kegel suits men who are comfortable on all fours and want to train the pelvic floor while the arms and belly are working. It is a good add-on for anyone who already does planks.',
 breathe: 'Breathe out as you lift into the plank. Keep breathing quietly through the kegel hold, then breathe in as you lower your knees.',
 progress: 'Hold the plank and the kegel for longer, or move to a full plank on your toes for the whole set. To make it easier, hover your knees just off the floor.',
 mistakes: [['Letting your hips sag.','Keep a straight line from head to knees or heels, and come down early rather than sag.'],['Squeezing your glutes instead of the pelvic floor.','Keep your bum soft and focus the lift inside.']]
},
hbabyk: {
 who: 'Happy baby release suits anyone who feels tight through the hips or finds it hard to let the pelvic floor go. It is a calm way to finish a session after lots of squeezing.',
 breathe: 'Breathe in slowly and let the pelvic floor soften and widen. Breathe out slowly and let the whole body settle, with no squeeze at all.',
 progress: 'Stay for more breaths, or rock a little further from side to side. If holding your feet is hard, hold your shins or the backs of your thighs instead.',
 mistakes: [['Pulling hard on your feet to go deeper.','Hold lightly. The stretch should feel easy enough to breathe slowly in.'],['Lifting your head and shoulders.','Keep your head down and your neck relaxed on the floor.']]
},
dsquatk: {
 who: 'Deep squat release suits men who can sit into a comfortable deep squat, with or without support. It is useful for anyone who sits a lot and wants to open the hips and let the pelvic floor relax.',
 breathe: 'Breathe in slowly and feel the area low down widen and drop. Breathe out without squeezing, letting your hips stay heavy.',
 progress: 'Stay for more breaths, or rest your hands on the floor and let your hips sink a little lower. To make it easier, sit on a low step or a folded towel under your heels.',
 mistakes: [['Forcing your heels down when it hurts.','Use a book or towel under your heels so the squeeze stays comfortable.'],['Pushing down to feel the drop.','Let the breath do the work. The drop should be soft.']]
},
childk: {
 who: "Child's pose release suits everyone and is especially useful at the end of a session or after a long day. It is a resting position, so it is a good one to do before bed.",
 breathe: 'Breathe slowly into your lower back so you feel it widen. On each breath in, let the pelvic floor soften. On each breath out, let your body sink a little more.',
 progress: 'Stay for longer, or walk your hands to one side and then the other for a gentle side stretch. To make it easier, put a cushion between your heels and hips.',
 mistakes: [['Forcing your hips down onto your heels.','Rest on a cushion if your hips do not reach. Comfort matters more than depth.'],['Rushing through the breaths.','Take each breath slowly. Six calm breaths beat twenty quick ones.']]
},
sidek: {
 who: 'Side-lying release is the gentlest position in Kegzo and suits anyone, at any stage. Use it when other positions feel like too much effort or when you want a quiet session.',
 breathe: 'Breathe in slowly and let the pelvic floor widen and drop. Breathe out slowly and let it return to rest, while your jaw and shoulders stay loose.',
 progress: 'Lengthen each breath, or add a pillow between your knees to let your hips relax further. Try both sides.',
 mistakes: [['Holding tension in your jaw or shoulders.','Let your head be heavy on your arm and your shoulders drop away from your ears.'],['Squeezing on the breath out.','Do nothing on the out-breath. Simply let everything settle.']]
},
knackk: {
 who: 'The Knack suits men who can do a quick, firm squeeze on demand. It is about timing, so it is useful for anyone who wants the pelvic floor to brace at the right moment during a cough, sneeze or laugh.',
 breathe: 'Take a normal breath, squeeze just before you cough, and keep the squeeze on until the cough is over. Then let go and breathe normally.',
 progress: 'Practise before a stronger cough, then try it before standing up or lifting something light. To make it easier, practise the squeeze-and-hold first without the cough.',
 mistakes: [['Coughing first and squeezing after.','The squeeze comes first. Lift, then cough while you keep the lift on.'],['Forcing a big, hard cough.','A small cough is enough to practise the timing.']]
},
liftk: {
 who: 'Lift kegel suits men who are comfortable with standing exercises and want to use the pelvic floor during everyday lifting. Always use something light, such as an empty or nearly empty box.',
 breathe: 'Breathe in before you bend. Squeeze and breathe out as you lift and stand. Keep breathing as you lower the box with the squeeze still on.',
 progress: 'Hold the squeeze for longer, or practise with shopping bags or a laundry basket in daily life. Keep the weight light: the aim is timing, not heavy lifting.',
 mistakes: [['Lifting something heavy to make it harder.','Keep it light. This trains when to squeeze, not how much you can lift.'],['Letting the squeeze go halfway through.','Keep it on until the box is back down, then let go.']]
},
lungek: {
 who: 'Lunge kegel is an advanced bonus move for men who find squats and walking holds easy. It is one of the harder positions for the pelvic floor, so leave it until the earlier exercises feel solid.',
 breathe: 'Breathe in at the top. Squeeze and keep breathing as you step and lower. Breathe out as you push back up to standing.',
 progress: 'Hold at the bottom of the lunge for a second or two, or alternate legs without stopping. To make it easier, do a shorter step and a shallower lunge.',
 mistakes: [['Going too low and losing the squeeze.','Only go as low as you can while the lift stays on.'],['Letting the front knee drift past the toes.','Take a longer step so your knee stays over your ankle.']]
},
stsk: {
 who: 'Stand-up kegel suits everyone, and it is one of the most useful everyday moves in the programme because you get up from a chair many times a day.',
 breathe: 'Breathe in while seated. Squeeze and breathe out as you stand. Keep breathing as you pause, then sit back down slowly.',
 progress: 'Stand up and sit down more slowly, or use a lower chair. To make it easier, use your hands on the armrests for support.',
 mistakes: [['Dropping back into the chair.','Lower yourself slowly with control, keeping the squeeze until you are seated.'],['Letting the squeeze fade as you rise.','Lift first, then stand, and keep the lift on the whole way up.']]
},
squatk: {
 who: 'Squat kegel suits men who are comfortable standing and want the pelvic floor to hold while the legs move. It is a natural next step after stand-up kegel.',
 breathe: 'Breathe in at the top, squeeze, and keep breathing as you bend and stand back up. Let the squeeze go at the top and take an easy breath.',
 progress: 'Squat a little deeper, pause at the bottom, or do more repetitions. To make it easier, hold the back of a chair for balance and keep the squat small.',
 mistakes: [['Squatting too low and losing the lift.','Keep the squat small enough that the squeeze stays on throughout.'],['Holding your breath through the movement.','Keep breathing. If you cannot, lighten the squeeze.']]
},
tiltk: {
 who: 'Pelvic tilt kegel suits men who want to learn to separate the pelvic floor from the muscles around it. It is a gentle lying-down move that works well early in the programme.',
 breathe: 'Breathe out as you tilt your pelvis. Keep breathing normally through the kegel hold, then breathe in as you roll back to neutral.',
 progress: 'Hold the kegel for longer during the tilt, or add a slow lift and lower of the hips. To make it easier, make the tilt smaller and the hold shorter.',
 mistakes: [['Pushing hard through your feet.','The tilt is small and gentle. Your hips stay on the floor.'],['Letting the tilt replace the kegel.','Tilt first, then add the pelvic floor lift as a separate squeeze.']]
},
breathk: {
 who: 'Belly breath release suits everyone and is the simplest way to learn the release side of training. It is a good warm-up before squeezing and a good cool-down after.',
 breathe: 'Breathe in through your nose and feel your belly rise under your hands as the pelvic floor softens. Breathe out slowly through your mouth and let everything settle.',
 progress: 'Make the breaths slower and longer, then try it sitting and standing. Take what you learn here into the reverse kegel.',
 mistakes: [['Breathing into the chest instead of the belly.','Keep your chest still and let your hands rise and fall with your belly.'],['Pushing down to feel the release.','Let the breath do the work. The release is soft and easy.']]
},
openk: {
 who: 'Open knee kegel suits anyone who tends to squeeze the inner thighs during kegels. Opening the knees takes the thighs out of the movement, so it is also handy for practising at a desk.',
 breathe: 'Breathe in as you open your knees. Squeeze and breathe out, then keep breathing normally through the hold. Breathe in as you let go.',
 progress: 'Hold the kegel for longer with your knees open, or add quick flicks in the same position. To make it easier, open your knees only part of the way.',
 mistakes: [['Squeezing the thighs instead of the pelvic floor.','Keep your knees wide and your thighs soft. The lift comes from inside.'],['Slumping back in the chair.','Sit tall on the front half of the seat.']]
},
kneelk: {
 who: 'Kneeling sweep kegel suits men who are comfortable kneeling and want to keep the pelvic floor working by itself while the upper body moves. Use a soft mat or cushion under your knees.',
 breathe: 'Breathe in as you reach forward. Breathe out as you sweep your arms back and lift your chest, then keep breathing through the kegel hold.',
 progress: 'Hold the open position and the kegel for longer, or slow the arm sweep down. To make it easier, make the sweep smaller and keep your hips over your knees.',
 mistakes: [['Leaning back so far that the lower back pinches.','Lift your chest, but keep your hips only gently forward.'],['Squeezing your glutes instead of the pelvic floor.','Keep your bum soft and focus the lift deep inside.']]
},
kneek: {
 who: 'Knee drive kegel suits men who are comfortable in a high plank and want to link the pelvic floor to movement. Done slowly, it trains a squeeze and a full release with every knee drive.',
 breathe: 'Breathe out as your knee comes in and you squeeze. Breathe in as the leg goes back and the squeeze lets go.',
 progress: 'Hold each squeeze for longer, or slow the knee drive down even more. To make it easier, do it with your hands on a bench or a sturdy table.',
 mistakes: [['Turning it into fast cardio.','Move slowly. Each knee drive is one squeeze and one release.'],['Letting your hips bounce up and down.','Keep your body in a straight line and your hips steady.']]
},
};
if (typeof module !== 'undefined') module.exports = { EXTRA };
