# FitCoach Exercise Image Generation Prompts

สูตรแม่แบบ Prompt สำหรับสร้างภาพประกอบท่าออกกำลังกายสไตล์ FitCoach ด้วย **Gemini / Imagen 3 / Fooocus / Stable Diffusion**

---

## 🎨 Master Template

### Positive Prompt:
```text
RAW photo, ultra-realistic, highly detailed photography of an extremely handsome 25-year-old East Asian male professional fitness trainer with fair skin and sharp attractive facial features, [INSERT_POSE_HERE]. He is completely shirtless, exposing a perfectly sculpted, dense and shredded athletic physique, highly defined muscular chest and tight six-pack abs, wearing only dark gym shorts. Lifelike human skin texture, visible skin pores, charming professional look. Isolated on a completely empty, solid light gray seamless studio background. No furniture, no equipment in background. Soft, professional studio lighting, cinematic rim light. Premium fitness app UI asset style, 8k resolution.
```

### Negative Prompt:
```text
(worst quality, low quality:1.4), gym environment, room, window, furniture, dumbbells, equipment, weights, rack, complex background, 3d render, CGI, plastic skin, smooth glossy skin, doll, artificial, illustration, anime, sketch, painting, text, watermark, bad anatomy, bad hands, deformed, distorted, extra limbs, extra legs, duplicate legs.
```

*(หมายเหตุ: สำหรับท่าที่มีอุปกรณ์ เช่น Kettlebell, Dumbbell, Bench ให้ตัดคำว่า dumbbells, equipment ออกจาก Negative prompt เฉพาะท่านั้นๆ)*

---

## 📋 รายชื่อท่าทั้งหมดสำหรับนำไปเติมใน `[ ]`

### หมวด 1: วอร์มอัพ (Warm-Up & Mobility)

| # | ชื่อไฟล์ภาพ | ท่า (ไทย / อังกฤษ) | ข้อความสำหรับใส่ใน `[ ]` |
|---|---|---|---|
| 1 | `walk.jpg` | เดินอุ่นเครื่อง / เดินฟื้นตัว (`w_walk`, `c_walk`, `hiitW`, `walk`) | `walking with energetic athletic posture on a sleek modern treadmill, chest upright, natural arm swing, side profile view` |
| 2 | `catcow.jpg` | Cat-Cow ยืดกระดูกสันหลัง (`w_cat`) | `on all fours on a dark gray yoga mat in Cat-Cow stretch, hands under shoulders and knees under hips, smoothly flexing and arching his spine, side angle studio view` |
| 3 | `w_thor.jpg` | Thoracic Extension พาดเบาะ (`w_thor`) | `kneeling on a dark gray mat with elbows resting on a flat workout bench, hands together behind neck, gently lowering chest toward the floor to stretch upper back, side angle view` |
| 4 | `w_9090.jpg` | 90/90 Hip Switch หมุนสะโพก (`w_9090`) | `seated on a dark gray yoga mat in a 90/90 hip mobility stretch, front leg bent at 90 degrees and back leg bent at 90 degrees, tall upright torso with hands off the ground, front 3/4 angle view` |
| 5 | `w_hipflex.jpg` | Kneeling Hip Flexor ยืดสะโพก (`w_hipflex`) | `in a half-kneeling hip flexor stretch on a dark gray yoga mat, rear knee on the mat, front knee bent 90 degrees, raising the same-side arm straight overhead while gently tucking pelvis forward, side profile view` |
| 6 | `w_bridge.jpg` | Glute Bridge สะพานก้น (`w_bridge`) | `lying on his back on a dark gray yoga mat in a double-leg glute bridge, knees bent with feet flat on the floor, hips lifted high in a straight line from knees to shoulders, hands resting flat on the mat, side 3/4 view` |
| 7 | `birddog.jpg` | Bird Dog แกนกลางหลัง (`w_bird`) | `on all fours on a dark gray yoga mat in Bird Dog exercise, extending right arm straight forward and left leg straight back parallel to the floor, neutral flat spine, side 3/4 view` |
| 8 | `deadbug.jpg` | Dead Bug ท้องน้อย (`w_deadbug`) | `lying on his back on a dark gray yoga mat in Dead Bug exercise, extending opposite right arm straight overhead and left leg straight forward hovering just above the mat, lower back pressed flat, 3/4 elevated view` |
| 9 | `sideplank.jpg` | Side Plank ข้างลำตัว (`w_side`) | `in a side plank on a dark gray yoga mat, propped up on his left forearm with elbow directly under shoulder, body aligned in a straight diagonal line, right hand on hip, front 3/4 view` |
| 10 | `w_wall.jpg` | Wall Slide สไลด์แขนแนบผนัง (`w_wall`) | `standing with back and head against a light gray wall, raising both arms bent at 90 degrees in a W-to-Y wall slide posture with elbows and back of hands touching the wall, front view` |

---

### หมวด 2: คูลดาวน์ & ยืดเหยียด (Cool-Down & Stretching)

| # | ชื่อไฟล์ภาพ | ท่า (ไทย / อังกฤษ) | ข้อความสำหรับใส่ใน `[ ]` |
|---|---|---|---|
| 11 | `childpose.jpg` | Child's Pose + เอื้อมข้าง (`c_child`) | `in Child's Pose on a dark gray yoga mat, sitting back on heels with torso folded forward and arms stretched out long reaching diagonally to one side, forehead resting near the mat, side elevated view` |
| 12 | `c_fig4.jpg` | Supine Figure-4 ยืดก้น (`c_fig4`) | `lying on his back on a dark gray yoga mat in Supine Figure-4 stretch, crossing right ankle over left knee and gently pulling left thigh toward chest with both hands, side 3/4 view` |
| 13 | `c_ham.jpg` | Hamstring Stretch ใช้ผ้าขนหนู (`c_ham`) | `lying on his back on a dark gray yoga mat, holding a rolled workout towel looped around the ball of his extended right foot, gently pulling the straight leg upward toward ceiling to stretch hamstring, side 3/4 view` |
| 14 | `c_hip.jpg` | Couch Stretch ยืดหน้าขาพาดกำแพง (`c_hip`) | `in a half-kneeling couch stretch position against a clean light gray wall, rear left knee on a dark gray mat with back shin and foot propped vertically against the wall, front right leg bent 90 degrees, tall upright torso, side profile view` |
| 15 | `c_thread.jpg` | Thread the Needle ยืดหลังบน (`c_thread`) | `on all fours on a dark gray yoga mat in Thread the Needle stretch, sliding right arm underneath torso across to the left floor with right shoulder and side of head resting on the mat, side 3/4 view` |
| 16 | `c_door.jpg` | Doorway Chest Stretch ยืดอก (`c_door`) | `standing in a modern doorway, placing one forearm on the door frame and turning away to stretch the chest, side 3/4 view` |
| 17 | `c_twist.jpg` | Supine Spinal Twist บิดเอวนอนราบ (`c_twist`) | `lying flat on his back on a dark gray yoga mat in a supine spinal twist, both arms spread wide in a T-pose at shoulder level with shoulders pinned flat to the floor, head turned to the right, straight left leg flat on the mat while his right knee is bent and crossed smoothly over his hips to the left floor, precisely two distinct legs and two arms, side 3/4 view` |
| 18 | `c_legs.jpg` | Legs Up The Wall พาดขาบนกำแพง (`c_legs`) | `lying flat on his back on a dark gray yoga mat with his hips against a clean light gray studio wall, both legs extended straight vertically upward together resting flat against the wall, arms relaxed by sides with palms facing up, side 3/4 view` |

---

### หมวด 3: เวทเทรนนิ่ง & ออกกำลังกายหลัก (Strength & Cardio)

| # | ชื่อไฟล์ภาพ | ท่า (ไทย / อังกฤษ) | ข้อความสำหรับใส่ใน `[ ]` |
|---|---|---|---|
| 19 | `squat_trainer.jpg` | Goblet Squat สควอทเคทเทิลเบล (`goblet`) | `holding a black kettlebell close against his chest with both hands, performing a deep goblet squat with thighs parallel to the floor, chest proud and spine neutral, front 3/4 view` |
| 20 | `rdl.jpg` | DB Romanian Deadlift เดดลิฟท์ (`rdl`) | `performing a Romanian Deadlift holding a pair of dumbbells in front of thighs, pushing hips back with soft bend in knees and perfectly flat neutral spine, side profile view` |
| 21 | `thrust.jpg` | DB Hip Thrust ฮิปทรัสต์ดัมเบล (`thrust`) | `performing a hip thrust with upper back resting across a flat workout bench, holding a heavy dumbbell across his pelvis, hips fully extended at the top forming a tabletop position, side 3/4 view` |
| 22 | `bmarch.jpg` | Glute Bridge March ยกก้นยกเข่า (`bmarch`) | `lying on his back on a dark gray yoga mat in a high single-leg glute bridge, hips elevated high off the floor, left foot planted firmly while right leg is lifted in a march with knee bent at 90 degrees, both arms resting flat along his sides, side 3/4 view` |
| 23 | `bench.jpg` | DB Bench Press ดันอกบนเบาะ (`bench`) | `lying flat on a workout bench holding a pair of heavy dumbbells at chest level, pressing the dumbbells upward with elbows at 45 degrees, feet flat on the floor, side 3/4 view` |
| 24 | `bss.jpg` | Bulgarian Split Squat ขาเดี่ยว (`bss`) | `performing a Bulgarian split squat, rear left foot resting on a flat workout bench behind him, front right knee bent 90 degrees in a deep lunge, holding a pair of dumbbells at sides with tall torso, side 3/4 view` |
| 25 | `press.jpg` | Seated DB Shoulder Press ดันไหล่ (`press`) | `seated upright on an incline workout bench, pressing a pair of dumbbells straight overhead with palms facing forward, core braced and back supported, front 3/4 view` |
| 26 | `row.jpg` | One-Arm DB Row ดึงหลังข้างเดียว (`row`) | `performing a one-arm dumbbell row, supporting left knee and left hand on a flat workout bench with flat horizontal back, rowing a heavy dumbbell up to hip with right arm, side 3/4 view` |
| 27 | `csrow.jpg` | Chest-Supported Row ดึงหลังคว่ำเบาะ (`csrow`) | `lying chest-down on an incline workout bench angled at 45 degrees, rowing a pair of dumbbells up toward ribs while retracting shoulder blades, side 3/4 view` |
| 28 | `pullover.jpg` | DB Pullover ดัมเบลพูลโอเวอร์ (`pullover`) | `lying on his back on a flat workout bench, holding one heavy dumbbell with both hands extended back over his head in a controlled dumbbell pullover, stretching lats and chest, side angle view` |
| 29 | `curl.jpg` | DB Hammer Curl แฮมเมอร์เคิร์ล (`curl`) | `standing tall and curling a pair of dumbbells with neutral hammer grip (palms facing each other), elbows tucked tight to ribs, muscular biceps flexing, front 3/4 view` |
| 30 | `lat.jpg` | DB Lateral Raise ยกแขนออกข้าง (`lat`) | `standing tall and raising a pair of dumbbells out to the sides at shoulder height with slight bend in elbows, lateral deltoid raise form, front view` |
| 31 | `swing.jpg` | Kettlebell Swing สวิงเคทเทิลเบล (`swing`) | `at the peak apex of a hardstyle kettlebell swing, standing tall with hips locked and glutes squeezed, holding a black kettlebell floating at chest level with straight arms, side 3/4 view` |
| 32 | `thruster.jpg` | DB Thruster สควอทดันเหนือหัว (`thruster`) | `performing a dynamic dumbbell thruster, standing up out of a squat while powerfully pressing a pair of dumbbells straight overhead in one continuous motion, front 3/4 view` |
| 33 | `pushup.jpg` | Push-Up วิดพื้น (`pushup`) | `in the bottom lowered position of a standard push-up on a dark gray yoga mat, chest hovering two inches above the floor, body in a rigid plank line with elbows at 45 degrees, side profile view` |
| 34 | `wheel.jpg` | Ab Wheel Rollout กลิ้งลูกกลิ้ง (`wheel`) | `kneeling on a dark gray yoga mat in an ab wheel rollout, extending arms forward holding an exercise roller wheel with core braced and spine neutral, side profile view` |
| 35 | `plank.jpg` | Plank แพลงก์ศอก (`plank`) | `in a standard forearm plank on a dark gray yoga mat, forearms parallel on the floor with elbows under shoulders, body forming a perfectly straight line from head to heels, side profile view` |
| 36 | `mtn.jpg` | Mountain Climber ซอยเข่า (`mtn`) | `in a high plank position on a dark gray yoga mat performing mountain climbers, driving right knee fast toward chest while left leg stays extended, flat back and braced core, side profile view` |
| 37 | `z2.jpg` | Zone 2 จ็อกกิ้งลู่วิ่ง (`z2`) | `jogging with steady athletic rhythm on a modern treadmill, relaxed shoulders, upright runner posture, side profile view` |
| 38 | `hiitR.jpg` | HIIT Sprint วิ่งสปรินต์ (`hiitR`) | `sprinting powerfully on a modern treadmill with intense athletic drive, high knee drive and strong arm pump, side profile view` |
| 39 | `hula.jpg` | Hula Hoop หมุนฮูล่าฮูป (`hula`) | `standing with athletic posture while spinning a fitness hula hoop smoothly around his waist, hands held up at chest level, front view` |
