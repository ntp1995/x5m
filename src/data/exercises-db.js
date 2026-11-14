/* FitCoach v3.0 — Exercise Database, Warmups, Workouts & 5-Phase Periodization */
/* ============ EXERCISE DB ============ */
const EX = {
    /* ---------- WARM-UP (เน้นหลัง/คนนั่งนาน) ---------- */
    w_walk: { img: 'walk.jpg', n: 'เดินอุ่นเครื่อง', eq: 'ลู่วิ่ง • ชัน 2%', cue: ['5.5 km/h ชัน 2% ให้เลือดไปเลี้ยงกล้ามเนื้อ', 'แกว่งแขนเต็มช่วง เปิดหัวไหล่', 'เป้าหมาย HR 105-120 bpm'], yt: 'treadmill warm up walk' },
    w_cat: { img: 'catcow.jpg', n: 'Cat-Cow', eq: 'พื้น', cue: ['คุกเข่า 4 จุด มือใต้ไหล่ เข่าใต้สะโพก', 'หายใจออก+โก่งหลังขึ้น → หายใจเข้า+แอ่นลง', 'เคลื่อนไหวทีละข้อกระดูก ช้าๆ 8-10 รอบ', 'ท่านี้ปลุกน้ำหล่อเลี้ยงหมอนรองกระดูก'], yt: 'cat cow stretch spine' },
    w_thor: { img: 'w_thor.jpg', n: 'Thoracic Extension (พาดเก้าอี้)', eq: 'เก้าอี้', cue: ['คุกเข่า วางศอกบนเบาะเก้าอี้ มือประกบกัน', 'ดันหน้าอกลงพื้น ก้นค้างอยู่เหนือส้นเท้า', 'รู้สึกยืดที่หลังส่วนบน ไม่ใช่หลังล่าง', 'คลายท่าค้อมหน้าคอมโดยตรง'], yt: 'thoracic extension chair stretch' },
    w_9090: { img: 'w_9090.jpg', n: '90/90 Hip Switch', eq: 'พื้น', cue: ['นั่งพื้น เข่าหน้า 90° เข่าหลัง 90°', 'สลับข้างโดยหมุนสะโพก อกตั้งตรง', 'ห้ามใช้มือช่วยดัน ใช้แรงสะโพกล้วน', '8 ครั้ง/ข้าง ช้าๆ'], yt: '90 90 hip switch mobility' },
    w_hipflex: { img: 'w_hipflex.jpg', n: 'Kneeling Hip Flexor Stretch', eq: 'พื้น', cue: ['คุกเข่าข้างเดียว เท้าหน้าตั้ง 90°', 'เก็บก้น (posterior tilt) แล้วดันสะโพกไปหน้า', 'ยกแขนข้างเดียวกับเข่าที่คุกขึ้นเหนือหัว', 'นี่คือท่าสำคัญที่สุดสำหรับคนนั่งนาน'], yt: 'kneeling hip flexor stretch', side: 1 },
    w_bridge: { img: 'w_bridge.jpg', n: 'Glute Bridge', eq: 'พื้น', cue: ['นอนหงาย ชันเข่า เท้าห่างเท่าสะโพก', 'ดันสะโพกขึ้นด้วยการ "บีบก้น" ไม่ใช่แอ่นหลัง', 'ค้างบนสุด 2 วินาที ลงช้า 15 ครั้ง', 'ปลุกกล้ามเนื้อก้นที่หลับจากการนั่ง'], yt: 'glute bridge form' },
    w_bird: { img: 'birddog.jpg', n: 'Bird Dog (McGill Big 3)', eq: 'พื้น', cue: ['ท่า 4 จุด เหยียดแขนขวา + ขาซ้ายพร้อมกัน', 'ลำตัวนิ่งสนิท วางแก้วน้ำบนหลังไม่ให้หก', 'ค้าง 6 วินาที/ครั้ง 8 ครั้ง/ข้าง', 'สร้างความมั่นคงหลังล่างก่อนยกน้ำหนัก'], yt: 'bird dog exercise mcgill', side: 1 },
    w_deadbug: { img: 'deadbug.jpg', n: 'Dead Bug (McGill Big 3)', eq: 'พื้น', cue: ['นอนหงาย แขนชี้เพดาน เข่างอ 90°', 'กดหลังล่างแนบพื้นตลอด ห้ามมีช่องว่าง', 'เหยียดแขน+ขาตรงข้ามช้าๆ 8 ครั้ง/ข้าง'], yt: 'dead bug exercise' },
    w_side: { img: 'sideplank.jpg', n: 'Side Plank (McGill Big 3)', eq: 'พื้น', cue: ['ตะแคง ศอกใต้ไหล่ เข่างอ (ระดับง่าย) หรือขาเหยียด', 'ดันสะโพกขึ้นเป็นเส้นตรง บีบก้น', 'ค้าง 20-30 วินาที/ข้าง', 'ฝึกกล้ามเนื้อข้างลำตัวที่พยุงหลัง'], yt: 'side plank form', side: 1 },
    w_wall: { img: 'w_wall.jpg', n: 'Wall Slide + Chin Tuck', eq: 'ผนัง', cue: ['ยืนพิงผนัง หลังล่างแนบ ศอกและหลังมือแตะผนัง', 'เลื่อนแขนขึ้น-ลงโดยไม่ให้หลุดจากผนัง 12 ครั้ง', 'จบด้วยเก็บคาง (ดันท้ายทอยไปหลัง) ค้าง 5 วิ × 8', 'แก้ท่าไหล่ห่อ-คอยื่นจากจอคอม'], yt: 'wall slide scapular exercise' },
    /* ---------- COOL-DOWN ---------- */
    c_walk: { img: 'walk.jpg', n: 'เดินคูลดาวน์', eq: 'ลู่วิ่ง', cue: ['4.5 km/h ไม่มีความชัน', 'หายใจเข้าจมูก 4 จังหวะ ออก 6 จังหวะ', 'ให้ HR ค่อยๆ ลงต่ำกว่า 110 bpm'], yt: 'cool down walk' },
    c_child: { img: 'childpose.jpg', n: "Child's Pose + เอื้อมข้าง", eq: 'พื้น', cue: ['นั่งทับส้นเท้า เหยียดแขนไปหน้าให้สุด', 'หายใจเข้าไปที่หลังส่วนล่างให้รู้สึกขยาย', 'เอื้อมแขนไปด้านซ้าย 20 วิ แล้วขวา 20 วิ'], yt: 'childs pose stretch' },
    c_fig4: { img: 'c_fig4.jpg', n: 'Supine Figure-4 (ยืดสะโพก/ก้น)', eq: 'พื้น', cue: ['นอนหงาย ไขว้ข้อเท้าขวาบนเข่าซ้าย', 'ดึงต้นขาซ้ายเข้าหาอกจนตึงก้นขวา', 'ค้าง 40 วินาที หายใจลึก', 'กล้ามเนื้อก้นตึงคือสาเหตุปวดหลังอันดับต้นๆ'], yt: 'figure 4 piriformis stretch', side: 1 },
    c_ham: { img: 'c_ham.jpg', n: 'Hamstring Stretch (ใช้ผ้าขนหนู)', eq: 'ผ้าขนหนู', cue: ['นอนหงาย คล้องผ้าที่ฝ่าเท้า ยกขาขึ้นตรง', 'เข่างอเล็กน้อยได้ หลังล่างแนบพื้นเสมอ', 'ค้าง 40 วินาที/ข้าง', 'ต้นขาหลังตึงจะดึงเชิงกรานทำให้หลังล่างเจ็บ'], yt: 'supine hamstring stretch strap', side: 1 },
    c_hip: { img: 'c_hip.jpg', n: 'Couch Stretch (สะโพกหน้า)', eq: 'เก้าอี้/ผนัง', cue: ['คุกเข่า วางหลังเท้าพาดเก้าอี้ด้านหลัง', 'เก็บก้นแล้วดันสะโพกไปหน้า อกตั้งตรง', 'ค้าง 45 วินาที/ข้าง หายใจช้า'], yt: 'couch stretch hip flexor', side: 1 },
    c_thread: { img: 'c_thread.jpg', n: 'Thread the Needle', eq: 'พื้น', cue: ['ท่า 4 จุด สอดแขนขวาลอดใต้ลำตัวไปทางซ้าย', 'วางไหล่และแก้มขวาลงพื้น', 'ค้าง 30 วินาที/ข้าง คลายหลังส่วนอก'], yt: 'thread the needle stretch', side: 1 },
    c_door: { img: 'c_door.jpg', n: 'Doorway Chest Stretch', eq: 'กรอบประตู', cue: ['วางแขนบนกรอบประตู ศอก 90° ระดับไหล่', 'ก้าวขาไปหน้า 1 ก้าว เปิดหน้าอก', 'ค้าง 40 วินาที/ข้าง แก้ไหล่ห่อ'], yt: 'doorway pec stretch', side: 1 },
    c_twist: { img: 'c_twist.jpg', n: 'Supine Spinal Twist (เบามาก)', eq: 'พื้น', cue: ['นอนหงาย ดึงเข่าขวาข้ามไปทางซ้ายช้าๆ', 'ไหล่ทั้งสองข้างแนบพื้น หันหน้าไปทางขวา', 'ค้าง 40 วินาที ห้ามฝืนถ้ารู้สึกจี๊ด'], yt: 'supine spinal twist stretch', side: 1 },
    c_legs: { img: 'c_legs.jpg', n: 'Legs Up The Wall + หายใจ 4-7-8', eq: 'ผนัง', cue: ['นอนหงาย ยกขาพาดผนัง ก้นชิดผนัง', 'หายใจเข้า 4 วิ กลั้น 7 วิ ออก 8 วิ', 'ทำ 8-10 รอบ ลดแรงกดหมอนรองกระดูก', 'ช่วยดึง HRV กลับขึ้นเร็วขึ้นหลังฝึกหนัก'], yt: 'legs up the wall pose' },
    /* ---------- MAIN ---------- */
    goblet: { n: 'Goblet Squat', eq: 'ดัมเบลหรือเคทเทิลบอล 4-6 กก.', img: 'squat_trainer.jpg', cue: ['ถือดัมเบลหรือเคทเทิลบอลชิดอก ศอกชี้ลง', 'เท้ากว้างเท่าไหล่ ปลายเท้าเฉียง 15°', 'ย่อลงจนต้นขาขนานพื้น อกเปิด หลังตรง', 'ดันส้นเท้า บีบก้นบนสุด'], yt: 'goblet squat form' },
    rdl: { n: 'DB Romanian Deadlift', eq: 'ดัมเบล 4 กก.×2', img: 'rdl.jpg', cue: ['ดัมเบลชิดต้นขา เข่างอเล็กน้อยค้างไว้', 'ดันสะโพกไปหลัง ไม่ใช่ก้มหลัง', 'หยุดที่กลางหน้าแข้ง หลังตรงเป็นไม้บรรทัด', 'ถ้ารู้สึกตึงหลังล่างแทนต้นขาหลัง = ฟอร์มผิด'], yt: 'dumbbell romanian deadlift form' },
    thrust: { n: 'DB Hip Thrust', eq: 'ดัมเบล + เก้าอี้', img: 'thrust.jpg', cue: ['พิงสะบักบนขอบเก้าอี้ วางดัมเบลบนสะโพก', 'เก็บคาง เก็บซี่โครง ดันขึ้นด้วยการบีบก้น', 'ค้างบนสุด 2 วินาที ห้ามแอ่นหลัง', 'ปลอดภัยต่อหลังล่างที่สุดในบรรดาท่าก้น'], yt: 'dumbbell hip thrust form' },
    bmarch: { img: 'bmarch.jpg', n: 'Glute Bridge March', eq: 'พื้น', cue: ['ยกสะพานก้นค้างไว้', 'ยกเข่าสลับข้างช้าๆ สะโพกไม่บิดตก', '10 ครั้ง/ข้าง ควบคุมทุกจังหวะ'], yt: 'glute bridge march' },
    bench: { n: 'DB Bench Press', eq: 'ดัมเบล + เก้าอี้', img: 'bench.jpg', cue: ['นอนบนเก้าอี้ เท้าแนบพื้น บีบสะบัก', 'ลงช้า 3 วินาที ศอก 45° กับลำตัว', 'ดันขึ้นจนแขนเกือบตรง ไม่ล็อกศอก'], yt: 'dumbbell bench press form' },
    bss: { n: 'Bulgarian Split Squat', eq: 'ดัมเบล + เก้าอี้', img: 'bss.jpg', cue: ['วางหลังเท้าบนเก้าอี้ เท้าหน้าห่าง 60-70 ซม.', 'ย่อลงตรงๆ เข่าหลังเกือบแตะพื้น', 'เอนลำตัวหน้าเล็กน้อยเพื่อเน้นก้น'], yt: 'bulgarian split squat form', side: 1 },
    press: { n: 'DB Shoulder Press (นั่ง)', eq: 'ดัมเบล + เก้าอี้', img: 'press.jpg', cue: ['นั่งพิงพนัก เกร็งแกนกลาง เก็บซี่โครง', 'ดัมเบลระดับหู ดันขึ้นเหนือศีรษะ', 'ห้ามแอ่นหลังเพื่อดันน้ำหนัก'], yt: 'seated dumbbell shoulder press' },
    row: { n: 'One-Arm DB Row', eq: 'ดัมเบล + เก้าอี้', img: 'row.jpg', cue: ['เข่าและมือวางบนเก้าอี้ หลังขนานพื้น', 'ดึงดัมเบลเข้าหาสะโพก ศอกชิดลำตัว', 'บีบสะบักค้าง 1 วินาที'], yt: 'one arm dumbbell row', side: 1 },
    csrow: { img: 'csrow.jpg', n: 'Chest-Supported Row', eq: 'ดัมเบล + เก้าอี้เอียง', cue: ['นอนคว่ำอกบนพนักเก้าอี้เอียง 45°', 'ดึงดัมเบลขึ้นพร้อมบีบสะบัก', 'หลังไม่ต้องรับภาระเลย — เหมาะกับคนปวดหลัง'], yt: 'chest supported dumbbell row' },
    pullover: { img: 'pullover.jpg', n: 'DB Pullover', eq: 'ดัมเบล 1 ตัว + เก้าอี้', cue: ['นอนหงาย ถือดัมเบล 2 มือเหนืออก', 'ลดลงหลังศีรษะจนตึง หลังล่างแนบเบาะ', 'ดึงกลับด้วยกล้ามเนื้อหลัง'], yt: 'dumbbell pullover form' },
    curl: { img: 'curl.jpg', n: 'DB Hammer Curl', eq: 'ดัมเบล 3-4 กก.×2', cue: ['ฝ่ามือหันเข้าหากันตลอด', 'ศอกล็อกข้างลำตัว ไม่แกว่งตัวช่วย', 'ลงช้า 3 วินาที'], yt: 'hammer curl form' },
    lat: { img: 'lat.jpg', n: 'DB Lateral Raise', eq: 'ดัมเบล (เบา 2 กก.)', cue: ['ยกออกข้างถึงระดับไหล่', 'ศอกงอเล็กน้อย ลงช้ามาก 3-4 วินาที'], yt: 'lateral raise form' },
    swing: { img: 'swing.jpg', n: 'Kettlebell Swing', eq: 'ดัมเบลหรือเคทเทิลบอล 4-6 กก.', cue: ['Hip hinge ไม่ใช่ squat — ดีดด้วยสะโพก', 'เคทเทิลบอลลอยถึงระดับอกด้วยแรงสะโพก', 'บีบก้นสุดตอนยืนตรง หลังตรงตลอด', 'ถ้าปวดหลังอยู่ ให้ข้ามไปใช้โหมดหลังปลอดภัย'], yt: 'kettlebell swing hardstyle' },
    thruster: { img: 'thruster.jpg', n: 'DB Thruster', eq: 'ดัมเบล 3-4 กก.×2', cue: ['ดัมเบลระดับไหล่ → ย่อสควอท', 'ยืนขึ้นแล้วดันเหนือหัวเป็นจังหวะเดียว', 'ท่าเผาผลาญสูงสุดของโปรแกรม'], yt: 'dumbbell thruster form' },
    pushup: { img: 'pushup.jpg', n: 'Push-Up', eq: 'ไม่ใช้อุปกรณ์', cue: ['มือกว้างกว่าไหล่เล็กน้อย ลำตัวตรง บีบก้น', 'ลงจนอกเกือบแตะพื้น', 'หนักเกินให้ยันมือบนเก้าอี้'], yt: 'push up proper form' },
    wheel: { img: 'wheel.jpg', n: 'Ab Wheel Rollout', eq: 'ลูกกลิ้งออกกำลัง', cue: ['คุกเข่าบนผ้าขนหนู เกร็งหน้าท้องก่อนออกตัว', 'กลิ้งออกเท่าที่หลังไม่แอ่นเด็ดขาด', 'ดึงกลับด้วยหน้าท้อง ไม่ใช่แขน'], yt: 'ab wheel rollout beginner' },
    plank: { n: 'Plank', eq: 'ไม่ใช้อุปกรณ์', img: 'plank.jpg', cue: ['ศอกใต้ไหล่ ลำตัวเป็นเส้นตรง', 'บีบก้น+หน้าท้อง สะโพกไม่ตก', 'หายใจสม่ำเสมอ ห้ามกลั้น'], yt: 'plank proper form' },
    mtn: { img: 'mtn.jpg', n: 'Mountain Climber', eq: 'ไม่ใช้อุปกรณ์', cue: ['ท่าแพลงก์มือเหยียด สะโพกไม่ยกสูง', 'ดึงเข่าเข้าอกสลับเร็ว หลังไม่แอ่น'], yt: 'mountain climbers form' },
    z2: { img: 'z2.jpg', n: 'วิ่ง/เดินเร็ว Zone 2', eq: 'ลู่วิ่ง', cue: ['คุมชีพจร 130-144 bpm ตลอด', 'เกินให้ลดความเร็ว/ความชันทันที', 'ควรพูดเป็นประโยคได้แต่ร้องเพลงไม่ได้', 'ชัน 2-4% ลดแรงกระแทกเข่าและหลัง'], yt: 'zone 2 training treadmill' },
    hiitR: { img: 'hiitR.jpg', n: 'Interval — เร่ง', eq: 'ลู่วิ่ง', cue: ['เร่งจน HR แตะ 158-172 bpm', 'ก้าวสั้นถี่ ลำตัวตั้ง ไม่ก้มหลัง'], yt: 'treadmill hiit intervals' },
    hiitW: { img: 'walk.jpg', n: 'Interval — เดินฟื้นตัว', eq: 'ลู่วิ่ง', cue: ['เดิน 4.5-5 km/h ให้ HR ลงต่ำกว่า 140', 'เดินต่อเนื่อง อย่าหยุดนิ่ง'], yt: 'active recovery walking' },
    hula: { img: 'hula.jpg', n: 'ฮูล่าฮูป', eq: 'ฮูล่าฮูป', cue: ['ดันสะโพกหน้า-หลัง ไม่ใช่หมุนวน', 'สลับทิศทุก 2 นาที', 'ถ้าปวดหลังเพิ่มขึ้นให้หยุดทันที'], yt: 'hula hoop workout' },
    walk: { img: 'walk.jpg', n: 'เดินฟื้นตัว', eq: 'ลู่วิ่ง/นอกบ้าน', cue: ['ชีพจร 100-120 bpm', 'เพิ่ม NEAT โดยไม่กระทบการฟื้นตัว'], yt: 'recovery walk' },
    /* ---------- OUTDOOR PARK ACTIVE RECOVERY & MOBILITY ---------- */
    w_out_walk: { img: 'w_out_walk.jpg', n: 'เดินปรับจังหวะในสวน (Brisk Walk)', eq: 'ทางเดินสวน', cue: ['ก้าวสั้นๆ ช้าๆ กวัดแกว่งแขนผ่อนคลาย', 'สูดหายใจลึกยาว ปรับอุณหภูมิร่างกาย', 'กระจายน้ำไขข้อ (Synovial Fluid) ในหมอนรองกระดูกและข้อต่อ'], yt: 'brisk walk warmup' },
    w_out_hinge: { img: 'w_out_hinge.jpg', n: 'Standing Hip Hinge (ท่ายืนดันสะโพก)', eq: 'ไม่ต้องใช้อุปกรณ์', cue: ['ยืนขากว้างเท่าสะโพก มือแตะหน้าขา', 'แขม่วพุง ล็อกหลังตรง ดันก้นไปข้างหลัง 45°', 'ห้ามโก่งหลัง รู้สึกตึงก้นและต้นขาหลัง', 'เกร็งก้นดันตัวกลับมายืนตรง 10-12 ครั้ง ปลุกก้นโดยไม่กดทับหลัง'], yt: 'standing hip hinge warmup' },
    w_out_march: { img: 'w_out_march.jpg', n: 'Standing March with Core Brace', eq: 'ไม่ต้องใช้อุปกรณ์', cue: ['ยืนตัวตรง แขม่วหน้าท้องเก็บซี่โครง', 'ยกเข่าขึ้นช้าๆ ทีละข้างระดับสะโพก ค้าง 1 วินาที', 'ลำตัวตรงไม่เอียง ล็อกแกนกลางแนวดิ่ง', 'กระตุ้นกล้ามเนื้อหน้าท้องเหมือนเดินจริงโดยไม่ต้องนอนเสื่อ'], yt: 'standing high knee march core' },
    w_out_lunge: { img: 'w_out_lunge.jpg', side: 1, n: 'Standing Staggered Lunge Stretch', eq: 'ไม่ต้องใช้อุปกรณ์', cue: ['ก้าวขาไปข้างหลัง ยืนบนปลายเท้า ย่อเข่าหน้าเล็กน้อย', 'เกร็งก้นข้างหลัง แล้วดันสะโพกไปข้างหน้าเบาๆ', 'ยืดตัวตรง ไม่แอ่นหลังล่าง', 'คลายกล้ามเนื้อหน้างอสะโพก (Hip Flexor) โดยเข่าไม่แตะพื้นดิน'], yt: 'standing hip flexor lunge stretch' },
    w_out_twist: { img: 'w_out_twist.jpg', n: 'Standing Thoracic Twist (หมุนอก)', eq: 'ไม่ต้องใช้อุปกรณ์', cue: ['ยืนกางขา มือประสานที่อกหรือแตะไหล่ตรงข้าม', 'ล็อกสะโพกและเชิงกรานให้นิ่ง หมุนเฉพาะช่วงอกซ้าย-ขวา', 'หมุนช้าๆ นุ่มนวล ไม่สะบัดเอว', 'เปิดการเคลื่อนไหวของกระดูกสันหลังส่วนอก หายใจโล่งขึ้น'], yt: 'standing thoracic rotation' },
    c_out_walk: { img: 'c_out_walk.jpg', n: 'เดินชะลอความเร็ว (Deceleration Walk)', eq: 'ทางเดินสวน', cue: ['ลดความเร็วลงเรื่อยๆ ก้าวสบายๆ', 'หายใจเข้า 4 วินาที ออกยาว 6 วินาที', 'ให้ชีพจรค่อยๆ ลงต่ำกว่า 100 bpm อย่างปลอดภัย'], yt: 'cool down walk' },
    c_out_fig4: { img: 'c_out_fig4.jpg', side: 1, n: 'Seated Park Bench Figure-4 (ยืดสลักเพชร)', eq: 'ม้านั่งสวนสาธารณะ', cue: ['นั่งหลังตรงบนม้านั่ง ยกข้อเท้าพาดบนเข่าตรงข้าม', 'ยืดอก โน้มตัวตรงจากข้อพับสะโพกไปข้างหน้า (ห้ามงอหลัง)', 'รู้สึกตึงลึกๆ ที่ก้น/สะโพก ค้าง 30 วินาที/ข้าง', 'คลายกล้ามเนื้อ Piriformis ป้องกันปวดสะโพกร้าวลงขา'], yt: 'seated figure 4 stretch bench' },
    c_out_ham: { img: 'c_out_ham.jpg', side: 1, n: 'Bench / Curb Hamstring Stretch', eq: 'ม้านั่งเตี้ย / ขอบทางเดิน', cue: ['วางส้นเท้าข้างหนึ่งบนขอบม้านั่งเตี้ยหรือขอบทาง ปลายเท้าชี้ขึ้น', 'งอเข่าขาหลักเล็กน้อย ดันก้นไปข้างหลัง โน้มตัวตรงไปข้างหน้าเบาๆ', 'รู้สึกตึงที่ต้นขาหลัง ค้าง 20 วินาที/ข้าง', 'ยืดแฮมสตริงโดยแนวกระดูกสันหลังตรง ปลอดภัยต่อหมอนรองกระดูก'], yt: 'standing hamstring stretch bench' },
    c_out_calf: { img: 'c_out_calf.jpg', side: 1, n: 'Tree / Post Calf Stretch (ยันต้นไม้ยืดน่อง)', eq: 'ต้นไม้ / เสา', cue: ['เอามือยันต้นไม้หรือเสา ก้าวขาข้างหนึ่งไปข้างหลัง', 'กดส้นเท้าแนบพื้น ปลายเท้าชี้ตรงไปข้างหน้า', 'โน้มตัวไปข้างหน้าเล็กน้อยจนรู้สึกตึงน่อง ค้าง 30 วินาที/ข้าง', 'คลายกล้ามเนื้อน่องจากการเดินบนพื้นแข็ง ป้องกันรองช้ำ'], yt: 'standing calf stretch tree' },
    c_out_chest: { img: 'c_out_chest.jpg', n: 'Tree / Post Chest & Lat Opener', eq: 'ต้นไม้ / เสา', cue: ['มือเกาะต้นไม้หรือเสาระดับอก ถอยเท้าไปข้างหลัง ดันสะโพกไปหลัง', 'ก้มศีรษะลงเบาๆ ให้ลำตัวขนานพื้น ยืดแผงอก ปีก และหลังส่วนบน', 'หายใจเข้า-ออกช้าๆ ลึกๆ ค้าง 30 วินาที', 'คลายกล้ามเนื้อหลังส่วนบนและสะบักจากการเดินแกว่งแขน'], yt: 'tree chest lat stretch' }
};

/* ============ WARM-UP / COOL-DOWN BLOCKS ============ */
const WARM_FULL = [
    { e: 'w_walk', sets: 1, type: 'time', t: 180, after: 10 },
    { e: 'w_cat', sets: 1, type: 'time', t: 60, after: 10 },
    { e: 'w_thor', sets: 1, type: 'time', t: 60, after: 10 },
    { e: 'w_9090', sets: 1, type: 'time', t: 60, after: 10 },
    { e: 'w_hipflex', sets: 1, type: 'time', t: 40, after: 10 },
    { e: 'w_bridge', sets: 1, type: 'reps', r: '15 ครั้ง', after: 10 },
    { e: 'w_bird', sets: 1, type: 'reps', r: '8 ครั้ง/ข้าง', after: 10 },
    { e: 'w_deadbug', sets: 1, type: 'reps', r: '8 ครั้ง/ข้าง', after: 10 },
    { e: 'w_side', sets: 1, type: 'time', t: 25, after: 10 },
    { e: 'w_wall', sets: 1, type: 'reps', r: '12 + เก็บคาง 8', after: 45 }
];
const WARM_LITE = [
    { e: 'w_walk', sets: 1, type: 'time', t: 240, after: 10 },
    { e: 'w_cat', sets: 1, type: 'time', t: 45, after: 10 },
    { e: 'w_hipflex', sets: 1, type: 'time', t: 35, after: 10 },
    { e: 'w_bridge', sets: 1, type: 'reps', r: '15 ครั้ง', after: 10 },
    { e: 'w_deadbug', sets: 1, type: 'reps', r: '8 ครั้ง/ข้าง', after: 30 }
];
const COOL = [
    { e: 'c_walk', sets: 1, type: 'time', t: 180, after: 10 },
    { e: 'c_child', sets: 1, type: 'time', t: 60, after: 10 },
    { e: 'c_fig4', sets: 1, type: 'time', t: 40, after: 10 },
    { e: 'c_ham', sets: 1, type: 'time', t: 40, after: 10 },
    { e: 'c_hip', sets: 1, type: 'time', t: 45, after: 10 },
    { e: 'c_thread', sets: 1, type: 'time', t: 30, after: 10 },
    { e: 'c_door', sets: 1, type: 'time', t: 40, after: 10 },
    { e: 'c_twist', sets: 1, type: 'time', t: 40, after: 10 },
    { e: 'c_legs', sets: 1, type: 'time', t: 180, after: 0 }
];
const WARM_OUTDOOR = [
    { e: 'w_out_walk', sets: 1, type: 'time', t: 120, after: 10 },
    { e: 'w_out_hinge', sets: 1, type: 'reps', r: '12 ครั้ง', after: 10 },
    { e: 'w_out_march', sets: 1, type: 'reps', r: '10 ครั้ง/ข้าง', after: 10 },
    { e: 'w_out_lunge', sets: 1, type: 'time', t: 20, after: 10 },
    { e: 'w_out_twist', sets: 1, type: 'reps', r: '10 ครั้ง', after: 20 }
];
const COOL_OUTDOOR = [
    { e: 'c_out_walk', sets: 1, type: 'time', t: 90, after: 10 },
    { e: 'c_out_fig4', sets: 1, type: 'time', t: 30, after: 10 },
    { e: 'c_out_ham', sets: 1, type: 'time', t: 20, after: 10 },
    { e: 'c_out_calf', sets: 1, type: 'time', t: 30, after: 10 },
    { e: 'c_out_chest', sets: 1, type: 'time', t: 30, after: 0 }
];
/* โหมดหลังปลอดภัย: ท่าเดิม -> ท่าแทน */
const SAFE = { rdl: 'thrust', swing: 'bmarch', wheel: 'w_deadbug', row: 'csrow' };

/* ============ WORKOUTS (ส่วนหลักเท่านั้น) ============ */
                        const W = {
    A: {
        n: 'Strength A — ขา + ดัน', ic: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--acc)"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>', warm: 'full', kcal: 400, items: [
            { e: 'goblet', sets: 4, type: 'reps', r: '12 ครั้ง', rest: 60, after: 90, log: 1 },
            { e: 'rdl', sets: 4, type: 'reps', r: '12 ครั้ง', rest: 60, after: 90, log: 1 },
            { e: 'bench', sets: 3, type: 'reps', r: '12 ครั้ง', rest: 60, after: 90, log: 1 },
            { e: 'bss', sets: 3, type: 'reps', r: '10 ครั้ง/ข้าง', rest: 60, after: 90, log: 1 },
            { e: 'press', sets: 3, type: 'reps', r: '12 ครั้ง', rest: 60, after: 75, log: 1 },
            { e: 'wheel', sets: 3, type: 'reps', r: '8 ครั้ง', rest: 45, after: 60 },
            { e: 'plank', sets: 3, type: 'time', t: 40, rest: 40, after: 60 },
            { e: 'z2', sets: 1, type: 'time', t: 900, after: 30 }]
    },
    B: {
        n: 'Strength B — หลัง + ดึง', ic: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--acc)"><path d="M14.4 14.4l-4.8-4.8"/><path d="M6.5 10.8l-4.3 4.3a2 2 0 0 0 2.8 2.8l4.3-4.3"/><path d="M17.5 13.2l4.3-4.3a2 2 0 0 0-2.8-2.8l-4.3 4.3"/><path d="M2.2 16.2l3 3"/><path d="M18.8 4.8l-3 3"/><path d="M7 9l8 8"/><path d="M9 7l8 8"/></svg>', warm: 'full', kcal: 380, items: [
            { e: 'row', sets: 4, type: 'reps', r: '12 ครั้ง/ข้าง', rest: 60, after: 90, log: 1 },
            { e: 'csrow', sets: 3, type: 'reps', r: '12 ครั้ง', rest: 60, after: 90, log: 1 },
            { e: 'pullover', sets: 3, type: 'reps', r: '12 ครั้ง', rest: 60, after: 75, log: 1 },
            { e: 'curl', sets: 3, type: 'reps', r: '12 ครั้ง', rest: 45, after: 60, log: 1 },
            { e: 'lat', sets: 3, type: 'reps', r: '15 ครั้ง', rest: 45, after: 75, log: 1 },
            { e: 'swing', sets: 4, type: 'time', t: 30, rest: 45, after: 60 },
            { e: 'w_deadbug', sets: 3, type: 'reps', r: '10 ครั้ง/ข้าง', rest: 40, after: 60 },
            { e: 'hula', sets: 2, type: 'time', t: 300, rest: 60, after: 30 }]
    },
    C: {
        n: 'Metabolic Circuit', ic: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:#f24e1e"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>', warm: 'full', kcal: 440, items: [
            { e: 'swing', sets: 4, type: 'time', t: 40, rest: 20, after: 20 },
            { e: 'goblet', sets: 4, type: 'time', t: 40, rest: 20, after: 20 },
            { e: 'pushup', sets: 4, type: 'time', t: 40, rest: 20, after: 20 },
            { e: 'thruster', sets: 4, type: 'time', t: 40, rest: 20, after: 20 },
            { e: 'mtn', sets: 4, type: 'time', t: 40, rest: 90, after: 90 },
            { e: 'plank', sets: 3, type: 'time', t: 45, rest: 40, after: 45 }]
    },
    Z: {
        n: 'Cardio Zone 2', ic: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--ok)"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>', warm: 'lite', kcal: 420, items: [
            { e: 'z2', sets: 1, type: 'time', t: 2100, after: 60 },
            { e: 'w_side', sets: 3, type: 'time', t: 30, rest: 30, after: 45 },
            { e: 'plank', sets: 3, type: 'time', t: 45, rest: 40, after: 45 }]
    },
    H: { n: 'HIIT Intervals', ic: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:#f24e1e"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>', warm: 'lite', kcal: 400, items: (() => { const a = []; for (let i = 0; i < 8; i++) { a.push({ e: 'hiitR', sets: 1, type: 'time', t: 60, after: 0 }); a.push({ e: 'hiitW', sets: 1, type: 'time', t: 90, after: i === 7 ? 30 : 0 }) } return a })() },
    M: {
        n: 'Morning Cardio — เดินลู่ตอนเช้า', ic: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:#f59e0b"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="4.22" x2="19.78" y2="5.64"/></svg>', warm: 'lite', kcal: 180, items: [
            { e: 'z2', sets: 1, type: 'time', t: 1500, after: 30 }]
    },
    R: {
        n: 'Active Recovery', ic: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--vio)"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/></svg>', warm: 'lite', kcal: 200, items: [
            { e: 'walk', sets: 1, type: 'time', t: 1500, after: 60 },
            { e: 'hula', sets: 2, type: 'time', t: 300, rest: 60, after: 60 }]
    }
};
/* ============ PERIODIZED WEIGHT PROGRESSION (5 PHASES) ============ */
const PHASE_WEIGHTS = {
    // Phase 1 (เริ่มต้นคุมฟอร์มด้วยดัมเบล 4 และ 6 กก.), Phase 2 (ขยับใช้ 6 กก. และเคทเทิลเบล 8 กก.), Phase 3-5 (เพิ่มเซ็ต & Tempo)
    goblet:   [4,   6,   8,   8,   6],   // ดัมเบลเดี่ยว 4-6 กก. (Phase 3 ใช้เคทเทิลเบล 8 กก.)
    rdl:      [4,   6,   6,   6,   4],   // ดัมเบลคู่ 4 กก. (Phase 2 ขยับเป็น 6 กก.)
    bench:    [4,   6,   6,   6,   6],   // ดัมเบลคู่ 4 กก. (Phase 2 ขยับเป็น 6 กก.)
    bss:      [4,   4,   6,   6,   4],   // ดัมเบลคู่ 4 กก.
    press:    [4,   4,   6,   6,   4],   // ดัมเบลคู่ 4 กก. (เซฟหลังและไหล่)
    row:      [6,   6,   6,   8,   6],   // ดัมเบลเดี่ยว 6 กก. (ท่าดึงมีแรงมากกว่า)
    csrow:    [4,   6,   6,   6,   4],   // ดัมเบลคู่ 4 กก. (Phase 2 ขยับเป็น 6 กก.)
    pullover: [6,   6,   6,   8,   6],   // ดัมเบลเดี่ยว 6 กก.
    curl:     [4,   4,   6,   6,   4],   // ดัมเบลคู่ 4 กก.
    lat:      [4,   4,   4,   4,   4],   // ดัมเบลคู่ 4 กก. (คุมจังหวะลงช้าๆ)
    swing:    [4,   6,   8,   8,   6],   // ดัมเบลเดี่ยว 4-6 กก. (Phase 3 ใช้เคทเทิลเบล 8 กก.)
    thruster: [4,   4,   6,   6,   4],   // ดัมเบลคู่ 4 กก.
    thrust:   [6,   6,   8,   8,   6]    // ดัมเบลเดี่ยว 6 กก. (Phase 3 ใช้เคทเทิลเบล 8 กก.)
};

function getExerciseWeightInfo(k) {
    const e = EX[k];
    if (!e) return { kg: null, totalKg: null, isPair: false, label: '', isCustom: false, baseKg: null };
    
    const pIdx = phIdx();
    const baseKg = (PHASE_WEIGHTS[k] && PHASE_WEIGHTS[k][pIdx] != null) ? PHASE_WEIGHTS[k][pIdx] : (defaultWeightOf(k) || null);
    const userKg = (D.cfg && D.cfg.weights && D.cfg.weights[k] != null) ? D.cfg.weights[k] : null;
    const activeKg = userKg != null ? userKg : baseKg;
    
    if (activeKg == null) {
        return { kg: null, totalKg: null, isPair: false, label: e.eq || 'ไม่ต้องใช้อุปกรณ์', isCustom: false, baseKg: null };
    }

    const origEq = e.eq || '';
    const isPair = origEq.includes('×2') || origEq.includes('x2') || origEq.includes('ดัมเบล +') ||
                   ['bench', 'rdl', 'press', 'bss', 'curl', 'lat', 'thruster', 'csrow'].includes(k);
    const isKB = origEq.includes('เคทเทิลบอล') || ['goblet', 'swing'].includes(k);
    
    let label = '';
    if (isKB) {
        label = `เคทเทิลบอล ${activeKg} กก.`;
    } else if (isPair) {
        label = `ดัมเบล ${activeKg} กก.×2 (รวม ${activeKg * 2} กก.)`;
    } else {
        label = `ดัมเบล ${activeKg} กก.`;
    }
    
    return {
        kg: activeKg,
        totalKg: isPair ? activeKg * 2 : activeKg,
        isPair,
        label,
        baseKg,
        isCustom: userKg != null && userKg !== baseKg
    };
}

const SCHED = ['R', 'A', 'Z', 'B', 'R', 'C', 'H'];
const DN = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];

function totalWeeks() { return D.cfg.courseWeeks || 20; }
function wkNo() { return Math.min(totalWeeks(), Math.max(1, Math.floor((new Date(iso() + 'T00:00:00+07:00') - new Date((D.start || iso()) + 'T00:00:00+07:00')) / 864e5 / 7) + 1)); }

function getPhases() {
    const tw = totalWeeks();
    const startW = D.checks[0]?.w || 77.3;
    const targetW = D.cfg.targetWeight || 68.0;
    const lossTgt = Math.max(0.5, startW - targetW);
    const perPhase = (lossTgt / 5).toFixed(1);

    const w1 = Math.max(1, Math.round(tw * 0.20));
    const w2 = Math.max(1, Math.round(tw * 0.20));
    const w3 = Math.max(1, Math.round(tw * 0.20));
    const w4 = Math.max(1, Math.round(tw * 0.20));
    const p1 = w1, p2 = p1 + w2, p3 = p2 + w3, p4 = p3 + w4, p5 = tw;

    return [
        { w: `1-${p1}`, n: 'Phase 1 · Foundation', d: 'ปรับตัว เรียนฟอร์ม + ฟื้นฟูแกนกลางและหลังด้วย McGill Big 3', v: 'พัก 60-75 วิ • Z2 30 นาที', tgt: `-${perPhase} กก.` },
        { w: `${p1 + 1}-${p2}`, n: 'Phase 2 · Build', d: 'เพิ่มปริมาณการฝึก + เริ่มอินเทอร์วัลเร่งการเผาผลาญ', v: '+1 เซ็ตท่าหลัก • HIIT 8 รอบ', tgt: `-${perPhase} กก.` },
        { w: `${p2 + 1}-${p3}`, n: 'Phase 3 · Metabolic', d: 'ลดเวลาพัก เพิ่มความหนาแน่นการฝึก สลายไขมันสะสม', v: 'พัก 45 วิ • เซอร์กิต 5 รอบ', tgt: `-${perPhase} กก.` },
        { w: `${p3 + 1}-${p4}`, n: 'Phase 4 · Intensify', d: 'เน้น Tempo คุมจังหวะกล้ามเนื้อ ล็อคมวลกล้ามเนื้อให้แน่น', v: 'Tempo 3-1-1 • Z2 45 นาที', tgt: `-${perPhase} กก.` },
        { w: `${p4 + 1}-${p5}`, n: 'Phase 5 · Peak Cut', d: 'ลีนขั้นสุดท้ายสำหรับทริปเที่ยว + ร่อง 6-Pack ชัดเจน', v: 'Drop set • คาร์ดิโอสม่ำเสมอ', tgt: `-${perPhase} กก.` }
    ];
}

function phIdx() {
    const w = wkNo();
    const phases = getPhases();
    for (let i = 0; i < phases.length; i++) {
        const parts = phases[i].w.split('-');
        const endW = parseInt(parts[1]) || (i + 1) * 4;
        if (w <= endW) return i;
    }
    return phases.length - 1;
}

function getMorningCardioMinutesToday() {
    let mins = 0;
    (D.sessions || []).forEach(s => {
        if (s.date === iso() && (s.workout_key === 'M' || (s.workout_name && (s.workout_name.includes('เช้า') || s.workout_name.includes('Morning'))))) {
            mins += Math.round((s.duration_sec || 0) / 60);
        }
    });
    if (D.morningCardio && D.morningCardio.date === iso()) {
        mins = Math.max(mins, D.morningCardio.mins || 0);
    }
    return mins;
}

function hasDoneMorningCardioToday() {
    return getMorningCardioMinutesToday() > 0;
}

function toggleForceFullCardio(val) {
    D.forceFullCardio = !!val;
    save();
    render();
}

async function markCardioDayDone(k) {
    const ok = await fcConfirm('ทำเครื่องหมายว่าจบโปรแกรม Cardio Zone 2 วันนี้เรียบร้อยแล้วใช่หรือไม่?');
    if (!ok) return;
    const morningM = getMorningCardioMinutesToday() || 35;
    const kcal = Math.round(morningM * 7.5);
    D.sessions.push({
        id: 'done_' + Date.now(),
        code: D.cfg.code || 'local',
        date: iso(),
        workout_key: k,
        workout_name: `${W[k]?.n || 'Cardio Zone 2'} (สำเร็จจากการเดินเช้า ${morningM} นาที)`,
        duration_sec: morningM * 60,
        kcal: kcal,
        total_volume_kg: 0,
        total_reps: 0,
        rpe: 6,
        back_safe: !!D.bs,
        pain_after: 0
    });
    save();
    render();
    autoSync();
    await fcAlert('🎉 ยอดเยี่ยมมาก! บันทึกจบโปรแกรมวันนี้เรียบร้อยแล้ว');
}

async function startMorningCardio() {
    const currentM = getMorningCardioMinutesToday();
    const defaultM = currentM > 0 ? String(currentM) : '35';
    const mins = await fcPrompt('เลือกระยะเวลาเดินลู่ตอนเช้า (นาที)', defaultM, '🌅 เดินลู่ Zone 2 ตอนเช้า');
    if (!mins) return;
    const m = Math.max(5, Math.min(120, parseInt(mins) || 35));
    const kcal = Math.round(m * 7.5);

    const choice = await fcChoice(
        '🌅 บันทึกการเดินลู่ตอนเช้า',
        `คุณระบุเดินลู่ <b>${m} นาที</b> (~${kcal} kcal)<br>ต้องการดำเนินการอย่างไร?`,
        [
            { id: 'log_now', label: '✓ บันทึกว่าเดินเสร็จแล้วทันที', sub: 'สำหรับกรณีเดินเสร็จแล้วจากบนลู่วิ่ง บันทึกลงประวัติทันทีโดยไม่ต้องจับเวลา' },
            { id: 'timer', label: '⏱️ เปิดตัวจับเวลาเดินลู่ตอนนี้', sub: 'เปิดหน้าจอจับเวลานับถอยหลังพร้อมเสียงเตือน' }
        ]
    );
    if (!choice) return;

    D.morningCardio = { date: iso(), mins: m, kcal };

    if (choice === 'log_now') {
        const sid = 'mc_' + Date.now();
        const existingIdx = (D.sessions || []).findIndex(s => s.date === iso() && (s.workout_key === 'M' || (s.workout_name && s.workout_name.includes('เช้า'))));
        const sessionData = {
            id: existingIdx >= 0 ? D.sessions[existingIdx].id : sid,
            code: D.cfg.code || 'local',
            date: iso(),
            workout_key: 'M',
            workout_name: `Morning Cardio — เดินลู่ตอนเช้า (${m} นาที)`,
            duration_sec: m * 60,
            kcal: kcal,
            total_volume_kg: 0,
            total_reps: 0,
            rpe: 6,
            back_safe: !!D.bs,
            pain_after: 0
        };
        if (existingIdx >= 0) {
            D.sessions[existingIdx] = sessionData;
        } else {
            D.sessions = D.sessions || [];
            D.sessions.push(sessionData);
        }
        save();
        render();
        autoSync();
        await fcAlert(`✓ บันทึกการเดินลู่ตอนเช้า ${m} นาที (~${kcal} kcal) เรียบร้อยแล้ว!\n\nระบบได้ปรับหักลบเวลาเดินลู่ และตัดเดินวอร์ม/คูลดาวน์ออกจากโปรแกรมวันนี้ให้อัตโนมัติ`);
    } else {
        W.M.items[0].t = m * 60;
        W.M.kcal = kcal;
        startW('M');
    }
}

