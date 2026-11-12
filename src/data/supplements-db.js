/* FitCoach v3.0 — Supplement Master Time Table, Pharmacokinetics & Inventory Engine */
/* ============ DAILY SUPPLEMENT & IF ROUTINE ENGINE (v2.15.1 - SUSTAINABLE DAILY MAINTENANCE) ============ */
const SUPP_STANDBY_HOLD = [
    {
        id: 'hold_ldee',
        name: 'LDEE Dietary',
        expDate: '06-02-2027',
        condition: 'ทาน 1 แคปซูล เฉพาะก่อนมื้อ Cheat Meal',
        reason: 'สารสกัดคุมหิวซ้ำซ้อนกับ Medita A1C',
        dose: '1 แคปซูล'
    },
    {
        id: 'hold_coq10',
        name: 'Dr.PONG CoQ10 30mg',
        expDate: '10-08-2028',
        condition: 'รอใช้เมื่อ Astaxanthin หรือ Triple C หมด',
        reason: 'ป้องกันร่างกายรับ Vitamin E/CoQ10 ซ้ำซ้อน',
        dose: '1 แคปซูล'
    },
    {
        id: 'hold_acv_liquid',
        name: 'ACV แบบน้ำ',
        expDate: '-',
        condition: 'ชงดื่มก่อนมื้อที่กินคาร์บหนักจัดๆ',
        reason: 'ใช้งานแบบแคปซูลสะดวกกับไลฟ์สไตล์มากกว่า',
        dose: '1 แก้ว'
    }
];

const SUPP_MASTER_SLOTS = [
    {
        id: 'slot_morning',
        icon: '☀️',
        title: 'ช่วงเช้า (Morning - Fasted State)',
        timeHint: '06:30 – 09:00 น. (ช่วงฟาสต์)',
        badge: 'เป้าหมาย: คุมหิว, คุมน้ำตาลในเลือด (ห้ามมีแคลอรี)',
        color: '#f59e0b',
        note: 'ดื่มน้ำเปล่า 1–2 แก้ว เริ่มต้นเก็บยอด 3 ลิตร/วัน (ไม่กินสารให้ความหวานช่วงฟาสต์)',
        items: [
            {
                id: 'supp_morn_medita',
                slotId: 'slot_morning',
                timing: 'ตอนเช้า (Fasted State — ห้ามมีแคลอรี)',
                name: 'Medita A1C',
                activeIngredients: 'Cactus, Bitter Orange, Black Pepper',
                dose: '1 แคปซูล',
                expDate: '-',
                benefit: 'คุมหิว, ลดน้ำตาลในเลือด',
                tag: '🩸 คุมหิว+ลดน้ำตาล',
                goalCat: 'liver_lipid',
                shiftMoveToLunch: true,
                active: true
            },
            {
                id: 'supp_morn_water',
                slotId: 'slot_morning',
                timing: 'หลังตื่นนอนทันที',
                name: 'ดื่มน้ำเปล่า 1–2 แก้ว (~500 ml)',
                activeIngredients: 'Pure Water (0 kcal)',
                dose: '1–2 แก้ว',
                expDate: '-',
                benefit: 'เริ่มต้นเก็บยอดน้ำ 3 ลิตร/วัน กระตุ้นระบบเผาผลาญช่วงฟาสต์',
                tag: '💧 เติมน้ำ 3 ลิตร/วัน',
                goalCat: 'liver_lipid',
                waterMl: 500,
                active: true
            }
        ]
    },
    {
        id: 'slot_lunch',
        icon: '🍽️',
        title: 'มื้อที่ 1 (Lunch - Feeding Window Starts)',
        timeHint: '11:45 – 13:00 น. (เปิดหน้าต่าง IF มื้อแรก)',
        badge: 'เป้าหมาย: บล็อกแป้ง, ซ่อมประสาท, บำรุงผิวพรรณ, ดรอปไขมัน',
        color: '#ea580c',
        items: [
            {
                id: 'supp_lunch_acv',
                slotId: 'slot_lunch',
                timing: 'ทานพร้อมข้าวคำแรก (ลดการดูดซึมน้ำตาล)',
                name: 'Dr.PONG ACV Capsule 750mg',
                activeIngredients: 'Apple Cider Vinegar 750mg',
                dose: '1 แคปซูล',
                expDate: '24-09-2028',
                benefit: 'ชะลอการดูดซึมน้ำตาลเข้ากระแสเลือด',
                tag: '🍏 พร้อมข้าวคำแรก',
                goalCat: 'liver_lipid',
                active: true
            },
            {
                id: 'supp_lunch_bcomplex',
                slotId: 'slot_lunch',
                timing: 'หลังอาหาร (บำรุงระบบประสาท ลดอาการชา)',
                name: 'Dr.PONG B Complex',
                activeIngredients: 'Vit B1 (100mg), B6, B12',
                dose: '1 แคปซูล',
                expDate: '15-08-2029',
                benefit: 'บำรุงระบบประสาทและสมอง ลดอาการชา',
                tag: '🧠 บำรุงระบบประสาท',
                goalCat: 'nerve_gut',
                active: true
            },
            {
                id: 'supp_lunch_vitc',
                slotId: 'slot_lunch',
                timing: 'หลังอาหาร (เสริมภูมิคุ้มกันและต้านอนุมูลอิสระ)',
                name: 'Watsons Triple C',
                activeIngredients: 'Vitamin C, CoQ10',
                dose: '1 เม็ด',
                expDate: '-',
                benefit: 'กระตุ้นการสร้างคอลลาเจน, เสริมภูมิคุ้มกันและต้านอนุมูลอิสระ',
                tag: '🍊 คอลลาเจน+เสริมภูมิ',
                goalCat: 'skin',
                active: true
            },
            {
                id: 'supp_lunch_asta',
                slotId: 'slot_lunch',
                timing: 'หลังอาหาร (ชะลอวัย ปกป้องผิวจากแสงแดด)',
                name: 'Whitelab Astaxanthin Plus Vit E',
                activeIngredients: 'Astaxanthin, Vit E',
                dose: '1 ซอฟต์เจล',
                expDate: '-',
                benefit: 'ต้านอนุมูลอิสระ, ชะลอวัย, ปกป้องผิวจากแสงแดด (UV)',
                tag: '✨ ชะลอวัย+กัน UV',
                goalCat: 'skin',
                active: true
            },
            {
                id: 'supp_lunch_fishoil',
                slotId: 'slot_lunch',
                timing: 'หลังอาหาร (ลดไตรกลีเซอไรด์)',
                name: 'Mega We Care Fish Oil',
                activeIngredients: 'Omega-3',
                dose: '1 แคปซูล',
                expDate: '-',
                benefit: 'ลดไตรกลีเซอไรด์และไขมันเลว (เม็ดที่ 1/2 ของวัน)',
                tag: '🐟 ลดไตรกลีเซอไรด์',
                goalCat: 'liver_lipid',
                active: true
            }
        ]
    },
    {
        id: 'slot_evening',
        icon: '🏋️',
        title: 'ช่วงเย็น (Evening - Workout Phase)',
        timeHint: 'Pre-Workout (ก่อนซ้อม 30 นาที) & Post-Workout (หลังซ้อมทันที)',
        badge: 'เพิ่มพละกำลัง • เผาผลาญไขมันช่องท้อง • ซ่อมกล้ามเนื้อ ผิว & ข้อต่อ',
        color: '#10b981',
        note: 'วันที่เลิกงานดึก ห้ามทานข้าวเย็นก่อนออกกำลัง ให้ทานเซ็ต Pre-Workout รองท้องแล้วไปลุยเลย',
        items: [
            {
                id: 'supp_eve_creatine',
                slotId: 'slot_evening',
                timing: 'Pre-Workout (ก่อนออกกำลังกาย 30 นาที — ชงน้ำเย็น)',
                name: 'BAAM!! Creatine Cola Flavour',
                activeIngredients: 'Micronized Creatine 5g',
                dose: '1 สกู๊ป / 5g',
                expDate: '23-10-2028',
                benefit: 'เพิ่มพละกำลัง, รักษามวลน้ำในกล้ามเนื้อ',
                tag: '⚡ Pre-Workout',
                goalCat: 'workout',
                skipOnShift: true,
                active: true
            },
            {
                id: 'supp_morn_carnitine',
                slotId: 'slot_evening',
                timing: 'Pre-Workout (ก่อนออกกำลังกาย 30 นาที — คู่คาร์ดิโอ)',
                name: 'L-Carnitine',
                activeIngredients: 'L-Carnitine',
                dose: '1 แคปซูล',
                expDate: '-',
                benefit: 'ขนส่งไขมันช่องท้องไปเผาผลาญเป็นพลังงานขณะออกกำลัง',
                tag: '🔥 เผาผลาญไขมันช่องท้อง',
                goalCat: 'workout',
                skipOnShift: true,
                active: true
            },
            {
                id: 'supp_eve_soy',
                slotId: 'slot_evening',
                timing: 'Post-Workout (หลังออกกำลังกายทันที)',
                name: 'BAAM Soy Isolate Dark Choc',
                activeIngredients: 'Soy Protein',
                dose: '1 สกู๊ป',
                expDate: '-',
                benefit: 'ซ่อมแซมกล้ามเนื้อหลังใช้งานหนัก',
                tag: '🥤 Post-Workout',
                goalCat: 'workout',
                active: true
            },
            {
                id: 'supp_eve_vida',
                slotId: 'slot_evening',
                timing: 'Post-Workout (ทานคู่กับเวย์ซอย)',
                name: 'Vida Collagen Dipeptide C',
                activeIngredients: 'Collagen Dipeptide, Vit C',
                dose: '2 แคปซูล',
                expDate: '-',
                benefit: 'บำรุงความยืดหยุ่นของผิวและข้อต่อในระยะยาว',
                tag: '✨ บำรุงผิว & ข้อต่อ',
                goalCat: 'skin',
                active: true
            }
        ]
    },
    {
        id: 'slot_dinner',
        icon: '🌙',
        title: 'มื้อที่ 2 (Dinner - Last Meal)',
        timeHint: '18:30 – 20:00 น. (จบมื้อนี้เริ่มนับ IF ทันที)',
        badge: 'เป้าหมาย: ดรอปไขมัน, ระงับกลิ่นกาย, เติมแร่ธาตุ',
        color: '#3b82f6',
        note: 'จบมื้อนี้ให้เริ่มนับเวลา IF ทันที',
        items: [
            {
                id: 'supp_din_fishoil',
                slotId: 'slot_dinner',
                timing: 'หลังอาหาร',
                name: 'Mega We Care Fish Oil',
                activeIngredients: 'Omega-3',
                dose: '1 แคปซูล',
                expDate: '-',
                benefit: 'ลดไตรกลีเซอไรด์และไขมันเลว (เม็ดที่ 2/2 ของวัน)',
                tag: '🐟 ลดไตรกลีเซอไรด์',
                goalCat: 'liver_lipid',
                active: true
            },
            {
                id: 'supp_din_innerdeo',
                slotId: 'slot_dinner',
                timing: 'หลังอาหาร (ดับกลิ่นกาย)',
                name: 'Dr.PONG InnerDeo',
                activeIngredients: 'Persimmon Powder 200mg',
                dose: '1 แคปซูล',
                expDate: '10-08-2028',
                benefit: 'ลดสาร Nonenal ระงับกลิ่นกายจากภายใน',
                tag: '🌿 ดับกลิ่นกาย',
                goalCat: 'skin',
                active: true
            },
            {
                id: 'supp_din_banana',
                slotId: 'slot_dinner',
                timing: 'ทานตบท้ายมื้ออาหาร',
                name: 'กล้วยหอม',
                activeIngredients: 'Natural Potassium',
                dose: '1 ลูก',
                expDate: '-',
                benefit: 'เติม Potassium คลายกล้ามเนื้อและเส้นประสาท',
                tag: '🍌 เติมแร่ธาตุโพแทสเซียม',
                goalCat: 'nerve_gut',
                active: true
            },
            {
                id: 'supp_din_calcium',
                slotId: 'slot_dinner',
                timing: 'รอนำเข้าตาราง (ของยังไม่มาส่ง)',
                name: '(Incoming) Dr.PONG Calcium 500 PLUS',
                activeIngredients: 'Calcium 500mg PLUS',
                dose: '1 แคปซูล',
                expDate: 'รอจัดส่ง',
                benefit: 'รอนำเข้าตารางเมื่อของมาส่ง (กู้มวลกระดูก 2.89kg)',
                tag: '⏳ รอมาส่ง (กู้มวลกระดูก)',
                goalCat: 'workout',
                optional: true,
                incoming: true,
                active: true
            }
        ]
    },
    {
        id: 'slot_bedtime',
        icon: '🛌',
        title: 'ช่วงก่อนนอน (Bedtime - Fasted State)',
        timeHint: '21:30 – 22:30 น. (ต้องเป็นตอนท้องว่าง)',
        badge: 'เป้าหมาย: ดีท็อกซ์ตับ, ปรับสมดุลลำไส้ (ต้องเป็นตอนท้องว่าง)',
        color: '#8b5cf6',
        note: 'ต้องทานตอนท้องว่างเพื่อให้ Liposomal Gluta+ และ Probiotic ทำงานได้เต็มประสิทธิภาพ',
        items: [
            {
                id: 'supp_night_gluta',
                slotId: 'slot_bedtime',
                timing: 'ก่อนนอน (ตอนท้องว่าง)',
                name: 'Whitelab Liposomal Gluta+',
                activeIngredients: 'Gluta, Zinc 30mg',
                dose: '1 แคปซูล',
                expDate: '-',
                benefit: 'ดีท็อกซ์สารพิษในตับและบำรุงผิวใส (Zinc 30mg ควบคุมความมัน/ลดสิว)',
                tag: '🛡️ ดีท็อกซ์ตับ + Zinc ลดสิว',
                goalCat: 'skin',
                active: true
            },
            {
                id: 'supp_night_probio',
                slotId: 'slot_bedtime',
                timing: 'ก่อนนอน (ตอนท้องว่าง)',
                name: 'Probiotic',
                activeIngredients: 'Multi-Strain Probiotics',
                dose: '1 เม็ด',
                expDate: '-',
                benefit: 'ปรับสมดุลลำไส้ (ทานเพื่อเคลียร์สต็อก)',
                tag: '🦠 ปรับสมดุลลำไส้',
                goalCat: 'nerve_gut',
                hasStockCounter: true,
                active: true
            }
        ]
    }
];

function ensureSuppInventory() {
    if (!D.cfg) D.cfg = {};
    if (D.cfg.probioticStock == null) D.cfg.probioticStock = 8;
    if (!Array.isArray(D.cfg.suppStandby) || D.cfg.suppSchemaVer !== 216) {
        D.cfg.suppStandby = SUPP_STANDBY_HOLD.map(h => ({ ...h }));
    }
    // Auto-migrate to v2.15.1 (schema 216) while preserving custom items & probioticStock
    if (!Array.isArray(D.cfg.suppInventory) || D.cfg.suppInventory.length === 0 || D.cfg.suppSchemaVer !== 216) {
        const prevInv = Array.isArray(D.cfg.suppInventory) ? D.cfg.suppInventory : [];
        const customItems = prevInv.filter(x => String(x.id || '').startsWith('supp_custom_'));
        const pausedMap = {};
        const calciumWasActivated = prevInv.some(x => x && x.id === 'supp_din_calcium' && x.optional === false);
        prevInv.forEach(x => {
            if (x && x.id && x.active === false) pausedMap[x.id] = false;
        });

        const seeded = [];
        SUPP_MASTER_SLOTS.forEach(slot => {
            slot.items.forEach(it => {
                const clone = {
                    ...it,
                    slotId: slot.id,
                    active: pausedMap[it.id] === false ? false : (it.active !== false),
                    stock: it.hasStockCounter ? D.cfg.probioticStock : (it.stock != null ? it.stock : null)
                };
                if (clone.id === 'supp_din_calcium' && calciumWasActivated) {
                    clone.optional = false;
                    clone.incoming = false;
                    clone.name = 'Dr.PONG Calcium 500 PLUS';
                    clone.timing = 'หลังอาหาร';
                    clone.tag = '🦴 กู้มวลกระดูก 2.89kg';
                }
                seeded.push(clone);
            });
        });
        customItems.forEach(c => seeded.push(c));
        D.cfg.suppInventory = seeded;
        D.cfg.suppSchemaVer = 216;
    } else {
        const probio = D.cfg.suppInventory.find(x => x.id === 'supp_night_probio');
        if (probio && D.cfg.probioticStock != null) {
            probio.stock = D.cfg.probioticStock;
        }
    }
    return D.cfg.suppInventory;
}

function getActiveSuppSlots() {
    const inv = ensureSuppInventory();
    return SUPP_MASTER_SLOTS.map(slot => ({
        ...slot,
        items: inv.filter(it => it.slotId === slot.id && it.active !== false)
    }));
}

function getPausedSuppItems() {
    const inv = ensureSuppInventory();
    return inv.filter(it => it.active === false);
}

/* ============ CLINICAL PHARMACOKINETICS & AI SUPPLEMENT SCHEDULER ============ */
function analyzeSupplementTiming(rawName = '', rawGoal = 'all', rawNotes = '') {
    const text = `${rawName} ${rawNotes}`.toLowerCase();
    let slotId = 'slot_lunch';
    let timing = 'หลังอาหาร';
    let dose = '1 แคปซูล';
    let goalCat = rawGoal !== 'all' ? rawGoal : 'skin';
    let tag = '✨ บำรุงสุขภาพระยะยาว';
    let benefit = '';
    let rationale = '';
    let skipOnShift = false;
    let shiftMoveToLunch = false;
    let optional = false;

    // 1. Check Pre-Workout / Fat Burners / Workout Performance
    if (/carnitine|คาร์นิทีน|pre[\s-]?workout|creatine|ครีเอทีน|caffeine|คาเฟอีน|ชาเขียว|egcg|green\s*tea|cla|bcaa/.test(text)) {
        slotId = 'slot_evening';
        timing = 'Pre-Workout (ก่อนออกกำลังกาย 30 นาที)';
        goalCat = 'workout';
        tag = '🔥 Pre-Workout & เผาผลาญไขมัน';
        skipOnShift = true;
        dose = /creatine|ครีเอทีน/.test(text) ? '1 สกู๊ป / 5g' : '1 แคปซูล';
        benefit = 'เพิ่มพละกำลังและดึงไขมันช่องท้อง (Visceral Fat 11) มาเผาผลาญเป็นพลังงานขณะออกกำลังกาย';
        rationale = 'จัดไว้ช่วงเย็น Pre-Workout (ก่อนออกกำลังกาย 30 นาที) ทานรองท้องก่อนลุยซ้อม และงดอัตโนมัติในวันเข้าเวร/ไม่ได้ออกกำลังกายเพื่อพักตับครับ';
    }
    // 2. Check Fasted Appetite / Blood Sugar Control (Morning or First Bite Lunch)
    else if (/medita|a1c|berberine|เบอร์เบอรีน|ldee/.test(text)) {
        slotId = 'slot_morning';
        timing = 'ตอนเช้า (Fasted State — ห้ามมีแคลอรี)';
        goalCat = 'liver_lipid';
        tag = '🩸 คุมหิว+ลดน้ำตาล';
        shiftMoveToLunch = true;
        benefit = 'คุมหิวและลดน้ำตาลในเลือดช่วง Fasted State โดยไม่มีแคลอรี';
        rationale = 'จัดไว้ช่วงเช้าตอนท้องว่าง (Fasted State) เพื่อคุมความหิวและระดับน้ำตาลในเลือดก่อนเริ่มมื้อแรกครับ';
    }
    else if (/acv|apple\s*cider|ไซเดอร์|ไฟเบอร์|fiber|inulin|อินูลิน|ไคโตซาน|chitosan/.test(text)) {
        slotId = 'slot_lunch';
        timing = 'ทานพร้อมข้าวคำแรก (ลดการดูดซึมน้ำตาล)';
        goalCat = 'liver_lipid';
        tag = '🍏 พร้อมข้าวคำแรก';
        benefit = 'ชะลอการดูดซึมน้ำตาลเข้ากระแสเลือดและบล็อกแป้งในมื้ออาหาร';
        rationale = 'ทานพร้อมข้าวคำแรกในมื้อที่ 1 (Lunch) เพื่อชะลอการดูดซึมน้ำตาลและลดการสร้างไตรกลีเซอไรด์โดยไม่ระคายเคืองกระเพาะครับ';
    }
    // 3. Check Post-Workout / Protein / Collagen / Muscle & Joint Maintenance
    else if (/whey|เวย์|soy|โปรตีน|protein|collagen|คอลลาเจน|dipeptide|tripeptide|เปปไทด์|ceramide|เซราไมด์|hya|ไฮยา/.test(text)) {
        slotId = 'slot_evening';
        timing = 'Post-Workout (หลังออกกำลังกายทันที)';
        goalCat = /collagen|คอลลาเจน|ceramide|เซราไมด์|hya|ไฮยา/.test(text) ? 'skin' : 'workout';
        tag = goalCat === 'skin' ? '✨ บำรุงผิว & ข้อต่อ' : '🥤 Post-Workout';
        dose = /whey|เวย์|soy|โปรตีน|protein/.test(text) ? '1 สกู๊ป' : '2 แคปซูล';
        benefit = goalCat === 'skin'
            ? 'บำรุงความยืดหยุ่นของผิวและข้อต่อในระยะยาว (Daily Maintenance)'
            : 'ซ่อมแซมกล้ามเนื้อหลังใช้งานหนัก';
        rationale = 'จัดไว้ช่วง Post-Workout หลังออกกำลังกายทันที ทานคู่กับเวย์ซอยเพื่อเร่งการซ่อมแซมกล้ามเนื้อและบำรุงผิว/ข้อต่อครับ';
    }
    // 4. Check Liver Detox / Glutathione / NAC / Milk Thistle / Zinc / Magnesium / Probiotic / Sleep (Bedtime Empty Stomach)
    else if (/gluta|กลูต้า|nac|cysteine|ซิสเทอีน|milk\s*thistle|silymarin|ซิลิมาริน|artichoke|อาร์ทิโชก|ตับ|liver|zinc|ซิงค์|magnesium|แมกนีเซียม|probiotic|โปรไบโอติก|โพรไบโอติก|gaba|กาบา|theanine|ธีอะนีน|melatonin|เมลาโทนิน/.test(text)) {
        slotId = 'slot_bedtime';
        timing = 'ก่อนนอน (ตอนท้องว่าง)';
        if (/milk\s*thistle|silymarin|ซิลิมาริน|artichoke|nac|ตับ|liver/.test(text)) {
            goalCat = 'liver_lipid';
            tag = '🛡️ ฟื้นฟูตับ & ลดไขมันพอกตับ';
            benefit = 'ฟื้นฟูเซลล์ตับ เพิ่มระดับกลูตาไธโอนในตับ และช่วยเร่งการสลายไขมันพอกตับช่วงหลับลึก';
        } else if (/gluta|กลูต้า|zinc|ซิงค์/.test(text)) {
            goalCat = 'skin';
            tag = '🛡️ ดีท็อกซ์ตับ + Zinc ลดสิว';
            benefit = 'ดีท็อกซ์สารพิษในตับและบำรุงผิวใส ควบคุมความมัน/ลดสิว';
        } else {
            goalCat = 'nerve_gut';
            tag = '🛌 ฟื้นฟูประสาท & ลำไส้';
            benefit = 'คลายความตึงเครียดของระบบประสาท ปรับสมดุลลำไส้ และช่วยให้หลับลึก';
        }
        rationale = 'จัดไว้ช่วงก่อนเข้านอน (ตอนท้องว่าง — Fasted State) เพราะตับและระบบซ่อมแซมร่างกายทำงานสูงสุดระหว่างหลับลึก และไม่ถูกแคลเซียมหรืออาหารในมื้อเย็นแย่งดูดซึมครับ';
    }
    // 5. Check Calcium / InnerDeo / Dinner items
    else if (/calcium|แคลเซียม|กระดูก|innerdeo|พลับ|persimmon|ดับกลิ่น/.test(text)) {
        slotId = 'slot_dinner';
        timing = 'หลังอาหาร';
        goalCat = /calcium|แคลเซียม|กระดูก/.test(text) ? 'workout' : 'skin';
        tag = /calcium|แคลเซียม|กระดูก/.test(text) ? '🦴 กู้มวลกระดูก 2.89kg' : '🌿 ดับกลิ่นกาย';
        benefit = /calcium|แคลเซียม|กระดูก/.test(text)
            ? 'เสริมความหนาแน่นมวลกระดูก (เป้าหมายกู้มวลกระดูก 2.89kg) และบำรุงข้อต่อในระยะยาว'
            : 'ลดสาร Nonenal ระงับกลิ่นกายจากภายใน';
        rationale = 'จัดไว้หลังอาหารมื้อที่ 2 (Dinner) เพื่อแยกแคลเซียมไม่ให้รบกวนการดูดซึมวิตามินในมื้อกลางวัน และไม่ให้ชนกับ Zinc ตอนก่อนนอนครับ';
    }
    // 6. Check Fat-Soluble Vitamins & B-Complex (Lunch After Meal)
    else if (/fish\s*oil|น้ำมันปลา|omega|โอเมก้า|krill|coq10|คิวเท็น|astaxanthin|แอสตา|vit\s*d|วิตามินดี|d3|k2|vit\s*e|วิตามินอี|lecithin|เลซิติน|choline|โคลีน|lutein|ลูทีน|lycopene|ไลโคปีน|b[\s-]?complex|วิตามินบี/.test(text)) {
        const isLipidOrLiver = /fish\s*oil|น้ำมันปลา|omega|โอเมก้า|krill|lecithin|เลซิติน|choline|โคลีน/.test(text);
        slotId = 'slot_lunch';
        timing = 'หลังอาหาร';
        goalCat = isLipidOrLiver ? 'liver_lipid' : (/b[\s-]?complex|วิตามินบี/.test(text) ? 'nerve_gut' : 'skin');
        tag = isLipidOrLiver ? '🐟 ลดไตรกลีเซอไรด์' : (/b[\s-]?complex|วิตามินบี/.test(text) ? '🧠 บำรุงระบบประสาท' : '✨ ชะลอวัย & ต้านอนุมูลอิสระ');
        benefit = isLipidOrLiver
            ? 'ลดไตรกลีเซอไรด์ (จาก 333) และลดไขมันช่องท้อง (Visceral Fat 11)'
            : 'ดูดซึมพร้อมไขมันดีในมื้ออาหารเพื่อบำรุงระบบประสาทและปกป้องผิวจากแสงแดด';
        rationale = 'จัดไว้หลังอาหารมื้อที่ 1 (Lunch) ทันที เพื่อให้ร่างกายหลั่งน้ำดีออกมาช่วยดูดซึมวิตามินที่ละลายในไขมันได้สูงสุด และวิตามินบีช่วยบำรุงระบบประสาทตลอดวันครับ';
    }
    // 7. Fallback
    else {
        if (rawGoal === 'liver_lipid') {
            slotId = 'slot_dinner';
            timing = 'หลังอาหาร';
            goalCat = 'liver_lipid';
            tag = '🛡️ ดูแลตับ & ลดไขมันช่องท้อง';
            benefit = 'ช่วยสนับสนุนการทำงานของตับและลดไตรกลีเซอไรด์ควบคู่กับมื้ออาหาร';
            rationale = 'จัดไว้หลังมื้ออาหารที่ 2 (Dinner) เพื่อกระจายจำนวนเม็ดยาไม่ให้กระจุกที่มื้อกลางวันมากเกินไป (เซฟตับ ห้าม Overdose) ครับ';
        } else if (rawGoal === 'workout') {
            slotId = 'slot_evening';
            timing = 'Post-Workout (หลังออกกำลังกายทันที)';
            goalCat = 'workout';
            tag = '💪 เสริมการออกกำลังกาย';
            benefit = 'ช่วยฟื้นฟูพลังงานและซ่อมแซมกล้ามเนื้อจากการฝึกซ้อม';
            rationale = 'จัดไว้ช่วงเย็นควบคู่กับเซสชันออกกำลังกายเพื่อให้ร่างกายนำไปใช้ฟื้นฟูกล้ามเนื้อได้ทันทีครับ';
        } else {
            slotId = 'slot_lunch';
            timing = 'หลังอาหาร';
            goalCat = 'skin';
            tag = '✨ บำรุงผิวพรรณ & ชะลอวัย';
            benefit = 'เสริมสร้างคอลลาเจนและต้านอนุมูลอิสระเพื่อดูแลผิวพรรณและข้อต่อในระยะยาว';
            rationale = 'จัดไว้หลังอาหารมื้อที่ 1 (Lunch) เพื่อไม่ให้ระคายเคืองกระเพาะและทำงานเสริมฤทธิ์กับ Watsons Triple C และ Astaxanthin ครับ';
        }
    }

    // Warnings / Liver & Standby Hold Checks against existing inventory
    const inv = ensureSuppInventory().filter(x => x.active !== false);
    const warnings = [];
    if (/zinc|ซิงค์/.test(text) && inv.some(x => /zinc|ซิงค์|gluta/i.test(x.name + ' ' + (x.activeIngredients || '') + ' ' + x.benefit + ' ' + x.tag))) {
        warnings.push('⚠️ ในตารางปัจจุบันมี Whitelab Liposomal Gluta+ ที่มี Zinc 30mg อยู่แล้ว แนะนำระวังปริมาณ Zinc รวมเกิน 40mg/วัน เพื่อไม่ให้รบกวนการดูดซึมทองแดงและเซฟตับครับ');
    }
    if (/coq10|คิวเท็น/.test(text) && inv.some(x => /triple\s*c|astaxanthin/i.test(x.name))) {
        warnings.push('🛑 กฎเซฟตับ (Standby/Hold): ปัจจุบันคุณทาน Watsons Triple C (มี CoQ10) และ Whitelab Astaxanthin (มี Vit E) อยู่แล้ว แนะนำให้พัก Dr.PONG CoQ10 30mg ไว้ในหมวดกองหนุน รอใช้เมื่อ Astaxanthin หรือ Triple C หมดเพื่อป้องกันร่างกายรับ Vitamin E/CoQ10 ซ้ำซ้อนครับ');
    }
    if (/ldee/.test(text) && inv.some(x => /medita|a1c/i.test(x.name))) {
        warnings.push('🛑 กฎเซฟตับ (Standby/Hold): LDEE Dietary มีสารสกัดคุมหิวซ้ำซ้อนกับ Medita A1C แนะนำให้ทาน 1 แคปซูล เฉพาะก่อนมื้อ Cheat Meal เท่านั้นครับ');
    }
    if (/fish\s*oil|น้ำมันปลา|omega|โอเมก้า/.test(text) && inv.filter(x => /fish\s*oil|น้ำมันปลา|omega/i.test(x.name)).length >= 2) {
        warnings.push('ℹ️ ปัจจุบันคุณทาน Mega We Care Fish Oil มื้อเที่ยงและมื้อเย็นอยู่แล้ว (รวม 2 แคปซูล/วัน) หากเพิ่มอีกเม็ดแนะนำให้รวม EPA+DHA ไม่เกิน 2,000–3,000 mg/วันครับ');
    }

    return {
        slotId,
        timing,
        dose,
        goalCat,
        tag,
        benefit,
        rationale,
        skipOnShift,
        shiftMoveToLunch,
        optional,
        warnings
    };
}

function getTodaySuppRecord() {
    const todayStr = iso();
    let rec = todayCheck();
    if (!rec) {
        const prev = D.checks[D.checks.length - 1];
        rec = {
            d: todayStr,
            w: prev?.w || null,
            cal: 0, protein: 0, carbs: 0, fat: 0, sugar: 0, sodium: 0, water: 0,
            meals: [],
            supps: {},
            suppShiftMode: false
        };
        D.checks.push(rec);
    }
    if (!rec.supps) rec.supps = {};
    return rec;
}

function getSuppProgressStats(rec) {
    const r = rec || todayCheck() || {};
    const supps = r.supps || {};
    const isShift = !!r.suppShiftMode;
    const activeSlots = getActiveSuppSlots();
    let totalReq = 0;
    let doneReq = 0;
    let optionalDone = 0;

    activeSlots.forEach(slot => {
        slot.items.forEach(item => {
            if (isShift && item.skipOnShift) return;
            if (item.optional) {
                if (supps[item.id]) optionalDone++;
                return;
            }
            totalReq++;
            if (supps[item.id]) doneReq++;
        });
    });

    const pct = totalReq > 0 ? Math.min(100, Math.round((doneReq / totalReq) * 100)) : 0;
    return { totalReq, doneReq, optionalDone, pct, isShift };
}

function toggleSuppItem(itemId) {
    const rec = getTodaySuppRecord();
    const newState = !rec.supps[itemId];
    rec.supps[itemId] = newState;
    rec.updatedAt = Date.now();

    const inv = ensureSuppInventory();
    const invItem = inv.find(x => x.id === itemId);

    // Handle stock counter for Probiotic or any item with stock tracking
    if (itemId === 'supp_night_probio' || (invItem && invItem.stock != null)) {
        let curStock = itemId === 'supp_night_probio'
            ? (D.cfg.probioticStock != null ? D.cfg.probioticStock : 8)
            : Number(invItem.stock);
        if (newState) {
            curStock = Math.max(0, curStock - 1);
        } else {
            curStock = Math.min(999, curStock + 1);
        }
        if (itemId === 'supp_night_probio') {
            D.cfg.probioticStock = curStock;
        }
        if (invItem) {
            invItem.stock = curStock;
        }
    }

    save();
    render();
    if (typeof pushToCloud === 'function') pushToCloud();
}

function toggleStandbySpecialUse(holdId) {
    const rec = getTodaySuppRecord();
    rec.supps[holdId] = !rec.supps[holdId];
    rec.updatedAt = Date.now();
    save();
    render();
    if (typeof pushToCloud === 'function') pushToCloud();
    const holdItem = (D.cfg.suppStandby || SUPP_STANDBY_HOLD).find(x => x.id === holdId);
    msg(rec.supps[holdId]
        ? `🍽️ บันทึกการใช้ On-Demand "${holdItem ? holdItem.name : holdId}" สำหรับวันนี้แล้ว`
        : `↺ ยกเลิกบันทึก On-Demand "${holdItem ? holdItem.name : holdId}"`);
}

function toggleSuppSlotAll(slotId) {
    const rec = getTodaySuppRecord();
    const isShift = !!rec.suppShiftMode;
    const activeSlots = getActiveSuppSlots();
    const slot = activeSlots.find(s => s.id === slotId);
    if (!slot) return;

    const activeItems = slot.items.filter(it => !(isShift && it.skipOnShift) && !(isShift && it.shiftMoveToLunch && slotId === 'slot_morning') && !it.optional);
    if (slotId === 'slot_lunch' && isShift) {
        const movedItems = activeSlots[0].items.filter(x => x.shiftMoveToLunch);
        activeItems.push(...movedItems);
    }
    const allChecked = activeItems.every(it => !!rec.supps[it.id]);
    const targetState = !allChecked;
    const inv = ensureSuppInventory();

    activeItems.forEach(it => {
        const prev = !!rec.supps[it.id];
        rec.supps[it.id] = targetState;
        const invItem = inv.find(x => x.id === it.id);
        if ((it.id === 'supp_night_probio' || (invItem && invItem.stock != null)) && prev !== targetState) {
            let curStock = it.id === 'supp_night_probio'
                ? (D.cfg.probioticStock != null ? D.cfg.probioticStock : 8)
                : Number(invItem.stock);
            curStock = targetState ? Math.max(0, curStock - 1) : Math.min(999, curStock + 1);
            if (it.id === 'supp_night_probio') D.cfg.probioticStock = curStock;
            if (invItem) invItem.stock = curStock;
        }
    });

    rec.updatedAt = Date.now();
    save();
    render();
    if (typeof pushToCloud === 'function') pushToCloud();
    msg(targetState ? '✓ เช็กอาหารเสริมครบช่วงเวลานี้แล้ว!' : '↺ ยกเลิกการเช็กช่วงเวลานี้แล้ว');
}

function toggleSuppShiftMode() {
    const rec = getTodaySuppRecord();
    rec.suppShiftMode = !rec.suppShiftMode;
    rec.updatedAt = Date.now();
    save();
    render();
    if (typeof pushToCloud === 'function') pushToCloud();
    msg(rec.suppShiftMode
        ? '🏥 เปิดโหมดวันเข้าเวร/งดออกกำลังกาย: งดเซ็ต Pre-Workout (Creatine + L-Carnitine) และย้าย Medita A1C ไปมื้อแรก'
        : '🏃‍♂️ สลับกลับเป็นโหมดวันออกกำลังกายปกติ');
}

function checkAllSuppsToday(markDone) {
    const rec = getTodaySuppRecord();
    const isShift = !!rec.suppShiftMode;
    const activeSlots = getActiveSuppSlots();
    const inv = ensureSuppInventory();

    activeSlots.forEach(slot => {
        slot.items.forEach(it => {
            if (isShift && it.skipOnShift) {
                rec.supps[it.id] = false;
                return;
            }
            if (!it.optional) {
                const prev = !!rec.supps[it.id];
                rec.supps[it.id] = !!markDone;
                const invItem = inv.find(x => x.id === it.id);
                if ((it.id === 'supp_night_probio' || (invItem && invItem.stock != null)) && prev !== !!markDone) {
                    let curStock = it.id === 'supp_night_probio'
                        ? (D.cfg.probioticStock != null ? D.cfg.probioticStock : 8)
                        : Number(invItem.stock);
                    curStock = markDone ? Math.max(0, curStock - 1) : Math.min(999, curStock + 1);
                    if (it.id === 'supp_night_probio') D.cfg.probioticStock = curStock;
                    if (invItem) invItem.stock = curStock;
                }
            } else if (!markDone) {
                rec.supps[it.id] = false;
            }
        });
    });
    rec.updatedAt = Date.now();
    save();
    render();
    if (typeof pushToCloud === 'function') pushToCloud();
    msg(markDone ? '🎉 เช็กอาหารเสริมครบทุกรายการของวันนี้แล้ว!' : '↺ รีเซ็ตตารางอาหารเสริมวันนี้แล้ว');
}

async function editProbioticStock(ev, itemId = 'supp_night_probio') {
    if (ev) ev.stopPropagation();
    const inv = ensureSuppInventory();
    const item = inv.find(x => x.id === itemId);
    const curVal = itemId === 'supp_night_probio'
        ? (D.cfg.probioticStock != null ? D.cfg.probioticStock : 8)
        : (item && item.stock != null ? item.stock : 30);

    const res = await fcPrompt(
        `ปรับจำนวนสต็อกคงเหลือของ "${item ? item.name : 'Probiotic'}" (เม็ด/ซอง):
(ใส่ 0 หากหมดสต็อกแล้ว ระบบจะถามเพื่อพักรายการนี้ชั่วคราว)`,
        String(curVal),
        '📦 อัปเดตสต็อกอาหารเสริม'
    );
    if (res === null) return;
    const n = parseInt(res);
    if (!isNaN(n) && n >= 0 && n <= 999) {
        if (itemId === 'supp_night_probio') D.cfg.probioticStock = n;
        if (item) {
            item.stock = n;
            item.hasStockCounter = true;
        }
        if (n === 0 && item) {
            const pauseNow = await fcConfirm(`"${item.name}" หมดสต็อกแล้ว (0 เม็ด)

ต้องการพักรายการนี้ชั่วคราว (ย้ายไปหมวด "รายการที่หมด/พักทาน") เพื่อไม่ให้ค้างในตารางรายวันเลยไหมครับ?`, '⏸️ พักรายการที่หมดสต็อก');
            if (pauseNow) {
                item.active = false;
            }
        }
        save();
        render();
        if (typeof pushToCloud === 'function') pushToCloud();
        msg('✓ อัปเดตสต็อกเรียบร้อยแล้ว');
    }
}

/* ============ SUPPLEMENT INVENTORY MANAGEMENT: PAUSE / RESUME / ADD / EDIT / AI AUDIT ============ */
function toggleSuppItemActive(itemId, ev) {
    if (ev) ev.stopPropagation();
    const inv = ensureSuppInventory();
    const item = inv.find(x => x.id === itemId);
    if (!item) return;
    item.active = item.active === false ? true : false;
    save();
    render();
    if (typeof pushToCloud === 'function') pushToCloud();
    msg(item.active
        ? `▶️ เปิดทาน "${item.name}" ในตารางประจำวันแล้ว`
        : `⏸️ พักการทาน "${item.name}" (หมดชั่วคราว) เรียบร้อยแล้ว`);
}

function activateIncomingCalcium(ev) {
    if (ev) ev.stopPropagation();
    const inv = ensureSuppInventory();
    const calItem = inv.find(x => x.id === 'supp_din_calcium');
    if (!calItem) return;
    calItem.optional = !calItem.optional;
    calItem.incoming = calItem.optional;
    calItem.name = calItem.optional ? '(Incoming) Dr.PONG Calcium 500 PLUS' : 'Dr.PONG Calcium 500 PLUS';
    calItem.timing = calItem.optional ? 'รอนำเข้าตาราง (ของยังไม่มาส่ง)' : 'หลังอาหาร (กู้มวลกระดูก 2.89kg)';
    calItem.tag = calItem.optional ? '⏳ รอมาส่ง (กู้มวลกระดูก)' : '🦴 กู้มวลกระดูก 2.89kg';
    calItem.expDate = calItem.optional ? 'รอจัดส่ง' : (calItem.expDate === 'รอจัดส่ง' ? '-' : calItem.expDate);
    save();
    render();
    if (typeof pushToCloud === 'function') pushToCloud();
    msg(calItem.optional
        ? '⏳ ตั้งค่า Dr.PONG Calcium 500 PLUS เป็นสถานะ Incoming (รอของมาส่ง)'
        : '🎉 นำเข้า Dr.PONG Calcium 500 PLUS เข้าตารางมื้อที่ 2 (Dinner) เต็มรูปแบบแล้ว!');
}

function promoteStandbyToActive(holdId) {
    const holdList = D.cfg.suppStandby || SUPP_STANDBY_HOLD;
    const h = holdList.find(x => x.id === holdId);
    if (!h) return;
    openAddSupplementModal();
    setTimeout(() => {
        fillQuickPresetSupp(h.name, h.dose || '1 แคปซูล', 'liver_lipid', h.condition, '', h.expDate || '-');
    }, 60);
}

function deleteSuppItemFromInventory(itemId, ev) {
    if (ev) ev.stopPropagation();
    const inv = ensureSuppInventory();
    const idx = inv.findIndex(x => x.id === itemId);
    if (idx < 0) return;
    const removed = inv.splice(idx, 1)[0];
    save();
    render();
    if (typeof pushToCloud === 'function') pushToCloud();
    fcClose();
    msg(`🗑️ ลบ "${removed.name}" ออกจากคลังอาหารเสริมแล้ว`);
}

function applySmartSuppAnalysisToForm() {
    const nameVal = (document.getElementById('newSuppName')?.value || '').trim();
    const goalVal = document.getElementById('newSuppGoal')?.value || 'all';
    const benefitVal = (document.getElementById('newSuppBenefit')?.value || '').trim();
    if (!nameVal) {
        msg('กรุณาพิมพ์ชื่ออาหารเสริมก่อนกดวิเคราะห์ครับ');
        return;
    }
    const analysis = analyzeSupplementTiming(nameVal, goalVal, benefitVal);
    const slotEl = document.getElementById('newSuppSlot');
    const timingEl = document.getElementById('newSuppTiming');
    const doseEl = document.getElementById('newSuppDose');
    const benEl = document.getElementById('newSuppBenefit');
    const tagEl = document.getElementById('newSuppTag');
    const skipEl = document.getElementById('newSuppSkipShift');
    const ratBox = document.getElementById('newSuppRationaleBox');

    if (slotEl) slotEl.value = analysis.slotId;
    if (timingEl) timingEl.value = analysis.timing;
    if (doseEl && !doseEl.value) doseEl.value = analysis.dose;
    if (benEl && !benEl.value) benEl.value = analysis.benefit;
    if (tagEl) tagEl.value = analysis.tag;
    if (skipEl) skipEl.checked = !!analysis.skipOnShift;

    if (ratBox) {
        const slotObj = SUPP_MASTER_SLOTS.find(s => s.id === analysis.slotId);
        const warnHtml = analysis.warnings.length > 0
            ? `<div style="margin-top:6px; padding-top:6px; border-top:1px dashed rgba(245,158,11,0.4); color:#d97706; font-weight:700;">${analysis.warnings.join('<br>')}</div>`
            : '';
        ratBox.style.display = 'block';
        ratBox.innerHTML = `
            <div style="font-weight:800; color:#059669; margin-bottom:3px;">🧠 ผลวิเคราะห์เวลาที่เหมาะสมที่สุด: ${slotObj ? slotObj.icon + ' ' + slotObj.title.split(' (')[0] : ''} (${analysis.timing})</div>
            <div style="color:var(--tx); line-height:1.45;">${analysis.rationale}</div>
            ${warnHtml}
        `;
    }
}

async function analyzeNewSuppWithGemini(mode = 'text') {
    if (!D.cfg.aiKey) {
        applySmartSuppAnalysisToForm();
        fcAlert('ระบบใช้ Clinical Engine วิเคราะห์ตารางให้เรียบร้อยแล้วครับ (หากต้องการสแกนรูปฉลากด้วย Gemini AI กรุณาใส่ API Key ในหน้าซิงก์)');
        return;
    }
    const nameVal = (document.getElementById('newSuppName')?.value || '').trim();
    const runGeminiPrompt = async (parts) => {
        const ratBox = document.getElementById('newSuppRationaleBox');
        if (ratBox) {
            ratBox.style.display = 'block';
            ratBox.innerHTML = `<div style="color:var(--acc); font-weight:700;">⏳ Gemini AI กำลังวิเคราะห์เภสัชจลนศาสตร์และความเข้ากันได้กับตับ/ผิว/การออกกำลังกาย...</div>`;
        }
        try {
            const inv = ensureSuppInventory().filter(x => x.active !== false);
            const currentStackStr = inv.map(x => `- ${x.name} (${x.dose}) [${x.slotId}: ${x.timing}]`).join('\n');
            const sysText = `คุณคือแพทย์ผู้เชี่ยวชาญด้านเวชศาสตร์ชะลอวัย เภสัชวิทยาคลินิก และโภชนาการการกีฬา
ผู้ใช้มีเป้าหมายหลัก (Daily Maintenance ระยะยาวตลอดปี):
1. ลดไตรกลีเซอไรด์ (เป้าหมายจาก 333) และบำรุงตับ
2. ลดไขมันช่องท้อง (Visceral Fat 11) และสร้างกล้ามเนื้อ
3. บำรุงระบบประสาท สุขภาพผิวพรรณ และข้อต่อในระยะยาว
กฎเหล็ก: ทำ IF 2 มื้อ, เซฟตับ (ห้าม Overdose), ไม่กินสารให้ความหวานช่วงฟาสต์

ตารางอาหารเสริมปัจจุบันของผู้ใช้:
${currentStackStr}

กรุณาวิเคราะห์อาหารเสริมตัวใหม่นี้ และจัดลงใน 1 ใน 5 ช่วงเวลาต่อไปนี้:
- "slot_morning": ช่วงเช้า (Morning - Fasted State ห้ามมีแคลอรี)
- "slot_lunch": มื้อที่ 1 (Lunch - Feeding Window Starts)
- "slot_evening": ช่วงเย็น (Evening - Workout Phase: Pre-Workout / Post-Workout)
- "slot_dinner": มื้อที่ 2 (Dinner - Last Meal ก่อนปิดหน้าต่าง IF)
- "slot_bedtime": ช่วงก่อนนอน (Bedtime - Fasted State ตอนท้องว่าง)

ตอบกลับเป็น JSON เท่านั้น (ห้ามใส่ markdown backticks):
{"name": "ชื่ออาหารเสริม", "activeIngredients": "สารสำคัญหลัก", "dose": "1 แคปซูล", "slotId": "slot_lunch", "timing": "หลังอาหาร", "goalCat": "liver_lipid หรือ skin หรือ workout หรือ nerve_gut", "tag": "ป้ายสั้นๆ เช่น 🛡️ เซฟตับ", "benefit": "สรรพคุณสั้นๆ 1 ประโยค", "rationale": "เหตุผลว่าทำไมทานเวลานี้ถึงดูดซึมดีที่สุดและเซฟตับ ไม่ตีกับตัวเดิมอย่างไร", "skipOnShift": false}`;

            const fullParts = [{ text: sysText }, ...parts];
            const models = ['gemini-3.5-flash', 'gemini-flash-latest', 'gemini-2.5-flash-lite'];
            let res = null;
            for (const m of models) {
                const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${D.cfg.aiKey.trim()}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contents: [{ parts: fullParts }] })
                });
                if (r.ok) { res = r; break; }
            }
            if (!res) throw new Error('ไม่สามารถเชื่อมต่อ Gemini ได้ ระบบจะใช้การวิเคราะห์อัตโนมัติในเครื่องแทน');
            const data = await res.json();
            const txt = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
            const jm = txt.match(/\{[\s\S]*\}/);
            if (!jm) throw new Error('รูปแบบ JSON ไม่สมบูรณ์');
            const aiRes = JSON.parse(jm[0]);

            if (aiRes.name && document.getElementById('newSuppName')) document.getElementById('newSuppName').value = aiRes.name;
            if (aiRes.activeIngredients && document.getElementById('newSuppIng')) document.getElementById('newSuppIng').value = aiRes.activeIngredients;
            if (aiRes.dose && document.getElementById('newSuppDose')) document.getElementById('newSuppDose').value = aiRes.dose;
            if (aiRes.slotId && document.getElementById('newSuppSlot')) document.getElementById('newSuppSlot').value = aiRes.slotId;
            if (aiRes.timing && document.getElementById('newSuppTiming')) document.getElementById('newSuppTiming').value = aiRes.timing;
            if (aiRes.goalCat && document.getElementById('newSuppGoal')) document.getElementById('newSuppGoal').value = aiRes.goalCat;
            if (aiRes.benefit && document.getElementById('newSuppBenefit')) document.getElementById('newSuppBenefit').value = aiRes.benefit;
            if (aiRes.tag && document.getElementById('newSuppTag')) document.getElementById('newSuppTag').value = aiRes.tag;
            if (document.getElementById('newSuppSkipShift')) document.getElementById('newSuppSkipShift').checked = !!aiRes.skipOnShift;

            if (ratBox) {
                const slotObj = SUPP_MASTER_SLOTS.find(s => s.id === aiRes.slotId);
                ratBox.innerHTML = `
                    <div style="font-weight:800; color:#059669; margin-bottom:3px;">🤖 Gemini AI จัดตารางให้ที่: ${slotObj ? slotObj.icon + ' ' + slotObj.title.split(' (')[0] : ''} (${aiRes.timing || ''})</div>
                    <div style="color:var(--tx); line-height:1.45;">${aiRes.rationale || ''}</div>
                `;
            }
        } catch (e) {
            applySmartSuppAnalysisToForm();
        }
    };

    if (mode === 'image') {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = e => {
            const file = e.target.files[0];
            if (!file) return;
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let w = img.width, h = img.height, max = 900;
                if (w > max || h > max) {
                    if (w > h) { h = h * (max / w); w = max; }
                    else { w = w * (max / h); h = max; }
                }
                canvas.width = w; canvas.height = h;
                canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                const b64 = canvas.toDataURL('image/jpeg', 0.7).split(',')[1];
                runGeminiPrompt([{ text: 'อ่านฉลากอาหารเสริมจากภาพนี้และจัดตารางเวลาที่เหมาะสม:' }, { inlineData: { mimeType: 'image/jpeg', data: b64 } }]);
            };
            img.src = URL.createObjectURL(file);
        };
        input.click();
    } else {
        if (!nameVal) return msg('กรุณาพิมพ์ชื่ออาหารเสริมก่อนครับ');
        runGeminiPrompt([{ text: 'อาหารเสริมที่ต้องการเพิ่มคือ: ' + nameVal }]);
    }
}

function fillQuickPresetSupp(name, dose, goalCat, notes, ing = '', exp = '-') {
    const nameEl = document.getElementById('newSuppName');
    const doseEl = document.getElementById('newSuppDose');
    const goalEl = document.getElementById('newSuppGoal');
    const benEl = document.getElementById('newSuppBenefit');
    const ingEl = document.getElementById('newSuppIng');
    const expEl = document.getElementById('newSuppExp');
    if (nameEl) nameEl.value = name;
    if (doseEl) doseEl.value = dose;
    if (goalEl) goalEl.value = goalCat;
    if (benEl) benEl.value = '';
    if (ingEl && ing) ingEl.value = ing;
    if (expEl && exp) expEl.value = exp;
    applySmartSuppAnalysisToForm();
}

async function openAddSupplementModal(editItemId = null) {
    const inv = ensureSuppInventory();
    const existing = editItemId ? inv.find(x => x.id === editItemId) : null;

    const defName = existing ? existing.name : '';
    const defIng = existing ? (existing.activeIngredients || '') : '';
    const defExp = existing ? (existing.expDate || '-') : '-';
    const defDose = existing ? existing.dose : '1 แคปซูล';
    const defSlot = existing ? existing.slotId : 'slot_lunch';
    const defTiming = existing ? existing.timing : 'หลังอาหาร';
    const defGoal = existing ? (existing.goalCat || 'skin') : 'liver_lipid';
    const defBenefit = existing ? existing.benefit : '';
    const defTag = existing ? existing.tag : '✨ อาหารเสริม';
    const defStock = existing && existing.stock != null ? existing.stock : '';
    const defSkipShift = existing ? !!existing.skipOnShift : false;
    const defOptional = existing ? !!existing.optional : false;

    const presetsHtml = !existing ? `
        <div style="margin-bottom:12px;">
            <div style="font-size:11px; font-weight:800; color:var(--dim); margin-bottom:5px;">⚡ เลือกตัวเสริมหรือตัวในคลัง (แตะเพื่อวิเคราะห์และจัดตารางทันที):</div>
            <div style="display:flex; gap:5px; flex-wrap:wrap;">
                <button type="button" onclick="fillQuickPresetSupp('Dr.PONG Calcium 500 PLUS', '1 แคปซูล', 'workout', 'กู้มวลกระดูก 2.89kg', 'Calcium 500mg PLUS', '-')" style="font-size:10.5px; font-weight:700; padding:4px 8px; border-radius:6px; background:var(--card2); border:1px solid var(--line); color:var(--tx); cursor:pointer;">🦴 Dr.PONG Calcium 500+</button>
                <button type="button" onclick="fillQuickPresetSupp('Dr.PONG CoQ10 30mg', '1 แคปซูล', 'skin', 'พลังงานเซลล์และผิว', 'Coenzyme Q10 30mg', '10-08-2028')" style="font-size:10.5px; font-weight:700; padding:4px 8px; border-radius:6px; background:var(--card2); border:1px solid var(--line); color:var(--tx); cursor:pointer;">❤️ Dr.PONG CoQ10 30mg</button>
                <button type="button" onclick="fillQuickPresetSupp('Milk Thistle (Silymarin)', '1 แคปซูล', 'liver_lipid', 'ฟื้นฟูตับ ลดไขมันพอกตับ', 'Silymarin Extract', '-')" style="font-size:10.5px; font-weight:700; padding:4px 8px; border-radius:6px; background:var(--card2); border:1px solid var(--line); color:var(--tx); cursor:pointer;">🛡️ Milk Thistle (เซฟตับ)</button>
                <button type="button" onclick="fillQuickPresetSupp('NAC (N-Acetyl Cysteine) 600mg', '1 เม็ด', 'liver_lipid', 'ตั้งต้นกลูต้า ล้างพิษตับ', 'N-Acetyl Cysteine 600mg', '-')" style="font-size:10.5px; font-weight:700; padding:4px 8px; border-radius:6px; background:var(--card2); border:1px solid var(--line); color:var(--tx); cursor:pointer;">🛡️ NAC 600mg</button>
                <button type="button" onclick="fillQuickPresetSupp('Ceramide / Rice Extract', '1 แคปซูล', 'skin', 'บำรุงความชุ่มชื้นและเกราะผิวระยะยาว', 'Rice Ceramide', '-')" style="font-size:10.5px; font-weight:700; padding:4px 8px; border-radius:6px; background:var(--card2); border:1px solid var(--line); color:var(--tx); cursor:pointer;">✨ Ceramide (เกราะผิว)</button>
                <button type="button" onclick="fillQuickPresetSupp('Magnesium Glycinate', '1–2 แคปซูล', 'nerve_gut', 'คลายกล้ามเนื้อ หลับลึก', 'Magnesium Glycinate', '-')" style="font-size:10.5px; font-weight:700; padding:4px 8px; border-radius:6px; background:var(--card2); border:1px solid var(--line); color:var(--tx); cursor:pointer;">🛌 Magnesium (หลับลึก)</button>
            </div>
        </div>
    ` : '';

    const html = `
        <div style="text-align:left; font-size:13.5px; max-height:76vh; overflow-y:auto; padding-right:2px;">
            <div style="font-weight:900; font-size:16px; color:var(--acc); margin-bottom:4px;">
                ${existing ? '✏️ แก้ไขข้อมูลอาหารเสริม & ตารางประจำวัน' : '➕ เพิ่มอาหารเสริมใหม่ & วิเคราะห์จัดตารางอัตโนมัติ'}
            </div>
            <div style="font-size:11.5px; color:var(--dim); margin-bottom:10px;">
                พิมพ์ชื่อหรือถ่ายรูปฉลาก เพื่อให้ระบบวิเคราะห์ช่วงเวลาที่ดูดซึมดีที่สุดและเซฟตับ (Daily Maintenance)
            </div>

            ${presetsHtml}

            <div style="background:var(--card2); border:1px solid var(--line); border-radius:12px; padding:10px 12px; margin-bottom:10px;">
                <label style="font-size:11.5px; font-weight:800; color:var(--tx); display:block; margin-bottom:4px;">1. ชื่ออาหารเสริม / วิตามิน:</label>
                <div style="display:flex; gap:6px; margin-bottom:8px;">
                    <input type="text" id="newSuppName" value="${defName}" oninput="applySmartSuppAnalysisToForm()" placeholder="เช่น Dr.PONG Calcium 500 PLUS, Milk Thistle..." style="flex:1; padding:8px 10px; font-size:13.5px; font-weight:700; border-radius:8px; border:1.5px solid var(--acc); background:var(--bg); color:var(--tx); box-sizing:border-box;">
                    <button type="button" class="btn sm" onclick="analyzeNewSuppWithGemini('image')" style="width:auto; flex:0 0 auto; padding:6px 10px; font-size:11.5px; background:var(--card); border:1px solid var(--acc); color:var(--acc); font-weight:800; border-radius:8px; cursor:pointer;" title="ถ่ายรูปกระปุกยาให้ AI อ่านฉลาก">📸 สแกนกระปุก</button>
                </div>

                <div style="display:grid; grid-template-columns:1.2fr 0.8fr; gap:8px; margin-bottom:8px;">
                    <div>
                        <label style="font-size:11px; font-weight:700; color:var(--dim); display:block; margin-bottom:2px;">สารสำคัญ (Active Ingredients):</label>
                        <input type="text" id="newSuppIng" value="${defIng}" placeholder="เช่น Omega-3, Vit B1/B6/B12" style="width:100%; padding:7px 8px; font-size:12px; border-radius:8px; border:1px solid var(--line); background:var(--bg); color:var(--tx); box-sizing:border-box;">
                    </div>
                    <div>
                        <label style="font-size:11px; font-weight:700; color:var(--dim); display:block; margin-bottom:2px;">วันหมดอายุ (Exp Date):</label>
                        <input type="text" id="newSuppExp" value="${defExp}" placeholder="เช่น 24-09-2028 หรือ -" style="width:100%; padding:7px 8px; font-size:12px; border-radius:8px; border:1px solid var(--line); background:var(--bg); color:var(--tx); box-sizing:border-box;">
                    </div>
                </div>

                <div style="display:grid; grid-template-columns:1.1fr 0.9fr; gap:8px; margin-bottom:8px;">
                    <div>
                        <label style="font-size:11px; font-weight:700; color:var(--dim); display:block; margin-bottom:2px;">เป้าหมายหลักที่ต้องการบำรุง:</label>
                        <select id="newSuppGoal" onchange="applySmartSuppAnalysisToForm()" style="width:100%; padding:7px 8px; font-size:12.5px; font-weight:700; border-radius:8px; border:1px solid var(--line); background:var(--bg); color:var(--tx);">
                            <option value="liver_lipid" ${defGoal === 'liver_lipid' ? 'selected' : ''}>🛡️ ลดไตรกลีเซอไรด์ (333) & บำรุงตับ</option>
                            <option value="workout" ${defGoal === 'workout' ? 'selected' : ''}>💪 ลดไขมันช่องท้อง (VF 11) & สร้างกล้ามเนื้อ/มวลกระดูก</option>
                            <option value="skin" ${defGoal === 'skin' ? 'selected' : ''}>✨ บำรุงผิวพรรณ ชะลอวัย & ข้อต่อระยะยาว</option>
                            <option value="nerve_gut" ${defGoal === 'nerve_gut' ? 'selected' : ''}>🧠 บำรุงระบบประสาท ลำไส้ & การนอน</option>
                        </select>
                    </div>
                    <div>
                        <label style="font-size:11px; font-weight:700; color:var(--dim); display:block; margin-bottom:2px;">ปริมาณที่ทาน (Dosage):</label>
                        <input type="text" id="newSuppDose" value="${defDose}" placeholder="เช่น 1 แคปซูล, 1 สกู๊ป" style="width:100%; padding:7px 8px; font-size:12.5px; font-weight:700; border-radius:8px; border:1px solid var(--line); background:var(--bg); color:var(--tx); box-sizing:border-box;">
                    </div>
                </div>

                <button type="button" class="btn sm" onclick="analyzeNewSuppWithGemini('text')" style="width:100%; padding:7px; font-size:12px; font-weight:800; background:linear-gradient(135deg, #059669 0%, #10b981 100%); color:#fff; border:none; border-radius:8px; cursor:pointer;">
                    🧠 วิเคราะห์เวลาทานที่เหมาะสมที่สุด (เซฟตับ & ดูดซึมสูงสุด)
                </button>

                <div id="newSuppRationaleBox" style="display:none; margin-top:8px; padding:8px 10px; border-radius:8px; background:rgba(16,185,129,0.08); border:1px solid rgba(16,185,129,0.35); font-size:11.5px;"></div>
            </div>

            <div style="background:var(--card2); border:1px solid var(--line); border-radius:12px; padding:10px 12px; margin-bottom:10px;">
                <label style="font-size:11.5px; font-weight:800; color:var(--tx); display:block; margin-bottom:4px;">2. ช่วงเวลาในตาราง DAILY TIME TABLE:</label>
                <select id="newSuppSlot" style="width:100%; padding:8px; font-size:13px; font-weight:800; border-radius:8px; border:1px solid var(--line); background:var(--bg); color:var(--tx); margin-bottom:8px;">
                    <option value="slot_morning" ${defSlot === 'slot_morning' ? 'selected' : ''}>☀️ ช่วงเช้า (Morning - Fasted State)</option>
                    <option value="slot_lunch" ${defSlot === 'slot_lunch' ? 'selected' : ''}>🍽️ มื้อที่ 1 (Lunch - Feeding Window Starts)</option>
                    <option value="slot_evening" ${defSlot === 'slot_evening' ? 'selected' : ''}>🏋️ ช่วงเย็น (Evening - Workout Phase)</option>
                    <option value="slot_dinner" ${defSlot === 'slot_dinner' ? 'selected' : ''}>🌙 มื้อที่ 2 (Dinner - Last Meal)</option>
                    <option value="slot_bedtime" ${defSlot === 'slot_bedtime' ? 'selected' : ''}>🛌 ช่วงก่อนนอน (Bedtime - Fasted State)</option>
                </select>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:8px;">
                    <div>
                        <label style="font-size:11px; font-weight:700; color:var(--dim); display:block; margin-bottom:2px;">จังหวะการทาน:</label>
                        <input type="text" id="newSuppTiming" value="${defTiming}" placeholder="เช่น หลังอาหาร, ทานพร้อมข้าวคำแรก" style="width:100%; padding:7px 8px; font-size:12.5px; border-radius:8px; border:1px solid var(--line); background:var(--bg); color:var(--tx); box-sizing:border-box;">
                    </div>
                    <div>
                        <label style="font-size:11px; font-weight:700; color:var(--dim); display:block; margin-bottom:2px;">📦 นับสต็อกคงเหลือ (เว้นว่างได้):</label>
                        <input type="number" id="newSuppStock" value="${defStock}" placeholder="เช่น 30 เม็ด" style="width:100%; padding:7px 8px; font-size:12.5px; border-radius:8px; border:1px solid var(--line); background:var(--bg); color:var(--tx); box-sizing:border-box;">
                    </div>
                </div>

                <label style="font-size:11px; font-weight:700; color:var(--dim); display:block; margin-bottom:2px;">Daily Purpose (วัตถุประสงค์การทานประจำวัน):</label>
                <input type="text" id="newSuppBenefit" value="${defBenefit}" placeholder="เช่น ชะลอการดูดซึมน้ำตาล, บำรุงความยืดหยุ่นของผิวและข้อต่อ..." style="width:100%; padding:7px 8px; font-size:12.5px; border-radius:8px; border:1px solid var(--line); background:var(--bg); color:var(--tx); box-sizing:border-box; margin-bottom:8px;">
                <input type="hidden" id="newSuppTag" value="${defTag}">

                <div style="display:flex; flex-direction:column; gap:5px; font-size:12px;">
                    <label style="display:flex; align-items:center; gap:6px; cursor:pointer;">
                        <input type="checkbox" id="newSuppSkipShift" ${defSkipShift ? 'checked' : ''} style="width:auto; margin:0;">
                        <span>🏥 งดทานอัตโนมัติในวันเข้าเวร / วันไม่ได้ออกกำลังกาย (เช่น Pre-Workout)</span>
                    </label>
                    <label style="display:flex; align-items:center; gap:6px; cursor:pointer;">
                        <input type="checkbox" id="newSuppOptional" ${defOptional ? 'checked' : ''} style="width:auto; margin:0;">
                        <span>⏳ เป็นรายการ Incoming (ยังไม่มาส่ง) หรือรายการเสริม (ไม่บังคับคิดรวมใน % รายวัน)</span>
                    </label>
                </div>
            </div>

            ${existing ? `
                <div style="display:flex; gap:8px; margin-bottom:8px;">
                    <button type="button" class="btn sm g" onclick="toggleSuppItemActive('${existing.id}'); fcClose();" style="flex:1; padding:8px; color:#d97706; border-color:rgba(245,158,11,0.4);">
                        ${existing.active === false ? '▶️ เปิดทานต่อ (มีของแล้ว)' : '⏸️ พักทานชั่วคราว (ของหมด)'}
                    </button>
                    <button type="button" class="btn sm g" onclick="deleteSuppItemFromInventory('${existing.id}', event)" style="flex:0.8; padding:8px; color:var(--red); border-color:rgba(239,68,68,0.35);">
                        🗑️ ลบถาวร
                    </button>
                </div>
            ` : ''}
        </div>
    `;

    const ok = await fcConfirm(html, existing ? '💾 บันทึกการแก้ไข' : '➕ เพิ่มเข้าตารางอาหารเสริม');
    if (!ok) return;

    const finalName = (document.getElementById('newSuppName')?.value || '').trim();
    if (!finalName) return fcAlert('กรุณาระบุชื่ออาหารเสริมครับ');

    const finalGoal = document.getElementById('newSuppGoal')?.value || 'skin';
    const autoMeta = analyzeSupplementTiming(finalName, finalGoal, document.getElementById('newSuppBenefit')?.value || '');

    const finalIng = (document.getElementById('newSuppIng')?.value || '').trim() || '-';
    const finalExp = (document.getElementById('newSuppExp')?.value || '').trim() || '-';
    const finalSlot = document.getElementById('newSuppSlot')?.value || autoMeta.slotId;
    const finalTiming = (document.getElementById('newSuppTiming')?.value || autoMeta.timing).trim();
    const finalDose = (document.getElementById('newSuppDose')?.value || autoMeta.dose).trim();
    const finalBenefit = (document.getElementById('newSuppBenefit')?.value || autoMeta.benefit).trim();
    const finalTag = (document.getElementById('newSuppTag')?.value || autoMeta.tag).trim();
    const stockRaw = (document.getElementById('newSuppStock')?.value || '').trim();
    const finalStock = stockRaw !== '' && !isNaN(parseInt(stockRaw)) ? parseInt(stockRaw) : null;
    const finalSkipShift = !!document.getElementById('newSuppSkipShift')?.checked;
    const finalOptional = !!document.getElementById('newSuppOptional')?.checked;

    if (existing) {
        existing.name = finalName;
        existing.activeIngredients = finalIng;
        existing.expDate = finalExp;
        existing.slotId = finalSlot;
        existing.timing = finalTiming;
        existing.dose = finalDose;
        existing.goalCat = finalGoal;
        existing.benefit = finalBenefit;
        existing.tag = finalTag;
        existing.stock = finalStock;
        existing.hasStockCounter = finalStock != null;
        if (existing.id === 'supp_night_probio' && finalStock != null) {
            D.cfg.probioticStock = finalStock;
        }
        existing.skipOnShift = finalSkipShift;
        existing.optional = finalOptional;
        msg(`✓ อัปเดต "${finalName}" เรียบร้อยแล้ว`);
    } else {
        inv.push({
            id: 'supp_custom_' + Date.now(),
            slotId: finalSlot,
            timing: finalTiming,
            name: finalName,
            activeIngredients: finalIng,
            expDate: finalExp,
            dose: finalDose,
            goalCat: finalGoal,
            benefit: finalBenefit,
            tag: finalTag,
            stock: finalStock,
            hasStockCounter: finalStock != null,
            skipOnShift: finalSkipShift,
            optional: finalOptional,
            active: true
        });
        msg(`✓ เพิ่ม "${finalName}" ลงในตารางเรียบร้อยแล้ว`);
    }

    save();
    render();
    if (typeof pushToCloud === 'function') pushToCloud();
}

function openSuppStackAuditModal() {
    const inv = ensureSuppInventory();
    const activeList = inv.filter(x => x.active !== false && !x.waterMl);

    const liverItems = activeList.filter(x => x.goalCat === 'liver_lipid' || /ตับ|ไตรกลีเซอไรด์|fish\s*oil|acv|a1c|gluta/i.test(x.name + ' ' + x.benefit));
    const workoutItems = activeList.filter(x => x.goalCat === 'workout' || /กล้ามเนื้อ|เผาผลาญ|carnitine|creatine|soy|isolate|calcium/i.test(x.name + ' ' + x.benefit));
    const maintItems = activeList.filter(x => x.goalCat === 'skin' || x.goalCat === 'nerve_gut' || /ประสาท|ผิว|ข้อต่อ|collagen|asta|triple\s*c|b\s*complex|innerdeo|probio|กล้วย/i.test(x.name + ' ' + x.benefit));

    // Count capsules per main meal to verify liver safety
    const mornCaps = activeList.filter(x => x.slotId === 'slot_morning').length;
    const lunchCaps = activeList.filter(x => x.slotId === 'slot_lunch').length;
    const dinnerCaps = activeList.filter(x => x.slotId === 'slot_dinner' && !/กล้วย/i.test(x.name) && !x.incoming).length;
    const bedCaps = activeList.filter(x => x.slotId === 'slot_bedtime').length;

    const html = `
        <div style="text-align:left; font-size:13.5px; max-height:78vh; overflow-y:auto; padding-right:2px;">
            <div style="font-weight:900; font-size:16px; color:var(--acc); margin-bottom:4px;">🩺 วิเคราะห์แผนดูแลสุขภาพระยะยาว (Daily Maintenance & Liver Safety)</div>
            <div style="font-size:12px; color:var(--dim); margin-bottom:12px;">ออกแบบให้ทานได้ทุกวันตลอดปีโดยไม่กระทบตับ • IF 2 มื้อ • ไม่กินสารให้ความหวานช่วงฟาสต์</div>

            <!-- Liver Load & Absorption Balance -->
            <div style="background:rgba(16,185,129,0.08); border:1px solid rgba(16,185,129,0.35); border-radius:12px; padding:10px 12px; margin-bottom:10px;">
                <div style="font-weight:800; color:#059669; font-size:13.5px; margin-bottom:4px;">✅ 1. การกระจายมื้อเพื่อเซฟตับ (ทานได้ต่อเนื่องตลอดปี)</div>
                <div style="font-size:12px; color:var(--tx); line-height:1.5;">
                    • <b>ช่วงเช้า (Fasted):</b> ${mornCaps} แคปซูล • <b>มื้อที่ 1 (Lunch):</b> ${lunchCaps} เม็ด • <b>มื้อที่ 2 (Dinner):</b> ${dinnerCaps} เม็ด • <b>ก่อนนอน:</b> ${bedCaps} เม็ด<br>
                    • <b>ผลประเมิน:</b> <span style="color:#059669; font-weight:700;">ปลอดภัยต่อตับและไตในระยะยาว!</span> แยกกลุ่มที่ซ้ำซ้อน (LDEE, CoQ10 30mg, ACV น้ำ) ไปไว้ในหมวด <b>🛑 STANDBY / HOLD (กองหนุน)</b> เพื่อใช้แบบ On-Demand หรือรอสลับเมื่อตัวหลักหมด
                </div>
            </div>

            <!-- 3 Core Goals Breakdown -->
            <div style="background:var(--card2); border:1px solid var(--line); border-radius:12px; padding:10px 12px; margin-bottom:10px;">
                <div style="font-weight:800; color:var(--acc); font-size:13px; margin-bottom:4px;">1️⃣ ลดไตรกลีเซอไรด์ (333) & บำรุงตับ (${liverItems.length} รายการ)</div>
                <div style="font-size:12px; color:var(--dim); line-height:1.45; margin-bottom:8px;">
                    ${liverItems.map(x => `• <b style="color:var(--tx);">${x.name}</b> — ${x.benefit}`).join('<br>')}
                </div>

                <div style="font-weight:800; color:#3b82f6; font-size:13px; margin-bottom:4px; padding-top:8px; border-top:1px dashed var(--line);">2️⃣ ลดไขมันช่องท้อง (VF 11) & สร้างกล้ามเนื้อ/มวลกระดูก (${workoutItems.length} รายการ)</div>
                <div style="font-size:12px; color:var(--dim); line-height:1.45; margin-bottom:8px;">
                    ${workoutItems.map(x => `• <b style="color:var(--tx);">${x.name}</b> — ${x.benefit}`).join('<br>')}
                </div>

                <div style="font-weight:800; color:#10b981; font-size:13px; margin-bottom:4px; padding-top:8px; border-top:1px dashed var(--line);">3️⃣ บำรุงระบบประสาท ผิวพรรณ & ข้อต่อระยะยาว (${maintItems.length} รายการ)</div>
                <div style="font-size:12px; color:var(--dim); line-height:1.45;">
                    ${maintItems.map(x => `• <b style="color:var(--tx);">${x.name}</b> — ${x.benefit}`).join('<br>')}
                </div>
            </div>

            <div style="background:rgba(59,130,246,0.08); border-left:3px solid #3b82f6; border-radius:8px; padding:9px 10px; font-size:12px; color:var(--tx); line-height:1.45;">
                📦 <b>สถานะรายการที่รอมาส่ง (Incoming):</b><br>
                • <b>Dr.PONG Calcium 500 PLUS:</b> ตอนนี้ตั้งสถานะเป็น <b>"⏳ รอมาส่ง"</b> (ยังไม่นำมาคิดหักเปอร์เซ็นต์รายวัน) ทันทีที่ของมาส่งแล้ว สามารถกดปุ่ม <b>"📦 ของมาส่งแล้ว กดนำเข้าตาราง"</b> ในมื้อที่ 2 เพื่อเริ่มกู้มวลกระดูก 2.89kg ได้ทันทีครับ
            </div>
        </div>
    `;
    fcAlert(html, '🩺 วิเคราะห์ตาราง Daily Maintenance & เซฟตับ');
}

function renderSupplementsUI() {
    const tc = todayCheck() || {};
    const stats = getSuppProgressStats(tc);
    const supps = tc.supps || {};
    const isShift = stats.isShift;
    const activeSlots = getActiveSuppSlots();
    const pausedItems = getPausedSuppItems();
    const inv = ensureSuppInventory();
    const standbyList = D.cfg.suppStandby || SUPP_STANDBY_HOLD;
    if (D.cfg.probioticStock == null) D.cfg.probioticStock = 8;

    // Determine current recommended slot by hour
    const nowH = new Date().getHours() + (new Date().getMinutes() / 60);
    let activeSlotIdx = 0;
    if (nowH < 10.5) activeSlotIdx = 0;
    else if (nowH < 15.0) activeSlotIdx = 1;
    else if (nowH < 18.0) activeSlotIdx = 2;
    else if (nowH < 20.5) activeSlotIdx = 3;
    else activeSlotIdx = 4;
    const curSlot = activeSlots[activeSlotIdx] || SUPP_MASTER_SLOTS[activeSlotIdx];

    // 1. Render Home Quick Summary Card (#homeSuppCard)
    const homeEl = document.getElementById('homeSuppCard');
    if (homeEl) {
        homeEl.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <div style="display:flex; align-items:center; gap:6px;">
                    <span style="background:rgba(16,185,129,0.15); color:#059669; padding:6px; border-radius:8px; display:inline-flex;">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>
                    </span>
                    <div>
                        <h3 style="margin:0; font-size:14.5px; font-weight:800;">Daily Supplement & IF Routine</h3>
                        <div style="font-size:11px; color:var(--dim);">ลดไตรกลีเซอไรด์ (333) • VF 11 & กล้ามเนื้อ • บำรุงประสาท ผิว & ข้อต่อ</div>
                    </div>
                </div>
                <span class="tag" style="font-size:11px; font-weight:800; background:${stats.pct === 100 ? 'rgba(16,185,129,0.18)' : 'rgba(249,115,22,0.15)'}; color:${stats.pct === 100 ? '#059669' : 'var(--acc)'};">
                    ${stats.doneReq}/${stats.totalReq} รายการ (${stats.pct}%)
                </span>
            </div>

            <div class="bar" style="height:7px; margin-bottom:9px;">
                <i style="width:${stats.pct}%; background:linear-gradient(90deg, #10b981, #059669);"></i>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; background:var(--card2); border:1px solid var(--line); border-radius:10px; padding:8px 10px;">
                <div style="font-size:12px; color:var(--tx); flex:1;">
                    <span style="font-weight:800; color:${curSlot.color};">${curSlot.icon} ช่วงเวลานี้:</span> ${curSlot.title.split(' (')[0]}
                    ${isShift ? ' <span style="font-size:10.5px; color:#d97706; font-weight:700;">(🏥 โหมดวันเข้าเวร/งดซ้อม)</span>' : ''}
                </div>
                <button class="btn sm" onclick="go('supp')" style="width:auto; flex:0 0 auto; padding:6px 12px; font-size:11.5px; background:var(--acc); color:#fff; font-weight:800; border-radius:8px; cursor:pointer;">
                    💊 เปิดตารางเช็กชื่อ ❯
                </button>
            </div>
        `;
    }

    // 2. Render Full Supplements Page (#suppPageContainer)
    const pageEl = document.getElementById('suppPageContainer');
    if (!pageEl) return;

    const renderItemRow = (it, extraBadgeHtml = '') => {
        const isSkipped = isShift && it.skipOnShift;
        const isMovedOut = isShift && it.shiftMoveToLunch && !extraBadgeHtml;
        const isDone = !!supps[it.id];
        const itemStock = it.id === 'supp_night_probio'
            ? D.cfg.probioticStock
            : (it.stock != null ? it.stock : null);

        if (isSkipped) {
            return `
                <div style="display:flex; align-items:flex-start; gap:10px; padding:10px 12px; border-radius:10px; background:var(--card2); border:1px dashed var(--line); opacity:0.65; margin-bottom:8px;">
                    <div style="font-size:16px; line-height:1.2; margin-top:2px;">⏸️</div>
                    <div style="flex:1;">
                        <div style="display:flex; align-items:center; justify-content:space-between; gap:6px; flex-wrap:wrap;">
                            <span style="font-weight:800; font-size:13.5px; color:var(--dim); text-decoration:line-through;">${it.name} (${it.dose})</span>
                            <span style="background:rgba(245,158,11,0.15); color:#d97706; font-size:10px; font-weight:800; padding:1px 6px; border-radius:6px;">งดทาน (วันเข้าเวร/ไม่ได้ออกกำลังกาย)</span>
                        </div>
                        <div style="font-size:11.5px; color:var(--dim); margin-top:2px;">${it.benefit}</div>
                    </div>
                </div>
            `;
        }

        if (isMovedOut) {
            return `
                <div style="display:flex; align-items:flex-start; gap:10px; padding:10px 12px; border-radius:10px; background:rgba(245,158,11,0.08); border:1px dashed rgba(245,158,11,0.4); margin-bottom:8px;">
                    <div style="font-size:16px; line-height:1.2; margin-top:2px;">↪️</div>
                    <div style="flex:1;">
                        <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                            <span style="font-weight:800; font-size:13.5px; color:#d97706;">${it.name} (${it.dose})</span>
                            <span style="background:rgba(245,158,11,0.2); color:#b45309; font-size:10px; font-weight:800; padding:1px 6px; border-radius:6px;">ย้ายไปทานก่อนมื้อกลางวันแล้ว</span>
                        </div>
                        <div style="font-size:11.5px; color:var(--dim); margin-top:2px;">เนื่องจากเปิดโหมดวันเข้าเวร/งดออกกำลังกาย ระบบจึงย้ายไปอยู่ในมื้อที่ 1 (Lunch) ให้เรียบร้อยครับ</div>
                    </div>
                </div>
            `;
        }

        const stockBadge = (it.hasStockCounter || itemStock != null) ? `
            <button type="button" onclick="editProbioticStock(event, '${it.id}')" style="background:${itemStock <= 3 ? 'rgba(239,68,68,0.15)' : 'rgba(139,92,246,0.15)'}; color:${itemStock <= 3 ? '#ef4444' : '#8b5cf6'}; border:1px solid ${itemStock <= 3 ? 'rgba(239,68,68,0.35)' : 'rgba(139,92,246,0.35)'}; font-size:10px; font-weight:800; padding:2px 6px; border-radius:6px; cursor:pointer;" title="แตะเพื่อปรับจำนวนสต็อก">
                📦 เหลือ ${itemStock} เม็ด
            </button>
        ` : '';

        const waterQuickBtn = it.waterMl ? `
            <button type="button" onclick="event.stopPropagation(); addWaterMl(${it.waterMl}); if(!todayCheck()?.supps?.['${it.id}']) toggleSuppItem('${it.id}');" style="background:rgba(139,92,246,0.12); color:var(--vio); border:1px solid rgba(139,92,246,0.3); font-size:10px; font-weight:800; padding:2px 7px; border-radius:6px; cursor:pointer;">
                💧 +บวกน้ำ ${it.waterMl}ml
            </button>
        ` : '';

        const incomingBtn = it.id === 'supp_din_calcium' ? `
            <button type="button" onclick="activateIncomingCalcium(event)" style="background:${it.optional ? 'rgba(59,130,246,0.14)' : 'rgba(16,185,129,0.14)'}; color:${it.optional ? '#2563eb' : '#059669'}; border:1px solid ${it.optional ? 'rgba(59,130,246,0.35)' : 'rgba(16,185,129,0.35)'}; font-size:10px; font-weight:800; padding:2px 7px; border-radius:6px; cursor:pointer;">
                ${it.optional ? '📦 ของมาส่งแล้ว กดนำเข้าตาราง' : '✓ นำเข้าตารางแล้ว'}
            </button>
        ` : '';

        const expChip = (it.expDate && it.expDate !== '-') ? `<span style="font-size:10px; color:var(--dim); font-weight:600;">⏳ Exp: ${it.expDate}</span>` : '';
        const ingChip = (it.activeIngredients && it.activeIngredients !== '-' && !it.waterMl) ? `<span style="font-size:10.5px; color:var(--acc); font-weight:700;">🔬 ${it.activeIngredients}</span>` : '';

        return `
            <div onclick="toggleSuppItem('${it.id}')" style="display:flex; align-items:flex-start; gap:10px; padding:10px 12px; border-radius:11px; background:${isDone ? 'rgba(16,185,129,0.08)' : (it.optional ? 'rgba(59,130,246,0.04)' : 'var(--card2)')}; border:1.5px ${it.optional && !isDone ? 'dashed rgba(59,130,246,0.4)' : 'solid ' + (isDone ? '#10b981' : 'var(--line)')}; margin-bottom:8px; cursor:pointer; transition:all 0.15s ease;">
                <div style="width:22px; height:22px; border-radius:6px; border:2px solid ${isDone ? '#10b981' : 'var(--dim)'}; background:${isDone ? '#10b981' : 'var(--bg)'}; color:#fff; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:900; flex-shrink:0; margin-top:2px;">
                    ${isDone ? '✓' : ''}
                </div>
                <div style="flex:1; min-width:0;">
                    <div style="display:flex; justify-content:space-between; align-items:center; gap:4px; flex-wrap:wrap;">
                        <span style="font-size:11px; font-weight:800; color:var(--acc);">${it.timing}</span>
                        <div style="display:flex; align-items:center; gap:4px; flex-wrap:wrap;">
                            ${extraBadgeHtml}
                            ${incomingBtn}
                            ${stockBadge}
                            ${waterQuickBtn}
                            <span style="font-size:10px; font-weight:700; padding:1px 6px; border-radius:6px; background:var(--card); border:1px solid var(--line); color:var(--dim);">${it.tag}</span>
                            <button type="button" onclick="event.stopPropagation(); openAddSupplementModal('${it.id}')" style="background:transparent; border:1px solid var(--line); color:var(--dim); font-size:10px; font-weight:700; padding:1px 6px; border-radius:6px; cursor:pointer;" title="แก้ไข / ตั้งค่าเมื่อของหมด">⚙️ จัดการ</button>
                        </div>
                    </div>
                    <div style="font-weight:800; font-size:14px; color:${isDone ? '#059669' : 'var(--tx)'}; margin-top:2px; ${isDone ? 'text-decoration:line-through; opacity:0.85;' : ''}">
                        ${it.name} <span style="font-size:12px; font-weight:700; color:var(--acc);">(${it.dose})</span>
                    </div>
                    ${(ingChip || expChip) ? `<div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:2px;">${ingChip} ${expChip}</div>` : ''}
                    <div style="font-size:11.5px; color:var(--dim); margin-top:2px; line-height:1.4;">
                        ${it.benefit}
                    </div>
                </div>
            </div>
        `;
    };

    const slotsHtml = activeSlots.map((slot, sIdx) => {
        let slotItemsHtml = '';
        slot.items.forEach(it => {
            slotItemsHtml += renderItemRow(it);
            if (slot.id === 'slot_lunch' && it.id === 'supp_lunch_acv' && isShift) {
                const movedList = activeSlots[0].items.filter(x => x.shiftMoveToLunch);
                movedList.forEach(meditaItem => {
                    slotItemsHtml += renderItemRow(
                        { ...meditaItem, timing: 'ก่อนอาหารมื้อแรก (ย้ายมาจากช่วงเช้า)' },
                        '<span style="background:rgba(245,158,11,0.2); color:#d97706; font-size:10px; font-weight:800; padding:1px 6px; border-radius:6px;">↪️ โหมดวันเข้าเวร</span>'
                    );
                });
            }
        });

        if (!slotItemsHtml) {
            slotItemsHtml = `<div style="text-align:center; padding:10px; font-size:12px; color:var(--dim); background:var(--card2); border-radius:8px;">ไม่มีรายการที่เปิดทานในช่วงเวลานี้</div>`;
        }

        const reqItems = slot.items.filter(it => !(isShift && it.skipOnShift) && !(isShift && it.shiftMoveToLunch && slot.id === 'slot_morning') && !it.optional);
        if (slot.id === 'slot_lunch' && isShift) {
            const movedList = activeSlots[0].items.filter(x => x.shiftMoveToLunch);
            reqItems.push(...movedList);
        }
        const slotDoneCount = reqItems.filter(it => !!supps[it.id]).length;
        const slotAllDone = reqItems.length > 0 && slotDoneCount === reqItems.length;
        const isCurrentWindow = sIdx === activeSlotIdx;

        const startIfQuickBtn = slot.id === 'slot_dinner' ? `
            <div style="margin-top:8px; display:flex; justify-content:flex-end;">
                <button type="button" class="btn sm" onclick="if(!D.if?.on && typeof toggleFast==='function'){toggleFast();} else {go('if');}" style="width:auto; padding:6px 12px; font-size:11.5px; font-weight:800; background:linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color:#fff; border:none; border-radius:8px; cursor:pointer;">
                    ⏱️ ${D.if?.on ? 'กำลังนับเวลา IF อยู่ (ดูนาฬิกา ❯)' : 'จบมื้อที่ 2 แล้ว — เริ่มนับเวลา IF ทันที!'}
                </button>
            </div>
        ` : '';

        return `
            <div class="card" style="margin-bottom:12px; border:${isCurrentWindow ? '1.5px solid ' + slot.color : '1px solid var(--line)'};">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px; margin-bottom:10px;">
                    <div>
                        <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                            <span style="font-size:18px;">${slot.icon}</span>
                            <h3 style="margin:0; font-size:15px; font-weight:900; color:var(--tx);">${slot.title}</h3>
                            ${isCurrentWindow ? `<span style="background:${slot.color}22; color:${slot.color}; border:1px solid ${slot.color}55; font-size:10px; font-weight:800; padding:1px 7px; border-radius:99px;">⏰ ช่วงเวลานี้</span>` : ''}
                        </div>
                        <div style="font-size:11.5px; color:var(--dim); margin-top:2px;">
                            🕒 <b>${slot.timeHint}</b> • <span style="color:${slot.color}; font-weight:700;">${slot.badge}</span>
                        </div>
                    </div>
                    <button type="button" class="btn sm" onclick="toggleSuppSlotAll('${slot.id}')" style="width:auto; flex:0 0 auto; padding:5px 10px; font-size:11px; font-weight:800; border-radius:8px; background:${slotAllDone ? 'rgba(16,185,129,0.16)' : 'var(--card2)'}; color:${slotAllDone ? '#059669' : 'var(--tx)'}; border:1px solid ${slotAllDone ? '#10b981' : 'var(--line)'}; cursor:pointer;">
                        ${slotAllDone ? '✓ ครบมื้อนี้แล้ว' : `เช็กครบ (${slotDoneCount}/${reqItems.length})`}
                    </button>
                </div>

                ${slotItemsHtml}

                ${slot.note ? `
                    <div style="margin-top:6px; padding:8px 10px; border-radius:8px; background:rgba(245,158,11,0.08); border-left:3px solid #f59e0b; font-size:11.5px; color:var(--tx); line-height:1.45;">
                        💡 <b>Note:</b> ${slot.note}
                    </div>
                ` : ''}
                ${startIfQuickBtn}
            </div>
        `;
    }).join('');

    // Build Active Supplements Inventory Table (#activeInventoryTable)
    const activeInventoryItems = inv.filter(it => it.active !== false && !it.waterMl && !/กล้วย/.test(it.name));
    const activeInvTableHtml = `
        <div class="card" style="margin-bottom:12px;">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:8px; flex-wrap:wrap;">
                <div>
                    <h3 style="margin:0; font-size:15px; font-weight:900; color:var(--tx);">📦 INVENTORY: ACTIVE SUPPLEMENTS (${activeInventoryItems.length} รายการ)</h3>
                    <div style="font-size:11.5px; color:var(--dim);">คลังอาหารเสริมประจำวัน (Daily Maintenance) พร้อมสารสำคัญ วันหมดอายุ และวัตถุประสงค์</div>
                </div>
            </div>
            <div style="overflow-x:auto; -webkit-overflow-scrolling:touch; border:1px solid var(--line); border-radius:10px;">
                <table style="width:100%; border-collapse:collapse; font-size:12px; min-width:540px;">
                    <thead>
                        <tr style="background:var(--card2); color:var(--dim); text-align:left; border-bottom:1px solid var(--line);">
                            <th style="padding:8px 10px; font-weight:800;">Item Name</th>
                            <th style="padding:8px 10px; font-weight:800;">Active Ingredient(s)</th>
                            <th style="padding:8px 10px; font-weight:800;">Dosage / Serving</th>
                            <th style="padding:8px 10px; font-weight:800;">Exp Date</th>
                            <th style="padding:8px 10px; font-weight:800;">Daily Purpose</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${activeInventoryItems.map(item => `
                            <tr onclick="openAddSupplementModal('${item.id}')" style="border-bottom:1px solid var(--line); cursor:pointer; ${item.optional ? 'background:rgba(59,130,246,0.04);' : ''}" title="แตะเพื่อแก้ไขข้อมูล">
                                <td style="padding:8px 10px; font-weight:800; color:${item.optional ? '#2563eb' : 'var(--tx)'};">${item.name}</td>
                                <td style="padding:8px 10px; color:var(--acc); font-weight:600;">${item.activeIngredients || '-'}</td>
                                <td style="padding:8px 10px; font-weight:700; white-space:nowrap;">${item.id === 'supp_lunch_fishoil' ? '1 Cap (x2/day)' : item.dose}</td>
                                <td style="padding:8px 10px; color:var(--dim); white-space:nowrap;">${item.expDate || '-'}</td>
                                <td style="padding:8px 10px; color:var(--dim);">${item.benefit}</td>
                            </tr>
                        `).filter((_, idx, arr) => {
                            // Combine duplicate Fish Oil row in summary table as 1 Cap (x2/day)
                            const item = activeInventoryItems[idx];
                            if (item.id === 'supp_din_fishoil') return false;
                            return true;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;

    // Build Standby / Hold Inventory Section
    const standbyHtml = `
        <div class="card" style="margin-bottom:12px; border:1.5px solid rgba(239,68,68,0.3); background:rgba(239,68,68,0.03);">
            <div style="margin-bottom:8px;">
                <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                    <span style="font-size:17px;">🛑</span>
                    <h3 style="margin:0; font-size:15px; font-weight:900; color:#dc2626;">INVENTORY: STANDBY / HOLD (กองหนุน)</h3>
                </div>
                <div style="font-size:11.5px; color:#b91c1c; font-weight:700; margin-top:2px;">
                    *หมวดหมู่นี้ใช้แบบ On-Demand หรือรอสลับใช้ เพื่อป้องกันตับทำงานหนัก*
                </div>
            </div>

            <div style="overflow-x:auto; -webkit-overflow-scrolling:touch; border:1px solid var(--line); border-radius:10px; background:var(--card);">
                <table style="width:100%; border-collapse:collapse; font-size:12px; min-width:520px;">
                    <thead>
                        <tr style="background:var(--card2); color:var(--dim); text-align:left; border-bottom:1px solid var(--line);">
                            <th style="padding:8px 10px; font-weight:800;">Item Name</th>
                            <th style="padding:8px 10px; font-weight:800;">Exp Date</th>
                            <th style="padding:8px 10px; font-weight:800;">Condition to Use</th>
                            <th style="padding:8px 10px; font-weight:800;">Reason for Holding</th>
                            <th style="padding:8px 10px; font-weight:800; text-align:right;">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${standbyList.map(h => {
                            const usedToday = !!supps[h.id];
                            return `
                                <tr style="border-bottom:1px solid var(--line); background:${usedToday ? 'rgba(245,158,11,0.08)' : 'transparent'};">
                                    <td style="padding:8px 10px; font-weight:800; color:var(--tx);">${h.name}</td>
                                    <td style="padding:8px 10px; color:var(--dim); white-space:nowrap;">${h.expDate}</td>
                                    <td style="padding:8px 10px; color:#d97706; font-weight:700;">${h.condition}</td>
                                    <td style="padding:8px 10px; color:var(--dim);">${h.reason}</td>
                                    <td style="padding:8px 10px; text-align:right; white-space:nowrap;">
                                        <button type="button" onclick="toggleStandbySpecialUse('${h.id}')" style="padding:4px 8px; font-size:10.5px; font-weight:800; border-radius:6px; border:1px solid ${usedToday ? '#10b981' : 'var(--line)'}; background:${usedToday ? 'rgba(16,185,129,0.15)' : 'var(--card2)'}; color:${usedToday ? '#059669' : 'var(--tx)'}; cursor:pointer;">
                                            ${usedToday ? '✓ ใช้วันนี้แล้ว' : '🍽️ ใช้ On-Demand วันนี้'}
                                        </button>
                                        <button type="button" onclick="promoteStandbyToActive('${h.id}')" style="padding:4px 7px; font-size:10.5px; font-weight:700; border-radius:6px; border:1px solid var(--line); background:transparent; color:var(--dim); cursor:pointer; margin-left:4px;" title="สลับเข้าตารางหลักเมื่อตัวเดิมหมด">
                                            🔄
                                        </button>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;

    const pausedSectionHtml = pausedItems.length > 0 ? `
        <div class="card" style="margin-bottom:12px; border:1px dashed var(--line); background:var(--card2);">
            <div style="font-weight:800; font-size:13.5px; color:var(--dim); margin-bottom:8px;">
                ⏸️ รายการที่หมดชั่วคราว / พักการทาน (${pausedItems.length} รายการ)
            </div>
            <div style="display:flex; flex-direction:column; gap:6px;">
                ${pausedItems.map(p => `
                    <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 10px; border-radius:8px; background:var(--card); border:1px solid var(--line);">
                        <div>
                            <div style="font-weight:700; font-size:13px; color:var(--dim);">${p.name} (${p.dose})</div>
                            <div style="font-size:11px; color:var(--dim);">${p.timing} • ${p.tag}</div>
                        </div>
                        <div style="display:flex; gap:6px;">
                            <button type="button" class="btn sm" onclick="toggleSuppItemActive('${p.id}', event)" style="width:auto; padding:4px 10px; font-size:11px; background:rgba(16,185,129,0.15); color:#059669; border:1px solid #10b981; font-weight:800; border-radius:6px; cursor:pointer;">▶️ เปิดทานต่อ</button>
                            <button type="button" class="btn sm g" onclick="openAddSupplementModal('${p.id}')" style="width:auto; padding:4px 8px; font-size:11px; border-radius:6px;">✏️</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    ` : '';

    pageEl.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px; margin-bottom:8px; flex-wrap:wrap;">
            <div>
                <h1 style="margin:0; font-size:21px;">💊 Daily Supplement & IF Routine</h1>
                <div class="sub" style="margin-top:5px; line-height:1.5;">
                    <b style="color:var(--acc);">Core Goals (Daily Maintenance):</b><br>
                    1. ลดไตรกลีเซอไรด์ (เป้าหมายจาก 333) และบำรุงตับ<br>
                    2. ลดไขมันช่องท้อง (Visceral Fat 11) และสร้างกล้ามเนื้อ<br>
                    3. บำรุงระบบประสาท สุขภาพผิวพรรณ และข้อต่อในระยะยาว<br>
                    <b style="color:#059669;">Rules:</b> ทำ IF 2 มื้อ • เซฟตับ (ห้าม Overdose) • ไม่กินสารให้ความหวานช่วงฟาสต์
                </div>
            </div>
        </div>

        <!-- Action Bar: Add New Supplement & AI Stack Audit -->
        <div style="display:grid; grid-template-columns:1.3fr 1fr; gap:8px; margin-bottom:12px;">
            <button type="button" class="btn sm" onclick="openAddSupplementModal()" style="padding:10px; font-size:12.5px; font-weight:800; background:linear-gradient(135deg, var(--acc) 0%, #ea580c 100%); color:#fff; border:none; border-radius:10px; cursor:pointer; box-shadow:0 3px 10px rgba(234,88,12,0.22);">
                ➕ เพิ่มตัวใหม่ / AI จัดตาราง
            </button>
            <button type="button" class="btn sm" onclick="openSuppStackAuditModal()" style="padding:10px; font-size:12px; font-weight:800; background:var(--card); color:var(--tx); border:1.5px solid var(--line); border-radius:10px; cursor:pointer;">
                🩺 วิเคราะห์สมดุล & ตับ
            </button>
        </div>

        <!-- Master Summary & Shift Mode Card -->
        <div class="card" style="margin-bottom:12px; background:linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color:#fff; border:none; box-shadow:0 6px 18px rgba(15,23,42,0.18);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <div>
                    <div style="font-size:11px; color:#94a3b8; font-weight:700;">📅 DAILY TIME TABLE วันนี้ (${iso()})</div>
                    <div style="display:flex; align-items:baseline; gap:6px; margin-top:2px;">
                        <span style="font-size:28px; font-weight:900; color:#10b981; line-height:1;">${stats.doneReq}/${stats.totalReq}</span>
                        <span style="font-size:13px; color:#cbd5e1; font-weight:700;">รายการหลัก (${stats.pct}%)</span>
                        ${stats.optionalDone > 0 ? `<span style="font-size:11px; color:#fde047; font-weight:700;">+${stats.optionalDone} เสริม</span>` : ''}
                    </div>
                </div>
                <div style="display:flex; gap:6px;">
                    <button type="button" class="btn sm" onclick="checkAllSuppsToday(true)" style="width:auto; padding:6px 10px; font-size:11px; background:#10b981; color:#fff; font-weight:800; border-radius:8px; border:none; cursor:pointer;">✓ เช็กครบทั้งวัน</button>
                    <button type="button" class="btn sm" onclick="checkAllSuppsToday(false)" style="width:auto; padding:6px 9px; font-size:11px; background:rgba(255,255,255,0.12); color:#cbd5e1; font-weight:700; border-radius:8px; border:1px solid rgba(255,255,255,0.2); cursor:pointer;">↺ รีเซ็ต</button>
                </div>
            </div>

            <div class="bar" style="height:8px; background:rgba(255,255,255,0.14); margin-bottom:12px;">
                <i style="width:${stats.pct}%; background:linear-gradient(90deg, #10b981, #34d399);"></i>
            </div>

            <!-- 1-Tap Shift / Rest Day Switcher -->
            <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.15); border-radius:10px; padding:8px 10px;">
                <div style="flex:1;">
                    <div style="font-size:12px; font-weight:800; color:${isShift ? '#fde047' : '#fff'};">
                        ${isShift ? '🏥 โหมดวันเข้าเวรเหนื่อย / งดออกกำลังกาย (เปิดอยู่)' : '🏋️ โหมดวันออกกำลังกายปกติ (Pre & Post-Workout)'}
                    </div>
                    <div style="font-size:10.5px; color:#cbd5e1; margin-top:1px;">
                        ${isShift ? 'งดเซ็ต Pre-Workout (Creatine + L-Carnitine) และย้าย Medita A1C ไปมื้อแรกให้อัตโนมัติ' : 'วันที่เลิกงานดึก ห้ามทานข้าวเย็นก่อนออกกำลัง ให้ทานเซ็ต Pre-Workout รองท้องแล้วไปลุยเลย'}
                    </div>
                </div>
                <button type="button" class="btn sm" onclick="toggleSuppShiftMode()" style="width:auto; flex:0 0 auto; padding:6px 10px; font-size:11px; font-weight:800; border-radius:8px; background:${isShift ? '#f59e0b' : 'rgba(255,255,255,0.15)'}; color:#fff; border:none; cursor:pointer;">
                    ${isShift ? '🏥 วันเข้าเวร ⇄' : 'สลับวันเข้าเวร ⇄'}
                </button>
            </div>
        </div>

        <!-- 3 Core Goals Banner -->
        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px; margin-bottom:12px; text-align:center;">
            <div style="background:var(--card); border:1px solid var(--line); border-radius:10px; padding:8px 6px;">
                <div style="font-size:16px;">🛡️</div>
                <div style="font-size:11px; font-weight:800; color:var(--acc); margin-top:2px;">ลด TG (333) & บำรุงตับ</div>
                <div style="font-size:10px; color:var(--dim);">Fish Oil×2 • ACV • Gluta+</div>
            </div>
            <div style="background:var(--card); border:1px solid var(--line); border-radius:10px; padding:8px 6px;">
                <div style="font-size:16px;">💪</div>
                <div style="font-size:11px; font-weight:800; color:#3b82f6; margin-top:2px;">ลด VF 11 & กล้ามเนื้อ</div>
                <div style="font-size:10px; color:var(--dim);">Creatine • Carnitine • Soy</div>
            </div>
            <div style="background:var(--card); border:1px solid var(--line); border-radius:10px; padding:8px 6px;">
                <div style="font-size:16px;">✨</div>
                <div style="font-size:11px; font-weight:800; color:#10b981; margin-top:2px;">ประสาท ผิว & ข้อต่อ</div>
                <div style="font-size:10px; color:var(--dim);">B Complex • Vida • Asta</div>
            </div>
        </div>

        ${slotsHtml}

        ${activeInvTableHtml}

        ${standbyHtml}

        ${pausedSectionHtml}
    `;
}

function showW(k) {
    document.querySelectorAll('#wSel button').forEach(b => b.classList.toggle('on', b.dataset.w === k));
    const items = fullItems(k), lab = { warm: '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;color:#f24e1e"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> WARM-UP · เตรียมหลังและสะโพก', main: '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><path d="M14.4 14.4l-4.8-4.8"/><path d="M6.5 10.8l-4.3 4.3a2 2 0 0 0 2.8 2.8l4.3-4.3"/><path d="M17.5 13.2l4.3-4.3a2 2 0 0 0-2.8-2.8l-4.3 4.3"/><path d="M2.2 16.2l3 3"/><path d="M18.8 4.8l-3 3"/><path d="M7 9l8 8"/><path d="M9 7l8 8"/></svg> ส่วนหลัก', cool: '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/><line x1="20" y1="16" x2="16" y2="20"/><line x1="4" y1="8" x2="8" y2="4"/><line x1="20" y1="8" x2="16" y2="4"/><line x1="4" y1="16" x2="8" y2="20"/></svg> COOL-DOWN · คลายและฟื้นฟู' };
    let cur = '', h = '';
    items.forEach((it,i)=>{
        if(it.ph!==cur){cur=it.ph;h+=`<div class="sec">${lab[cur]}</div>`}
        const e=EX[it.e];
        const wInfo = getExerciseWeightInfo(it.e);
        h+=`<div class="exi"><div class="num" style="color:${cur==='main'?'var(--acc)':cur==='warm'?'var(--warn)':'var(--vio)'}">${i+1}</div>
    ${fig(it.e,76)}
    <div style="flex:1"><h3 style="font-size:14.5px">${e.n}</h3>
    <div class="sub" style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
      <span>${wInfo.label || e.eq}</span>
      ${wInfo.isCustom ? '<span class="tag o" style="font-size:10px;padding:1px 6px;">ปรับแต่งเอง</span>' : (wInfo.kg != null ? '<span class="tag gr" style="font-size:10px;padding:1px 6px;">ตามโปรแกรม P' + (phIdx() + 1) + '</span>' : '')}
    </div>
    <div style="margin-top:5px;font-size:12.5px;font-weight:700;color:var(--acc)">
      ${it.sets>1?it.sets+' เซ็ต × ':''}${it.type==='time'?fmt(it.t):it.r}${e.side?' (ทั้ง 2 ข้าง)':''}${it.rest?' • พัก '+it.rest+' วิ':''}</div>
    <ul class="cue">${e.cue.map(c=>'<li>'+c+'</li>').join('')}</ul>
    <a class="yt" href="javascript:void(0)" onclick="showExModal('${it.e}')">▶ ดูตัวอย่างท่านี้</a>
    </div></div>`;
    });
    const outdoorDetailSwitcher = (['R', 'Z'].includes(k) || W[k].warm === 'lite') ? `
        <div style="display:flex; align-items:center; justify-content:space-between; margin:10px 0; padding:8px 12px; background:var(--card2); border-radius:10px; border:1px solid var(--line);">
            <div>
                <div style="font-weight:700; font-size:12.5px; color:var(--tx);">${D.outdoorMode ? '🌲 โหมดเดินสวนสาธารณะ (ไม่ใช้เสื่อ)' : '🏠 โหมดในบ้าน (ใช้เสื่อโยคะ)'}</div>
                <div style="font-size:11px; color:var(--dim);">${D.outdoorMode ? 'ชุดวอร์ม & คูลดาวน์ท่ายืน/ม้านั่ง เหมาะกับการไปเดินสวน' : 'ชุดวอร์ม & คูลดาวน์มาตรฐานบนเสื่อโยคะ'}</div>
            </div>
            <button class="btn sm" onclick="toggleOutdoorMode(); showW('${k}')" style="width:auto; padding:4px 10px; font-size:11.5px; font-weight:700; border-radius:8px; background:${D.outdoorMode ? 'rgba(16,185,129,0.15)' : 'var(--card)'}; border:1px solid ${D.outdoorMode ? '#10b981' : 'var(--line)'}; color:${D.outdoorMode ? '#059669' : 'var(--dim)'}; cursor:pointer;">
                ${D.outdoorMode ? '🌲 สวนสาธารณะ ⇄' : '🏠 ในบ้าน ⇄'}
            </button>
        </div>
    ` : '';

    document.getElementById('wDetail').innerHTML = `<div class="card">
    <div class="row"><h3>${W[k].ic} ${W[k].n}</h3><span class="tag b">~${estMin(k)} นาที</span></div>${outdoorDetailSwitcher}${h}
    <button class="btn" style="margin-top:14px" onclick="startW('${k}')">▶ เริ่มเลย</button></div>`;
}
function toggleBS() { D.bs = document.getElementById('bsMode').checked; save(); render() }

