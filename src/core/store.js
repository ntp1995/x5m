/* FitCoach v3.0 — Timezone Engine, Reactive State Store (D) & Session Builder */
/* ============ THAI TIMEZONE (Asia/Bangkok, GMT+7) HELPERS ============ */
function iso(d = new Date()) {
    try {
        // Ensure date string strictly adheres to Thai Local Date (YYYY-MM-DD)
        return new Intl.DateTimeFormat('en-CA', {
            timeZone: 'Asia/Bangkok',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).format(d instanceof Date ? d : new Date(d));
    } catch (e) {
        const dt = d instanceof Date ? d : new Date(d);
        const y = dt.getFullYear();
        const m = String(dt.getMonth() + 1).padStart(2, '0');
        const day = String(dt.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    }
}

function formatThaiTime(dateObj = new Date()) {
    try {
        return new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Asia/Bangkok',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).format(dateObj instanceof Date ? dateObj : new Date(dateObj));
    } catch (e) {
        const dt = dateObj instanceof Date ? dateObj : new Date(dateObj);
        return String(dt.getHours()).padStart(2, '0') + ':' + String(dt.getMinutes()).padStart(2, '0');
    }
}

function getThaiDayOfWeek(d = new Date()) {
    try {
        const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Bangkok', weekday: 'short' }).format(d instanceof Date ? d : new Date(d));
        const map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
        return map[parts] !== undefined ? map[parts] : d.getDay();
    } catch (e) {
        return d.getDay();
    }
}

function fmt(s) { s = Math.max(0, Math.round(s)); return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0') }
function exOf(k) { return (D.bs && SAFE[k]) ? SAFE[k] : k }
function todayCheck() { return D.checks.find(x => x.d === iso()) || null }

function weighStreak() {
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const ds = iso(d);
        if (D.checks.some(x => x.d === ds)) streak++; else break;
    }
    return streak;
}

function daysSinceWeigh() {
    const sorted = D.checks.filter(x => x.w).sort((a, b) => b.d.localeCompare(a.d));
    if (!sorted.length) return 999;
    const todayMs = new Date(iso() + 'T00:00:00+07:00').getTime();
    const lastMs = new Date(sorted[0].d + 'T00:00:00+07:00').getTime();
    return Math.max(0, Math.floor((todayMs - lastMs) / 864e5));
}


/* ============ STATE ============ */
const D = JSON.parse(localStorage.getItem('fit') || 'null') || { start: iso(), bs: false, outdoorMode: false, checks: [{ d: iso(), w: 77.3, bf: 25.9, hrv: 73, pain: null }], sessions: [], sets: [], cfg: { url: '', key: '', code: '' } };
if (D.schOffs && !D.schOffsUpdatedAt) { D.schOffsUpdatedAt = Date.now(); }
if (D.outdoorMode === undefined) { D.outdoorMode = false; }
D.cfg = D.cfg || { url: '', key: '', code: '', aiKey: '', aiKeyBackup: '' };
if (!D.cfg.savedFoods || D.cfg.savedFoods.length === 0) {
    D.cfg.savedFoods = [
        { id: 'fav_def_1', name: 'นมโปรตีนพาสเจอร์ไรส์ RTD', portion: '1 ขวด (350 มล.)', cal: 170, pro: 28, carbs: 8, fat: 2.5, sugar: 2, sodium: 160 },
        { id: 'fav_def_2', name: 'กล้วยหอม', portion: '1 ผล', cal: 105, pro: 1, carbs: 27, fat: 0, sugar: 14, sodium: 1 },
        { id: 'fav_def_3', name: 'ไข่ต้ม', portion: '2 ฟอง', cal: 140, pro: 12, carbs: 1, fat: 10, sugar: 0, sodium: 120 },
        { id: 'fav_def_4', name: 'อกไก่นุ่ม 7-Eleven', portion: '1 ชิ้น (100g)', cal: 100, pro: 20, carbs: 1, fat: 1.5, sugar: 1, sodium: 350 },
        { id: 'fav_def_5', name: 'ต้มยำไก่ใส่เห็ดพร้อมข้าวสวย', portion: '1 ชุด', cal: 470, pro: 32, carbs: 58, fat: 10, sugar: 4, sodium: 750 }
    ];
}
let CAL_TARGET = D.cfg.calTarget || 1800;
let PROTEIN_TARGET = D.cfg.proteinTarget || 155;
let FAT_TARGET = D.cfg.fatTarget || 50;
let CARBS_TARGET = D.cfg.carbsTarget || 185;
let SUGAR_TARGET = D.cfg.sugarTarget || 25;
let SODIUM_TARGET = D.cfg.sodiumTarget || 2000;
// Migrate water target & records from glasses (<= 50) to ml (* 250)
if (D.cfg.waterTarget && D.cfg.waterTarget <= 50) {
    D.cfg.waterTarget = D.cfg.waterTarget * 250;
}
let WATER_TARGET = D.cfg.waterTarget || 2700;
(D.checks || []).forEach(c => {
    if (c.water != null && c.water > 0 && c.water <= 50) {
        c.water = Math.round(c.water * 250);
    }
    // Auto-heal cal, protein, carbs, fat, sugar, sodium if meals exist
    if (c.meals && c.meals.length > 0) {
        let mCal = 0, mPro = 0, mCarbs = 0, mFat = 0, mSugar = 0, mSodium = 0;
        c.meals.forEach(m => {
            mCal += Number(m.cal) || 0;
            mPro += Number(m.pro) || 0;
            mCarbs += Number(m.carbs) || 0;
            mFat += Number(m.fat) || 0;
            mSugar += Number(m.sugar) || 0;
            mSodium += Number(m.sodium) || 0;
        });
        c.cal = Math.round(mCal);
        c.protein = Math.round(mPro);
        c.carbs = Math.round(mCarbs);
        c.fat = Math.round(mFat);
        c.sugar = Math.round(mSugar);
        c.sodium = Math.round(mSodium);
    }
});


/* ============ BUILD FULL SESSION ============ */
function toggleOutdoorMode() {
    D.outdoorMode = !D.outdoorMode;
    save();
    render();
    if (typeof pushToCloud === 'function') pushToCloud();
    msg(D.outdoorMode ? '🌲 สลับเป็นโหมดเดินสวนสาธารณะ (ไม่ใช้เสื่อโยคะ)' : '🏠 สลับเป็นโหมดในบ้าน (ใช้เสื่อโยคะ)');
}

function fullItems(k) {
    const w = W[k];
    const isOutdoor = !!D.outdoorMode && (['R', 'Z'].includes(k) || w.warm === 'lite');
    let warm = (isOutdoor ? WARM_OUTDOOR : (w.warm === 'full' ? WARM_FULL : WARM_LITE)).map(x => ({ ...x, ph: 'warm' }));
    let items = w.items.map(x => ({ ...x }));
    let cool = (isOutdoor ? COOL_OUTDOOR : COOL).map(x => ({ ...x, ph: 'cool' }));
    const morningM = getMorningCardioMinutesToday();

    if (isOutdoor && k === 'R') {
        // Outdoor Park Walking Active Recovery: 30 minutes continuous walk in the park
        items = [{ e: 'walk', sets: 1, type: 'time', t: 1800, after: 60 }];
    }

    if (morningM > 0) {
        // Smart Cardio Adaptation based on morning walk
        if (k === 'Z' && !D.forceFullCardio) {
            if (morningM >= 30) {
                // Walked 30+ mins in the morning: Zone 2 goal fulfilled!
                items = items.filter(x => x.e !== 'z2');
                warm = warm.filter(x => x.e !== 'w_walk' && x.e !== 'w_out_walk');
                cool = cool.filter(x => x.e !== 'c_walk' && x.e !== 'c_out_walk');
            } else {
                // Deduct morning minutes from 35-min target
                const remM = Math.max(5, 35 - morningM);
                items = items.map(x => x.e === 'z2' ? { ...x, t: remM * 60 } : x);
                warm = warm.filter(x => x.e !== 'w_walk' && x.e !== 'w_out_walk');
                cool = cool.filter(x => x.e !== 'c_walk' && x.e !== 'c_out_walk');
            }
        } else if (k === 'R' && !D.forceFullCardio) {
            if (morningM >= 20) {
                items = items.filter(x => x.e !== 'walk');
                warm = warm.filter(x => x.e !== 'w_walk' && x.e !== 'w_out_walk');
                cool = cool.filter(x => x.e !== 'c_walk' && x.e !== 'c_out_walk');
            } else {
                const remM = Math.max(5, (isOutdoor ? 30 : 25) - morningM);
                items = items.map(x => x.e === 'walk' ? { ...x, t: remM * 60 } : x);
                warm = warm.filter(x => x.e !== 'w_walk' && x.e !== 'w_out_walk');
                cool = cool.filter(x => x.e !== 'c_walk' && x.e !== 'c_out_walk');
            }
        } else if (k === 'A' && !D.forceEveningCardio) {
            items = items.filter(x => x.e !== 'z2');
            warm = warm.filter(x => x.e !== 'w_walk' && x.e !== 'w_out_walk');
            cool = cool.filter(x => x.e !== 'c_walk' && x.e !== 'c_out_walk');
        } else if (['B', 'C', 'H'].includes(k)) {
            // Already walked in morning: remove redundant walking warm-up & cool-down
            warm = warm.filter(x => x.e !== 'w_walk' && x.e !== 'w_out_walk');
            cool = cool.filter(x => x.e !== 'c_walk' && x.e !== 'c_out_walk');
        }
    }

    const main = items.map(x => ({ ...x, e: exOf(x.e), ph: 'main' }));
    if (main.length) main[main.length - 1] = { ...main[main.length - 1], after: 60 };
    return [...warm, ...main, ...cool];
}
function estMin(k) { let s = 0; fullItems(k).forEach(it => { const n = it.sets || 1; s += n * (it.t || 35) + (n - 1) * (it.rest || 0) + (it.after || 0) }); return Math.round(s / 60) }

/* ============ AI USAGE & QUOTA ENGINE ============ */
if (!D.aiUsage) { D.aiUsage = {}; }

function recordAiUsage(actionType = 'วิเคราะห์ AI', isSuccess = true) {
    try {
        const today = iso();
        if (!D.aiUsage) D.aiUsage = {};
        if (!D.aiUsage[today]) {
            D.aiUsage[today] = { count: 0, items: [], lastTime: '' };
        }
        D.aiUsage[today].count = (D.aiUsage[today].count || 0) + 1;
        D.aiUsage[today].lastTime = formatThaiTime();
        if (!D.aiUsage[today].items) D.aiUsage[today].items = [];
        D.aiUsage[today].items.unshift({
            time: formatThaiTime(),
            action: actionType,
            success: isSuccess
        });
        if (D.aiUsage[today].items.length > 20) {
            D.aiUsage[today].items = D.aiUsage[today].items.slice(0, 20);
        }
        if (typeof save === 'function') save();
        if (typeof renderAiQuotaWidget === 'function') renderAiQuotaWidget();
    } catch (e) {
        console.warn('recordAiUsage error:', e);
    }
}

function getAiUsageToday() {
    const today = iso();
    const u = (D.aiUsage && D.aiUsage[today]) ? D.aiUsage[today] : { count: 0, items: [], lastTime: '' };
    return {
        today,
        count: u.count || 0,
        dailyLimit: 500,
        rpmLimit: 15,
        tpmLimit: 250000,
        remaining: Math.max(0, 500 - (u.count || 0)),
        lastTime: u.lastTime || '',
        items: u.items || []
    };
}

/* ============================================================================
   FITNESS & MACRO CALCULATION ENGINE (skill.md)
   Anti-YoYo & Plateau Protocol with 4 Dynamic Day Types
   ============================================================================ */

function computeDynamicTDEE(customWeight) {
    const lastCheck = (D && D.checks && D.checks.length) ? (D.checks[D.checks.length - 1] || {}) : {};
    const bio = (D && D.cfg && D.cfg.biometrics) ? D.cfg.biometrics : {};
    const saved = (D && D.cfg && D.cfg.bmrInfo) ? D.cfg.bmrInfo : {};

    const w = Math.max(40, Number(customWeight || lastCheck.w || bio.weight || saved.weight || 78.0));
    const h = Math.max(130, Number(bio.height || saved.height || 168.0));
    const age = Math.max(15, Number(bio.age || saved.age || 31));
    const gender = bio.gender || saved.gender || 'M';

    // NEAT Factor from skill.md:
    // Sedentary: 1.20 | Lightly Active: 1.35 | Moderately Active: 1.50
    const wType = (D && D.cfg && D.cfg.workType) || 'light';
    let neat = 1.35;
    if (wType === 'sedentary') neat = 1.20;
    else if (wType === 'active' || wType === 'moderate') neat = 1.50;

    // 1. BMR (Mifflin-St Jeor Equation)
    const bmr = (10 * w) + (6.25 * h) - (5 * age) + (gender === 'M' ? 5 : -161);

    // 2. Base TDEE (Rest Day)
    const tdeeRest = Math.round(bmr * neat);

    // 3. Exercise Energy additions from skill.md
    // Weight Training (45-60 min): w * 3.5 (~200 - 250 kcal)
    // Cardio (30-45 min): w * 4.0 (~250 - 300 kcal)
    const extraWeightKcal = Math.round(w * 3.5);
    const extraCardioKcal = Math.round(w * 4.0);
    const extraBothKcal = extraWeightKcal + extraCardioKcal;

    // 4. Goal & Deficit / Surplus
    const goalType = (D && D.cfg && D.cfg.goalType) || (saved && saved.goalType) || 'recomp';
    let deficit = 200; // Safe Anti-YoYo Deficit from skill.md (150-200 kcal)
    if (goalType === 'maintain') deficit = 0;
    else if (goalType === 'bulk') deficit = -200; // Surplus +200 kcal

    // 5. Fixed Protein & Fat per kg from skill.md
    const proGrams = Math.round(w * 2.0); // 2.0 g/kg
    const fatGrams = Math.round(w * 0.8); // 0.8 g/kg
    const waterMl = Math.max(2500, Math.round(w * 38));

    function makeDayPlan(typeKey, name, icon, tdeeVal, extraDesc) {
        let rawTarget = tdeeVal - deficit;
        let isClamped = false;
        // Safety Guardrail from skill.md: Target_Calories ห้ามต่ำกว่า BMR เด็ดขาด
        if (rawTarget < bmr) {
            rawTarget = Math.round(bmr);
            isClamped = true;
        }
        const targetCal = Math.round(rawTarget);
        const proKcal = proGrams * 4;
        const fatKcal = fatGrams * 9;
        const remKcal = Math.max(0, targetCal - proKcal - fatKcal);
        const carbsGrams = Math.max(50, Math.round(remKcal / 4));

        return {
            key: typeKey,
            name,
            icon,
            tdee: tdeeVal,
            targetCal,
            pro: proGrams,
            carbs: carbsGrams,
            fat: fatGrams,
            water: waterMl,
            isClamped,
            extraDesc
        };
    }

    const days = {
        rest: makeDayPlan('rest', 'วันพัก (Rest Day)', '🪑', tdeeRest, 'พักฟื้น ฟื้นฟูกล้ามเนื้อและระบบประสาท'),
        weight: makeDayPlan('weight', 'วันเล่นเวท (Weight Day)', '🏋️', tdeeRest + extraWeightKcal, 'โปรแกรม A / Z ยกเวท 45-60 นาที (+ ' + extraWeightKcal + ' kcal)'),
        cardio: makeDayPlan('cardio', 'วันคาร์ดิโอ (Cardio Day)', '🏃', tdeeRest + extraCardioKcal, 'โปรแกรม R / เดินเร็ว Zone 2 35-45 นาที (+ ' + extraCardioKcal + ' kcal)'),
        both: makeDayPlan('both', 'วันเวท + คาร์ดิโอ', '⚡', tdeeRest + extraBothKcal, 'เล่นเวทพร้อมคาร์ดิโอเบิร์นเข้มข้น (+ ' + extraBothKcal + ' kcal)')
    };

    return {
        weight: w,
        height: h,
        age,
        gender,
        bmr: Math.round(bmr),
        neat,
        wType,
        goalType,
        deficit,
        days
    };
}

function getTodayEffectiveDayType() {
    const todayIso = iso();
    const tc = (D && D.checks) ? D.checks.find(x => x.d === todayIso) : null;
    if (tc && tc.dayTypeOverride) {
        return tc.dayTypeOverride;
    }

    // Auto-detect based on workout schedule
    if (typeof isShiftDutyToday === 'function' && isShiftDutyToday()) {
        return 'rest';
    }

    const dow = getThaiDayOfWeek();
    const actualIdx = (dow + (D.schOffs || 0)) % 7;
    const tk = (typeof SCHED !== 'undefined' && SCHED[actualIdx]) ? SCHED[actualIdx] : 'A';

    const morningDone = Boolean(tc && tc.morningCardioDone);
    const morningM = (tc && tc.morningCardioMin) || 0;

    if (tk === 'A' || tk === 'Z') {
        if (morningDone || morningM >= 20) {
            return 'both';
        }
        return 'weight';
    } else if (tk === 'R') {
        return 'cardio';
    }
    return 'rest';
}

function setTodayDayType(typeKey) {
    const todayIso = iso();
    let tc = (D && D.checks) ? D.checks.find(x => x.d === todayIso) : null;
    if (!tc) {
        tc = { d: todayIso, w: null, bf: null, hrv: null, pain: null };
        if (D && D.checks) D.checks.push(tc);
    }
    tc.dayTypeOverride = typeKey;

    const dyn = computeDynamicTDEE();
    const selected = dyn.days[typeKey] || dyn.days.rest;

    CAL_TARGET = selected.targetCal;
    PROTEIN_TARGET = selected.pro;
    CARBS_TARGET = selected.carbs;
    FAT_TARGET = selected.fat;
    WATER_TARGET = selected.water;

    if (D && D.cfg) {
        D.cfg.todayDayType = typeKey;
    }

    if (typeof save === 'function') save();
    if (typeof render === 'function') render();
    if (typeof msg === 'function') {
        msg(`✓ ปรับงบเป็น ${selected.name} (${selected.targetCal} kcal • คาร์บ ${selected.carbs}g)`);
    }
}

function diagnoseWeightPlateau() {
    if (!D || !D.checks || D.checks.length < 2) {
        return {
            status: 'initial',
            title: 'ข้อมูลยังไม่เพียงพอสำหรับการประเมิน',
            badge: 'รอข้อมูลบันทึก',
            color: '#64748b',
            message: 'กรุณาชั่งน้ำหนักตอนเช้าติดต่อกันอย่างน้อย 7-14 วัน เพื่อให้ระบบเริ่มวิเคราะห์อัตราการเผาผลาญ',
            lossPerWk: 0
        };
    }

    const sorted = [...D.checks].filter(c => c.w > 0).sort((a, b) => a.d.localeCompare(b.d));
    if (sorted.length < 2) {
        return {
            status: 'initial',
            title: 'ข้อมูลยังไม่เพียงพอสำหรับการประเมิน',
            badge: 'รอข้อมูลบันทึก',
            color: '#64748b',
            message: 'กรุณาชั่งน้ำหนักตอนเช้าติดต่อกันอย่างน้อย 7-14 วัน เพื่อให้ระบบเริ่มวิเคราะห์อัตราการเผาผลาญ',
            lossPerWk: 0
        };
    }

    const latest = sorted[sorted.length - 1];
    const todayMs = new Date(latest.d).getTime();
    let twoWeeksAgoCheck = sorted[0];
    for (let i = sorted.length - 2; i >= 0; i--) {
        const diffDays = Math.round((todayMs - new Date(sorted[i].d).getTime()) / 864e5);
        if (diffDays >= 12 && diffDays <= 24) {
            twoWeeksAgoCheck = sorted[i];
            break;
        }
    }

    const totalDays = Math.max(1, Math.round((todayMs - new Date(twoWeeksAgoCheck.d).getTime()) / 864e5));
    const totalLoss = twoWeeksAgoCheck.w - latest.w; // positive if lost weight
    const lossPerWk = (totalLoss / totalDays) * 7;

    const dyn = computeDynamicTDEE();

    if (totalDays >= 10 && totalLoss <= 0.2) {
        return {
            status: 'plateau',
            title: 'ตรวจพบสัญญาณน้ำหนักค้าง (Plateau)',
            badge: '⚠️ น้ำหนักคงที่ > 2 สัปดาห์',
            color: '#ea580c',
            bg: '#fff7ed',
            border: '#fdba74',
            lossPerWk: Math.round(lossPerWk * 100) / 100,
            message: 'น้ำหนักตัวไม่ขยับลงมานานกว่า 2 สัปดาห์ ร่างกายอาจเริ่มลดอัตราการเผาผลาญ (Metabolic Adaptation) หรือมีความเครียดสะสม/บวมน้ำ',
            prescription: [
                '🍚 <b>ทำ Refeed Day 1 วัน:</b> ทานแคลอรี่เท่าระดับ TDEE (' + dyn.days.weight.tdee + ' kcal) โดยเพิ่มเฉพาะคาร์โบไฮเดรตที่มีประโยชน์ +60g ถึง +80g เพื่อกระตุ้นฮอร์โมนเลปตินและต่อมไทรอยด์',
                '🔒 <b>ห้ามลดแคลอรี่ต่ำกว่า BMR (' + dyn.bmr + ' kcal):</b> การตัดอาหารเพิ่มในจุดนี้จะยิ่งทำให้น้ำหนักค้างและสูญเสียกล้ามเนื้อ',
                '😴 <b>นอนหลับให้ครบ 7-8 ชม.:</b> ลดฮอร์โมน Cortisol ซึ่งเป็นสาเหตุหลักของการบวมน้ำสะสมใต้ผิวหนัง'
            ]
        };
    }

    if (lossPerWk > 1.0) {
        return {
            status: 'rapid',
            title: 'น้ำหนักลดเร็วเกินเกณฑ์มาตรฐาน',
            badge: '⚡ ลดเร็ว > 1 กก./สัปดาห์',
            color: '#f59e0b',
            bg: '#fefce8',
            border: '#fef08a',
            lossPerWk: Math.round(lossPerWk * 100) / 100,
            message: 'อัตราการลดเฉลี่ย ' + lossPerWk.toFixed(2) + ' kg/สัปดาห์ เสี่ยงต่อการสูญเสียมวลกล้ามเนื้อและน้ำในเซลล์',
            prescription: [
                '🥩 <b>เพิ่มโปรตีนให้แตะ ' + (dyn.weight * 2.0).toFixed(0) + ' กรัม/วัน:</b> เพื่อตรึงมวลกล้ามเนื้อ',
                '🍚 <b>เพิ่มคาร์บในวันฝึกซ้อม +30g:</b> เสริมพลังงานและป้องกันกล้ามเนื้อสลายตัว',
                '💧 <b>ดื่มน้ำให้ได้ ' + (dyn.days.rest.water / 1000).toFixed(1) + ' ลิตร/วัน:</b> รักษาสมดุลเกลือแร่'
            ]
        };
    }

    return {
        status: 'optimal',
        title: 'อัตราการลดไขมันอยู่ในเกณฑ์สมบูรณ์แบบ',
        badge: '✓ ปลอดภัย & รักษากล้ามเนื้อ',
        color: '#10b981',
        bg: '#ecfdf5',
        border: '#a7f3d0',
        lossPerWk: Math.round(lossPerWk * 100) / 100,
        message: 'น้ำหนักและสัดส่วนลดลงเฉลี่ย ' + Math.max(0, lossPerWk).toFixed(2) + ' kg/สัปดาห์ ปลอดภัยต่ออัตราการเผาผลาญและไม่เสี่ยงโยโย่',
        prescription: [
            '🎯 <b>ทำตามแผน Dynamic TDEE ต่อเนื่อง:</b> ทานคาร์บเพิ่มในวันเล่นเวท และลดในวันพัก',
            '📏 <b>วัดรอบเอวสัปดาห์ละ 1 ครั้ง:</b> ควบคู่กับการชั่งน้ำหนักตอนเช้า'
        ]
    };
}

function openAntiPlateauModal() {
    renderAntiPlateauModal();
    const m = document.getElementById('antiPlateauModal');
    if (m) m.style.display = 'flex';
}

function closeAntiPlateauModal() {
    const m = document.getElementById('antiPlateauModal');
    if (m) m.style.display = 'none';
}

function renderAntiPlateauModal() {
    const box = document.getElementById('antiPlateauContentBox');
    if (!box) return;

    const dyn = computeDynamicTDEE();
    const curType = getTodayEffectiveDayType();
    const diag = diagnoseWeightPlateau();

    const rowsHtml = Object.values(dyn.days).map(d => {
        const isCur = d.key === curType;
        return `
        <tr class="${isCur ? 'active' : ''}">
            <td style="text-align:left; font-weight:800;">
                <span style="font-size:16px; margin-right:4px;">${d.icon}</span> ${d.name}
                ${isCur ? '<br><span style="font-size:10px; background:#0284c7; color:#fff; padding:1px 6px; border-radius:99px;">วันนี้</span>' : ''}
            </td>
            <td><b>${d.tdee}</b></td>
            <td style="color:#0284c7;"><b>${d.targetCal}</b> ${d.isClamped ? '<span title="ล็อคไม่ให้ต่ำกว่า BMR">🔒</span>' : ''}</td>
            <td style="color:#059669;"><b>${d.pro}g</b></td>
            <td style="color:#d97706;"><b>${d.carbs}g</b></td>
            <td style="color:#e11d48;"><b>${d.fat}g</b></td>
        </tr>
        `;
    }).join('');

    box.innerHTML = `
        <!-- BMR Safety Floor Banner -->
        <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:16px; padding:12px 14px; margin-bottom:14px; display:flex; align-items:center; gap:12px;">
            <div style="font-size:28px;">🛡️</div>
            <div style="flex:1;">
                <div style="font-size:12.5px; font-weight:800; color:#0369a1;">BMR Safety Floor: ${dyn.bmr} kcal/วัน</div>
                <div style="font-size:11px; color:#475569; margin-top:2px; line-height:1.4;">
                    ระบบล็อคไม่ให้เป้าหมายต่ำกว่า BMR เด็ดขาด เพื่อป้องกันระบบเผาผลาญพัง และอาการโยโย่เอฟเฟกต์ 100%
                </div>
            </div>
        </div>

        <!-- 4 Day Types Comparison Table -->
        <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:18px; padding:12px; margin-bottom:14px; box-shadow:0 2px 8px rgba(15,23,42,0.03);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                <div style="font-size:13px; font-weight:900; color:#0f172a;">ตารางเปรียบเทียบ 4 รูปแบบวัน (Dynamic TDEE)</div>
                <span style="font-size:11px; font-weight:700; color:#64748b;">Deficit: -${dyn.deficit} kcal</span>
            </div>
            <div style="overflow-x:auto;">
                <table class="wm-dyn-table">
                    <thead>
                        <tr>
                            <th style="text-align:left;">ประเภทวัน</th>
                            <th>TDEE</th>
                            <th>เป้าแคล</th>
                            <th>โปรตีน</th>
                            <th>คาร์บ</th>
                            <th>ไขมัน</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHtml}
                    </tbody>
                </table>
            </div>
            <div style="font-size:11px; color:#64748b; line-height:1.4; margin-top:6px;">
                💡 <b>หลักการสมดุล:</b> โปรตีน 2.0g/kg และไขมัน 0.8g/kg คงที่ทุกวัน ส่วน<b>คาร์โบไฮเดรต</b>จะปรับเพิ่มในวันฝึกซ้อมเพื่อให้มีพลังงานยก และลดลงในวันพัก
            </div>
        </div>

        <!-- Plateau Diagnostic Card -->
        <div style="background:${diag.bg || '#f8fafc'}; border:1px solid ${diag.border || '#e2e8f0'}; border-radius:18px; padding:14px 16px; margin-bottom:14px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                <div style="font-size:13.5px; font-weight:900; color:#0f172a;">${diag.title}</div>
                <span style="font-size:10.5px; font-weight:800; color:${diag.color}; background:#fff; padding:2px 8px; border-radius:99px; border:1px solid ${diag.border || '#e2e8f0'};">${diag.badge}</span>
            </div>
            <div style="font-size:11.5px; color:#475569; margin-bottom:8px; line-height:1.45;">
                ${diag.message}
            </div>
            ${diag.prescription ? `
            <div style="background:#ffffff; border-radius:12px; padding:10px 12px; border:1px solid rgba(0,0,0,0.06);">
                <div style="font-size:11px; font-weight:800; color:#0f172a; margin-bottom:4px;">📋 แนวทางปฏิบัติแก้น้ำหนักค้าง (Anti-Plateau Action Plan):</div>
                <div style="display:flex; flex-direction:column; gap:6px; font-size:11px; color:#334155; line-height:1.45;">
                    ${diag.prescription.map(p => `<div>• ${p}</div>`).join('')}
                </div>
            </div>` : ''}
        </div>
    `;
}



