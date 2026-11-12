/* ============================================================================
   FitCoach v3.0 Component: 2D Front & Back Anatomical Muscle Recovery Heatmap
   Inspired by: GymWork (pro.godok.gymwork)
   ============================================================================ */

const MUSCLE_GROUPS_V3 = [
    { id: 'chest', side: 'front', name: 'อก (Chest)', wKeys: ['A', 'C'], exHint: 'Floor Press, Push-up' },
    { id: 'shoulders', side: 'front', name: 'ไหล่ (Shoulders)', wKeys: ['A', 'B', 'C'], exHint: 'Lateral Raise, Shoulder Press' },
    { id: 'biceps', side: 'front', name: 'หน้าแขน (Biceps)', wKeys: ['B', 'C'], exHint: 'Hammer Curl, Concentration Curl' },
    { id: 'core', side: 'front', name: 'หน้าท้อง/แกนกลาง (Core)', wKeys: ['A', 'B', 'C', 'Z', 'H'], exHint: 'Dead Bug, Bird-Dog, Plank' },
    { id: 'quads', side: 'front', name: 'ต้นขาด้านหน้า (Quads)', wKeys: ['A', 'C', 'H'], exHint: 'Goblet Squat, Split Squat' },
    { id: 'upper_back', side: 'back', name: 'บ่า & หลังบน (Upper Back/Lats)', wKeys: ['B', 'C'], exHint: 'Chest-Supported Row, One-Arm Row' },
    { id: 'triceps', side: 'back', name: 'หลังแขน (Triceps)', wKeys: ['A', 'C'], exHint: 'Overhead Tricep Extension' },
    { id: 'lower_back', side: 'back', name: '🛡️ หลังส่วนล่าง (McGill Shield)', wKeys: ['A', 'B', 'C'], exHint: 'McGill Big 3, Glute Bridge (เลี่ยงก้มยกหนัก)' },
    { id: 'glutes_hams', side: 'back', name: 'ก้น & ขาด้านหลัง (Glutes/Hams)', wKeys: ['A', 'B', 'C'], exHint: 'Hip Thrust, Romanian Deadlift (Back-Safe)' }
];

let selectedMuscleIdV3 = 'lower_back';

function computeMuscleRecoveryStatus() {
    const now = new Date();
    const sessions = (D && D.sessions) ? D.sessions : [];
    const tc = (typeof todayCheck === 'function') ? (todayCheck() || {}) : {};
    const painScore = Number(tc.pain || 0);

    const statusMap = {};
    MUSCLE_GROUPS_V3.forEach(m => {
        let minDaysAgo = 99;
        sessions.forEach(s => {
            if (!s.date) return;
            const wk = s.workout_key || '';
            if (m.wKeys.includes(wk)) {
                const diffMs = now - new Date(s.date + 'T12:00:00');
                const days = Math.max(0, Math.floor(diffMs / 86400000));
                if (days < minDaysAgo) minDaysAgo = days;
            }
        });

        let pct = 100;
        let color = '#10b981'; // Green = Ready
        let stateTxt = 'พร้อมฝึก 100%';

        if (minDaysAgo === 0) {
            pct = 45;
            color = '#f43f5e';
            stateTxt = 'เพิ่งฝึกวันนี้ (พักซ่อมแซม)';
        } else if (minDaysAgo === 1) {
            pct = 72;
            color = '#f59e0b';
            stateTxt = 'ฝึกเมื่อวาน (กำลังฟื้นตัว)';
        } else if (minDaysAgo === 2) {
            pct = 90;
            color = '#10b981';
            stateTxt = 'พัก 2 วัน (พร้อมฝึก)';
        }

        // Special protection for Lower Back if pain >= 3 or bsMode is active
        if (m.id === 'lower_back' && (painScore >= 3 || (D && D.bs))) {
            pct = painScore >= 5 ? 40 : 68;
            color = painScore >= 5 ? '#f43f5e' : '#f59e0b';
            stateTxt = painScore >= 5
                ? `ปวดหลัง ${painScore}/10 (งดแรงกดสันหลัง)`
                : 'โหมดเซฟหลัง McGill Big 3 ทำงาน';
        }

        statusMap[m.id] = {
            ...m,
            daysAgo: minDaysAgo === 99 ? '3+ วัน' : (minDaysAgo === 0 ? 'วันนี้' : `${minDaysAgo} วันก่อน`),
            pct,
            color,
            stateTxt
        };
    });

    return statusMap;
}

function selectMuscleHeatmapGroup(mId) {
    selectedMuscleIdV3 = mId;
    renderMuscleRecoveryWidget();
}

function renderMuscleRecoveryWidget() {
    const el = document.getElementById('v3MuscleRecoveryCard');
    if (!el) return;

    const map = computeMuscleRecoveryStatus();
    const sel = map[selectedMuscleIdV3] || map['lower_back'];

    el.innerHTML = `
        <div class="row" style="align-items:center; margin-bottom:8px;">
            <div>
                <h3 style="margin:0; font-size:15px; font-weight:900; display:flex; align-items:center; gap:6px;">
                    <span>🧬 แผนผังการฟื้นตัวกล้ามเนื้อ 2D (Muscle Recovery Map)</span>
                </h3>
                <div class="sub" style="font-size:11.5px;">คำนวณความล้าอัตโนมัติจากประวัติฝึกจริง + เกราะเซฟหลังส่วนล่าง</div>
            </div>
            <span class="tag" style="background:rgba(16,185,129,0.14); color:#059669; font-weight:800; font-size:11px;">GymWork AI</span>
        </div>

        <div class="muscle-map-grid">
            <!-- Front Anatomical SVG -->
            <div class="muscle-body-box">
                <div style="font-size:11.5px; font-weight:800; color:var(--dim); margin-bottom:6px;">ด้านหน้า (Front)</div>
                <svg viewBox="0 0 120 200" width="105" height="165" style="margin:0 auto; display:block;">
                    <!-- Head & Neck -->
                    <circle cx="60" cy="20" r="12" fill="#94a3b8" opacity="0.45"/>
                    <rect x="55" y="32" width="10" height="8" rx="3" fill="#94a3b8" opacity="0.45"/>
                    <!-- Shoulders -->
                    <rect x="26" y="40" width="16" height="22" rx="7" fill="${map.shoulders.color}" onclick="selectMuscleHeatmapGroup('shoulders')" style="cursor:pointer;"/>
                    <rect x="78" y="40" width="16" height="22" rx="7" fill="${map.shoulders.color}" onclick="selectMuscleHeatmapGroup('shoulders')" style="cursor:pointer;"/>
                    <!-- Chest -->
                    <rect x="43" y="40" width="34" height="26" rx="6" fill="${map.chest.color}" onclick="selectMuscleHeatmapGroup('chest')" style="cursor:pointer;"/>
                    <!-- Biceps -->
                    <rect x="24" y="64" width="14" height="28" rx="6" fill="${map.biceps.color}" onclick="selectMuscleHeatmapGroup('biceps')" style="cursor:pointer;"/>
                    <rect x="82" y="64" width="14" height="28" rx="6" fill="${map.biceps.color}" onclick="selectMuscleHeatmapGroup('biceps')" style="cursor:pointer;"/>
                    <!-- Core / Abs -->
                    <rect x="45" y="68" width="30" height="38" rx="6" fill="${map.core.color}" onclick="selectMuscleHeatmapGroup('core')" style="cursor:pointer;"/>
                    <!-- Quads -->
                    <rect x="42" y="110" width="16" height="48" rx="7" fill="${map.quads.color}" onclick="selectMuscleHeatmapGroup('quads')" style="cursor:pointer;"/>
                    <rect x="62" y="110" width="16" height="48" rx="7" fill="${map.quads.color}" onclick="selectMuscleHeatmapGroup('quads')" style="cursor:pointer;"/>
                    <!-- Calves -->
                    <rect x="44" y="162" width="13" height="30" rx="5" fill="#94a3b8" opacity="0.4"/>
                    <rect x="63" y="162" width="13" height="30" rx="5" fill="#94a3b8" opacity="0.4"/>
                </svg>
            </div>

            <!-- Back Anatomical SVG -->
            <div class="muscle-body-box">
                <div style="font-size:11.5px; font-weight:800; color:var(--dim); margin-bottom:6px;">ด้านหลัง (Back)</div>
                <svg viewBox="0 0 120 200" width="105" height="165" style="margin:0 auto; display:block;">
                    <!-- Head & Neck -->
                    <circle cx="60" cy="20" r="12" fill="#94a3b8" opacity="0.45"/>
                    <rect x="55" y="32" width="10" height="8" rx="3" fill="#94a3b8" opacity="0.45"/>
                    <!-- Upper Back / Lats -->
                    <rect x="42" y="40" width="36" height="34" rx="7" fill="${map.upper_back.color}" onclick="selectMuscleHeatmapGroup('upper_back')" style="cursor:pointer;"/>
                    <!-- Triceps -->
                    <rect x="25" y="56" width="14" height="32" rx="6" fill="${map.triceps.color}" onclick="selectMuscleHeatmapGroup('triceps')" style="cursor:pointer;"/>
                    <rect x="81" y="56" width="14" height="32" rx="6" fill="${map.triceps.color}" onclick="selectMuscleHeatmapGroup('triceps')" style="cursor:pointer;"/>
                    <!-- Lower Back (McGill Shield) -->
                    <rect x="45" y="76" width="30" height="24" rx="6" fill="${map.lower_back.color}" stroke="#0f172a" stroke-width="1.5" onclick="selectMuscleHeatmapGroup('lower_back')" style="cursor:pointer;"/>
                    <!-- Glutes & Hamstrings -->
                    <rect x="42" y="103" width="16" height="54" rx="7" fill="${map.glutes_hams.color}" onclick="selectMuscleHeatmapGroup('glutes_hams')" style="cursor:pointer;"/>
                    <rect x="62" y="103" width="16" height="54" rx="7" fill="${map.glutes_hams.color}" onclick="selectMuscleHeatmapGroup('glutes_hams')" style="cursor:pointer;"/>
                    <!-- Calves -->
                    <rect x="44" y="162" width="13" height="30" rx="5" fill="#94a3b8" opacity="0.4"/>
                    <rect x="63" y="162" width="13" height="30" rx="5" fill="#94a3b8" opacity="0.4"/>
                </svg>
            </div>
        </div>

        <!-- Legend -->
        <div style="display:flex; justify-content:center; gap:12px; font-size:11px; color:var(--dim); margin-top:8px;">
            <span><b style="color:#10b981;">●</b> พร้อมฝึก (90-100%)</span>
            <span><b style="color:#f59e0b;">●</b> กำลังฟื้นตัว (65-85%)</span>
            <span><b style="color:#f43f5e;">●</b> พักซ่อมแซม (&lt;65%)</span>
        </div>

        <!-- Muscle Pill Selector -->
        <div class="muscle-pill-list">
            ${Object.values(map).map(m => `
                <button type="button" class="muscle-pill ${m.id === sel.id ? 'active' : ''}" onclick="selectMuscleHeatmapGroup('${m.id}')">
                    <span style="width:8px; height:8px; border-radius:50%; background:${m.color}; display:inline-block;"></span>
                    <span>${m.name}</span>
                    <span style="color:var(--dim); font-weight:600;">${m.pct}%</span>
                </button>
            `).join('')}
        </div>

        <!-- Selected Muscle Inspector Box -->
        <div style="margin-top:10px; background:var(--card2); border:1px solid var(--line); border-left:4px solid ${sel.color}; border-radius:10px; padding:10px 12px; font-size:12px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <strong style="color:var(--tx); font-size:13px;">${sel.name} — ความพร้อม ${sel.pct}%</strong>
                <span style="font-size:11px; color:var(--dim);">ฝึกล่าสุด: ${sel.daysAgo}</span>
            </div>
            <div style="color:${sel.color}; font-weight:700; margin-top:2px;">สถานะ: ${sel.stateTxt}</div>
            <div style="color:var(--dim); font-size:11.5px; margin-top:4px;">💡 ท่าแนะนำ/ปลอดภัย: <b>${sel.exHint}</b></div>
        </div>
    `;
}
