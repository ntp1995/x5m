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


