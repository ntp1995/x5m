/* ============================================================================
   FitCoach v3.0 Component: GoFasting Metabolic Stage Tracker & Supplement Bridge
   Inspired by: GoFasting (gofasting.fastingtracker)
   ============================================================================ */

const IF_METABOLIC_STAGES = [
    {
        minH: 0, maxH: 4,
        icon: '🍽️',
        title: 'ระยะที่ 1: ย่อยและดูดซึมสารอาหาร (0 - 4 ชม.)',
        desc: 'ระดับน้ำตาลและอินซูลินกำลังทำงานเพื่อนำพลังงานไปเก็บ',
        suppTip: 'ทาน Dr.PONG ACV คำแรกของมื้อ + Fish Oil / B Complex / Triple C / Astaxanthin หลังมื้ออาหาร'
    },
    {
        minH: 4, maxH: 8,
        icon: '📉',
        title: 'ระยะที่ 2: น้ำตาลและอินซูลินลดระดับ (4 - 8 ชม.)',
        desc: 'ตับอ่อนเริ่มได้พัก ร่างกายหยุดสะสมไขมันใหม่เข้าตับ',
        suppTip: 'จิบน้ำเปล่าทยอยเก็บยอด 3 ลิตร/วัน (งดสารให้ความหวานทุกชนิด)'
    },
    {
        minH: 8, maxH: 12,
        icon: '🔥',
        title: 'ระยะที่ 3: พร่องไกลโคเจนในตับ (8 - 12 ชม.)',
        desc: 'ร่างกายดึงพลังงานสำรองในตับมาใช้ ช่วยลดไขมันพอกตับโดยตรง',
        suppTip: 'เตรียมพร้อมเข้าสู่โหมดสลายไขมันช่องท้อง (Visceral Fat)'
    },
    {
        minH: 12, maxH: 16,
        icon: '⚡',
        title: 'ระยะที่ 4: โหมดเผาผลาญไขมันช่องท้อง (12 - 16 ชม.)',
        desc: 'ตับและกล้ามเนื้อดึงกรดไขมันอิสระและไตรกลีเซอไรด์มาเผาผลาญเต็มที่',
        suppTip: '☀️ ช่วงเช้า Fasted: ทาน Medita A1C 1 แคปซูล + ดื่มน้ำเปล่า 1-2 แก้ว (ไม่หลุดฟาสต์)'
    },
    {
        minH: 16, maxH: 99,
        icon: '🧬',
        title: 'ระยะที่ 5: Ketosis & Autophagy ฟื้นฟูระดับเซลล์ (16+ ชม.)',
        desc: 'เก็บกวาดเซลล์เสื่อมสภาพ เพิ่มความไวอินซูลิน และลดการอักเสบของหลอดเลือด',
        suppTip: 'เมื่อเปิดมื้อแรก (Feeding Window) ให้เริ่มด้วย ACV Capsule พร้อมข้าวคำแรกทันที'
    }
];

function renderFastingMetabolicStages() {
    const el = document.getElementById('v3FastingStagesCard');
    if (!el) return;

    let elapsedHours = 0;
    const isFasting = Boolean(D && D.if && D.if.start);
    if (isFasting) {
        elapsedHours = Math.max(0, (Date.now() - D.if.start) / 3600000);
    }

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
                return `
                    <div class="if-stage-item ${active ? 'active' : ''}">
                        <div style="font-size:22px; line-height:1.1;">${st.icon}</div>
                        <div style="flex:1;">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <strong style="font-size:12.5px; color:var(--tx);">${st.title}</strong>
                                ${active ? '<span class="tag" style="background:#10b981; color:#fff; font-size:10px; padding:2px 7px;">ระยะปัจจุบัน</span>' : ''}
                            </div>
                            <div style="font-size:11.5px; color:var(--dim); margin-top:2px;">${st.desc}</div>
                            <div style="font-size:11px; color:var(--acc); font-weight:700; margin-top:4px;">💊 คู่หูวิตามิน: ${st.suppTip}</div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function renderV3AllWidgets() {
    renderInBodyAndRadarWidgets();
    renderMuscleRecoveryWidget();
    renderFastingMetabolicStages();
}
