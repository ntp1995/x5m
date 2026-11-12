/* ============================================================================
   FitCoach v3.0 Component: 5-Axis Liver/Nutrition Radar & InBody Clinical Sheet
   Inspired by: WiseMeal (Radar Chart) & InOut (InBody Clinical Sheet)
   ============================================================================ */

function ensureClinicalBioMetrics() {
    D.bio = D.bio || {};
    if (D.bio.triglycerides === undefined) D.bio.triglycerides = 333;
    if (D.bio.visceralFat === undefined) D.bio.visceralFat = 11;
    if (D.bio.boneMass === undefined) D.bio.boneMass = 2.89;
    return D.bio;
}

async function editClinicalBioMetricsModal() {
    const bio = ensureClinicalBioMetrics();
    const tg = await fcPrompt('ระบุค่าไตรกลีเซอไรด์ล่าสุด (mg/dL) — เป้าหมาย < 150:', String(bio.triglycerides), '🩸 อัปเดตผลเลือด & InBody');
    if (tg === null) return;
    const vf = await fcPrompt('ระบุระดับไขมันช่องท้อง (Visceral Fat) — เป้าหมาย < 9:', String(bio.visceralFat), '🔥 อัปเดต Visceral Fat');
    if (vf === null) return;
    const bm = await fcPrompt('ระบุมวลกระดูก (Bone Mass กก.) — ค่าเริ่มต้น 2.89 กก.:', String(bio.boneMass), '🦴 อัปเดตมวลกระดูก');
    if (bm === null) return;

    const tgNum = parseFloat(tg);
    const vfNum = parseFloat(vf);
    const bmNum = parseFloat(bm);
    if (!isNaN(tgNum) && tgNum > 20) bio.triglycerides = tgNum;
    if (!isNaN(vfNum) && vfNum > 0) bio.visceralFat = vfNum;
    if (!isNaN(bmNum) && bmNum > 0.5) bio.boneMass = bmNum;
    save();
    render();
}

function compute5AxisRadarScores() {
    const tc = (typeof todayCheck === 'function') ? (todayCheck() || {}) : {};
    const cal = Number(tc.cal || 0);
    const pro = Number(tc.protein || 0);
    const wat = Number(tc.water || 0);
    const steps = Number(tc.steps || 0);

    // 1. Calorie score (0-100)
    let calScore = 60;
    if (cal > 0) {
        const diffRatio = Math.abs(cal - CAL_TARGET) / Math.max(1, CAL_TARGET);
        calScore = Math.round(Math.max(25, Math.min(100, (1 - diffRatio) * 100)));
    }

    // 2. Protein score (0-100)
    const proScore = Math.round(Math.max(20, Math.min(100, (pro / Math.max(1, PROTEIN_TARGET)) * 100)));

    // 3. Liver & Triglyceride Guard score (Supp checklist + low sugar)
    let suppPct = 65;
    if (typeof getTodaySuppProgress === 'function') {
        const sp = getTodaySuppProgress();
        if (sp && sp.total > 0) suppPct = Math.round((sp.done / sp.total) * 100);
    }
    const liverScore = Math.round(Math.max(35, Math.min(100, suppPct * 0.7 + 30)));

    // 4. Hydration (3L) & IF 16:8 score
    const watRatio = Math.min(1, wat / 3000);
    const ifActiveBonus = (D && D.if && D.if.start) ? 25 : 15;
    const ifWaterScore = Math.round(Math.max(25, Math.min(100, watRatio * 75 + ifActiveBonus)));

    // 5. Activity & Steps score
    const stepTarget = (D && D.cfg && D.cfg.stepTarget) ? D.cfg.stepTarget : 8000;
    const actScore = Math.round(Math.max(25, Math.min(100, (steps / Math.max(1, stepTarget)) * 100)));

    const avg = Math.round((calScore + proScore + liverScore + ifWaterScore + actScore) / 5);
    return {
        axes: [
            { label: 'แคลอรี', val: calScore },
            { label: 'โปรตีน', val: proScore },
            { label: 'เซฟตับ/TG', val: liverScore },
            { label: 'IF & น้ำ 3L', val: ifWaterScore },
            { label: 'แอคทีฟ', val: actScore }
        ],
        avg
    };
}

function buildRadarPentagonSvg(axes) {
    const cx = 90, cy = 88, rMax = 58;
    const angles = [-90, -18, 54, 126, 198].map(deg => (deg * Math.PI) / 180);

    function pt(radius, idx) {
        const a = angles[idx];
        return `${(cx + radius * Math.cos(a)).toFixed(1)},${(cy + radius * Math.sin(a)).toFixed(1)}`;
    }

    const ring100 = angles.map((_, i) => pt(rMax, i)).join(' ');
    const ring66 = angles.map((_, i) => pt(rMax * 0.66, i)).join(' ');
    const ring33 = angles.map((_, i) => pt(rMax * 0.33, i)).join(' ');
    const dataPoly = axes.map((ax, i) => pt((ax.val / 100) * rMax, i)).join(' ');

    const labelsSvg = axes.map((ax, i) => {
        const a = angles[i];
        const lx = cx + (rMax + 20) * Math.cos(a);
        const ly = cy + (rMax + 16) * Math.sin(a);
        return `<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="middle" dominant-baseline="middle" font-size="9.5" font-weight="800" fill="var(--tx)">${ax.label} (${ax.val})</text>`;
    }).join('');

    return `
        <svg viewBox="0 0 180 175" width="175" height="168" style="display:block; margin:0 auto;">
            <polygon points="${ring100}" fill="none" stroke="var(--line)" stroke-width="1"/>
            <polygon points="${ring66}" fill="none" stroke="var(--line)" stroke-width="1" stroke-dasharray="2,2"/>
            <polygon points="${ring33}" fill="none" stroke="var(--line)" stroke-width="1" stroke-dasharray="2,2"/>
            ${angles.map((_, i) => `<line x1="${cx}" y1="${cy}" x2="${pt(rMax, i).split(',')[0]}" y2="${pt(rMax, i).split(',')[1]}" stroke="var(--line)" stroke-width="1"/>`).join('')}
            <polygon points="${dataPoly}" fill="rgba(249, 115, 22, 0.25)" stroke="#f97316" stroke-width="2.2"/>
            ${labelsSvg}
        </svg>
    `;
}

function renderInBodyAndRadarWidgets() {
    const bio = ensureClinicalBioMetrics();
    const radar = compute5AxisRadarScores();
    const tc = (typeof todayCheck === 'function') ? (todayCheck() || {}) : {};
    const curW = tc.w || ((D.checks && D.checks.length) ? D.checks[D.checks.length - 1].w : 77.5);
    const curMuscle = tc.muscle || ((D.checks && D.checks.length) ? D.checks[D.checks.length - 1].muscle : 54.3);

    // 1. Render compact Medical & Radar Card on Home (#v3HomeRadarCard)
    const homeEl = document.getElementById('v3HomeRadarCard');
    if (homeEl) {
        homeEl.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px; margin-bottom:8px;">
                <div>
                    <div style="display:inline-flex; align-items:center; gap:5px; font-size:10.5px; font-weight:800; color:#059669; background:rgba(16,185,129,0.12); padding:3px 8px; border-radius:99px; margin-bottom:4px;">
                        🛡️ Medical-Aware Nutrition & Liver Guard
                    </div>
                    <h3 style="margin:0; font-size:14.5px; font-weight:900;">สมดุลสุขภาพ 5 มิติ & เป้าหมายคลินิก</h3>
                </div>
                <button type="button" class="btn sm g" onclick="editClinicalBioMetricsModal()" style="width:auto; padding:4px 9px; font-size:11px;">✏️ อัปเดตผลตรวจ</button>
            </div>

            <div style="display:grid; grid-template-columns: 1.05fr 1fr; gap:8px; align-items:center;">
                <div>${buildRadarPentagonSvg(radar.axes)}</div>
                <div style="display:flex; flex-direction:column; gap:7px;">
                    <div style="background:var(--card2); border:1px solid var(--line); border-radius:10px; padding:7px 9px;">
                        <div style="font-size:10px; color:var(--dim); font-weight:700;">🩸 ไตรกลีเซอไรด์ (เป้า &lt;150)</div>
                        <div style="font-size:15px; font-weight:900; color:${bio.triglycerides > 150 ? '#ea580c' : '#10b981'};">${bio.triglycerides} <span style="font-size:10px; font-weight:600;">mg/dL</span></div>
                    </div>
                    <div style="background:var(--card2); border:1px solid var(--line); border-radius:10px; padding:7px 9px;">
                        <div style="font-size:10px; color:var(--dim); font-weight:700;">🔥 ไขมันช่องท้อง (เป้า &lt;9)</div>
                        <div style="font-size:15px; font-weight:900; color:${bio.visceralFat >= 10 ? '#f59e0b' : '#10b981'};">ระดับ ${bio.visceralFat}</div>
                    </div>
                    <div style="background:var(--card2); border:1px solid var(--line); border-radius:10px; padding:7px 9px;">
                        <div style="font-size:10px; color:var(--dim); font-weight:700;">🦴 มวลกระดูก (ฐาน 2.89 กก.)</div>
                        <div style="font-size:15px; font-weight:900; color:#0284c7;">${Number(bio.boneMass).toFixed(2)} <span style="font-size:10px; font-weight:600;">กก.</span></div>
                    </div>
                </div>
            </div>
        `;
    }

    // 2. Render Full Clinical InBody Sheet on Stats page (#v3StatsInBodyCard)
    const statEl = document.getElementById('v3StatsInBodyCard');
    if (statEl) {
        const tgPos = Math.min(95, Math.max(10, Math.round((bio.triglycerides / 400) * 100)));
        const vfPos = Math.min(95, Math.max(10, Math.round((bio.visceralFat / 18) * 100)));
        const bmPos = Math.min(95, Math.max(10, Math.round((bio.boneMass / 4.0) * 100)));

        statEl.innerHTML = `
            <div class="row" style="align-items:center; margin-bottom:10px;">
                <div>
                    <h3 style="margin:0; font-size:15px; font-weight:900;">🏥 ใบรายงานองค์ประกอบร่างกาย (InBody & Liver Clinical Sheet)</h3>
                    <div class="sub" style="font-size:11.5px;">อ้างอิงรูปแบบ InOut: ติดตามการลดไขมันช่องท้อง ไตรกลีเซอไรด์ และมวลกระดูก</div>
                </div>
                <button type="button" class="btn sm g" onclick="editClinicalBioMetricsModal()" style="width:auto; padding:5px 10px; font-size:11.5px;">อัปเดตค่า</button>
            </div>

            <div class="inbody-row">
                <div style="display:flex; justify-content:space-between; font-size:12.5px; font-weight:800;">
                    <span>🩸 ไตรกลีเซอไรด์ (Triglycerides)</span>
                    <span style="color:${bio.triglycerides > 150 ? '#ea580c' : '#10b981'};">${bio.triglycerides} mg/dL (เป้าหมาย &lt; 150)</span>
                </div>
                <div class="inbody-track">
                    <div style="background:#10b981;"></div>
                    <div style="background:#f59e0b;"></div>
                    <div style="background:#ef4444;"></div>
                    <div class="inbody-marker" style="left:${tgPos}%;"></div>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:10px; color:var(--dim); margin-top:4px;">
                    <span>ปกติ (&lt;150)</span><span>ก้ำกึ่ง (150-199)</span><span>สูง (200-333+)</span>
                </div>
            </div>

            <div class="inbody-row">
                <div style="display:flex; justify-content:space-between; font-size:12.5px; font-weight:800;">
                    <span>🔥 ไขมันช่องท้อง (Visceral Fat)</span>
                    <span style="color:${bio.visceralFat >= 10 ? '#f59e0b' : '#10b981'};">ระดับ ${bio.visceralFat} (เป้าหมาย &lt; 9)</span>
                </div>
                <div class="inbody-track">
                    <div style="background:#10b981;"></div>
                    <div style="background:#f59e0b;"></div>
                    <div style="background:#ef4444;"></div>
                    <div class="inbody-marker" style="left:${vfPos}%;"></div>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:10px; color:var(--dim); margin-top:4px;">
                    <span>มาตรฐาน (1-9)</span><span>เริ่มเกิน (10-14)</span><span>อันตราย (15+)</span>
                </div>
            </div>

            <div class="inbody-row">
                <div style="display:flex; justify-content:space-between; font-size:12.5px; font-weight:800;">
                    <span>🦴 มวลกระดูกแร่ธาตุ (Bone Mass) + กล้ามเนื้อ (${curMuscle} กก.)</span>
                    <span style="color:#0284c7;">${Number(bio.boneMass).toFixed(2)} กก. (เป้าหมาย ≥ 3.00 กก.)</span>
                </div>
                <div class="inbody-track">
                    <div style="background:#f59e0b;"></div>
                    <div style="background:#10b981;"></div>
                    <div style="background:#0284c7;"></div>
                    <div class="inbody-marker" style="left:${bmPos}%;"></div>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:10px; color:var(--dim); margin-top:4px;">
                    <span>ต่ำกว่าเกณฑ์ (&lt;2.6)</span><span>มาตรฐาน (2.7-3.1)</span><span>แข็งแรงมาก (3.2+)</span>
                </div>
            </div>
        `;
    }
}
