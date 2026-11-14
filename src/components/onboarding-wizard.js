/* ============================================================================
   FitCoach v3.4.2 — WiseMeal-Inspired 8-Step Body & Plan Calibration Wizard
   Matches Exact UI from User Mockups:
   - Step 1: เลือกเพศของคุณ (Male/Female Avatar Cards + ไม่ต้องการระบุ)
   - Step 2: คุณเกิดปีอะไร? (Vertical Year Roller Picker + Age Auto-Calc)
   - Step 3: ส่วนสูงของคุณคือเท่าไหร่? (cm/ft Toggle + Vertical Height Stadiometer)
   - Step 4: น้ำหนักปัจจุบันของคุณคือเท่าไหร่? (kg/lbs Toggle + Horizontal Scale + ตาชั่ง)
   - Step 4.5: การวิเคราะห์ส่วนบุคคล (Personal Analysis with Clip 📎 + 4-Color BMI Gauge)
   - Step 5: น้ำหนักที่ต้องการของคุณคือเท่าไหร่? (Target Weight Scale + Goal Difficulty %)
   - Step 6: คุณต้องการบรรลุเป้าหมายเมื่อไหร่? (3-Column Date Roller + 0.4kg/wk Feasibility)
   - Step 6.5: เราคาดการณ์ว่าคุณจะบรรลุเป้าหมาย (Trajectory Curve SVG ⛳ + คาดการณ์บรรลุเป้าหมาย)
   - Step 7: ระดับกิจกรรมของคุณเป็นอย่างไร? (4-Dot Activity Slider + Illustration)
   - Step 8: คุณรู้ความสัมพันธ์ระหว่างแคลอรี่และน้ำหนักตัวหรือไม่? (Knowledge Quiz Cards)
   - Step 8.5: ลดพลังงาน 500 kcal ต่อวันอย่างง่ายดาย (Educational Motivation & Plan Summary)
   ============================================================================ */

let obStep = 1;
let obSubStep = ''; // '', 'analysis', 'trajectory', 'completion'
let obMode = 'register'; // 'register' (first login) or 'recalibrate' (ปรับเป้า)
let obHeightUnit = 'cm';
let obWeightUnit = 'kg';

const OB_WORK_FACTORS = { sedentary: 1.15, light: 1.28, active: 1.42, very_active: 1.55 };
const OB_EXERCISE_FACTORS = { none: 0.0, light: 0.12, moderate: 0.25, heavy: 0.35 };

let obState = {
    gender: 'M',
    birthYear: 1995,
    age: 31,
    height: 168.0,
    weight: 78.0,
    targetWeight: 70.0,
    targetYear: 2027,
    targetMonth: 3,
    targetDay: 31,
    activityLevel: 1, // 1: sedentary, 2: light, 3: moderate, 4: very active
    quizAnswer: 1,
    bf: 25.9,
    muscle: 54.3,
    visceral: 11,
    bmrCustom: 1630,
    rhr: 45,
    vo2max: 45,
    hrv: 73,
    courseWeeks: 20,
    goalType: 'recomp',
    workType: 'light',
    exerciseType: 'moderate',
    stepTarget: 8000,
    ifGoal: 16,
    outdoorMode: false
};

function initOnboardingDraftFromStore() {
    const lastCheck = (D && D.checks && D.checks.length) ? (D.checks[D.checks.length - 1] || {}) : {};
    const bio = (D && D.cfg && D.cfg.biometrics) ? D.cfg.biometrics : {};
    const saved = (D && D.cfg && D.cfg.bmrInfo) ? D.cfg.bmrInfo : {};

    obState.weight = Number(lastCheck.w || bio.weight || 78.0);
    obState.height = Number(bio.height || saved.height || 168.0);
    obState.age = Number(bio.age || saved.age || 31);
    obState.birthYear = new Date().getFullYear() - obState.age;
    obState.gender = bio.gender || saved.gender || 'M';
    obState.targetWeight = Number((D && D.cfg && D.cfg.targetWeight) || 70.0);
    obState.courseWeeks = Number((D && D.cfg && D.cfg.courseWeeks) || 20);
    obState.goalType = (saved && saved.goalType) || (D && D.cfg && D.cfg.goalType) || 'recomp';

    const actMap = { sedentary: 1, light: 2, moderate: 3, active: 4, very_active: 4 };
    obState.activityLevel = actMap[D && D.cfg && D.cfg.workType] || 3;

    obState.bf = Number(bio.bf || lastCheck.bf || 25.9);
    obState.muscle = Number(bio.muscle || 54.3);
    obState.visceral = Number(bio.visceral || 11);
    obState.rhr = Number(bio.rhr || 45);
    obState.vo2max = Number(bio.vo2max || 45);
    obState.hrv = Number(bio.hrv || 73);
    obState.bmrCustom = Number(bio.bmrCustom || 1630);
    obState.stepTarget = Number((D && D.cfg && D.cfg.stepTarget) || saved.stepTarget || 8000);
    obState.ifGoal = Number((D && D.if && D.if.goal) || 16);
    obState.outdoorMode = Boolean(D && D.outdoorMode);
}

function openOnboardingWizard(startStep = 1, mode) {
    initOnboardingDraftFromStore();
    obStep = startStep;
    obSubStep = '';
    obMode = mode || ((D && D.cfg && D.cfg.onboardingDone) ? 'recalibrate' : 'register');
    const page = document.getElementById('p-onboard');
    if (page) {
        page.classList.add('on');
        if (document.body) document.body.classList.add('onboard-active');
        renderOnboardingStep();
    }
}

function closeOnboardingWizard(markSkipped = false) {
    const page = document.getElementById('p-onboard');
    if (page) page.classList.remove('on');
    if (document.body) document.body.classList.remove('onboard-active');
    if (markSkipped && D && D.cfg) {
        D.cfg.onboardingDone = true;
        save();
    }
}

function goObStep(step, subStep = '') {
    obStep = step;
    obSubStep = subStep;
    renderOnboardingStep();
    const page = document.getElementById('p-onboard');
    if (page) page.scrollTop = 0;
}

function setObField(key, val) {
    obState[key] = val;
    renderOnboardingStep();
}

function setObHeightUnit(u) {
    obHeightUnit = u;
    renderOnboardingStep();
}

function setObWeightUnit(u) {
    obWeightUnit = u;
    renderOnboardingStep();
}

function onObYearSelect(yr) {
    obState.birthYear = parseInt(yr, 10);
    obState.age = Math.max(15, new Date().getFullYear() - obState.birthYear);
    renderOnboardingStep();
}

function onObHeightDrag(val) {
    obState.height = Math.round(parseFloat(val) * 10) / 10;
    const disp = document.getElementById('obHeightReadout');
    if (disp) {
        disp.textContent = obHeightUnit === 'ft' 
            ? `${(obState.height / 30.48).toFixed(1)} ft` 
            : `${obState.height.toFixed(1)} cm`;
    }
    const line = document.getElementById('obHeightPointerLine');
    if (line) {
        const pct = Math.max(0, Math.min(100, ((200 - obState.height) / (200 - 140)) * 100));
        line.style.top = `${pct}%`;
    }
}

function onObWeightDrag(field, val) {
    obState[field] = Math.round(parseFloat(val) * 10) / 10;
    const numEl = document.getElementById(field === 'weight' ? 'obWeightReadoutNum' : 'obTargetReadoutNum');
    if (numEl) numEl.textContent = obState[field].toFixed(1);

    const diffEl = document.getElementById('obTargetDiffPercent');
    if (diffEl && field === 'targetWeight') {
        const pctLoss = Math.max(0, ((obState.weight - obState.targetWeight) / obState.weight * 100)).toFixed(1);
        diffEl.textContent = `คุณจะลดน้ำหนักลง ${pctLoss}% ของน้ำหนักตัว`;
    }
}

function setObWeeks(weeks) {
    obState.courseWeeks = Math.max(4, Math.min(52, parseInt(weeks, 10)));
    renderOnboardingStep();
}

function adjustObWeeks(delta) {
    obState.courseWeeks = Math.max(4, Math.min(52, obState.courseWeeks + delta));
    renderOnboardingStep();
}

function selectObActivity(lvl) {
    obState.activityLevel = parseInt(lvl, 10);
    const wMap = { 1: 'sedentary', 2: 'light', 3: 'moderate', 4: 'active' };
    obState.workType = wMap[obState.activityLevel] || 'moderate';
    renderOnboardingStep();
}

function selectObGoalType(gType) {
    obState.goalType = gType;
    renderOnboardingStep();
}

function onObActivitySelect(lvl) {
    selectObActivity(lvl);
}

function onObQuizSelect(ans) {
    obState.quizAnswer = parseInt(ans, 10);
    renderOnboardingStep();
}

function computeOnboardingPlan() {
    const w = Math.max(40, Number(obState.weight) || 78.0);
    const h = Math.max(130, Number(obState.height) || 168.0);
    const age = Math.max(15, Number(obState.age) || 31);
    const gender = obState.gender || 'M';
    const targetW = Math.max(40, Number(obState.targetWeight) || 70.0);
    const weeks = Math.max(4, Number(obState.courseWeeks) || 20);
    const goalType = obState.goalType || 'recomp';

    // Activity Multiplier based on Step 7
    const actMults = { 1: 1.20, 2: 1.35, 3: 1.50, 4: 1.65 };
    const act = actMults[obState.activityLevel] || 1.35;

    // Clinical Mifflin-St Jeor Formula
    const bmr = (10 * w) + (6.25 * h) - (5 * age) + (gender === 'M' ? 5 : -161);
    const tdee = Math.round(bmr * act);

    const diffKg = Math.max(0, w - targetW);
    const lossPerWk = weeks > 0 ? (diffKg / weeks) : 0.4;
    const lossPerMonth = lossPerWk * 4.33;

    // Calorie Deficit / Surplus based on Sports Science Strategy
    let deficit = 300;
    let proMultiplier = 2.0;

    if (goalType === 'recomp') {
        deficit = 300; // Moderate deficit, high protein to spare muscle & burn visceral fat
        proMultiplier = 2.0;
    } else if (goalType === 'fatloss') {
        deficit = 500; // Fast fat loss cut
        proMultiplier = 2.0;
    } else if (goalType === 'slowcut') {
        deficit = 200; // Gentle, sustainable cut without fatigue
        proMultiplier = 1.9;
    } else if (goalType === 'bulk') {
        deficit = -250; // Lean bulk surplus
        proMultiplier = 1.8;
    } else if (goalType === 'maintain') {
        deficit = 0; // Maintenance
        proMultiplier = 1.8;
    }

    let calTarget = Math.max(1400, Math.round(tdee - deficit));

    // Macro Target distribution
    let proTarget = Math.round(w * proMultiplier);
    if (proTarget < 110) proTarget = 110;
    const proKcal = proTarget * 4;

    const fatKcal = Math.round(calTarget * 0.25);
    const fatTarget = Math.max(35, Math.round(fatKcal / 9));

    const remainingKcal = Math.max(0, calTarget - proKcal - (fatTarget * 9));
    const carbsTarget = Math.max(100, Math.round(remainingKcal / 4));
    const waterTarget = Math.max(2500, Math.round(w * 38));

    return {
        bmr: Math.round(bmr),
        tdee,
        calTarget,
        proTarget,
        proMultiplier,
        carbsTarget,
        fatTarget,
        waterTarget,
        diffKg,
        lossPerWk: Math.round(lossPerWk * 100) / 100,
        lossPerMonth: Math.round(lossPerMonth * 10) / 10,
        deficit,
        act,
        goalType
    };
}

function applyOnboardingPlanToApp() {
    const plan = computeOnboardingPlan();
    D.cfg = D.cfg || {};
    D.cfg.targetWeight = obState.targetWeight;
    D.cfg.courseWeeks = obState.courseWeeks;
    D.cfg.goalType = obState.goalType;
    D.cfg.calTarget = plan.calTarget;
    D.cfg.proteinTarget = plan.proTarget;
    D.cfg.carbsTarget = plan.carbsTarget;
    D.cfg.fatTarget = plan.fatTarget;
    D.cfg.waterTarget = plan.waterTarget;
    D.cfg.lossPerWk = plan.lossPerWk;
    D.cfg.lossPerMonth = plan.lossPerMonth;
    D.cfg.workType = obState.workType;
    D.cfg.exerciseType = obState.exerciseType;
    D.cfg.stepTarget = obState.stepTarget;

    D.cfg.bmrInfo = {
        gender: obState.gender,
        birthYear: obState.birthYear,
        age: obState.age,
        height: obState.height,
        weight: obState.weight,
        targetWeight: obState.targetWeight,
        activityLevel: obState.activityLevel,
        workType: obState.workType,
        stepTarget: obState.stepTarget,
        goalType: obState.goalType,
        bmr: plan.bmr,
        tdee: plan.tdee,
        courseWeeks: obState.courseWeeks
    };

    D.cfg.biometrics = {
        gender: obState.gender,
        age: obState.age,
        height: obState.height,
        weight: obState.weight,
        bf: obState.bf,
        muscle: obState.muscle,
        visceral: obState.visceral,
        rhr: obState.rhr,
        vo2max: obState.vo2max,
        hrv: obState.hrv,
        bmrCustom: plan.bmr
    };

    D.cfg.onboardingDone = true;

    // Update Live App Globals
    CAL_TARGET = plan.calTarget;
    PROTEIN_TARGET = plan.proTarget;
    CARBS_TARGET = plan.carbsTarget;
    FAT_TARGET = plan.fatTarget;
    WATER_TARGET = plan.waterTarget;

    if (D.checks && D.checks.length) {
        const lastCheck = D.checks[D.checks.length - 1];
        lastCheck.w = obState.weight;
    }

    if (typeof save === 'function') save();
    if (typeof render === 'function') render();
    if (typeof updateIFUI === 'function') updateIFUI();
    if (typeof pushToCloud === 'function' && currentUser && fbDb) pushToCloud();

    closeOnboardingWizard();
    if (typeof msg === 'function') {
        msg('✓ บันทึกโปรแกรมส่วนบุคคลเรียบร้อย! งบพลังงาน ' + plan.calTarget.toLocaleString() + ' kcal/วัน');
    }
}

function calcBMR() {
    openOnboardingWizard(4, 'recalibrate');
}

/* ============================================================================
   Main Render Function: 8-Step Exact WiseMeal UI
   ============================================================================ */
function renderOnboardingStep() {
    const body = document.getElementById('obWizardBody');
    if (!body) return;

    const totalSteps = 8;
    const progressPct = Math.round((Math.min(8, obStep) / totalSteps) * 100);
    const isRecal = obMode === 'recalibrate';
    const plan = computeOnboardingPlan();

    // Top Header with Chevron, Progress Bar, Step Count, and Recalibrate Tag
    const headerHtml = `
        <div class="wm-ob-topbar">
            <button type="button" class="wm-ob-back-btn" onclick="${getObBackAction()}">‹</button>
            <div class="wm-ob-progress-track">
                <div class="wm-ob-progress-fill" style="width:${progressPct}%;"></div>
            </div>
            <div class="wm-ob-step-num">${Math.min(8, obStep)} / ${totalSteps}</div>
        </div>
        ${isRecal ? '<div style="text-align:center; margin:-14px 0 14px 0;"><span style="font-size:11px; font-weight:800; background:#eff6ff; color:#0284c7; padding:2px 10px; border-radius:99px; border:1px solid #bfdbfe;">ปรับเป้า & วิเคราะห์โปรแกรมใหม่</span></div>' : ''}
    `;

    // -------------------------------------------------------------
    // STEP 1: เลือกเพศของคุณ (Select Gender)
    // -------------------------------------------------------------
    if (obStep === 1) {
        body.innerHTML = `
        <div class="wm-ob-wrap">
            ${headerHtml}
            <div class="wm-ob-body">
                <h1 class="wm-ob-title">เลือกเพศของคุณ</h1>
                <p class="wm-ob-subtitle">โดยปกติผู้ชายจะมีอัตราการเผาผลาญพื้นฐานสูงกว่าผู้หญิง</p>

                <div class="wm-gender-grid">
                    <!-- Male Card -->
                    <div class="wm-gender-card ${obState.gender === 'M' ? 'active' : ''}" onclick="setObField('gender', 'M')">
                        <div class="wm-gender-avatar-wrap" style="background:#e0f2fe;">
                            <svg width="68" height="68" viewBox="0 0 100 100" fill="none">
                                <circle cx="50" cy="50" r="48" fill="#dbeafe"/>
                                <circle cx="50" cy="38" r="18" fill="#fbcfe8"/>
                                <path d="M50 20C40 20 36 28 36 34C36 40 40 44 40 44L44 48H56L60 44C60 44 64 40 64 34C64 28 60 20 50 20Z" fill="#92400e"/>
                                <ellipse cx="50" cy="42" rx="13" ry="15" fill="#fde68a"/>
                                <path d="M22 88C22 70 34 62 50 62C66 62 78 70 78 88" fill="#38bdf8"/>
                            </svg>
                        </div>
                        <div class="wm-gender-name">ชาย</div>
                    </div>

                    <!-- Female Card -->
                    <div class="wm-gender-card ${obState.gender === 'F' ? 'active' : ''}" onclick="setObField('gender', 'F')">
                        <div class="wm-gender-avatar-wrap" style="background:#fce7f3;">
                            <svg width="68" height="68" viewBox="0 0 100 100" fill="none">
                                <circle cx="50" cy="50" r="48" fill="#fce7f3"/>
                                <path d="M50 18C36 18 30 28 30 46C30 58 36 64 36 64C40 60 42 54 42 46C42 36 46 32 50 32C54 32 58 36 58 46C58 54 60 60 64 64C64 64 70 58 70 46C70 28 64 18 50 18Z" fill="#94a3b8"/>
                                <ellipse cx="50" cy="42" rx="12" ry="14" fill="#fbcfe8"/>
                                <path d="M26 88C26 72 36 64 50 64C64 64 74 72 74 88" fill="#cbd5e1"/>
                            </svg>
                        </div>
                        <div class="wm-gender-name">หญิง</div>
                    </div>
                </div>

                <button type="button" class="wm-ob-skip-btn" onclick="setObField('gender', 'M'); goObStep(2);">ไม่ต้องการระบุ</button>
            </div>
            <div class="wm-ob-footer">
                <button type="button" class="wm-ob-continue-btn" onclick="goObStep(2)">ดำเนินการต่อ</button>
            </div>
        </div>`;
    }

    // -------------------------------------------------------------
    // STEP 2: คุณเกิดปีอะไร? (Birth Year Roller Picker)
    // -------------------------------------------------------------
    else if (obStep === 2) {
        const curYr = obState.birthYear || 1995;
        const years = [curYr - 3, curYr - 2, curYr - 1, curYr, curYr + 1, curYr + 2, curYr + 3];

        body.innerHTML = `
        <div class="wm-ob-wrap">
            ${headerHtml}
            <div class="wm-ob-body">
                <h1 class="wm-ob-title">คุณเกิดปีอะไร?</h1>
                <p class="wm-ob-subtitle">เมื่ออายุมากขึ้น การเผาผลาญพื้นฐานของร่างกายจะค่อยๆ ลดลง</p>

                <div class="wm-roller-picker">
                    <div class="wm-roller-highlight"></div>
                    <div class="wm-roller-list">
                        ${years.map(y => {
                            const isSel = y === curYr;
                            const isNear = Math.abs(y - curYr) === 1;
                            return `<div class="wm-roller-item ${isSel ? 'selected' : (isNear ? 'near' : '')}" onclick="onObYearSelect(${y})">${y}</div>`;
                        }).join('')}
                    </div>
                </div>

                <div style="display:flex; justify-content:center; gap:12px; margin-top:8px;">
                    <button type="button" class="ob-step-pill" onclick="onObYearSelect(${curYr - 1})">▲ ปีก่อนหน้า</button>
                    <span style="font-size:14px; font-weight:800; color:#0284c7; display:flex; align-items:center;">อายุ ${obState.age} ปี</span>
                    <button type="button" class="ob-step-pill" onclick="onObYearSelect(${curYr + 1})">▼ ปีถัดไป</button>
                </div>
            </div>
            <div class="wm-ob-footer">
                <button type="button" class="wm-ob-continue-btn" onclick="goObStep(3)">ดำเนินการต่อ</button>
            </div>
        </div>`;
    }

    // -------------------------------------------------------------
    // STEP 3: ส่วนสูงของคุณคือเท่าไหร่? (Vertical Stadiometer)
    // -------------------------------------------------------------
    else if (obStep === 3) {
        const displayVal = obHeightUnit === 'ft' 
            ? `${(obState.height / 30.48).toFixed(1)} ft` 
            : `${obState.height.toFixed(1)} cm`;
        const pointerPct = Math.max(0, Math.min(100, ((200 - obState.height) / (200 - 140)) * 100));

        body.innerHTML = `
        <div class="wm-ob-wrap">
            ${headerHtml}
            <div class="wm-ob-body">
                <h1 class="wm-ob-title">ส่วนสูงของคุณคือเท่าไหร่?</h1>
                <p class="wm-ob-subtitle">ส่วนสูงและน้ำหนักเป็นตัวบ่งชี้สำคัญในการกำหนดอัตราการเผาผลาญพื้นฐาน</p>

                <!-- Unit Toggle -->
                <div style="text-align:center;">
                    <div class="wm-unit-toggle">
                        <button type="button" class="wm-unit-btn ${obHeightUnit === 'ft' ? 'active' : ''}" onclick="setObHeightUnit('ft')">ft</button>
                        <button type="button" class="wm-unit-btn ${obHeightUnit === 'cm' ? 'active' : ''}" onclick="setObHeightUnit('cm')">cm</button>
                    </div>
                </div>

                <div class="wm-height-stage">
                    <!-- Left: Height Ruler Track -->
                    <div class="wm-height-ruler-track">
                        <div id="obHeightPointerLine" class="wm-height-pointer-line" style="top:${pointerPct}%;"></div>
                        <div class="wm-height-tick-mark"><span>200</span><i style="display:inline-block; width:12px; height:2px; background:#94a3b8;"></i></div>
                        <div class="wm-height-tick-mark"><span>190</span><i style="display:inline-block; width:8px; height:2px; background:#cbd5e1;"></i></div>
                        <div class="wm-height-tick-mark"><span>180</span><i style="display:inline-block; width:12px; height:2px; background:#94a3b8;"></i></div>
                        <div class="wm-height-tick-mark"><span>170</span><i style="display:inline-block; width:8px; height:2px; background:#cbd5e1;"></i></div>
                        <div class="wm-height-tick-mark"><span>160</span><i style="display:inline-block; width:12px; height:2px; background:#94a3b8;"></i></div>
                        <div class="wm-height-tick-mark"><span>150</span><i style="display:inline-block; width:8px; height:2px; background:#cbd5e1;"></i></div>
                        <div class="wm-height-tick-mark"><span>140</span><i style="display:inline-block; width:12px; height:2px; background:#94a3b8;"></i></div>
                    </div>

                    <!-- Right: Big Readout Display & Draggable Slider -->
                    <div style="text-align:center; padding-left:10px;">
                        <div id="obHeightReadout" class="wm-height-display-val">${displayVal}</div>
                        <div style="margin-top:20px;">
                            <input type="range" class="ob-range-slider" min="140" max="200" step="0.5" value="${obState.height}" oninput="onObHeightDrag(this.value)" style="width:85%;">
                        </div>
                        <div class="ob-step-btns" style="margin-top:14px;">
                            <button type="button" class="ob-step-pill" onclick="onObHeightDrag(${obState.height - 1})">−1 cm</button>
                            <button type="button" class="ob-step-pill" onclick="onObHeightDrag(${obState.height - 0.5})">−0.5</button>
                            <button type="button" class="ob-step-pill" onclick="onObHeightDrag(${obState.height + 0.5})">+0.5</button>
                            <button type="button" class="ob-step-pill" onclick="onObHeightDrag(${obState.height + 1})">+1 cm</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="wm-ob-footer">
                <button type="button" class="wm-ob-continue-btn" onclick="goObStep(4)">ดำเนินการต่อ</button>
            </div>
        </div>`;
    }

    // -------------------------------------------------------------
    // STEP 4: น้ำหนักปัจจุบันของคุณคือเท่าไหร่? (Current Weight Scale)
    // -------------------------------------------------------------
    else if (obStep === 4 && obSubStep !== 'analysis') {
        const displayVal = obWeightUnit === 'lbs' 
            ? `${(obState.weight * 2.20462).toFixed(1)} lbs` 
            : `${obState.weight.toFixed(1)} kg`;

        body.innerHTML = `
        <div class="wm-ob-wrap">
            ${headerHtml}
            <div class="wm-ob-body">
                <h1 class="wm-ob-title">น้ำหนักปัจจุบันของคุณคือเท่าไหร่?</h1>
                <p class="wm-ob-subtitle">ส่วนสูงและน้ำหนักเป็นตัวบ่งชี้สำคัญในการกำหนดอัตราการเผาผลาญพื้นฐาน</p>

                <!-- Unit Toggle -->
                <div style="text-align:center;">
                    <div class="wm-unit-toggle">
                        <button type="button" class="wm-unit-btn ${obWeightUnit === 'lbs' ? 'active' : ''}" onclick="setObWeightUnit('lbs')">lbs</button>
                        <button type="button" class="wm-unit-btn ${obWeightUnit === 'kg' ? 'active' : ''}" onclick="setObWeightUnit('kg')">kg</button>
                    </div>
                </div>

                <!-- Big Readout -->
                <div class="wm-weight-readout">
                    <span id="obWeightReadoutNum">${obState.weight.toFixed(1)}</span>
                    <span style="font-size:22px; font-weight:700; color:#64748b;">${obWeightUnit}</span>
                </div>

                <!-- ตาชั่งน้ำหนักแบบ Interactive Scale -->
                <div class="wm-weight-scale-stage" title="ตาชั่งน้ำหนัก">
                    <div class="wm-weight-needle"></div>
                    <div style="display:flex; align-items:flex-end; gap:6px; height:100%; padding-bottom:6px;">
                        ${buildScaleTicksHtml(obState.weight)}
                    </div>
                </div>

                <div style="text-align:center; margin-top:14px;">
                    <input type="range" class="ob-range-slider" min="45" max="140" step="0.1" value="${obState.weight}" oninput="onObWeightDrag('weight', this.value)" style="width:85%;">
                </div>

                <div class="ob-step-btns" style="margin-top:14px;">
                    <button type="button" class="ob-step-pill" onclick="onObWeightDrag('weight', ${obState.weight - 0.5})">−0.5 kg</button>
                    <button type="button" class="ob-step-pill" onclick="onObWeightDrag('weight', ${obState.weight - 0.1})">−0.1</button>
                    <button type="button" class="ob-step-pill" onclick="onObWeightDrag('weight', ${obState.weight + 0.1})">+0.1</button>
                    <button type="button" class="ob-step-pill" onclick="onObWeightDrag('weight', ${obState.weight + 0.5})">+0.5 kg</button>
                </div>
            </div>
            <div class="wm-ob-footer">
                <button type="button" class="wm-ob-continue-btn" onclick="goObStep(4, 'analysis')">ดำเนินการต่อ</button>
            </div>
        </div>`;
    }

    // -------------------------------------------------------------
    // STEP 4.5: การวิเคราะห์ส่วนบุคคล (Personal Analysis with Clip 📎)
    // -------------------------------------------------------------
    else if (obStep === 4 && obSubStep === 'analysis') {
        const hM = (obState.height || 168) / 100;
        const bmi = (obState.weight / (hM * hM)).toFixed(1);
        const normalWeightMax = (24.9 * (hM * hM)).toFixed(1);
        const normalWeightMin = (18.5 * (hM * hM)).toFixed(1);
        const excessWeight = Math.max(0, obState.weight - normalWeightMax).toFixed(1);
        const isOver = bmi >= 25.0;

        // BMI Pointer percentage on 4-color track (15 to 35 range)
        const bmiPct = Math.max(5, Math.min(95, ((bmi - 15) / (35 - 15)) * 100));

        body.innerHTML = `
        <div class="wm-ob-wrap">
            ${headerHtml}
            <div class="wm-ob-body">
                <!-- Floating Clip Card -->
                <div class="wm-clip-card">
                    <!-- Blue Paperclip Icon -->
                    <svg class="wm-clip-icon" viewBox="0 0 32 38" fill="none">
                        <path d="M8 12V24C8 28.4 11.6 32 16 32C20.4 32 24 28.4 24 24V8C24 4.7 21.3 2 18 2C14.7 2 12 4.7 12 8V22C12 24.2 13.8 26 16 26C18.2 26 20 24.2 20 22V12" stroke="#0284c7" stroke-width="3" stroke-linecap="round"/>
                    </svg>

                    <div class="wm-analysis-header">การวิเคราะห์ส่วนบุคคล</div>

                    <!-- Profile Row -->
                    <div class="wm-analysis-profile-row">
                        <div style="display:flex; align-items:center; gap:8px;">
                            <span style="font-size:24px;">👤</span>
                            <div>
                                <div style="font-size:11px; color:#64748b; font-weight:700;">อายุ</div>
                                <div style="font-size:14px; font-weight:900; color:#0f172a;">${obState.age}</div>
                            </div>
                        </div>
                        <div style="width:1px; height:24px; background:#e2e8f0;"></div>
                        <div>
                            <div style="font-size:11px; color:#64748b; font-weight:700;">เพศ</div>
                            <div style="font-size:14px; font-weight:900; color:#0f172a;">${obState.gender === 'M' ? 'ชาย' : 'หญิง'}</div>
                        </div>
                        <div style="width:1px; height:24px; background:#e2e8f0;"></div>
                        <div>
                            <div style="font-size:11px; color:#64748b; font-weight:700;">ส่วนสูง</div>
                            <div style="font-size:14px; font-weight:900; color:#0f172a;">${obState.height.toFixed(1)} cm</div>
                        </div>
                    </div>

                    <!-- 2-Column Status Grid -->
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:14px;">
                        <div class="wm-analysis-stat-box" style="justify-content:center;">
                            <div style="font-size:11.5px; font-weight:700; color:#64748b;">สถานะ</div>
                            <div style="font-size:18px; font-weight:900; color:${isOver ? '#f97316' : '#10b981'};">
                                ${isOver ? 'น้ำหนักเกิน' : 'สุขภาพดี'}
                            </div>
                        </div>
                        <div style="display:flex; flex-direction:column; gap:8px;">
                            <div class="wm-analysis-stat-box" style="padding:8px 12px;">
                                <div style="font-size:10.5px; font-weight:700; color:#64748b;">น้ำหนัก</div>
                                <div style="font-size:15px; font-weight:900; color:#0f172a;">${obState.weight.toFixed(1)} kg</div>
                            </div>
                            <div class="wm-analysis-stat-box" style="padding:8px 12px; background:#fff7ed; border-color:#fed7aa;">
                                <div style="font-size:10.5px; font-weight:700; color:#ea580c;">ข้อเสนอแนะ</div>
                                <div style="font-size:14px; font-weight:900; color:#c2410c;">${excessWeight > 0 ? `ลด ${excessWeight} kg` : 'รักษาน้ำหนัก'}</div>
                            </div>
                        </div>
                    </div>

                    <!-- 4-Color BMI Gauge Bar -->
                    <div style="position:relative; margin-top:20px;">
                        <div class="wm-bmi-pointer" style="left:${bmiPct}%;">
                            <span>${bmi}</span>
                            <span style="font-size:9px; color:#0284c7;">▼</span>
                        </div>
                        <div class="wm-bmi-bar-track">
                            <div class="wm-bmi-segment" style="background:#38bdf8;" title="น้ำหนักน้อยเกินไป"></div>
                            <div class="wm-bmi-segment" style="background:#4ade80;" title="สุขภาพดี"></div>
                            <div class="wm-bmi-segment" style="background:#fb923c;" title="น้ำหนักเกิน"></div>
                            <div class="wm-bmi-segment" style="background:#f87171;" title="อ้วนมาก"></div>
                        </div>
                        <div style="display:flex; justify-content:space-between; font-size:10px; font-weight:700; color:#94a3b8; margin-top:4px;">
                            <span>น้ำหนักน้อยเกินไป</span>
                            <span>สุขภาพดี</span>
                            <span>น้ำหนักเกิน</span>
                            <span>อ้วนมาก</span>
                        </div>
                    </div>

                    <!-- Details Row with Male Torso Graphic -->
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:16px; background:#ffffff; border-radius:14px; padding:12px 14px; border:1px solid #e2e8f0;">
                        <div style="display:flex; flex-direction:column; gap:8px;">
                            <div style="display:flex; align-items:center; gap:8px;">
                                <span style="font-size:15px;">💡</span>
                                <span style="font-size:12px; font-weight:700; color:#64748b;">BMI <b>${bmi}</b></span>
                            </div>
                            <div style="display:flex; align-items:center; gap:8px;">
                                <span style="font-size:15px;">🍃</span>
                                <span style="font-size:12px; font-weight:700; color:#64748b;">BMI ที่ดีต่อสุขภาพ <b>18.5 - 24.9</b></span>
                            </div>
                            <div style="display:flex; align-items:center; gap:8px;">
                                <span style="font-size:15px;">🩱</span>
                                <span style="font-size:12px; font-weight:700; color:#64748b;">น้ำหนักที่ดีต่อสุขภาพ <b>${normalWeightMin}kg - ${normalWeightMax}kg</b></span>
                            </div>
                        </div>
                        <div style="width:72px; height:84px; display:flex; align-items:center; justify-content:center; background:#f8fafc; border-radius:10px;">
                            <svg width="60" height="74" viewBox="0 0 60 74" fill="none">
                                <path d="M12 12C12 4 48 4 48 12C48 24 54 36 50 56C46 58 40 58 36 54L30 58L24 54C20 58 14 58 10 56C6 36 12 24 12 12Z" fill="#334155"/>
                                <path d="M16 54H44V70H16V54Z" fill="#1e293b"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
            <div class="wm-ob-footer">
                <button type="button" class="wm-ob-continue-btn" onclick="goObStep(5)">ดำเนินการต่อ</button>
            </div>
        </div>`;
    }

    // -------------------------------------------------------------
    // STEP 5: น้ำหนักที่ต้องการของคุณคือเท่าไหร่? (Target Weight)
    // -------------------------------------------------------------
    else if (obStep === 5) {
        const pctLoss = Math.max(0, ((obState.weight - obState.targetWeight) / obState.weight * 100)).toFixed(1);
        const difficulty = pctLoss > 10 ? 'เป้าหมายระดับยาก' : (pctLoss > 5 ? 'เป้าหมายระดับปานกลาง' : 'เป้าหมายแบบง่าย');
        const diffColor = pctLoss > 10 ? '#f97316' : (pctLoss > 5 ? '#eab308' : '#10b981');

        body.innerHTML = `
        <div class="wm-ob-wrap">
            ${headerHtml}
            <div class="wm-ob-body">
                <h1 class="wm-ob-title">น้ำหนักที่ต้องการของคุณคือเท่าไหร่?</h1>
                <p class="wm-ob-subtitle">น้ำหนักเป้าหมายจะส่งผลต่อการคำนวณงบประมาณแคลอรี่ของคุณ</p>

                <!-- Big Readout -->
                <div class="wm-weight-readout">
                    <span id="obTargetReadoutNum">${obState.targetWeight.toFixed(1)}</span>
                    <span style="font-size:22px; font-weight:700; color:#64748b;">kg</span>
                </div>

                <!-- ตาชั่งน้ำหนักเป้าหมาย (Interactive Target Scale) -->
                <div class="wm-weight-scale-stage" title="ตาชั่งน้ำหนักเป้าหมาย">
                    <div class="wm-weight-needle"></div>
                    <div style="display:flex; align-items:flex-end; gap:6px; height:100%; padding-bottom:6px;">
                        ${buildScaleTicksHtml(obState.targetWeight)}
                    </div>
                </div>

                <div style="text-align:center; margin-top:14px;">
                    <input type="range" class="ob-range-slider" min="45" max="115" step="0.1" value="${obState.targetWeight}" oninput="onObWeightDrag('targetWeight', this.value)" style="width:85%;">
                </div>

                <div class="ob-step-btns" style="margin-top:14px;">
                    <button type="button" class="ob-step-pill" onclick="onObWeightDrag('targetWeight', ${obState.targetWeight - 0.5})">−0.5 kg</button>
                    <button type="button" class="ob-step-pill" onclick="onObWeightDrag('targetWeight', ${obState.targetWeight - 0.1})">−0.1</button>
                    <button type="button" class="ob-step-pill" onclick="onObWeightDrag('targetWeight', ${obState.targetWeight + 0.1})">+0.1</button>
                    <button type="button" class="ob-step-pill" onclick="onObWeightDrag('targetWeight', ${obState.targetWeight + 0.5})">+0.5 kg</button>
                </div>

                <!-- Dynamic Difficulty Card -->
                <div style="margin-top:20px; background:#ffffff; border:1px solid #e2e8f0; border-radius:18px; padding:14px 16px; box-shadow:0 4px 14px rgba(15,23,42,0.03);">
                    <div style="font-size:14px; font-weight:800; color:${diffColor}; margin-bottom:4px;">${difficulty}</div>
                    <div id="obTargetDiffPercent" style="font-size:12.5px; color:#475569; font-weight:600;">คุณจะลดน้ำหนักลง ${pctLoss}% ของน้ำหนักตัว</div>
                </div>
            </div>
            <div class="wm-ob-footer">
                <button type="button" class="wm-ob-continue-btn" onclick="goObStep(6)">ดำเนินการต่อ</button>
            </div>
        </div>`;
    }

    // -------------------------------------------------------------
    // STEP 6: คุณต้องการฝึกโปรแกรมนี้กี่สัปดาห์? (Course Weeks Selection)
    // -------------------------------------------------------------
    else if (obStep === 6 && obSubStep !== 'trajectory') {
        const weeks = Math.max(4, Number(obState.courseWeeks) || 20);
        const diffKg = Math.max(0, obState.weight - obState.targetWeight);
        const lossRate = weeks > 0 ? (diffKg / weeks) : 0.4;
        const estMonths = Math.round((weeks / 4.33) * 10) / 10;

        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + (weeks * 7));
        const thaiMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
        const estDateTh = `${targetDate.getDate()} ${thaiMonths[targetDate.getMonth()]} ${targetDate.getFullYear() + 543}`;

        let safetyBadge = {
            label: 'เป้าหมายระดับปลอดภัยสูง (ยั่งยืน)',
            desc: `ลดประมาณ ${lossRate.toFixed(2)} kg ต่อสัปดาห์ (อัตราส่วนที่ดีที่สุดในการรักษามวลกล้ามเนื้อและระดับฮอร์โมน)`,
            color: '#10b981',
            bg: '#ecfdf5',
            border: '#a7f3d0'
        };
        if (lossRate > 0.8) {
            safetyBadge = {
                label: 'เป้าหมายระดับเข้มข้นสูง (ท้าทาย)',
                desc: `ลดประมาณ ${lossRate.toFixed(2)} kg ต่อสัปดาห์ (ต้องมีวินัยโภชนาการเข้มงวด ควรปรึกษาผู้เชี่ยวชาญ)`,
                color: '#f97316',
                bg: '#fff7ed',
                border: '#fed7aa'
            };
        } else if (lossRate > 0.5) {
            safetyBadge = {
                label: 'เป้าหมายระดับมาตรฐาน (เห็นผลชัดเจน)',
                desc: `ลดประมาณ ${lossRate.toFixed(2)} kg ต่อสัปดาห์ (อัตราการลดไขมันที่ปลอดภัยและเห็นการเปลี่ยนแปลงไว)`,
                color: '#0284c7',
                bg: '#eff6ff',
                border: '#bfdbfe'
            };
        }

        body.innerHTML = `
        <div class="wm-ob-wrap">
            ${headerHtml}
            <div class="wm-ob-body">
                <div style="display:inline-block; font-size:11px; font-weight:800; color:#0284c7; background:#eff6ff; padding:3px 10px; border-radius:99px; border:1px solid #bae6fd; margin-bottom:6px;">🎯 ระยะเวลาโปรแกรม & คาดการณ์บรรลุเป้าหมาย</div>
                <h1 class="wm-ob-title">คุณต้องการฝึกโปรแกรมนี้กี่สัปดาห์?</h1>
                <p class="wm-ob-subtitle">เลือกระยะเวลาการฝึกตามจำนวนสัปดาห์เพื่อคำนวณอัตราการเปลี่ยนแปลงรูปร่างอย่างปลอดภัยและยั่งยืน</p>

                <!-- Hero Week Display & Stepper -->
                <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:24px; padding:20px 16px; text-align:center; box-shadow:0 4px 16px rgba(15,23,42,0.04); margin-bottom:14px;">
                    <div style="font-size:11.5px; font-weight:800; color:#64748b; text-transform:uppercase; letter-spacing:0.5px;">ระยะเวลาการฝึกซ้อม</div>
                    <div style="font-size:44px; font-weight:900; color:#0284c7; line-height:1.1; margin:6px 0 2px;">
                        ${weeks} <span style="font-size:18px; font-weight:800; color:#64748b;">สัปดาห์</span>
                    </div>
                    <div style="font-size:12.5px; font-weight:700; color:#0369a1;">(ประมาณ ${estMonths} เดือน)</div>
                    
                    <!-- Stepper Buttons for Fine Tuning -->
                    <div style="display:flex; justify-content:center; align-items:center; gap:10px; margin-top:14px;">
                        <button type="button" class="ob-step-pill" onclick="adjustObWeeks(-1)" style="min-width:96px; padding:8px 16px; border-radius:99px; background:#f1f5f9; border:1px solid #cbd5e1; font-size:13.5px; font-weight:800; color:#334155; cursor:pointer;">− 1 สัปดาห์</button>
                        <button type="button" class="ob-step-pill" onclick="adjustObWeeks(1)" style="min-width:96px; padding:8px 16px; border-radius:99px; background:#eff6ff; border:1px solid #bfdbfe; color:#0284c7; font-size:13.5px; font-weight:800; cursor:pointer;">+ 1 สัปดาห์</button>
                    </div>
                </div>

                <!-- Popular Week Selection Cards -->
                <div style="font-size:12.5px; font-weight:800; color:#475569; margin-bottom:4px;">เลือกระยะเวลายอดนิยม:</div>
                <div class="wm-week-grid">
                    <div class="wm-week-card ${weeks === 8 ? 'active' : ''}" onclick="setObWeeks(8)">
                        <div style="font-size:15px; font-weight:900; color:#0f172a;">8 สัปดาห์</div>
                        <div style="font-size:11px; font-weight:700; color:#64748b; margin-top:2px;">~ 2 เดือน</div>
                    </div>
                    <div class="wm-week-card ${weeks === 12 ? 'active' : ''}" onclick="setObWeeks(12)">
                        <div style="font-size:15px; font-weight:900; color:#0f172a;">12 สัปดาห์</div>
                        <div style="font-size:11px; font-weight:700; color:#64748b; margin-top:2px;">~ 3 เดือน</div>
                    </div>
                    <div class="wm-week-card ${weeks === 16 ? 'active' : ''}" onclick="setObWeeks(16)">
                        <div style="font-size:15px; font-weight:900; color:#0f172a;">16 สัปดาห์</div>
                        <div style="font-size:11px; font-weight:700; color:#64748b; margin-top:2px;">~ 4 เดือน</div>
                    </div>
                    <div class="wm-week-card ${weeks === 20 ? 'active' : ''}" onclick="setObWeeks(20)">
                        <div style="font-size:15px; font-weight:900; color:#0f172a;">20 สัปดาห์</div>
                        <div style="font-size:11px; font-weight:800; color:#0284c7; margin-top:2px;">⭐ แนะนำ</div>
                    </div>
                    <div class="wm-week-card ${weeks === 24 ? 'active' : ''}" onclick="setObWeeks(24)">
                        <div style="font-size:15px; font-weight:900; color:#0f172a;">24 สัปดาห์</div>
                        <div style="font-size:11px; font-weight:700; color:#64748b; margin-top:2px;">~ 6 เดือน</div>
                    </div>
                </div>

                <!-- Feasibility & Sports Science Rate Card -->
                <div style="background:${safetyBadge.bg}; border:1px solid ${safetyBadge.border}; border-radius:18px; padding:13px 16px; margin-top:6px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                        <span style="font-size:13px; font-weight:800; color:${safetyBadge.color};">${safetyBadge.label}</span>
                        <span style="font-size:11px; font-weight:700; color:#64748b;">เป้าหมาย: ${estDateTh}</span>
                    </div>
                    <div style="font-size:12px; color:#475569; font-weight:600; line-height:1.45;">${safetyBadge.desc}</div>
                </div>
            </div>
            <div class="wm-ob-footer">
                <button type="button" class="wm-ob-continue-btn" onclick="goObStep(6, 'trajectory')">ดำเนินการต่อ</button>
            </div>
        </div>`;
    }

    // -------------------------------------------------------------
    // STEP 6.5: เราคาดการณ์ว่าคุณจะบรรลุเป้าหมาย (Trajectory Curve SVG)
    // -------------------------------------------------------------
    else if (obStep === 6 && obSubStep === 'trajectory') {
        const weeks = Math.max(4, Number(obState.courseWeeks) || 20);
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + (weeks * 7));
        const thaiMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
        const estDateTh = `${targetDate.getDate()} ${thaiMonths[targetDate.getMonth()]} ${targetDate.getFullYear() + 543}`;
        const monthShort = thaiMonths[targetDate.getMonth()];
        const dayNum = targetDate.getDate();

        body.innerHTML = `
        <div class="wm-ob-wrap">
            ${headerHtml}
            <div class="wm-ob-body">
                <div style="font-size:14px; font-weight:700; color:#64748b; text-align:center; margin-bottom:4px;">เราคาดการณ์ว่าคุณจะบรรลุเป้าหมาย</div>
                <h1 style="font-size:25px; font-weight:900; color:#0284c7; text-align:center; margin:0 0 20px; letter-spacing:-0.5px;">
                    ${obState.targetWeight.toFixed(1)} kg ภายใน ${weeks} สัปดาห์
                </h1>

                <!-- Smooth SVG Trajectory Chart -->
                <div style="background:#ffffff; border-radius:24px; border:1px solid #e2e8f0; padding:24px 16px 14px; box-shadow:0 8px 24px rgba(15,23,42,0.04); position:relative; overflow:hidden;">
                    <svg viewBox="0 0 340 160" width="100%" height="160" style="display:block;">
                        <!-- Baseline without plan (Grey Dotted Wave) -->
                        <path d="M 30 50 Q 120 70 200 60 T 320 65" fill="none" stroke="#cbd5e1" stroke-width="2.5" stroke-dasharray="5 5"/>
                        <!-- Controlled Healthy Trajectory Curve (Vibrant Blue) -->
                        <path d="M 30 50 C 90 50, 110 110, 260 110 L 320 110" fill="none" stroke="#0284c7" stroke-width="4.5" stroke-linecap="round"/>
                        <!-- Start Point Dot -->
                        <circle cx="30" cy="50" r="7" fill="#0284c7" stroke="#ffffff" stroke-width="3"/>
                        <!-- Target Pin Flag Badge -->
                        <g transform="translate(235, 78)">
                            <rect x="0" y="0" width="54" height="58" rx="18" fill="#ffffff" stroke="#38bdf8" stroke-width="2" filter="drop-shadow(0 4px 8px rgba(2,132,199,0.15))"/>
                            <text x="27" y="16" font-size="9" font-weight="700" fill="#64748b" text-anchor="middle">${monthShort}</text>
                            <text x="27" y="32" font-size="14" font-weight="900" fill="#0f172a" text-anchor="middle">${dayNum}</text>
                            <circle cx="27" cy="46" r="8" fill="#f97316"/>
                            <text x="27" y="50" font-size="9" fill="#ffffff" text-anchor="middle">⛳</text>
                        </g>
                    </svg>

                    <!-- Chart Axis Labels -->
                    <div style="display:flex; justify-content:space-between; font-size:11px; font-weight:700; color:#64748b; margin-top:8px; padding:0 8px;">
                        <span>วันนี้<br><b style="color:#0f172a;">${obState.weight.toFixed(1)} kg</b></span>
                        <span style="text-align:right;">${estDateTh}<br><b style="color:#0284c7;">${obState.targetWeight.toFixed(1)} kg</b></span>
                    </div>
                </div>

                <!-- Motivation Card -->
                <div style="margin-top:18px; background:#ffffff; border:1px solid #e2e8f0; border-radius:18px; padding:15px; box-shadow:0 4px 14px rgba(15,23,42,0.03);">
                    <div style="display:flex; align-items:center; gap:8px; font-size:14.5px; font-weight:900; color:#0f172a; margin-bottom:4px;">
                        <span>🎯</span> เส้นทางวิทยาศาสตร์การกีฬา
                    </div>
                    <div style="font-size:12.5px; color:#64748b; line-height:1.45;">เรานำจำนวนสัปดาห์ (${weeks} สัปดาห์) ไปคำนวณอัตรา Deficit และสัดส่วนโปรตีนเพื่อคุ้มกันมวลกล้ามเนื้อให้คุณโดยเฉพาะ</div>
                </div>
            </div>
            <div class="wm-ob-footer">
                <button type="button" class="wm-ob-continue-btn" onclick="goObStep(7)">ดำเนินการต่อ</button>
            </div>
        </div>`;
    }

    // -------------------------------------------------------------
    // STEP 7: ระดับกิจกรรมของคุณเป็นอย่างไร? (4 Large Touch Cards)
    // -------------------------------------------------------------
    else if (obStep === 7) {
        const actOptions = [
            {
                lvl: 1,
                title: 'นั่งโต๊ะทำงานเป็นหลัก',
                subTitle: 'Sedentary (ตัวคูณ 1.20)',
                desc: 'นั่งทำงาน นั่งหน้าคอมฯ ขับรถ เคลื่อนไหวน้อย เดินต่ำกว่า 3,000 ก้าวต่อวัน',
                icon: '🪑',
                color: '#64748b'
            },
            {
                lvl: 2,
                title: 'ขยับร่างกายเบาๆ',
                subTitle: 'Lightly Active (ตัวคูณ 1.35)',
                desc: 'เดินตรวจเวร ยืนบ่อย ทำงานบ้าน ก้าวเดินระหว่างวัน 4,000 - 6,000 ก้าว',
                icon: '🚶',
                color: '#0284c7'
            },
            {
                lvl: 3,
                title: 'เคลื่อนไหวปานกลาง',
                subTitle: 'Moderately Active (ตัวคูณ 1.50) ⭐ แนะนำ',
                desc: 'ออกกำลังกายสม่ำเสมอ 3-4 วันต่อสัปดาห์ หรือเดินมากกว่า 8,000 ก้าวต่อวัน',
                icon: '🏃',
                color: '#10b981'
            },
            {
                lvl: 4,
                title: 'เคลื่อนไหวมาก / ลุยเวร',
                subTitle: 'Very Active (ตัวคูณ 1.65)',
                desc: 'ทำงานใช้แรงหนัก ซ้อมกีฬาเข้มข้น 5-6 วันต่อสัปดาห์ หรือเข้าเวรลุยภาคสนามต่อเนื่อง',
                icon: '⚡',
                color: '#f97316'
            }
        ];

        body.innerHTML = `
        <div class="wm-ob-wrap">
            ${headerHtml}
            <div class="wm-ob-body">
                <h1 class="wm-ob-title">ระดับกิจกรรมของคุณเป็นอย่างไร?</h1>
                <p class="wm-ob-subtitle">อัตราการขยับร่างกายจะช่วยกำหนดค่า TDEE และปริมาณพลังงานที่เหมาะสมอย่างแม่นยำ</p>

                <div class="wm-act-touch-list">
                    ${actOptions.map(opt => {
                        const isAct = obState.activityLevel === opt.lvl;
                        return `
                        <div class="wm-act-touch-card ${isAct ? 'active' : ''}" onclick="selectObActivity(${opt.lvl})">
                            <div style="width:48px; height:48px; border-radius:14px; background:${isAct ? '#eff6ff' : '#f8fafc'}; display:flex; align-items:center; justify-content:center; font-size:24px; flex-shrink:0; border:1px solid ${isAct ? '#bfdbfe' : '#e2e8f0'};">
                                ${opt.icon}
                            </div>
                            <div style="flex:1;">
                                <div style="display:flex; justify-content:space-between; align-items:center;">
                                    <div style="font-size:15px; font-weight:900; color:#0f172a;">${opt.title}</div>
                                    ${isAct ? '<span style="font-size:16px; color:#0284c7; font-weight:900;">✓</span>' : ''}
                                </div>
                                <div style="font-size:11.5px; font-weight:800; color:${opt.color}; margin-top:1px;">${opt.subTitle}</div>
                                <div style="font-size:11.5px; color:#64748b; font-weight:600; margin-top:3px; line-height:1.4;">${opt.desc}</div>
                            </div>
                        </div>`;
                    }).join('')}
                </div>
            </div>
            <div class="wm-ob-footer">
                <button type="button" class="wm-ob-continue-btn" onclick="goObStep(8)">ดำเนินการต่อ</button>
            </div>
        </div>`;
    }

    // -------------------------------------------------------------
    // STEP 8: ยุทธศาสตร์สรีรวิทยา & สรุป Macro สารอาหารเป้าหมาย
    // -------------------------------------------------------------
    else if (obStep === 8 && obSubStep !== 'completion') {
        const plan = computeOnboardingPlan();
        const goals = [
            {
                id: 'recomp',
                title: '⚡ ลดไขมันรักษากล้ามเนื้อ (Body Recomp)',
                badge: '⭐ แนะนำทางสรีรวิทยา',
                badgeColor: '#0284c7',
                badgeBg: '#eff6ff',
                desc: 'ตัดแคลอรี่ปานกลาง (-300 kcal), โปรตีนสูง 2.0g/kg สลายไขมันสะสมโดยคงมวลกล้ามเนื้อเดิมและคุ้มกันระบบเผาผลาญ'
            },
            {
                id: 'fatloss',
                title: '🔥 เน้นลดไขมัน/น้ำหนักเร็ว (Fat Loss Cut)',
                badge: 'Deficit -500 kcal',
                badgeColor: '#ea580c',
                badgeBg: '#fff7ed',
                desc: 'เร่งดึงไขมันช่องท้องและไขมันสะสมมาใช้เป็นพลังงานหลัก เหมาะกับผู้ที่ต้องการลดสัดส่วนอย่างรวดเร็ว'
            },
            {
                id: 'slowcut',
                title: '🍃 ลดไขมันช้าๆ สบายๆ ยั่งยืน (Slow Cut)',
                badge: 'Deficit -200 kcal',
                badgeColor: '#16a34a',
                badgeBg: '#f0fdf4',
                desc: 'ตัดแคลอรี่เพียงเล็กน้อย ไม่เพลีย ไม่กระทบกับสมาธิการทำงานหรือการเข้าเวร เหมาะกับการควบคุมระยะยาว'
            },
            {
                id: 'bulk',
                title: '💪 เพิ่มกล้ามเนื้อลีน (Lean Bulk)',
                badge: 'Surplus +250 kcal',
                badgeColor: '#9333ea',
                badgeBg: '#faf5ff',
                desc: 'เพิ่มพลังงานเกินเล็กน้อยเพื่อเสริมสร้างมวลกล้ามเนื้อและความแข็งแรง โดยสะสมไขมันส่วนเกินให้น้อยที่สุด'
            }
        ];

        body.innerHTML = `
        <div class="wm-ob-wrap">
            ${headerHtml}
            <div class="wm-ob-body">
                <h1 class="wm-ob-title">เป้าหมายเชิงสรีรวิทยาของคุณคืออะไร?</h1>
                <p class="wm-ob-subtitle">ระบบวิทยาศาสตร์การกีฬาจะปรับสัดส่วน Macro และ Calorie Deficit ให้สอดคล้องกับเป้าหมายคุณ</p>

                <!-- Goal Selection Cards -->
                <div>
                    ${goals.map(g => {
                        const isSel = (obState.goalType || 'recomp') === g.id;
                        return `
                        <div class="wm-goal-touch-card ${isSel ? 'active' : ''}" onclick="selectObGoalType('${g.id}')">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                                <div style="font-size:14.5px; font-weight:900; color:#0f172a;">${g.title}</div>
                                <span style="font-size:10.5px; font-weight:800; color:${g.badgeColor}; background:${g.badgeBg}; padding:2px 8px; border-radius:99px;">${g.badge}</span>
                            </div>
                            <div style="font-size:11.5px; color:#64748b; font-weight:600; line-height:1.45;">${g.desc}</div>
                        </div>`;
                    }).join('')}
                </div>

                <!-- Interactive Live Macro Breakdown Card on the same page -->
                <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:20px; padding:15px; margin-top:14px; box-shadow:0 4px 14px rgba(15,23,42,0.03);">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                        <div style="font-size:13px; font-weight:900; color:#0f172a;">📊 สัดส่วนสารอาหารเป้าหมาย (Macros Target)</div>
                        <span style="font-size:11px; font-weight:800; color:#0284c7; background:#eff6ff; padding:2px 8px; border-radius:99px; border:1px solid #bfdbfe;">TDEE: ${plan.tdee.toLocaleString()} kcal</span>
                    </div>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                        <!-- Box 1: Calorie Budget -->
                        <div style="background:#f0f9ff; border:1px solid #bae6fd; border-radius:12px; padding:10px 12px;">
                            <div style="font-size:11px; font-weight:800; color:#0369a1;">งบพลังงานต่อวัน</div>
                            <div style="font-size:18px; font-weight:900; color:#0284c7; margin-top:2px;">${plan.calTarget.toLocaleString()} <span style="font-size:11px; font-weight:700;">kcal</span></div>
                            <div style="font-size:10.5px; color:#64748b; font-weight:600; margin-top:2px;">${plan.deficit > 0 ? 'Deficit -' + plan.deficit : (plan.deficit < 0 ? 'Surplus +' + Math.abs(plan.deficit) : 'สมดุล')} kcal/วัน</div>
                        </div>
                        <!-- Box 2: Protein -->
                        <div style="background:#ecfdf5; border:1px solid #a7f3d0; border-radius:12px; padding:10px 12px;">
                            <div style="font-size:11px; font-weight:800; color:#047857;">โปรตีนเป้าหมาย</div>
                            <div style="font-size:18px; font-weight:900; color:#059669; margin-top:2px;">${plan.proTarget} <span style="font-size:11px; font-weight:700;">กรัม</span></div>
                            <div style="font-size:10.5px; color:#64748b; font-weight:600; margin-top:2px;">(${plan.proMultiplier}g ต่อน้ำหนักตัว 1 kg)</div>
                        </div>
                        <!-- Box 3: Carbs -->
                        <div style="background:#fefce8; border:1px solid #fef08a; border-radius:12px; padding:10px 12px;">
                            <div style="font-size:11px; font-weight:800; color:#854d0e;">คาร์โบไฮเดรต</div>
                            <div style="font-size:18px; font-weight:900; color:#ca8a04; margin-top:2px;">${plan.carbsTarget} <span style="font-size:11px; font-weight:700;">กรัม</span></div>
                            <div style="font-size:10.5px; color:#64748b; font-weight:600; margin-top:2px;">(พลังงานสำหรับการฝึกซ้อม)</div>
                        </div>
                        <!-- Box 4: Fat & Water -->
                        <div style="background:#fff1f2; border:1px solid #fecdd3; border-radius:12px; padding:10px 12px;">
                            <div style="font-size:11px; font-weight:800; color:#9f1239;">ไขมันดี & น้ำดื่ม</div>
                            <div style="font-size:18px; font-weight:900; color:#e11d48; margin-top:2px;">${plan.fatTarget}g <span style="font-size:11px; font-weight:700; color:#0284c7;">/ ${(plan.waterTarget / 1000).toFixed(1)}L</span></div>
                            <div style="font-size:10.5px; color:#64748b; font-weight:600; margin-top:2px;">(ฮอร์โมน & ระบบไหลเวียน)</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="wm-ob-footer">
                <button type="button" class="wm-ob-continue-btn" onclick="goObStep(8, 'completion')">ดำเนินการต่อ</button>
            </div>
        </div>`;
    }

    // -------------------------------------------------------------
    // STEP 8.5: สรุปภาพรวมโปรแกรมส่วนบุคคล (Final Summary & Launch)
    // -------------------------------------------------------------
    else if (obStep === 8 && obSubStep === 'completion') {
        const plan = computeOnboardingPlan();
        const weeks = Math.max(4, Number(obState.courseWeeks) || 20);

        body.innerHTML = `
        <div class="wm-ob-wrap">
            <div class="wm-ob-topbar">
                <button type="button" class="wm-ob-back-btn" onclick="goObStep(8)">‹</button>
                <div class="wm-ob-progress-track">
                    <div class="wm-ob-progress-fill" style="width:100%;"></div>
                </div>
                <div class="wm-ob-step-num">8 / 8</div>
            </div>
            <div class="wm-ob-body">
                <div style="text-align:center; margin-bottom:12px;">
                    <div style="display:inline-block; font-size:11px; font-weight:800; color:#0284c7; background:#eff6ff; padding:3px 12px; border-radius:99px; border:1px solid #bae6fd; margin-bottom:6px;">🚀 แผนฝึกพร้อมใช้งาน</div>
                    <h1 class="wm-ob-title" style="margin:0 0 6px; font-size:23px;">สรุปโปรแกรมส่วนบุคคล FitCoach</h1>
                    <p style="font-size:12.5px; color:#64748b; margin:0;">แผนโภชนาการและการฝึกซ้อมได้รับการปรับแต่งตามหลักวิทยาศาสตร์การกีฬาเรียบร้อยแล้ว</p>
                </div>

                <!-- Hero Plan Card -->
                <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:24px; padding:18px 16px; box-shadow:0 6px 20px rgba(15,23,42,0.04); margin-bottom:14px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #f1f5f9; padding-bottom:12px; margin-bottom:12px;">
                        <div>
                            <div style="font-size:11.5px; font-weight:800; color:#64748b;">เป้าหมายน้ำหนักตัว</div>
                            <div style="font-size:19px; font-weight:900; color:#0f172a; margin-top:2px;">
                                ${obState.weight.toFixed(1)} ➔ <span style="color:#0284c7;">${obState.targetWeight.toFixed(1)} kg</span>
                            </div>
                        </div>
                        <div style="text-align:right;">
                            <div style="font-size:11.5px; font-weight:800; color:#64748b;">ระยะเวลาโปรแกรม</div>
                            <div style="font-size:19px; font-weight:900; color:#0f172a; margin-top:2px;">
                                ${weeks} <span style="font-size:13px; font-weight:700; color:#64748b;">สัปดาห์</span>
                            </div>
                        </div>
                    </div>

                    <!-- Macro Target Grid -->
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                        <div style="background:#f0f9ff; padding:8px 10px; border-radius:12px; border:1px solid #bae6fd;">
                            <span style="color:#0369a1; font-weight:800; font-size:11px;">งบพลังงาน</span><br>
                            <b style="font-size:16px; color:#0284c7;">${plan.calTarget.toLocaleString()} kcal</b>
                        </div>
                        <div style="background:#ecfdf5; padding:8px 10px; border-radius:12px; border:1px solid #a7f3d0;">
                            <span style="color:#047857; font-weight:800; font-size:11px;">โปรตีนเป้าหมาย</span><br>
                            <b style="font-size:16px; color:#059669;">${plan.proTarget} กรัม</b>
                        </div>
                        <div style="background:#fefce8; padding:8px 10px; border-radius:12px; border:1px solid #fef08a;">
                            <span style="color:#854d0e; font-weight:800; font-size:11px;">คาร์โบไฮเดรต</span><br>
                            <b style="font-size:16px; color:#ca8a04;">${plan.carbsTarget} กรัม</b>
                        </div>
                        <div style="background:#fff1f2; padding:8px 10px; border-radius:12px; border:1px solid #fecdd3;">
                            <span style="color:#9f1239; font-weight:800; font-size:11px;">ไขมันดี & น้ำ</span><br>
                            <b style="font-size:16px; color:#e11d48;">${plan.fatTarget}g / ${(plan.waterTarget / 1000).toFixed(1)}L</b>
                        </div>
                    </div>
                </div>

                <!-- Medical Shields & Clinical Protection -->
                <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:18px; padding:14px 16px;">
                    <div style="font-size:12.5px; font-weight:900; color:#0f172a; margin-bottom:8px; display:flex; align-items:center; gap:6px;">
                        <span>🩺</span> ระบบคุ้มกันทางการแพทย์เฉพาะบุคคล
                    </div>
                    <ul style="margin:0; padding-left:16px; font-size:11.5px; color:#475569; line-height:1.6; display:flex; flex-direction:column; gap:4px;">
                        <li><b>McGill Lower Back Shield:</b> ปรับท่าเวทเทรนนิ่งเพื่อปกป้องกระดูกสันหลังและข้อต่อ</li>
                        <li><b>Metabolic Protection:</b> อัตรา Deficit ค่อยเป็นค่อยไปเพื่อลดไขมันเกาะตับโดยไม่โทรม</li>
                        <li><b>Shift-Duty Aware:</b> รองรับโหมดเข้าเวรและวันที่พักฟื้นน้อยเพื่อป้องกันการสูญเสียกล้ามเนื้อ</li>
                    </ul>
                </div>
            </div>
            <div class="wm-ob-footer">
                <button type="button" class="wm-ob-continue-btn" onclick="applyOnboardingPlanToApp()">บันทึกและเริ่มโปรแกรมส่วนบุคคล 🚀</button>
            </div>
        </div>`;
    }
}

function getObBackAction() {
    if (obSubStep === 'analysis') return "goObStep(4)";
    if (obSubStep === 'trajectory') return "goObStep(6)";
    if (obSubStep === 'completion') return "goObStep(8)";
    if (obStep > 1) return `goObStep(${obStep - 1})`;
    return "closeOnboardingWizard(true)";
}

function buildScaleTicksHtml(centerVal = 78.0) {
    let html = '';
    const start = Math.floor(centerVal) - 4;
    for (let i = start; i <= start + 8; i++) {
        html += `
            <div style="display:flex; flex-direction:column; align-items:center; gap:2px; flex:0 0 36px;">
                <div style="width:2px; height:18px; background:#64748b; border-radius:1px;"></div>
                <span style="font-size:11px; font-weight:700; color:#64748b;">${i}</span>
            </div>
        `;
    }
    return html;
}
