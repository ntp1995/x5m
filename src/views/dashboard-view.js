/* FitCoach v3.0 — Dashboard View & Weekly Executive AI Report */
/* ============ FEATURE 4: WEEKLY AI EXECUTIVE REPORT ============ */
function getWeeklyReportData() {
    const today = new Date();
    const past7Days = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        past7Days.push(iso(d));
    }

    const checks7 = (D.checks || []).filter(c => past7Days.includes(c.d));
    const wChecks = checks7.filter(c => c.w != null);
    const wStart = wChecks.length > 0 ? wChecks[0].w : (D.checks[D.checks.length - 1]?.w || 77.9);
    const wEnd = wChecks.length > 0 ? wChecks[wChecks.length - 1].w : wStart;
    const wDelta = wEnd - wStart;

    const bfChecks = checks7.filter(c => c.bf != null);
    const bfEnd = bfChecks.length > 0 ? bfChecks[bfChecks.length - 1].bf : null;

    const validCal = checks7.filter(c => c.cal != null && c.cal > 0);
    const avgCal = validCal.length > 0 ? Math.round(validCal.reduce((a, b) => a + b.cal, 0) / validCal.length) : 0;

    const validPro = checks7.filter(c => c.protein != null && c.protein > 0);
    const avgPro = validPro.length > 0 ? Math.round(validPro.reduce((a, b) => a + b.protein, 0) / validPro.length) : 0;

    const validSugar = checks7.filter(c => c.sugar != null && c.sugar > 0);
    const avgSugar = validSugar.length > 0 ? Math.round(validSugar.reduce((a, b) => a + b.sugar, 0) / validSugar.length) : 0;

    const validSodium = checks7.filter(c => c.sodium != null && c.sodium > 0);
    const avgSodium = validSodium.length > 0 ? Math.round(validSodium.reduce((a, b) => a + b.sodium, 0) / validSodium.length) : 0;

    const validWat = checks7.filter(c => c.water != null && c.water > 0);
    const avgWat = validWat.length > 0 ? Math.round(validWat.reduce((a, b) => a + b.water, 0) / validWat.length) : 0;

    const validSteps = checks7.filter(c => c.steps != null && c.steps > 0);
    const avgSteps = validSteps.length > 0 ? Math.round(validSteps.reduce((a, b) => a + b.steps, 0) / validSteps.length) : 0;

    const sessions7 = (D.sessions || []).filter(s => past7Days.includes(s.date));
    const totalTrainSec = sessions7.reduce((a, b) => a + (b.duration_sec || 0), 0);
    const totalTrainMin = Math.round(totalTrainSec / 60);

    const sets7 = (D.sets || []).filter(st => past7Days.includes(st.date));
    const totalVolumeKg = Math.round(sets7.reduce((a, b) => a + ((b.weight_kg || 0) * (b.reps || 0)), 0));

    const painChecks = checks7.filter(c => c.pain != null);
    const avgPain = painChecks.length > 0 ? +(painChecks.reduce((a, b) => a + b.pain, 0) / painChecks.length).toFixed(1) : 0;

    return {
        past7Days,
        wStart,
        wEnd,
        wDelta,
        bfEnd,
        avgCal,
        avgPro,
        avgSugar,
        avgSodium,
        avgWat,
        avgSteps,
        sessions7Count: sessions7.length,
        totalTrainMin,
        totalVolumeKg,
        avgPain,
        daysLogged: checks7.length
    };
}

function openWeeklyReportModal() {
    const data = getWeeklyReportData();
    const wSign = data.wDelta > 0 ? '+' : '';
    const wColor = data.wDelta <= 0 ? 'var(--ok)' : 'var(--warn)';
    const proPct = Math.round((data.avgPro / (PROTEIN_TARGET || 155)) * 100);
    const watPct = Math.round((data.avgWat / (WATER_TARGET || 2700)) * 100);

    let backHealthMsg = '';
    let backHealthColor = 'var(--ok)';
    if (data.avgPain <= 1) {
        backHealthMsg = '🛡️ สุขภาพหลังยอดเยี่ยม (เฉลี่ย ' + data.avgPain + '/10) — แกนกลางลำตัวแข็งแรง ปลอดภัย พร้อมฝึกต่อเนื่อง';
    } else if (data.avgPain <= 3) {
        backHealthMsg = '⚠️ ระดับการตึงตัวเล็กน้อย (เฉลี่ย ' + data.avgPain + '/10) — แนะนำเน้น Bird Dog & Side Plank ไม่ก้มยกของหลังค่อม';
        backHealthColor = 'var(--warn)';
    } else {
        backHealthMsg = '🚨 เฝ้าระวังหลังล่าง (เฉลี่ย ' + data.avgPain + '/10) — ระบบแนะนำเปิดโหมด Back-Safe และเน้น Active Recovery';
        backHealthColor = 'var(--red)';
    }

    const html = `
        <div style="text-align:left; font-size:13.5px; max-height:80vh; overflow-y:auto; padding-right:2px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <div>
                    <div style="font-weight:900; font-size:17px; color:var(--acc);">📊 รายงานสรุปผลประจำสัปดาห์</div>
                    <div style="font-size:12px; color:var(--dim);">ช่วงวันที่ ${data.past7Days[0].slice(5)} ถึง ${data.past7Days[6].slice(5)} (รอบ 7 วัน)</div>
                </div>
                <span class="tag o" style="font-size:11px; padding:3px 8px; font-weight:700;">Executive Report</span>
            </div>

            <!-- 4 Metric Bento Grid -->
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin:12px 0;">
                <!-- Box 1: Weight -->
                <div style="background:var(--card2); border:1px solid var(--line); border-radius:10px; padding:10px;">
                    <div style="font-size:11px; color:var(--dim); font-weight:700;">⚖️ น้ำหนักตัว</div>
                    <div style="font-size:18px; font-weight:900; color:var(--tx); margin-top:2px;">
                        ${data.wEnd.toFixed(1)} <span style="font-size:12px; font-weight:600;">กก.</span>
                    </div>
                    <div style="font-size:11.5px; color:${wColor}; font-weight:700; margin-top:2px;">
                        ${wSign}${data.wDelta.toFixed(1)} กก. ในสัปดาห์นี้
                    </div>
                </div>

                <!-- Box 2: Protein & Nutrition -->
                <div style="background:var(--card2); border:1px solid var(--line); border-radius:10px; padding:10px;">
                    <div style="font-size:11px; color:var(--dim); font-weight:700;">🍗 โปรตีนเฉลี่ย</div>
                    <div style="font-size:18px; font-weight:900; color:var(--acc2); margin-top:2px;">
                        ${data.avgPro} <span style="font-size:12px; font-weight:600; color:var(--dim);">/ ${PROTEIN_TARGET}g</span>
                    </div>
                    <div style="font-size:11.5px; color:var(--dim); margin-top:2px;">
                        ${proPct}% ของเป้า (${data.avgCal.toLocaleString()} kcal/วัน)
                    </div>
                </div>

                <!-- Box 3: Water & Steps -->
                <div style="background:var(--card2); border:1px solid var(--line); border-radius:10px; padding:10px;">
                    <div style="font-size:11px; color:var(--dim); font-weight:700;">💧 น้ำดื่ม & ก้าวเดิน</div>
                    <div style="font-size:18px; font-weight:900; color:var(--vio); margin-top:2px;">
                        ~{(${data.avgWat} / 1000).toFixed(1)}L <span style="font-size:12px; font-weight:600; color:var(--dim);">/ วัน</span>
                    </div>
                    <div style="font-size:11.5px; color:var(--dim); margin-top:2px;">
                        ${watPct}% เป้า • ${data.avgSteps.toLocaleString()} ก้าว/วัน
                    </div>
                </div>

                <!-- Box 4: Training & Volume -->
                <div style="background:var(--card2); border:1px solid var(--line); border-radius:10px; padding:10px;">
                    <div style="font-size:11px; color:var(--dim); font-weight:700;">🏋️ ผลงานการฝึกซ้อม</div>
                    <div style="font-size:18px; font-weight:900; color:var(--acc); margin-top:2px;">
                        ${data.sessions7Count} วัน <span style="font-size:12px; font-weight:600; color:var(--dim);">(${data.totalTrainMin} นาที)</span>
                    </div>
                    <div style="font-size:11.5px; color:var(--dim); margin-top:2px;">
                        ยกสะสม ${data.totalVolumeKg.toLocaleString()} กก.
                    </div>
                </div>
            </div>

            <!-- Back Health Section -->
            <div style="background:var(--card2); border:1px solid var(--line); border-radius:10px; padding:10px; margin-bottom:12px;">
                <div style="font-size:11.5px; font-weight:800; color:${backHealthColor}; margin-bottom:2px;">
                    ดัชนีสุขภาพหลังล่าง (McGill Method)
                </div>
                <div style="font-size:12.5px; color:var(--tx); line-height:1.4;">
                    ${backHealthMsg}
                </div>
            </div>

            <!-- Strategic Advice -->
            <div style="background:rgba(234,88,12,0.06); border:1px solid rgba(234,88,12,0.25); border-radius:10px; padding:10px; margin-bottom:14px;">
                <div style="font-size:12px; font-weight:800; color:var(--acc); margin-bottom:4px;">💡 ข้อคิดเห็นและกลยุทธ์สำหรับสัปดาห์หน้า:</div>
                <ul style="margin:0; padding-left:18px; font-size:12.5px; color:var(--tx); line-height:1.5;">
                    <li>${data.wDelta <= 0 ? 'อัตราการลดน้ำหนักอยู่ในเกณฑ์ที่ปลอดภัยและเหมาะสม รักษาความสม่ำเสมอนี้ไว้' : 'น้ำหนักแกว่งขึ้นเล็กน้อย อาจเกิดจากปริมาณโซเดียมหรือไกลโคเจนสะสม แนะนำคุมปริมาณน้ำดื่มให้ครบเป้า'}</li>
                    <li>${proPct >= 90 ? 'ปริมาณโปรตีนถึงเป้ายอดเยี่ยม กล้ามเนื้อได้รับการซ่อมแซมเต็มที่' : 'โปรตีนยังเฉลี่ยต่ำกว่าเป้า แนะนำเพิ่มไข่ต้ม CP หรือนมโปรตีน RTD ในช่วงบ่าย/เย็น'}</li>
                    <li>${data.sessions7Count >= 3 ? 'วินัยในการออกกำลังกายอยู่ในเกณฑ์ดีมาก ร่างกายเริ่มปรับตัวรับโหลดได้ดี' : 'สัปดาห์นี้ออกกำลังกายน้อยกว่าเป้าหมาย แนะนำจัดเวลาฝึกช่วงเช้าหรือหลังเลิกงาน'}</li>
                </ul>
            </div>

            <!-- Gemini AI Deep Dive Section -->
            <div id="geminiWeeklyReportBox">
                <button class="btn" onclick="generateGeminiWeeklyDeepReport()" style="width:100%; padding:10px; font-size:13px; font-weight:800; background:linear-gradient(135deg, var(--acc) 0%, #d97706 100%); color:#fff; border-radius:8px;">
                    🧠 ขอคำวิเคราะห์เชิงลึกจาก Gemini AI
                </button>
            </div>

            <div style="margin-top:12px; text-align:right;">
                <button class="btn sm g" onclick="fcClose()" style="padding:6px 16px; font-size:12px;">ปิดรายงาน</button>
            </div>
        </div>
    `;

    fcAlert(html);
}

async function generateGeminiWeeklyDeepReport() {
    if (!D.cfg.aiKey) {
        fcAlert('กรุณากรอก Gemini API Key ในหน้าซิงก์ เพื่อรับการวิเคราะห์เชิงลึกจาก AI ครับ');
        return;
    }
    const box = document.getElementById('geminiWeeklyReportBox');
    if (box) {
        box.innerHTML = `
            <div style="text-align:center; padding:16px; background:var(--card2); border-radius:10px; border:1px solid var(--line);">
                <div style="font-size:20px; animation: spin 1s linear infinite; margin-bottom:8px;">⏳</div>
                <div style="font-size:12.5px; font-weight:700; color:var(--acc);">Gemini AI กำลังวิเคราะห์ผลงานรอบสัปดาห์ของคุณ...</div>
            </div>
        `;
    }

    const data = getWeeklyReportData();
    const prompt = `คุณคือหัวหน้านักวิทยาศาสตร์การกีฬาและโค้ชฟิตเนสส่วนตัว (FitCoach AI) กรุณาวิเคราะห์ข้อมูลสุขภาพรอบ 7 วันต่อไปนี้ของผู้ใช้:
- น้ำหนักเริ่มต้นสัปดาห์: ${data.wStart.toFixed(1)} กก., น้ำหนักปัจจุบัน: ${data.wEnd.toFixed(1)} กก. (เปลี่ยนแปลง: ${data.wDelta.toFixed(1)} กก.)
- แคลอรี่เฉลี่ย: ${data.avgCal} kcal/วัน (เป้าหมาย: ${CAL_TARGET} kcal)
- โปรตีนเฉลี่ย: ${data.avgPro} g/วัน (เป้าหมาย: ${PROTEIN_TARGET} g)
- น้ำดื่มเฉลี่ย: ${data.avgWat} ml/วัน (เป้าหมาย: ${WATER_TARGET} ml)
- ก้าวเดินเฉลี่ย: ${data.avgSteps} ก้าว/วัน
- จำนวนเซสชันเวท/ออกกำลังกายที่ทำได้: ${data.sessions7Count} ครั้ง (รวม ${data.totalTrainMin} นาที, น้ำหนักยกสะสม ${data.totalVolumeKg} กก.)
- คะแนนปวดหลังล่างเฉลี่ย: ${data.avgPain}/10

กรุณาเขียนรายงานประเมินผลเชิงบวก เป็นกันเอง สุภาพ ชัดเจนในภาษาไทย สรุปเป็น 3 ข้อสำคัญ:
1. สิ่งที่ทำได้ยอดเยี่ยมในสัปดาห์นี้
2. จุดที่ต้องระวังหรือปรับปรุงทันทีในสัปดาห์ถัดไป
3. Action Plan 3 ข้อที่ต้องปฏิบัติใน 7 วันข้างหน้า`;

    try {
        const keysToTry = [(D.cfg.aiKey || '').trim(), (D.cfg.aiKeyBackup || '').trim()].filter(Boolean);
        const models = ['gemini-3.1-flash-lite', 'gemini-3.6-flash', 'gemini-3.8-flash', 'gemini-2.5-flash-lite'];
        const payload = { contents: [{ parts: [{ text: prompt }] }] };

        let resText = '';
        keyLoop: for (const apiKey of keysToTry) {
            for (const model of models) {
                try {
                    const ep = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
                    const r = await fetch(ep, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                    if (r.ok) {
                        const json = await r.json();
                        if (json.candidates?.[0]?.content?.parts?.[0]?.text) {
                            resText = json.candidates[0].content.parts[0].text;
                            if (typeof recordAiUsage === 'function') {
                                recordAiUsage('วิเคราะห์กลยุทธ์สุขภาพ', true);
                            }
                            break keyLoop;
                        }
                    }
                } catch (e) {}
            }
        }

        if (!resText) throw new Error('ไม่สามารถเชื่อมต่อ Gemini ได้ในขณะนี้');

        if (box) {
            box.innerHTML = `
                <div style="background:var(--card2); border:1px solid var(--acc); border-radius:10px; padding:12px; margin-top:8px;">
                    <div style="font-size:12px; font-weight:800; color:var(--acc); margin-bottom:6px;">🤖 บทวิเคราะห์และกลยุทธ์จาก Gemini AI:</div>
                    <div style="font-size:12.5px; color:var(--tx); line-height:1.5; white-space:pre-wrap;">${resText}</div>
                </div>
            `;
        }
    } catch (err) {
        if (box) {
            box.innerHTML = `
                <div style="color:var(--warn); font-size:12px; padding:8px; background:var(--card2); border-radius:8px;">
                    ⚠️ ${err.message}
                </div>
            `;
        }
    }
}


/* ============ RENDER ============ */
function render() {
    const tc = todayCheck();
    const lastWeighRecord = (D.checks || []).filter(x => x.w != null && x.w > 0).slice(-1)[0] || null;
    const last = (tc && tc.w != null && tc.w > 0) ? tc : (lastWeighRecord || D.checks[D.checks.length - 1] || null);
    document.getElementById('wkTxt').textContent = 'สัปดาห์ ' + wkNo() + '/' + totalWeeks();
    document.getElementById('phaseTag').textContent = getPhases()[phIdx()].n.split(' · ')[0];
    const hsubEl = document.getElementById('hsub');
    if (hsubEl) hsubEl.textContent = '';

    // 1. Body Composition Metrics Update
    const curWEl = document.getElementById('curW');
    if (curWEl) curWEl.textContent = (last && last.w != null && last.w > 0) ? (+last.w).toFixed(1) : (lastWeighRecord ? (+lastWeighRecord.w).toFixed(1) : '–');
    const sBFEl = document.getElementById('sBF');
    if (sBFEl) sBFEl.textContent = last?.bf ? (+last.bf).toFixed(1) + '%' : '–';
    const sMuscleEl = document.getElementById('sMuscle');
    if (sMuscleEl) sMuscleEl.textContent = last?.muscle ? (+last.muscle).toFixed(1) + ' กก.' : '–';
    const sHRVEl = document.getElementById('sHRV');
    const curHrv = tc?.hrv || last?.hrv;
    if (sHRVEl) sHRVEl.textContent = curHrv ? curHrv + ' ms' : '–';
    const sPainEl = document.getElementById('sPain');
    const curPain = tc?.pain != null ? tc.pain : (last?.pain != null ? last.pain : null);
    if (sPainEl) sPainEl.textContent = curPain != null ? curPain + '/10' : '–';
    const sSyncEl = document.getElementById('sSync');
    if (sSyncEl) sSyncEl.innerHTML = currentUser ? '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;color:var(--ok)"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>' : '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>';

    const startW = D.checks[0]?.w || last?.w || null;
    const targetW = D.cfg.targetWeight || 65.0;
    const lost = (startW && last) ? startW - last.w : 0;
    const totalToLose = (startW && targetW) ? Math.max(0.5, startW - targetW) : 8.0;
    const dl = document.getElementById('delta');
    const wBar = document.getElementById('wBar');
    if (dl && wBar) {
        if (startW && last) {
            dl.textContent = (lost >= 0 ? '-' : '+') + Math.abs(lost).toFixed(1) + ' กก.';
            dl.className = 'tag' + (lost >= 0 ? '' : ' o');
            const pct = Math.max(2, Math.min(100, (lost / totalToLose) * 100));
            wBar.style.width = pct + '%';
        } else {
            dl.textContent = 'เริ่มต้น';
            dl.className = 'tag';
            wBar.style.width = '2%';
        }
    }
    const wStartEl = document.getElementById('wStartTxt');
    if (wStartEl) wStartEl.textContent = 'เริ่ม ' + (startW ? (+startW).toFixed(1) : '–') + ' กก.';
    const wTargetEl = document.getElementById('wTargetTxt');
    if (wTargetEl) wTargetEl.textContent = 'เป้า ' + (+targetW).toFixed(1) + ' กก.';

    const streak = weighStreak(), daysAgo = daysSinceWeigh();
    let streakClass = '', streakIcon = '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;color:#f24e1e"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>';
    if (daysAgo > WEIGH_WARN_DAYS) { streakClass = ' danger'; streakIcon = '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>' }
    else if (daysAgo === WEIGH_WARN_DAYS) { streakClass = ' warn'; streakIcon = '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2"/><path d="M5 3L2 6"/><path d="M19 3l3 3"/></svg>' }
    
    const lastWeighEl = document.getElementById('lastWeighTxt');
    if (lastWeighEl) {
        const displayWeighRec = (tc && tc.w != null && tc.w > 0) ? tc : lastWeighRecord;
        lastWeighEl.textContent = displayWeighRec ? 'ล่าสุด: ' + displayWeighRec.d.slice(5) + ' (' + (+displayWeighRec.w).toFixed(1) + ' กก.)' : 'ยังไม่เคยชั่ง — แตะเพื่อบันทึก';
    }
    const bodyStreakEl = document.getElementById('bodyStreakBadge');
    if (bodyStreakEl) {
        bodyStreakEl.className = 'streak-badge' + streakClass;
        bodyStreakEl.innerHTML = streakIcon + ' ' + (daysAgo === 0 ? streak + ' วันติด' : 'ไม่ได้ชั่ง ' + daysAgo + ' วัน');
    }

    document.getElementById('bsMode').checked = !!D.bs;

    // 2. Nutrition & Activity Metrics (Auto-heal from meals if present)
    let cal = tc?.cal || 0, pro = tc?.protein || 0, carbs = tc?.carbs || 0, fat = tc?.fat || 0, wat = tc?.water || 0, sugar = tc?.sugar || 0, sodium = tc?.sodium || 0;
    if (tc?.meals && tc.meals.length > 0) {
        let mCal = 0, mPro = 0, mCarbs = 0, mFat = 0, mSugar = 0, mSodium = 0;
        tc.meals.forEach(m => {
            mCal += Number(m.cal) || 0;
            mPro += Number(m.pro) || 0;
            mCarbs += Number(m.carbs) || 0;
            mFat += Number(m.fat) || 0;
            mSugar += Number(m.sugar) || 0;
            mSodium += Number(m.sodium) || 0;
        });
        cal = Math.round(mCal);
        pro = Math.round(mPro);
        carbs = Math.round(mCarbs);
        fat = Math.round(mFat);
        sugar = Math.round(mSugar);
        sodium = Math.round(mSodium);
        if (tc.cal !== cal || tc.protein !== pro || tc.carbs !== carbs || tc.fat !== fat || tc.sugar !== sugar || tc.sodium !== sodium) {
            tc.cal = cal;
            tc.protein = pro;
            tc.carbs = carbs;
            tc.fat = fat;
            tc.sugar = sugar;
            tc.sodium = sodium;
            try { localStorage.setItem('fit', JSON.stringify(D)); } catch (e) {}
        }
    }
    const sugarPct = Math.min(100, Math.round((sugar / SUGAR_TARGET) * 100));
    const sodiumPct = Math.min(100, Math.round((sodium / SODIUM_TARGET) * 100));

    let sugarStatusText = 'ปลอดภัย', sugarStatusColor = '#10b981', sugarBarColor = '#ec4899', sugarBorderColor = 'var(--line)';
    if (sugar > SUGAR_TARGET) {
        sugarStatusText = 'เกินเกณฑ์ (+' + (sugar - SUGAR_TARGET) + 'g)';
        sugarStatusColor = 'var(--red)';
        sugarBarColor = 'var(--red)';
        sugarBorderColor = 'rgba(239,68,68,0.4)';
    } else if (sugar >= SUGAR_TARGET * 0.8) {
        sugarStatusText = 'ใกล้เต็ม (' + (SUGAR_TARGET - sugar) + 'g เหลือ)';
        sugarStatusColor = 'var(--warn)';
        sugarBarColor = 'var(--warn)';
    } else {
        sugarStatusText = 'เหลือ ' + (SUGAR_TARGET - sugar) + 'g';
    }

    let sodiumStatusText = 'ปลอดภัย', sodiumStatusColor = '#10b981', sodiumBarColor = '#8b5cf6', sodiumBorderColor = 'var(--line)';
    if (sodium > SODIUM_TARGET) {
        sodiumStatusText = 'เกินเกณฑ์ (+' + (sodium - SODIUM_TARGET).toLocaleString() + 'mg)';
        sodiumStatusColor = 'var(--red)';
        sodiumBarColor = 'var(--red)';
        sodiumBorderColor = 'rgba(239,68,68,0.4)';
    } else if (sodium >= SODIUM_TARGET * 0.8) {
        sodiumStatusText = 'ใกล้เต็ม (' + (SODIUM_TARGET - sodium).toLocaleString() + 'mg เหลือ)';
        sodiumStatusColor = 'var(--warn)';
        sodiumBarColor = 'var(--warn)';
    } else {
        sodiumStatusText = 'เหลือ ' + (SODIUM_TARGET - sodium).toLocaleString() + 'mg';
    }
    const steps = tc?.steps || 0;
    const stepTarget = D.cfg?.stepTarget || 8000;
    const stepPct = Math.min(100, Math.round((steps / stepTarget) * 100));

    const curWeight = (tc?.w != null ? tc.w : (last?.w || 77.9));
    const baselineSteps = (D.cfg?.workType === 'active') ? 9000 : (D.cfg?.workType === 'sedentary' ? 3000 : 6000);
    const extraSteps = Math.max(0, steps - baselineSteps);
    const extraStepCal = Math.round(extraSteps * (curWeight * 0.00055));

    // Dynamic TDEE Engine (skill.md & sports physiology -300 kcal deficit)
    if (typeof syncDailyTargetsWithDayType === 'function') {
        syncDailyTargetsWithDayType();
    }
    const todayType = (typeof getTodayEffectiveDayType === 'function') ? getTodayEffectiveDayType() : 'rest';
    const dynData = (typeof computeDynamicTDEE === 'function') ? computeDynamicTDEE(curWeight) : null;
    const curDayPlan = (dynData && dynData.days && dynData.days[todayType]) ? dynData.days[todayType] : null;

    const baseCalTarget = curDayPlan ? curDayPlan.targetCal : CAL_TARGET;
    const effectiveCalTarget = baseCalTarget + extraStepCal;
    const effectiveProTarget = curDayPlan ? curDayPlan.pro : PROTEIN_TARGET;
    const effectiveCarbsTarget = curDayPlan ? curDayPlan.carbs : CARBS_TARGET;
    const effectiveFatTarget = curDayPlan ? curDayPlan.fat : FAT_TARGET;

    // Calorie Status: Over or Remaining / Under
    const calDiff = cal - effectiveCalTarget; // > 0: Over, < 0: Under/Remaining, === 0: Exact
    const isCalOver = calDiff > 0;
    const isCalExact = (calDiff === 0 && cal > 0);
    const overCal = Math.max(0, calDiff);
    const remCal = Math.max(0, -calDiff);

    const calPct = Math.min(100, Math.round(cal / effectiveCalTarget * 100));
    const proPct = Math.min(100, Math.round(pro / effectiveProTarget * 100));
    const carbsPct = Math.min(100, Math.round(carbs / effectiveCarbsTarget * 100));
    const fatPct = Math.min(100, Math.round(fat / effectiveFatTarget * 100));
    const watPct = Math.min(100, Math.round(wat / WATER_TARGET * 100));
    const calColor = isCalOver ? 'var(--red)' : cal > effectiveCalTarget * 0.9 ? 'var(--warn)' : 'var(--acc)';

    // Macro Differences: Over vs Remaining
    const proDiff = pro - effectiveProTarget;
    const carbsDiff = carbs - effectiveCarbsTarget;
    const fatDiff = fat - effectiveFatTarget;

    const remPro = Math.max(0, -proDiff);
    const remCarbs = Math.max(0, -carbsDiff);
    const remFat = Math.max(0, -fatDiff);

    const totalMacroKcal = (pro * 4) + (carbs * 4) + (fat * 9);
    const proRatio = totalMacroKcal > 0 ? Math.round((pro * 4) / totalMacroKcal * 100) : 0;
    const carbsRatio = totalMacroKcal > 0 ? Math.round((carbs * 4) / totalMacroKcal * 100) : 0;
    const fatRatio = totalMacroKcal > 0 ? Math.max(0, 100 - proRatio - carbsRatio) : 0;

    // 3. Render Card 3: WiseMeal Water Cup & Steps Bento Grid
    const vitalsEl = document.getElementById('dailyVitalsGrid');
    if (vitalsEl) {
        vitalsEl.innerHTML = `
        <!-- Left: WiseMeal Water Cup Card -->
        <div class="wm-vital-card" onclick="openWaterLogModal()" style="cursor:pointer;" title="แตะเพื่อบันทึกน้ำดื่ม">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px;">
                <div>
                    <div style="font-size:13px; font-weight:900; color:#0f172a; margin-bottom:4px;">ดื่มน้ำ</div>
                    <div style="display:flex; align-items:baseline; gap:3px;">
                        <span style="font-size:24px; font-weight:900; color:#0f172a; letter-spacing:-0.5px;">${wat.toLocaleString()}</span>
                        <span style="font-size:12px; font-weight:700; color:#64748b;">ml</span>
                    </div>
                    <div style="font-size:11px; color:#64748b; margin-top:2px;">เป้าหมาย ${WATER_TARGET.toLocaleString()}ml</div>
                    <div style="display:inline-block; margin-top:6px; font-size:10px; font-weight:700; color:#2563eb; background:#eff6ff; padding:2px 8px; border-radius:99px;">~${(wat/1000).toFixed(2)} / 3.0 ลิตร</div>
                </div>
                <div class="wm-water-cup">
                    <div class="wm-water-fill" style="height:${watPct}%;"></div>
                    <div class="wm-water-plus">＋</div>
                </div>
            </div>
        </div>

        <!-- Right: Steps & Active Burn Card -->
        <div class="wm-vital-card" onclick="logDailySteps()" style="cursor:pointer;" title="แตะเพื่อบันทึกก้าวเดิน">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px;">
                <div>
                    <div style="font-size:13px; font-weight:900; color:#0f172a; margin-bottom:4px;">ก้าวเดิน</div>
                    <div style="display:flex; align-items:baseline; gap:3px;">
                        <span style="font-size:24px; font-weight:900; color:#0f172a; letter-spacing:-0.5px;">${steps.toLocaleString()}</span>
                        <span style="font-size:11px; font-weight:700; color:#64748b;">ก้าว</span>
                    </div>
                    <div style="font-size:11px; color:#64748b; margin-top:2px;">เป้าหมาย ${stepTarget.toLocaleString()}</div>
                    <div style="display:inline-block; margin-top:6px; font-size:10px; font-weight:700; color:#059669; background:#ecfdf5; padding:2px 8px; border-radius:99px;">${extraStepCal > 0 ? `+${extraStepCal} kcal โบนัส` : `${stepPct}% ของเป้า`}</div>
                </div>
                <div style="width:50px; height:50px; border-radius:16px; background:linear-gradient(135deg,#fef3c7,#fde68a); display:flex; align-items:center; justify-content:center; font-size:24px; box-shadow:0 4px 10px rgba(245,158,11,0.18);">👟</div>
            </div>
        </div>`;
    }

    // 4. Render Card 4: Daily Fuel & Nutrition Bento Card
    const mealsList = tc?.meals || [];
    let mealsHtml = '';
    if (mealsList.length === 0) {
        mealsHtml = '<div style="text-align:center; padding:12px; color:var(--dim); font-size:12.5px; background:var(--card2); border-radius:10px; margin-top:8px;">ยังไม่มีรายการอาหารวันนี้ — กดปุ่มด้านล่างเพื่อบันทึก</div>';
    } else {
        const favsList = D.cfg.savedFoods || [];
    let favPillsHtml = '';
    if (favsList.length > 0) {
        favPillsHtml = `
            <div style="margin-top:10px; padding:8px 10px; background:var(--card2); border-radius:10px; border:1px solid var(--line);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                    <span style="font-size:11.5px; font-weight:700; color:var(--dim); display:flex; align-items:center; gap:4px;">
                        ⭐ เมนูกินประจำ (แตะเพื่อบวกทันที):
                    </span>
                    <button onclick="openAddMealModal('lunch')" style="background:transparent; border:none; color:var(--acc); font-size:11px; font-weight:700; cursor:pointer;">ดูคลัง</button>
                </div>
                <div style="display:flex; gap:6px; overflow-x:auto; padding-bottom:3px;">
                    ${favsList.slice(0, 6).map(f => `
                        <button onclick="quickLogFavoriteMeal('${f.id}')" style="white-space:nowrap; flex:0 0 auto; padding:4px 8px; font-size:11px; font-weight:700; background:var(--card); border:1px solid var(--line); color:var(--tx); border-radius:8px; cursor:pointer; display:flex; align-items:center; gap:4px;">
                            <span style="color:#eab308;">+</span> ${f.name} <span style="font-size:9.5px; color:var(--dim); font-weight:400;">(${f.cal})</span>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }

    mealsHtml = '<div style="margin-top:8px; display:flex; flex-direction:column; gap:6px;">' + mealsList.map((m, idx) => {
            const typeLabel = MEAL_LABELS[m.type] || '🍽️ อาหาร';
            const mHealth = computeFoodHealthMetrics(m.cal, m.pro, m.carbs, m.fat, m.sugar, m.sodium, m.fiber, m);
            return `
                <div style="display:flex; align-items:center; justify-content:space-between; background:var(--card2); border:1px solid var(--line); border-radius:10px; padding:8px 10px; font-size:12.5px;">
                    <div style="flex:1; padding-right:8px;">
                        <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                            <button type="button" onclick="editMealItem('${tc.d}', ${idx})" style="background:transparent; border:none; padding:0; cursor:pointer; font-weight:700; color:var(--acc); font-size:11.5px; display:inline-flex; align-items:center; gap:2px;" title="แตะเพื่อเปลี่ยนมื้อหรือแก้ไข">${typeLabel} ▾</button>
                            <span style="color:var(--dim); font-size:11px;">${m.time || ''}</span>
                            <span style="background:${mHealth.gradeColor}20; color:${mHealth.gradeColor}; border:1px solid ${mHealth.gradeColor}55; font-weight:800; font-size:9.5px; padding:1px 6px; border-radius:6px;">เกรด ${mHealth.nutriGrade} • สุขภาพ ${mHealth.healthScore}/10 • อิ่ม ${mHealth.satietyScore}/10</span>
                        </div>
                        <div style="font-weight:700; color:var(--tx); margin-top:2px;">${m.name} ${m.portion ? '<span style="color:var(--dim);font-weight:400;font-size:11.5px;">(' + m.portion + ')</span>' : ''}</div>
                        <div style="font-size:11px; color:var(--dim); margin-top:2px;">
                            🍗 ${m.pro || 0}g • 🍚 ${m.carbs || 0}g • 🥑 ${m.fat || 0}g${(mHealth.fiber > 0) ? ' • <span style="color:#10b981;font-weight:600;">🥦 ' + mHealth.fiber + 'g</span>' : ''}${(m.sugar != null && m.sugar > 0) ? ' • <span style="color:#ec4899;font-weight:600;">🍭 ' + m.sugar + 'g</span>' : ''}${(m.sodium != null && m.sodium > 0) ? ' • <span style="color:#8b5cf6;font-weight:600;">🧂 ' + m.sodium + 'mg</span>' : ''}
                        </div>
                    </div>
                    <div style="display:flex; align-items:center; gap:6px;">
                        <div style="text-align:right;">
                            <span style="font-weight:800; color:var(--acc); font-size:13.5px;">${m.cal || 0}</span>
                            <span style="font-size:10.5px; color:var(--dim);"> kcal</span>
                        </div>
                        <!-- Star Favorite Button -->
                        <button onclick="toggleMealFavorite('${tc.d}', ${idx})" style="background:transparent; border:none; color:${(D.cfg.savedFoods || []).some(f => f.name.trim().toLowerCase() === m.name.trim().toLowerCase()) ? '#eab308' : 'var(--dim)'}; cursor:pointer; padding:4px 5px; font-size:13px;" title="${(D.cfg.savedFoods || []).some(f => f.name.trim().toLowerCase() === m.name.trim().toLowerCase()) ? 'อยู่ในเมนูโปรดแล้ว (แตะเพื่อลบ)' : 'แตะเพื่อบันทึกเป็นเมนูโปรด'}">${(D.cfg.savedFoods || []).some(f => f.name.trim().toLowerCase() === m.name.trim().toLowerCase()) ? '⭐' : '☆'}</button>
                        <button onclick="editMealItem('${tc.d}', ${idx})" style="background:transparent; border:none; color:var(--dim); cursor:pointer; padding:4px 5px; font-size:13px;" title="แตะเพื่อปรับสัดส่วนหรือหักลบแคลอรี่">✏️</button>
                        <button onclick="deleteMealItem('${tc.d}', ${idx})" style="background:transparent; border:none; color:var(--red); cursor:pointer; padding:4px 5px; font-size:13px; opacity:0.8;" title="ลบรายการนี้">🗑️</button>
                    </div>
                </div>
            `;
        }).join('') + '</div>' + favPillsHtml;
    }

    const nutritionEl = document.getElementById('dailyNutritionCard');
    if (nutritionEl) {
        // Calorie Sphere Dynamic Theme & Labels
        let sphereCardClass = 'wm-sphere-card';
        let sphereInnerClass = 'wm-sphere-inner';
        let sphereLabel = 'ที่เหลืออยู่';
        let sphereLabelColor = '#1e3a8a';
        let sphereNumColor = '#0f172a';
        let sphereUnitColor = '#1e3a8a';
        let sphereNumText = remCal.toLocaleString();
        let sphereRingStroke = '#2563eb';
        let sphereRingOffset = Math.max(0, 389.5 - (389.5 * calPct) / 100);
        let sphereSubtitle = `เป้าหมาย ${effectiveCalTarget.toLocaleString()} kcal <span style="display:block; font-size:11px; color:#2563eb; font-weight:700; margin-top:2px;">(เหลืออีก ${remCal.toLocaleString()} kcal)</span>`;
        let headerStatusHtml = cal > 0 ? `<span style="color:#2563eb; font-weight:700;">(ขาดอีก ${remCal.toLocaleString()} kcal)</span>` : '';

        if (isCalOver) {
            sphereCardClass = 'wm-sphere-card is-over';
            sphereInnerClass = 'wm-sphere-inner is-over';
            sphereLabel = '⚠️ ทานเกินเป้า';
            sphereLabelColor = '#991b1b';
            sphereNumColor = '#7f1d1d';
            sphereUnitColor = '#991b1b';
            sphereNumText = `+${overCal.toLocaleString()}`;
            sphereRingStroke = '#ef4444';
            sphereRingOffset = 0;
            sphereSubtitle = `เป้าหมาย ${effectiveCalTarget.toLocaleString()} kcal <span style="display:block; font-size:11px; color:#ef4444; font-weight:800; margin-top:2px;">(เกิน +${overCal.toLocaleString()} kcal)</span>`;
            headerStatusHtml = `<span style="color:#ef4444; font-weight:800;">(เกิน +${overCal.toLocaleString()} kcal)</span>`;
        } else if (isCalExact) {
            sphereCardClass = 'wm-sphere-card is-exact';
            sphereInnerClass = 'wm-sphere-inner is-exact';
            sphereLabel = '✓ พอดีเป้าหมาย';
            sphereLabelColor = '#065f46';
            sphereNumColor = '#064e3b';
            sphereUnitColor = '#065f46';
            sphereNumText = '0';
            sphereRingStroke = '#10b981';
            sphereRingOffset = 0;
            sphereSubtitle = `เป้าหมาย ${effectiveCalTarget.toLocaleString()} kcal <span style="display:block; font-size:11px; color:#10b981; font-weight:800; margin-top:2px;">(ครบตามเป้า 100%)</span>`;
            headerStatusHtml = `<span style="color:#10b981; font-weight:800;">(พอดีเป้าหมาย)</span>`;
        }

        // Macro Badges & Ring Colors
        const carbsBadge = carbsDiff > 0 
            ? `<span style="color:#ef4444; font-size:10px; font-weight:800;">(เกิน +${carbsDiff}g)</span>` 
            : carbsDiff < 0 
                ? `<span style="color:#64748b; font-size:10px; font-weight:600;">(ขาด ${Math.abs(carbsDiff)}g)</span>` 
                : `<span style="color:#10b981; font-size:10px; font-weight:700;">(ครบพอดี)</span>`;
        const carbsRingColor = carbsDiff > 0 ? '#ef4444' : '#84cc16';

        const proBadge = proDiff > 0 
            ? `<span style="color:#10b981; font-size:10px; font-weight:800;">(+${proDiff}g เกินเป้า)</span>` 
            : proDiff < 0 
                ? `<span style="color:#f97316; font-size:10px; font-weight:700;">(ขาด ${Math.abs(proDiff)}g)</span>` 
                : `<span style="color:#10b981; font-size:10px; font-weight:700;">(ครบพอดี)</span>`;
        const proRingColor = proDiff > 0 ? '#10b981' : '#f97316';

        const fatBadge = fatDiff > 0 
            ? `<span style="color:#ef4444; font-size:10px; font-weight:800;">(เกิน +${fatDiff}g)</span>` 
            : fatDiff < 0 
                ? `<span style="color:#64748b; font-size:10px; font-weight:600;">(ขาด ${Math.abs(fatDiff)}g)</span>` 
                : `<span style="color:#10b981; font-size:10px; font-weight:700;">(ครบพอดี)</span>`;
        const fatRingColor = fatDiff > 0 ? '#ef4444' : '#eab308';

        const isManualOverride = Boolean(tc?.dayTypeOverride && tc.dayTypeOverride !== 'auto');
        const dayModeBadge = isManualOverride 
            ? '<span style="font-size:9.5px; font-weight:800; background:rgba(234,88,12,0.18); color:#f97316; padding:1.5px 7px; border-radius:99px; border:1px solid rgba(234,88,12,0.35); white-space:nowrap; flex-shrink:0;">📌 ล็อกโหมด</span>'
            : '<span style="font-size:9.5px; font-weight:800; background:rgba(16,185,129,0.18); color:#10b981; padding:1.5px 7px; border-radius:99px; border:1px solid rgba(16,185,129,0.35); white-space:nowrap; flex-shrink:0;">⚡ อัตโนมัติ</span>';

        const offs = (D && D.schOffs) || 0;
        const actualD = getThaiDayOfWeek();
        const dow = (actualD - offs + 7) % 7;
        const tk = (typeof SCHED !== 'undefined' && SCHED[dow]) ? SCHED[dow] : 'A';
        const curWkObj = (typeof W !== 'undefined' && W[tk]) ? W[tk] : null;
        const curWkName = curWkObj ? curWkObj.n : 'วันพักผ่อน';

        const curDayShortName = curDayPlan && curDayPlan.name ? curDayPlan.name.replace(/\s*\([^)]*\)/g, '').trim() : 'วันฝึก';

        nutritionEl.innerHTML = `
        <!-- WiseMeal Header: งบประมาณรายวัน & Action Buttons -->
        <div style="margin-bottom:10px;">
            <div>
                <h3 style="margin:0; font-size:16px; font-weight:900; color:#0f172a; letter-spacing:-0.3px;">งบประมาณรายวัน</h3>
                <div style="font-size:11.5px; color:#64748b; margin-top:2px;">ทานแล้ว <b style="color:#0f172a;">${cal.toLocaleString()}</b> kcal ${extraStepCal > 0 ? `<span style="color:#10b981;font-weight:700;">(+${extraStepCal} ก้าว)</span> ` : ''}${headerStatusHtml}</div>
            </div>
            <div style="display:flex; flex-wrap:wrap; gap:6px; margin-top:8px;">
                <button type="button" onclick="openAntiPlateauModal()" style="padding:5px 10px; font-size:11px; border-radius:99px; border:1px solid #bae6fd; background:#eff6ff; color:#0284c7; font-weight:800; cursor:pointer; white-space:nowrap; display:inline-flex; align-items:center; gap:4px;" title="ดูตารางวิเคราะห์ 4 รูปแบบวัน & แผนแก้น้ำหนักค้าง">🛡️ Anti-YoYo</button>
                <button type="button" onclick="calcBMR()" style="padding:5px 10px; font-size:11px; border-radius:99px; border:1px solid var(--line); background:#f8fafd; color:#475569; font-weight:700; cursor:pointer; white-space:nowrap; display:inline-flex; align-items:center; gap:4px;" title="ปรับเป้าหมายพลังงาน BMR/TDEE">🧮 ปรับเป้า</button>
                <button type="button" onclick="editDailyTracker()" style="padding:5px 10px; font-size:11px; border-radius:99px; border:1px solid var(--line); background:#f8fafd; color:#475569; font-weight:700; cursor:pointer; white-space:nowrap; display:inline-flex; align-items:center; gap:4px;" title="แก้ไขแคลอรี่/น้ำ">✏️ แก้ไข</button>
            </div>
        </div>

        <!-- Dynamic Day Type Status Banner (Single Compact Switching Card) -->
        <div style="margin-bottom:12px; background:linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color:#fff; border-radius:14px; padding:11px 12px; box-shadow:0 3px 10px rgba(15,23,42,0.14);">
            <!-- Top Row: Icon + Short Thai Title + Mode Button -->
            <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
                <div style="min-width:0; flex:1; font-size:13.5px; font-weight:900; color:#fff; line-height:1.3;">
                    ${curDayPlan ? curDayPlan.icon : '🏋️'} วันนี้: ${curDayShortName}
                </div>
                <button type="button" onclick="openDayTypeSelectorModal()" style="flex:0 0 auto; width:auto; font-size:11px; padding:5px 10px; background:rgba(255,255,255,0.15); border:1px solid rgba(255,255,255,0.25); color:#fff; border-radius:8px; white-space:nowrap; font-weight:700; cursor:pointer;" title="แตะเพื่อสลับรูปแบบวันหรือคืนค่าตรวจจับอัตโนมัติ">สลับโหมด ▾</button>
            </div>
            
            <!-- Bottom Row: Auto/Manual Pill + Clean Metrics Bar (wraps cleanly on narrow screens) -->
            <div style="display:flex; flex-wrap:wrap; align-items:center; gap:6px; margin-top:8px; font-size:11px; color:#94a3b8;">
                ${dayModeBadge}
                <span style="background:rgba(255,255,255,0.08); padding:2px 7px; border-radius:6px; white-space:nowrap;">ตาราง: <b style="color:#e2e8f0;">${curWkName}</b></span>
                <span style="background:rgba(255,255,255,0.08); padding:2px 7px; border-radius:6px; white-space:nowrap;">เป้า <b style="color:#f97316;">${effectiveCalTarget}</b> kcal <span style="color:#38bdf8; font-weight:700;">(-${dynData ? dynData.deficit : 300})</span></span>
                <span style="background:rgba(255,255,255,0.08); padding:2px 7px; border-radius:6px; white-space:nowrap;">คาร์บ <b style="color:#60a5fa;">${effectiveCarbsTarget}g</b></span>
            </div>
        </div>

        <!-- WiseMeal 2-Column Hero: Liquid Calorie Sphere (Left) + 3 Macro Rings (Right) -->
        <div class="wm-budget-grid" style="margin-bottom:12px;">
            <!-- Left: Calorie Sphere -->
            <div class="${sphereCardClass}">
                <div class="wm-sphere-wrap">
                    <svg viewBox="0 0 140 140" width="142" height="142" style="transform:rotate(-90deg);">
                        <circle cx="70" cy="70" r="62" fill="none" stroke="#e2e8f0" stroke-width="8"/>
                        <circle class="wm-sphere-ring-arc" cx="70" cy="70" r="62" fill="none" stroke="${sphereRingStroke}" stroke-width="8" stroke-linecap="round" stroke-dasharray="389.5" stroke-dashoffset="${sphereRingOffset}"/>
                    </svg>
                    <div class="${sphereInnerClass}">
                        <div class="wm-sphere-wave"></div>
                        <div class="wm-sphere-wave wave2"></div>
                        <div style="position:relative; z-index:2; font-size:11px; font-weight:800; color:${sphereLabelColor}; letter-spacing:0.2px;">${sphereLabel}</div>
                        <div style="position:relative; z-index:2; font-size:28px; font-weight:900; letter-spacing:-1px; line-height:1.05; color:${sphereNumColor};">${sphereNumText}</div>
                        <div style="position:relative; z-index:2; font-size:12px; font-weight:800; color:${sphereUnitColor};">${isCalOver ? 'kcal เกิน' : 'kcal'}</div>
                    </div>
                </div>
                <div style="font-size:11.5px; font-weight:700; color:#475569; margin-top:8px; text-align:center;">${sphereSubtitle}</div>
            </div>

            <!-- Right: 3 Macro Circular Rings (Carbs, Protein, Fat) -->
            <div class="wm-macro-col">
                <!-- Carbs -->
                <div class="wm-macro-row">
                    <div>
                        <div style="font-size:14px; font-weight:900; color:#0f172a;">${carbs} <span style="font-size:11.5px; color:#64748b; font-weight:600;">/ ${effectiveCarbsTarget}g</span></div>
                        <div style="font-size:11px; font-weight:700; color:#64748b; display:flex; align-items:center; gap:4px; margin-top:2px;">
                            <span>คาร์บ</span>
                            ${carbsBadge}
                        </div>
                    </div>
                    <div class="wm-macro-ring">
                        <svg viewBox="0 0 44 44" width="42" height="42" style="transform:rotate(-90deg);">
                            <circle cx="22" cy="22" r="18" fill="none" stroke="#e2e8f0" stroke-width="4"/>
                            <circle cx="22" cy="22" r="18" fill="none" stroke="${carbsRingColor}" stroke-width="4" stroke-linecap="round" stroke-dasharray="113" stroke-dashoffset="${Math.max(0, 113 - (113 * carbsPct) / 100)}"/>
                        </svg>
                        <span>🍞</span>
                    </div>
                </div>

                <!-- Protein -->
                <div class="wm-macro-row">
                    <div>
                        <div style="font-size:14px; font-weight:900; color:#0f172a;">${pro} <span style="font-size:11.5px; color:#64748b; font-weight:600;">/ ${effectiveProTarget}g</span></div>
                        <div style="font-size:11px; font-weight:700; color:#64748b; display:flex; align-items:center; gap:4px; margin-top:2px;">
                            <span>โปรตีน</span>
                            ${proBadge}
                        </div>
                    </div>
                    <div class="wm-macro-ring">
                        <svg viewBox="0 0 44 44" width="42" height="42" style="transform:rotate(-90deg);">
                            <circle cx="22" cy="22" r="18" fill="none" stroke="#e2e8f0" stroke-width="4"/>
                            <circle cx="22" cy="22" r="18" fill="none" stroke="${proRingColor}" stroke-width="4" stroke-linecap="round" stroke-dasharray="113" stroke-dashoffset="${Math.max(0, 113 - (113 * proPct) / 100)}"/>
                        </svg>
                        <span>🍗</span>
                    </div>
                </div>

                <!-- Fat -->
                <div class="wm-macro-row">
                    <div>
                        <div style="font-size:14px; font-weight:900; color:#0f172a;">${fat} <span style="font-size:11.5px; color:#64748b; font-weight:600;">/ ${effectiveFatTarget}g</span></div>
                        <div style="font-size:11px; font-weight:700; color:#64748b; display:flex; align-items:center; gap:4px; margin-top:2px;">
                            <span>ไขมัน</span>
                            ${fatBadge}
                        </div>
                    </div>
                    <div class="wm-macro-ring">
                        <svg viewBox="0 0 44 44" width="42" height="42" style="transform:rotate(-90deg);">
                            <circle cx="22" cy="22" r="18" fill="none" stroke="#e2e8f0" stroke-width="4"/>
                            <circle cx="22" cy="22" r="18" fill="none" stroke="${fatRingColor}" stroke-width="4" stroke-linecap="round" stroke-dasharray="113" stroke-dashoffset="${Math.max(0, 113 - (113 * fatPct) / 100)}"/>
                        </svg>
                        <span>🧀</span>
                    </div>
                </div>
            </div>
        </div>
                        <span>🧀</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Macronutrient Ratio Breakdown Bar -->
        <div style="margin:10px 0 6px 0; padding:8px 10px; background:var(--card2); border-radius:10px; border:1px solid var(--line);">
            <div style="display:flex; justify-content:space-between; font-size:11.5px; font-weight:700; margin-bottom:5px;">
                <span>สัดส่วนสารอาหารที่กินจริง:</span>
                <span style="color:var(--dim);">เป้าหมาย ~35 : 40 : 25</span>
            </div>
            <div style="display:flex; height:8px; border-radius:99px; overflow:hidden; background:var(--line); margin-bottom:4px;">
                <div style="width:${proRatio}%; background:var(--acc2);" title="โปรตีน ${proRatio}%"></div>
                <div style="width:${carbsRatio}%; background:#3b82f6;" title="คาร์บ ${carbsRatio}%"></div>
                <div style="width:${fatRatio}%; background:#10b981;" title="ไขมัน ${fatRatio}%"></div>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:10.5px; color:var(--dim);">
                <span style="color:var(--acc2); font-weight:700;">🍗 P ${proRatio}%</span>
                <span style="color:#3b82f6; font-weight:700;">🍚 C ${carbsRatio}%</span>
                <span style="color:#10b981; font-weight:700;">🥑 F ${fatRatio}%</span>
            </div>
        </div>

        <!-- Sugar & Sodium Health Guard Monitor -->
        <div style="margin:8px 0 10px 0; display:grid; grid-template-columns:1fr 1fr; gap:8px;">
            <!-- Sugar Card -->
            <div style="background:var(--card2); border:1px solid ${sugarBorderColor}; border-radius:10px; padding:8px 10px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                    <span style="font-size:11.5px; font-weight:800; color:var(--tx); display:flex; align-items:center; gap:4px;">
                        <span>🍭 น้ำตาล</span>
                    </span>
                    <span style="font-size:10px; font-weight:700; color:${sugarStatusColor};">${sugarStatusText}</span>
                </div>
                <div style="display:flex; align-items:baseline; gap:4px; margin-bottom:4px;">
                    <span style="font-size:16px; font-weight:900; color:${sugar > SUGAR_TARGET ? 'var(--red)' : 'var(--tx)'};">${sugar}</span>
                    <span style="font-size:11px; color:var(--dim);">/ ${SUGAR_TARGET} g</span>
                </div>
                <div class="bar" style="height:5px; margin:0; background:var(--line);"><i style="width:${sugarPct}%; background:${sugarBarColor};"></i></div>
            </div>

            <!-- Sodium Card -->
            <div style="background:var(--card2); border:1px solid ${sodiumBorderColor}; border-radius:10px; padding:8px 10px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                    <span style="font-size:11.5px; font-weight:800; color:var(--tx); display:flex; align-items:center; gap:4px;">
                        <span>🧂 โซเดียม</span>
                    </span>
                    <span style="font-size:10px; font-weight:700; color:${sodiumStatusColor};">${sodiumStatusText}</span>
                </div>
                <div style="display:flex; align-items:baseline; gap:4px; margin-bottom:4px;">
                    <span style="font-size:16px; font-weight:900; color:${sodium > SODIUM_TARGET ? 'var(--red)' : 'var(--tx)'};">${sodium.toLocaleString()}</span>
                    <span style="font-size:11px; color:var(--dim);">/ ${SODIUM_TARGET.toLocaleString()} mg</span>
                </div>
                <div class="bar" style="height:5px; margin:0; background:var(--line);"><i style="width:${sodiumPct}%; background:${sodiumBarColor};"></i></div>
            </div>
        </div>

        <!-- Today's Meals Timeline -->
        <div style="margin-top:12px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                <div style="font-weight:800; font-size:13px; color:var(--tx);">🍽️ รายการอาหารวันนี้ (${mealsList.length} เมนู)</div>
                <button class="btn sm" onclick="openAddMealModal()" style="width:auto; flex:0 0 auto; padding:3px 10px; font-size:11.5px; background:rgba(234,88,12,0.1); border:1px solid var(--acc); color:var(--acc); border-radius:99px; font-weight:700; cursor:pointer;">+ เพิ่มมื้อ</button>
            </div>
            ${mealsHtml}
        </div>

        <!-- Action Buttons with AI Suggester -->
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:12px;">
            <button class="btn sm" onclick="openAddMealModal()" style="padding:8px; font-size:12px; background:var(--acc); color:#fff; font-weight:700;">+ บันทึกมื้ออาหาร</button>
            <button class="btn sm" onclick="openAiFoodScanner()" style="padding:8px; font-size:12px; background:rgba(234,88,12,0.12); color:var(--acc); border:1px solid var(--acc); font-weight:700;">📸 สแกนอาหาร AI</button>
        </div>
        <div style="margin-top:8px;">
            <button class="btn sm" onclick="suggestNextMealAI()" style="width:100%; padding:9px; font-size:12.5px; background:linear-gradient(135deg, #ea580c, #f59e0b); color:#fff; font-weight:800; border:none; box-shadow:0 3px 12px rgba(234,88,12,0.25);">🤖 AI แนะนำเมนูมื้อถัดไป (ตามโควตาที่เหลือ)</button>
        </div>`;
    }

    // 5. Render Card 6: Weekly Executive Summary Card
    const nowMs = Date.now();
    const oneWeekMs = 7 * 86400000;
    const weekChecks = (D.checks || []).filter(c => {
        const cTime = new Date(c.d).getTime();
        return nowMs - cTime <= oneWeekMs;
    });
    const todayWeekly = new Date();
    const past7DaysWeekly = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date(todayWeekly);
        d.setDate(d.getDate() - i);
        past7DaysWeekly.push(iso(d));
    }
    const weekSessions = (D.sessions || []).filter(s => {
        const sDate = s.date || s.d || '';
        return past7DaysWeekly.includes(sDate) && s.workout_key !== 'M';
    });
    const weekWorkoutDays = new Set(weekSessions.map(s => s.date || s.d)).size;
    
    let totalWeekCal = 0, totalWeekPro = 0, validCalDays = 0;
    weekChecks.forEach(c => {
        if (c.cal > 0) { totalWeekCal += c.cal; totalWeekPro += (c.protein || 0); validCalDays++; }
    });
    const avgWeekCal = validCalDays > 0 ? Math.round(totalWeekCal / validCalDays) : cal;
    const avgWeekPro = validCalDays > 0 ? Math.round(totalWeekPro / validCalDays) : pro;

    const weeklyEl = document.getElementById('weeklySummaryCard');
    if (weeklyEl) {
        weeklyEl.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <div style="font-weight:800; font-size:13.5px; color:var(--tx); display:flex; align-items:center; gap:6px;">
                <span>📈 สรุปภาพรวมรอบ 7 วัน (Weekly Overview)</span>
            </div>
            <button class="btn sm" onclick="openWeeklyReportModal()" style="font-size:11px; padding:3px 8px; background:var(--acc); color:#fff; font-weight:700; border-radius:6px; cursor:pointer;">📊 ดูรายงานผู้บริหาร ❯</button>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; font-size:12px;">
            <div style="background:var(--card); padding:8px 10px; border-radius:8px; border:1px solid var(--line);">
                <div style="color:var(--dim); font-size:11px;">🏋️ เล่นเวทเทรนนิ่ง</div>
                <div style="font-weight:800; font-size:14px; color:var(--acc); margin-top:2px;">${weekSessions.length} วัน</div>
            </div>
            <div style="background:var(--card); padding:8px 10px; border-radius:8px; border:1px solid var(--line);">
                <div style="color:var(--dim); font-size:11px;">⚡ แคลอรี่เฉลี่ย</div>
                <div style="font-weight:800; font-size:14px; color:var(--tx); margin-top:2px;">${avgWeekCal.toLocaleString()} kcal</div>
            </div>
        </div>
        <div style="margin-top:8px; font-size:11.5px; color:var(--dim); line-height:1.4;">
            💡 <b>คำแนะนำโค้ช:</b> ${remPro > 50 ? 'วันนี้โปรตีนยังขาดค่อนข้างเยอะ แนะนำมื้อถัดไปเน้น อกไก่, ลาบคั่วไก่, หรือไข่ขาวต้ม' : (remCal < 200 ? 'พลังงานวันนี้ใกล้แตะเป้าแล้ว มื้อเย็นเน้นผักต้มน้ำพริกหนุ่มหรือซุปใส' : 'สัดส่วนอาหารและพลังงานอยู่ในเกณฑ์ยอดเยี่ยม รักษาความต่อเนื่องไว้ครับ!')}
        </div>`;
    }

    // Fallback clear for dummy dailyTracker if present
    const dtDummy = document.getElementById('dailyTracker');
    if (dtDummy) dtDummy.innerHTML = '';

    let offs = D.schOffs || 0; const actualD = getThaiDayOfWeek(); const dow = (actualD - offs + 7) % 7, tk = SCHED[dow], t = W[tk];
    const morningM = getMorningCardioMinutesToday();
    const morningDone = morningM > 0;
    const done = D.sessions.some(s => s.date === iso() && (s.workout_key !== 'M' || (['Z', 'R'].includes(tk) && (s.duration_sec >= 1800 || morningM >= 30))));
    
    let cardioNote = '';
    let startBtnTxt = `▶ เริ่มออกกำลังกาย (~${estMin(tk)} นาที)`;
    
    if (tk === 'Z') {
        if (morningM >= 30) {
            if (D.forceFullCardio) {
                cardioNote = `<div style="margin-top:10px;padding:12px 14px;background:rgba(245,158,11,0.12);border-radius:12px;border:1px solid rgba(245,158,11,0.3);">
                    <div style="font-weight:700;color:#d97706;font-size:13.5px;">✓ เช้านี้เดินลู่แล้ว ${morningM} นาที • เปิดโหมดเดินเต็มโปรแกรม</div>
                    <div style="font-size:12px;color:var(--tx);margin-top:4px;">โปรแกรมจะเปิดลู่วิ่งเต็ม 35 นาทีตามความต้องการ</div>
                    <div style="margin-top:6px;"><label style="font-size:12px;color:var(--dim);display:flex;align-items:center;gap:6px;cursor:pointer;"><input type="checkbox" checked onchange="toggleForceFullCardio(this.checked)" style="width:auto;margin:0;"> ต้องการเดินเต็มโปรแกรม</label></div>
                </div>`;
                startBtnTxt = `▶ เริ่มเดินลู่เต็มโปรแกรม (~${estMin(tk)} นาที)`;
            } else {
                cardioNote = `<div style="margin-top:10px;padding:12px 14px;background:rgba(16,185,129,0.12);border-radius:12px;border:1px solid rgba(16,185,129,0.3);">
                    <div style="font-weight:700;color:#059669;font-size:13.5px;display:flex;align-items:center;gap:6px;">✓ เช้านี้เดินลู่แล้ว ${morningM} นาที (ครบเป้าหมาย Zone 2 แล้ว!)</div>
                    <div style="font-size:12.5px;color:var(--tx);margin-top:4px;line-height:1.5;">ระบบ<b>ตัดเดินลู่ 35 นาทีและเดินวอร์มออกให้อัตโนมัติ</b> ให้คุณฝึกเฉพาะ <b>Core & ยืดเหยียด</b> (~${estMin(tk)} นาที) ร่างกายจะได้ไม่ล้าเกินไป</div>
                    <div style="margin-top:8px;padding-top:8px;border-top:1px dashed rgba(16,185,129,0.3);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;">
                        <label style="font-size:11.5px;color:var(--dim);display:flex;align-items:center;gap:6px;cursor:pointer;"><input type="checkbox" onchange="toggleForceFullCardio(this.checked)" style="width:auto;margin:0;"> ต้องการเดินลู่เพิ่มเต็ม 35 นาที</label>
                        <button class="btn sm g" onclick="markCardioDayDone('${tk}')" style="font-size:11px;padding:4px 8px;border-radius:8px;">✓ จบโปรแกรมวันนี้แล้ว</button>
                    </div>
                </div>`;
                startBtnTxt = `▶ เริ่มฝึก Core & ยืดเหยียด (~${estMin(tk)} นาที)`;
            }
        } else if (morningM > 0) {
            const remM = Math.max(5, 35 - morningM);
            cardioNote = `<div style="margin-top:10px;padding:12px 14px;background:rgba(245,158,11,0.12);border-radius:12px;border:1px solid rgba(245,158,11,0.3);">
                <div style="font-weight:700;color:#d97706;font-size:13.5px;">✓ เช้านี้เดินลู่แล้ว ${morningM} นาที • เหลืออีก ${remM} นาที</div>
                <div style="font-size:12px;color:var(--tx);margin-top:4px;">ระบบปรับลดเวลาเดินลู่ให้เหลือ <b>${remM} นาที</b> และตัดเดินวอร์มออกให้อัตโนมัติ</div>
            </div>`;
            startBtnTxt = `▶ เริ่มเดินต่อ ${remM} นาที + Core (~${estMin(tk)} นาที)`;
        } else {
            cardioNote = `<div style="margin-top:6px;font-size:12px;color:var(--dim);">💡 ยังไม่ได้เดินเช้า • โปรแกรม Zone 2 เดินลู่ 35 นาที + Core</div>`;
        }
    } else if (tk === 'A') {
        if (morningDone) {
            cardioNote = `<div style="margin-top:6px;font-size:12px;color:var(--ok);font-weight:600;display:flex;align-items:center;gap:4px;">
                ✓ เช้านี้เดินลู่แล้ว ${morningM} นาที • เย็นนี้ยกเวทเน้นๆ (ตัดลู่วิ่งท้ายเวท 15 นาที และเดินวอร์มออกให้อัตโนมัติ)
            </div>`;
            startBtnTxt = `▶ เริ่มยกเวทเน้นๆ (~${estMin(tk)} นาที)`;
        } else {
            cardioNote = `<div style="margin-top:6px;font-size:12px;color:var(--dim);">
                💡 ไม่ได้เดินเช้า • รวมเดินลู่ท้ายเวท 15 นาทีตามโปรแกรมปกติ
            </div>`;
        }
    } else if (tk === 'R' && morningDone) {
        cardioNote = `<div style="margin-top:6px;font-size:12px;color:var(--ok);font-weight:600;">
            ✓ เช้านี้เดินลู่แล้ว ${morningM} นาที • ปรับเน้นฮูลาฮูปและยืดเหยียดฟื้นฟูหลัง
        </div>`;
    }

    const isOutdoorActive = !!D.outdoorMode && (['R', 'Z'].includes(tk) || t.warm === 'lite');
    const warmTag = isOutdoorActive 
        ? '<span class="tag o">🌲 Warm-up สวนสาธารณะ (ท่ายืน 4 นาที)</span>'
        : ((morningM > 0 && ['Z', 'R', 'A'].includes(tk)) 
            ? '<span class="tag o">Warm-up ยืดข้อต่อ (ไม่มีเดินซ้ำ)</span>' 
            : `<span class="tag o"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="4.22" x2="19.78" y2="5.64"/></svg> Warm-up ${t.warm === 'full' ? '9' : '6'} นาที</span>`);
    const coolTag = isOutdoorActive
        ? '<span class="tag v">🌲 Cool-down สวนสาธารณะ (ม้านั่ง 4 นาที)</span>'
        : ((morningM > 0 && ['Z', 'R', 'A'].includes(tk)) 
            ? '<span class="tag v">Cool-down คลายกล้ามเนื้อ</span>' 
            : '<span class="tag v"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/><line x1="20" y1="16" x2="16" y2="20"/><line x1="4" y1="8" x2="8" y2="4"/><line x1="20" y1="8" x2="16" y2="4"/><line x1="4" y1="16" x2="8" y2="20"/></svg> Cool-down 8 นาที</span>');

    const outdoorSwitcherHtml = (['R', 'Z'].includes(tk) || t.warm === 'lite') ? `
        <div style="display:flex; align-items:center; justify-content:space-between; margin-top:8px; padding:6px 10px; background:var(--card2); border-radius:10px; border:1px solid var(--line);">
            <span style="font-size:12px; font-weight:700; color:var(--tx); display:flex; align-items:center; gap:5px;">
                ${D.outdoorMode ? '🌲 โหมดเดินสวนสาธารณะ (ท่ายืน/ม้านั่ง ไม่ใช้เสื่อ)' : '🏠 โหมดในบ้าน (ใช้เสื่อโยคะ/พื้น)'}
            </span>
            <button class="btn sm" onclick="toggleOutdoorMode()" style="width:auto; padding:3px 9px; font-size:11px; border-radius:6px; background:${D.outdoorMode ? 'rgba(16,185,129,0.15)' : 'var(--card)'}; border:1px solid ${D.outdoorMode ? '#10b981' : 'var(--line)'}; color:${D.outdoorMode ? '#059669' : 'var(--dim)'}; cursor:pointer; font-weight:700;">
                ${D.outdoorMode ? '🌲 สวน (เปิดอยู่)' : '🏠 สลับเป็นสวน'}
            </button>
        </div>
    ` : '';

    const bgImgMap = { A: 'goblet.jpg', B: 'row.jpg', C: 'hipthrust.jpg', Z: 'walk.jpg', H: 'farmer.jpg', R: 'catcow.jpg' };
    const heroBgImg = bgImgMap[tk] || 'landing_bg.jpg';
    document.getElementById('todayBox').innerHTML = `
    <div class="hw-hero-card" style="background-image:url('${heroBgImg}');">
        <div class="hw-hero-overlay"></div>
        <div class="hw-hero-content">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                <span style="background:rgba(255,255,255,0.18); backdrop-filter:blur(6px); color:#fff; font-size:11px; font-weight:800; padding:4px 10px; border-radius:99px;">วัน${DN[dow]} • ~${estMin(tk)} นาที • ~${(tk === 'Z' && morningM >= 30 && !D.forceFullCardio) ? 140 : t.kcal} kcal</span>
                ${done ? '<span style="background:#10b981; color:#fff; font-size:11px; font-weight:800; padding:4px 10px; border-radius:99px;">✓ สำเร็จวันนี้</span>' : '<span style="background:rgba(59,130,246,0.35); color:#bfdbfe; font-size:11px; font-weight:800; padding:4px 10px; border-radius:99px;">ภารกิจวันนี้</span>'}
            </div>
            <h2 style="margin:4px 0 6px; font-size:22px; font-weight:900; color:#ffffff; letter-spacing:-0.4px; display:flex; align-items:center; gap:8px;">
                <span>${t.ic} ${t.n}</span>
            </h2>
            <div style="margin-top:6px; display:flex; flex-wrap:wrap; gap:6px;">
                ${warmTag} ${coolTag}
                ${D.bs ? '<span class="tag b" style="background:rgba(16,185,129,0.25); color:#a7f3d0; border:none;">🛡️ เซฟหลัง McGill Big 3</span>' : ''}
            </div>
            ${outdoorSwitcherHtml}
            ${cardioNote}
            <button type="button" class="hw-cta-pill" onclick="startW('${tk}')">
                <span>${startBtnTxt}</span>
                <span class="hw-cta-arrow">➔</span>
            </button>
            <div class="g2" style="margin-top:10px;">
                <button class="btn sm" style="background:rgba(255,255,255,0.15); color:#fef08a; border:1px solid rgba(255,255,255,0.22); border-radius:99px; font-weight:700;" onclick="startMorningCardio()">🌅 ${morningDone ? `เดินลู่เช้า (${morningM} น.) ✓` : 'เดินลู่เช้า Zone 2'}</button>
                <button class="btn sm" style="background:rgba(255,255,255,0.15); color:#ffffff; border:1px solid rgba(255,255,255,0.22); border-radius:99px; font-weight:700;" onclick="toggleShiftDutyMode()">${typeof isShiftDutyToday === "function" && isShiftDutyToday() ? "🌙 เข้าเวร/พัก (ON)" : "🏥 โหมดเข้าเวร"}</button>
            </div>
        </div>
    </div>`;

    document.getElementById('weekBox').innerHTML = SCHED.map((k, i) => {
    let actualDay = (i + (D.schOffs || 0)) % 7;
    return `
    <div class="day ${i === dow ? 'today' : ''}" onclick="showW('${k}');go('prog')">
      <div class="dot">${W[k].ic}</div>
      <div style="flex:1"><h3 style="font-size:14px">${W[k].n}</h3><div class="sub">วัน${DN[actualDay]} • ~${estMin(k)} นาที</div></div>
      ${i === dow ? '<span class="tag">วันนี้</span>' : '<span class="sub">›</span>'}</div>`;
}).join('');

const hasShift = (D.schOffs || 0) > 0;
    document.getElementById('schCtrls').innerHTML = `
<button class="qbtn" onclick="shiftSchedule(1)" style="background:rgba(236,72,153,0.15);color:var(--acc2);border:1px solid rgba(236,72,153,0.3)"><svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><polygon points="13 19 22 12 13 5 13 19"/><polygon points="2 19 11 12 2 5 2 19"/></svg> เลื่อนชดเชยที่ขาด 1 วัน ${hasShift ? `(+${D.schOffs} วัน)` : ''}</button>
${hasShift ? `<button class="qbtn" onclick="resetScheduleShift()" style="background:rgba(148,163,184,0.15);color:var(--dim);border:1px solid rgba(148,163,184,0.3)"><svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg> กลับตารางปกติ</button>` : ''}
<button class="qbtn" onclick="resetProgram()" style="background:rgba(14,165,233,0.15);color:var(--acc);border:1px solid rgba(14,165,233,0.3)"><svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg> รีเซ็ตโปรแกรมใหม่</button>
`;
    const verEl = document.getElementById('appVersionTxt');
    if (verEl) verEl.textContent = 'เวอร์ชัน ' + APP_VERSION + ' (PWA พร้อมใช้งาน)';

    document.getElementById('phaseList').innerHTML = getPhases().map((p, i) => `
    <div class="card" style="${i === phIdx() ? 'border-color:var(--acc)' : ''}">
      <div class="row"><h3>${p.n}</h3><span class="tag ${i === phIdx() ? '' : 'gr'}">สัปดาห์ ${p.w}</span></div>
      <div class="sub" style="margin-top:6px">${p.d}</div>
      <div class="sub" style="margin-top:8px;color:var(--acc)">⚙ ${p.v}</div>
      <div class="sub"><svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg> เป้าลด ${p.tgt}</div></div>`).join('');
    document.getElementById('wSel').innerHTML = Object.keys(W).map(k =>
        `<button data-w="${k}" onclick="showW('${k}')">${W[k].ic} ${W[k].n.split(' — ')[0]}</button>`).join('');

    document.getElementById('stDone').textContent = D.sessions.length;
    document.getElementById('stKcal').textContent = D.sessions.reduce((a, b) => a + (b.kcal || 0), 0).toLocaleString();
    const totalVolAll = (D.sets || []).reduce((a, b) => a + ((b.weight_kg || 0) * (b.reps || 0)), 0);
    const totalRepsAll = (D.sets || []).reduce((a, b) => a + (b.reps || 0), 0);
    const stVolEl = document.getElementById('stVol');
    if (stVolEl) stVolEl.textContent = totalVolAll.toLocaleString();
    const stRepsEl = document.getElementById('stReps');
    if (stRepsEl) stRepsEl.textContent = totalRepsAll.toLocaleString();
    document.getElementById('log').innerHTML = D.sessions.length ? D.sessions.slice(-14).reverse().map(s =>
        `<div class="row" style="padding:7px 0;border-bottom:1px solid var(--line);align-items:center;">
     <div style="flex:1;">
       <span style="font-size:13px">${W[s.workout_key] ? W[s.workout_key].ic : '•'} ${s.workout_name}</span>
       <span class="sub" style="display:block;margin-top:2px;">${s.date.slice(5)} • ${s.kcal} kcal${s.total_volume_kg ? ` • 🏋️ ยกสะสม ${s.total_volume_kg.toLocaleString()} กก.` : ''}</span>
     </div>
     <button type="button" class="btn sm g" onclick="openWorkoutSummaryModal('${s.id}')" style="font-size:11px;padding:4px 8px;border-radius:6px;display:flex;align-items:center;gap:3px;" title="ดูสรุป & สร้างการ์ดแชร์">
       <span>📸 การ์ดแชร์</span>
     </button>
   </div>`).join('') : '<div class="sub">ยังไม่มีบันทึก</div>';
    if (document.getElementById('aiKey')) document.getElementById('aiKey').value = D.cfg.aiKey || '';
    if (document.getElementById('aiKeyBackup')) document.getElementById('aiKeyBackup').value = D.cfg.aiKeyBackup || '';
    renderAuthUI();
    document.getElementById('localInfo').textContent = `เช็กอิน ${D.checks.length} วัน • เซสชัน ${D.sessions.length} • เซ็ตที่บันทึก ${D.sets.length}`;
    charts(); renderCheckHistory(); renderWeightProgressionUI(); renderSupplementsUI(); showW(document.querySelector('#wSel button.on')?.dataset.w || 'A');
}


// FitCoach v3.0 Render Hook: automatically refresh modular v3 widgets after core render()
const _origRenderV2 = render;
render = function() {
    _origRenderV2();
    if (typeof renderV3AllWidgets === 'function') {
        try { renderV3AllWidgets(); } catch (err) { console.warn('v3 widget render warning:', err); }
    }
};
