/* ============================================================================
   FitCoach v3.0 Component: GoFasting Metabolic Stage Tracker & Supplement Bridge
   Inspired by: GoFasting (gofasting.fastingtracker)
   ============================================================================ */

const IF_METABOLIC_STAGES = [
    {
        num: 1,
        minH: 0, maxH: 4,
        icon: '💧↓',
        title: 'ระยะที่ 1: น้ำตาลและอินซูลินเริ่มลดระดับ (0 - 4 ชม.)',
        shortTitle: 'น้ำตาลและอินซูลินเริ่มลดระดับ',
        badge: 'ย่อยอาหาร & น้ำตาลลด',
        desc: 'ร่างกายกำลังย่อยและดูดซึมสารอาหารมื้อล่าสุด ระดับน้ำตาลในเลือดและอินซูลินจะค่อยๆ ลดระดับลงสู่ค่าปกติ',
        clinicalNote: 'ระดับอินซูลินเริ่มลดลง ตับเริ่มลดการเก็บพลังงานและเตรียมพร้อมเข้าสู่โหมดพักผ่อน',
        suppTip: 'จบมื้อสุดท้ายด้วย Dr.PONG Calcium 500 PLUS + Fish Oil + InnerDeo + กล้วยหอม แล้วเริ่มนับเวลา IF ทันที',
        color: '#0284c7',
        bg: '#eff6ff',
        border: '#bfdbfe'
    },
    {
        num: 2,
        minH: 4, maxH: 8,
        icon: '💧↑',
        title: 'ระยะที่ 2: อินซูลินลดต่ำ & ตับหยุดเก็บไขมันใหม่ (4 - 8 ชม.)',
        shortTitle: 'อินซูลินลดต่ำ & หยุดสะสมไขมัน',
        badge: 'อินซูลินต่ำ & หยุดเก็บไขมัน',
        desc: 'อินซูลินลดลงต่ำมาก ตับหยุดสังเคราะห์ไตรกลีเซอไรด์ใหม่และเริ่มนำไกลโคเจนสำรองมาใช้งาน',
        clinicalNote: 'ฮอร์โมนกลูคากอน (Glucagon) เพิ่มขึ้น ป้องกันภาวะน้ำตาลตกและเริ่มดึงไตรกลีเซอไรด์ส่วนเกินมาเตรียมพร้อม',
        suppTip: 'ช่วงก่อนนอน (ตอนท้องว่าง): ทาน Whitelab Liposomal Gluta+ (ดีท็อกซ์ตับ + Zinc 30mg) และ Probiotic (ปรับสมดุลลำไส้)',
        color: '#4f46e5',
        bg: '#eef2ff',
        border: '#c7d2fe'
    },
    {
        num: 3,
        minH: 8, maxH: 12,
        icon: '🔥',
        title: 'ระยะที่ 3: พร่องไกลโคเจน & สลายไขมันพอกตับ (8 - 12 ชม.)',
        shortTitle: 'พร่องไกลโคเจน & สลายไขมันพอกตับ',
        badge: 'สลายไขมันพอกตับ',
        desc: 'ไกลโคเจนในตับลดลงเกือบหมด ตับสลับสวิตช์สู่การเผาผลาญไขมัน ลดไขมันพอกตับและลดไตรกลีเซอไรด์โดยตรง',
        clinicalNote: 'กรดไขมันอิสระ (Free Fatty Acids) ถูกปล่อยเข้าสู่กระแสเลือดเพื่อเป็นพลังงานหลักของกล้ามเนื้อและหัวใจ',
        suppTip: 'ตื่นนอนทันที: ดื่มน้ำเปล่า 1-2 แก้ว (~500ml) เริ่มต้นเก็บยอด 3 ลิตร/วัน (งดอาหารและสารให้ความหวานทุกชนิด)',
        color: '#ea580c',
        bg: '#fff7ed',
        border: '#fed7aa'
    },
    {
        num: 4,
        minH: 12, maxH: 16,
        icon: '🚀',
        title: 'ระยะที่ 4: เผาผลาญไขมันช่องท้อง & ไตรกลีเซอไรด์สูงสุด (12 - 16 ชม.)',
        shortTitle: 'เผาผลาญไขมันช่องท้อง & ไตรกลีเซอไรด์',
        badge: 'เบิร์นไขมันช่องท้อง & ไตรกลีเซอไรด์ (นาทีทอง)',
        desc: 'เข้าสู่ภาวะ Ketosis ระดับเริ่มต้น ตับเปลี่ยนกรดไขมันเป็นคีโตน เผาผลาญไขมันช่องท้อง (Visceral Fat 11) และลดไตรกลีเซอไรด์ 333 อย่างรวดเร็ว',
        clinicalNote: 'Growth Hormone เพิ่มขึ้นเพื่อปกป้องมวลกล้ามเนื้อและมวลกระดูก เป็นช่วงนาทีทองในการลดสัดส่วนหน้าท้อง',
        suppTip: 'ช่วงเช้า Fasted: ทาน Medita A1C 1 แคปซูล (คุมหิว ลดน้ำตาล) + จิบน้ำเปล่าต่อเนื่อง (ห้ามมีแคลอรี)',
        color: '#7c3aed',
        bg: '#f5f3ff',
        border: '#ddd6fe'
    },
    {
        num: 5,
        minH: 16, maxH: 99,
        icon: '🧬',
        title: 'ระยะที่ 5: Ketosis & Autophagy ฟื้นฟูระดับเซลล์เต็มรูปแบบ (16+ ชม.)',
        shortTitle: 'Ketosis & Autophagy ฟื้นฟูระดับเซลล์',
        badge: 'Autophagy ฟื้นฟูเซลล์สมบูรณ์',
        desc: 'เซลล์เริ่มกระบวนการ Autophagy รีไซเคิลโปรตีนและของเสียที่เสื่อมสภาพ ลดการอักเสบในหลอดเลือด และเพิ่มความไวต่ออินซูลินสูงสุด',
        clinicalNote: 'การสร้างเซลล์ใหม่และฟื้นฟูเยื่อบุทางเดินอาหาร เหมาะกับการเปิดหน้าต่าง IF ด้วยอาหารคุณภาพสูง',
        suppTip: 'เมื่อเปิดมื้อที่ 1 (Feeding Window Starts): ทาน Dr.PONG ACV Capsule 750mg พร้อมข้าวคำแรกทันทีเพื่อบล็อกแป้ง',
        color: '#059669',
        bg: '#ecfdf5',
        border: '#a7f3d0'
    }
];

function renderFastingMetabolicStages() {
    let elapsedHours = 0;
    const isFasting = Boolean(D && D.if && D.if.start);
    if (isFasting) {
        elapsedHours = Math.max(0, (Date.now() - D.if.start) / 3600000);
    }

    const arcEl = document.getElementById('v3IfArcPath');
    if (arcEl && typeof arcEl.setAttribute === 'function') {
        const goalH = (D && D.if && D.if.goal) ? D.if.goal : 16;
        const pct = isFasting ? Math.min(1, Math.max(0.03, elapsedHours / goalH)) : 0.03;
        arcEl.setAttribute('stroke-dashoffset', String(Math.round(395 * (1 - pct))));
    }

    // 1. Render Current Stage Highlight Banner (#ifCurrentStageBanner)
    const bannerEl = document.getElementById('ifCurrentStageBanner');
    if (bannerEl) {
        if (isFasting) {
            const curStage = IF_METABOLIC_STAGES.find(st => elapsedHours >= st.minH && elapsedHours < st.maxH) || IF_METABOLIC_STAGES[IF_METABOLIC_STAGES.length - 1];
            const stageSpan = Math.max(1, curStage.maxH - curStage.minH);
            const stageElapsed = Math.max(0, elapsedHours - curStage.minH);
            const stagePct = Math.min(100, Math.round((stageElapsed / stageSpan) * 100));
            const remH = Math.max(0, curStage.maxH - elapsedHours);
            const remHText = remH >= 1 ? `${Math.floor(remH)} ชม. ${Math.round((remH % 1) * 60)} นาที` : `${Math.round(remH * 60)} นาที`;
            const nextStage = IF_METABOLIC_STAGES.find(s => s.num === curStage.num + 1);

            bannerEl.innerHTML = `
                <div style="background:${curStage.bg}; border:1.5px solid ${curStage.border}; border-radius:20px; padding:15px 16px; text-align:left; margin-bottom:12px; box-shadow:0 4px 16px rgba(15,23,42,0.04); cursor:pointer;" onclick="openIfStageDetailModal(${curStage.num})" title="แตะเพื่อดูรายละเอียดสรีรวิทยาของระยะนี้">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:4px;">
                        <span style="font-size:11px; font-weight:800; background:${curStage.color}; color:#fff; padding:2.5px 9px; border-radius:99px; letter-spacing:0.3px;">
                            ${curStage.icon} ระยะปัจจุบัน: ${curStage.num} จาก 5
                        </span>
                        ${nextStage ? `
                            <span style="font-size:11px; font-weight:800; color:${curStage.color};">
                                ⏳ อีก ${remHText} สู่ระยะที่ ${nextStage.num} (${nextStage.icon})
                            </span>
                        ` : `
                            <span style="font-size:11px; font-weight:800; color:#059669;">
                                ⭐ ถึงระยะสูงสุดแล้ว (Autophagy เต็มรูปแบบ)
                            </span>
                        `}
                    </div>

                    <div style="font-size:15px; font-weight:900; color:#0f172a; line-height:1.25; margin:4px 0 3px;">
                        ${curStage.title}
                    </div>
                    
                    <div style="font-size:12px; color:#475569; font-weight:600; line-height:1.45; margin-bottom:8px;">
                        ${curStage.desc}
                    </div>

                    <!-- Mini Progress Track to Next Stage -->
                    <div style="background:rgba(0,0,0,0.07); height:6px; border-radius:99px; overflow:hidden; margin-bottom:10px;">
                        <div style="width:${stagePct}%; height:100%; background:${curStage.color}; border-radius:99px; transition:width 0.4s ease;"></div>
                    </div>

                    <div style="background:rgba(255,255,255,0.88); border:1px solid ${curStage.border}; border-radius:12px; padding:8px 10px; font-size:11.5px; color:#334155; font-weight:700; display:flex; align-items:center; gap:6px;">
                        <span style="font-size:15px;">💊</span>
                        <span style="flex:1;"><b>คู่หูวิตามิน & การดื่มน้ำ:</b> ${curStage.suppTip}</span>
                        <span style="color:#94a3b8; font-size:14px; font-weight:800;">›</span>
                    </div>
                </div>
            `;
        } else {
            bannerEl.innerHTML = `
                <div style="background:#f8fafc; border:1px dashed #cbd5e1; border-radius:18px; padding:14px 16px; text-align:left; margin-bottom:12px;">
                    <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
                        <span style="font-size:16px;">🍽️</span>
                        <span style="font-size:13.5px; font-weight:800; color:#0f172a;">ช่วงเปิดหน้าต่างรับประทานอาหาร (Feeding Window)</span>
                    </div>
                    <div style="font-size:12px; color:#64748b; font-weight:600; line-height:1.4;">
                        คุมโควตาแคลอรี่ ทานมื้อที่ 1 & มื้อที่ 2 พร้อมเซ็ตวิตามินตามตาราง เมื่อทานมื้อเย็นเสร็จ ให้เริ่มนับเวลา IF ทันทีเพื่อเข้าสู่กระบวนการเผาผลาญไขมัน
                    </div>
                </div>
            `;
        }
    }

    // 2. Render Full 5 Metabolic Stages Breakdown Card (#v3FastingStagesCard)
    const el = document.getElementById('v3FastingStagesCard');
    if (!el) return;

    el.innerHTML = `
        <div class="row" style="align-items:center; margin-bottom:10px;">
            <div>
                <h3 style="margin:0; font-size:15px; font-weight:900;">🔥 5 ระยะการเผาผลาญขณะทำ IF (Metabolic Stages)</h3>
                <div class="sub" style="font-size:11.5px;">เชื่อมโยงระยะเวลาอดอาหารเข้ากับการลดไตรกลีเซอไรด์และตารางวิตามิน</div>
            </div>
            <span class="tag" style="background:rgba(16,185,129,0.15); color:#059669; font-weight:800;">${isFasting ? `${elapsedHours.toFixed(1)} ชม.` : 'Feeding Window'}</span>
        </div>

        <div>
            ${IF_METABOLIC_STAGES.map(st => {
                const active = isFasting && elapsedHours >= st.minH && elapsedHours < st.maxH;
                const isPassed = isFasting && elapsedHours >= st.maxH;
                return `
                    <div class="if-stage-item ${active ? 'active' : ''}" onclick="openIfStageDetailModal(${st.num})" style="cursor:pointer; margin-bottom:8px; border-left:4px solid ${active ? st.color : (isPassed ? '#10b981' : '#cbd5e1')};">
                        <div style="font-size:22px; line-height:1.1; margin-top:2px;">${st.icon}</div>
                        <div style="flex:1;">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <strong style="font-size:13px; color:var(--tx);">${st.title}</strong>
                                ${active ? `<span class="tag" style="background:${st.color}; color:#fff; font-size:10px; font-weight:800; padding:2px 7px;">ระยะปัจจุบัน</span>` : (isPassed ? '<span style="color:#10b981; font-size:11px; font-weight:800;">✓ สำเร็จแล้ว</span>' : '')}
                            </div>
                            <div style="font-size:11.5px; color:var(--dim); margin-top:2px;">${st.desc}</div>
                            <div style="font-size:11px; color:${st.color}; font-weight:700; margin-top:4px;">💊 คู่หูวิตามิน: ${st.suppTip}</div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function openIfStageDetailModal(stageNum) {
    const st = IF_METABOLIC_STAGES.find(s => s.num === stageNum) || IF_METABOLIC_STAGES[0];
    const isFasting = Boolean(D && D.if && D.if.start);
    let elapsedHours = 0;
    if (isFasting) {
        elapsedHours = Math.max(0, (Date.now() - D.if.start) / 3600000);
    }
    const isCurrent = isFasting && elapsedHours >= st.minH && elapsedHours < st.maxH;

    const modalHtml = `
        <div style="text-align:left; font-size:14px; max-height:80vh; overflow-y:auto; padding-right:2px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <div style="display:inline-flex; align-items:center; gap:6px; background:${st.bg}; border:1px solid ${st.border}; padding:3px 10px; border-radius:99px;">
                    <span style="font-size:16px;">${st.icon}</span>
                    <span style="font-size:11.5px; font-weight:800; color:${st.color};">ระยะที่ ${st.num} จาก 5 (${st.minH} - ${st.maxH > 24 ? '16+' : st.maxH} ชม.)</span>
                </div>
                ${isCurrent ? '<span style="background:#10b981; color:#fff; font-size:10px; font-weight:800; padding:2px 8px; border-radius:99px;">✓ ระยะปัจจุบันของคุณ</span>' : ''}
            </div>

            <h2 style="margin:0 0 4px; font-size:18px; font-weight:900; color:#0f172a; line-height:1.25;">
                ${st.title}
            </h2>
            <div style="font-size:12px; color:#64748b; font-weight:700; margin-bottom:12px;">
                🎯 ${st.badge}
            </div>

            <!-- Medical & Physiology Explanation Card -->
            <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:16px; padding:14px; margin-bottom:12px; box-shadow:0 4px 12px rgba(15,23,42,0.03);">
                <div style="font-size:11.5px; font-weight:800; color:#64748b; text-transform:uppercase; margin-bottom:4px; letter-spacing:0.3px;">
                    🔬 กระบวนการสรีรวิทยาในร่างกาย
                </div>
                <div style="font-size:13px; color:#1e293b; font-weight:600; line-height:1.55;">
                    ${st.desc}
                </div>
                <div style="margin-top:8px; padding-top:8px; border-top:1px dashed #e2e8f0; font-size:12px; color:#475569; line-height:1.45;">
                    💡 <b>กลไกทางชีวเคมี:</b> ${st.clinicalNote}
                </div>
            </div>

            <!-- Goal Impact: Triglycerides & Visceral Fat -->
            <div style="background:${st.bg}; border:1px solid ${st.border}; border-radius:16px; padding:12px 14px; margin-bottom:12px;">
                <div style="font-size:11.5px; font-weight:800; color:${st.color}; margin-bottom:4px;">
                    🎯 ผลลัพธ์ต่อเป้าหมายของคุณ
                </div>
                <div style="font-size:12px; color:#334155; font-weight:600; line-height:1.45;">
                    ${st.num === 1 ? '• รักษาระดับน้ำตาลให้คงที่ ป้องกันอินซูลินสวิง' : ''}
                    ${st.num === 2 ? '• ยับยั้งการสะสมไขมันใหม่เข้าสู่เซลล์ตับ ช่วยให้ตับฟื้นฟู' : ''}
                    ${st.num === 3 ? '• ดึงไตรกลีเซอไรด์ส่วนเกิน (เป้าหมายจาก 333) ออกมาสลายเป็นพลังงานหลัก' : ''}
                    ${st.num === 4 ? '• เร่งเผาผลาญไขมันช่องท้อง (Visceral Fat 11) และกระตุ้น Growth Hormone คุ้มกันกล้ามเนื้อ' : ''}
                    ${st.num === 5 ? '• รีไซเคิลของเสียในเซลล์ตับและหลอดเลือด เพิ่มความไวอินซูลินและลดการอักเสบ' : ''}
                </div>
            </div>

            <!-- Targeted Vitamin & Water Guideline -->
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:16px; padding:12px 14px; margin-bottom:16px;">
                <div style="font-size:11.5px; font-weight:800; color:#0f172a; margin-bottom:4px; display:flex; align-items:center; gap:5px;">
                    <span>💊</span> คู่หูอาหารเสริม & วินัยการดื่มน้ำ
                </div>
                <div style="font-size:12.5px; color:#0369a1; font-weight:700; line-height:1.45;">
                    ${st.suppTip}
                </div>
            </div>

            <!-- Close Action Button -->
            <button type="button" class="btn sm" onclick="fcClose()" style="width:100%; padding:10px; font-size:13px; font-weight:800; background:#0284c7; color:#fff; border-radius:10px; border:none; cursor:pointer;">
                รับทราบ & ปิดหน้าต่าง
            </button>
        </div>
    `;
    fcAlert(modalHtml);
}
window.openIfStageDetailModal = openIfStageDetailModal;


function renderWeekCalendarStrip() {
    const el = document.getElementById('v3WeekCalendarStrip');
    if (!el) return;
    const today = new Date();
    const todayIso = iso(today);
    const dowNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const curDow = today.getDay();
    const daysHtml = [];

    for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - curDow + i);
        const dIso = iso(d);
        const isToday = dIso === todayIso;
        const hasLog = ((D.checks || []).some(c => c.d === dIso && ((c.cal || 0) > 0 || (c.w || 0) > 0))) ||
                       ((D.sessions || []).some(s => (s.date || s.d) === dIso));
        daysHtml.push(`
            <div class="wm-cal-day ${isToday ? 'is-today' : ''}">
                <div class="wm-dow">${dowNames[i]}</div>
                <div class="wm-num">${d.getDate()}</div>
                ${hasLog || isToday ? '<div class="wm-cal-dot"></div>' : '<div style="height:8px;"></div>'}
            </div>
        `);
    }
    el.innerHTML = daysHtml.join('');
}

function renderV3AllWidgets() {
    renderWeekCalendarStrip();
    renderInBodyAndRadarWidgets();
    renderMuscleRecoveryWidget();
    renderFastingMetabolicStages();
    if (typeof updateWiseMealStatsHeader === 'function') updateWiseMealStatsHeader();
    if (typeof updateWeeklyCadenceStatus === 'function') updateWeeklyCadenceStatus();
}
