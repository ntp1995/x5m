/* ============================================================================
   FitCoach v3.0 Component: Floating '+' Quick-Action Hub & Shift-Day Mode
   Inspired by: WiseMeal (com.quvideo.wisemeal) & Home Workout
   ============================================================================ */

function isShiftDutyToday() {
    return Boolean(D && D.shiftDutyDate === iso());
}

function toggleShiftDutyMode() {
    if (isShiftDutyToday()) {
        D.shiftDutyDate = null;
    } else {
        D.shiftDutyDate = iso();
    }
    save();
    render();
    renderQuickActionSheetContent();
}

function openQuickActionSheet() {
    const bd = document.getElementById('qaBackdrop');
    if (!bd) return;
    renderQuickActionSheetContent();
    bd.classList.add('on');
}

function closeQuickActionSheet() {
    const bd = document.getElementById('qaBackdrop');
    if (bd) bd.classList.remove('on');
}

function startTodayWorkoutFromHub() {
    closeQuickActionSheet();
    const todayIdx = new Date().getDay();
    const offs = D.schOffs || 0;
    const wkKey = SCHED[(todayIdx + offs) % 7] || 'A';
    if (wkKey === 'R') {
        go('prog');
    } else {
        startW(wkKey);
    }
}

function renderQuickActionSheetContent() {
    const box = document.getElementById('qaSheetBody');
    if (!box) return;
    const tc = todayCheck() || {};
    const calLeft = Math.max(0, CAL_TARGET - (tc.cal || 0));
    const proLeft = Math.max(0, PROTEIN_TARGET - (tc.protein || 0));
    const waterL = ((tc.water || 0) / 1000).toFixed(2);
    const shiftOn = isShiftDutyToday();

    box.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <div style="display:flex; align-items:center; gap:8px;">
                <div style="width:36px; height:36px; border-radius:12px; background:linear-gradient(135deg,#f97316,#ea580c); color:#fff; display:flex; align-items:center; justify-content:center; font-size:18px; font-weight:900;">⚡</div>
                <div>
                    <div style="font-size:14.5px; font-weight:900; color:var(--tx);">ศูนย์ควบคุมด่วน (Quick Action Hub)</div>
                    <div style="font-size:11px; color:var(--dim);">เหลือโควตาวันนี้: <b>${calLeft} kcal</b> • โปรตีนขาด <b>${proLeft}g</b> • น้ำ <b>${waterL}/3.0L</b></div>
                </div>
            </div>
            <button type="button" onclick="closeQuickActionSheet()" style="background:var(--card2); border:1px solid var(--line); width:30px; height:30px; border-radius:50%; font-size:14px; cursor:pointer; color:var(--dim);">✕</button>
        </div>

        <!-- Shift-Day / Late Duty Quick Switch -->
        <div onclick="toggleShiftDutyMode()" style="cursor:pointer; display:flex; justify-content:space-between; align-items:center; padding:10px 12px; border-radius:12px; background:${shiftOn ? 'rgba(245,158,11,0.14)' : 'var(--card2)'}; border:1px solid ${shiftOn ? '#f59e0b' : 'var(--line)'}; margin-bottom:10px;">
            <div style="display:flex; align-items:center; gap:8px;">
                <span style="font-size:18px;">${shiftOn ? '🌙' : '🏥'}</span>
                <div>
                    <div style="font-size:12.5px; font-weight:800; color:${shiftOn ? '#d97706' : 'var(--tx)'};">โหมดวันเข้าเวร / เลิกงานดึก ${shiftOn ? '(เปิดอยู่)' : '(แตะเพื่อเปิด)'}</div>
                    <div style="font-size:10.5px; color:var(--dim);">${shiftOn ? 'ห้ามทานข้าวเย็นก่อนเวท! ใช้ Creatine+L-Carnitine รองท้อง หรือสลับพักผ่อน' : 'ปรับตารางอาหารเสริมและเซฟร่างกายอัตโนมัติในวันเข้าเวร'}</div>
                </div>
            </div>
            <span class="tag" style="background:${shiftOn ? '#f59e0b' : 'var(--line)'}; color:${shiftOn ? '#fff' : 'var(--dim)'}; font-size:10.5px;">${shiftOn ? 'ON' : 'OFF'}</span>
        </div>

        <div class="qa-grid">
            <button type="button" class="qa-tile" onclick="closeQuickActionSheet(); openFoodScanner();">
                <div class="qa-tile-icon" style="background:rgba(249,115,22,0.15); color:#ea580c;">📸</div>
                <div class="qa-tile-title">สแกนอาหาร AI</div>
                <div class="qa-tile-sub">ถ่ายรูปนับแคลทันที</div>
            </button>
            <button type="button" class="qa-tile" onclick="closeQuickActionSheet(); go('supp');">
                <div class="qa-tile-icon" style="background:rgba(16,185,129,0.15); color:#059669;">💊</div>
                <div class="qa-tile-title">เช็กชื่อวิตามิน</div>
                <div class="qa-tile-sub">ตาราง 5 ช่วงเวลา</div>
            </button>
            <button type="button" class="qa-tile" onclick="closeQuickActionSheet(); openWaterLogModal();">
                <div class="qa-tile-icon" style="background:rgba(14,165,233,0.15); color:#0284c7;">💧</div>
                <div class="qa-tile-title">บันทึกดื่มน้ำ</div>
                <div class="qa-tile-sub">เป้าหมาย 3.0 ลิตร</div>
            </button>
            <button type="button" class="qa-tile" onclick="closeQuickActionSheet(); go('if');">
                <div class="qa-tile-icon" style="background:rgba(139,92,246,0.15); color:#7c3aed;">⏱️</div>
                <div class="qa-tile-title">วงแหวน IF 16:8</div>
                <div class="qa-tile-sub">${D.if && D.if.start ? 'กำลังฟาสต์' : 'เริ่มจับเวลาฟาสต์'}</div>
            </button>
            <button type="button" class="qa-tile" onclick="startTodayWorkoutFromHub();">
                <div class="qa-tile-icon" style="background:rgba(239,68,68,0.15); color:#dc2626;">🏋️</div>
                <div class="qa-tile-title">ลุยเวทวันนี้</div>
                <div class="qa-tile-sub">พร้อมโค้ชเสียงไทย</div>
            </button>
            <button type="button" class="qa-tile" onclick="closeQuickActionSheet(); openMorningWeighInModal();">
                <div class="qa-tile-icon" style="background:rgba(234,179,8,0.15); color:#ca8a04;">⚖️</div>
                <div class="qa-tile-title">ชั่งน้ำหนัก/InBody</div>
                <div class="qa-tile-sub">ไขมัน • กล้าม • ปวดหลัง</div>
            </button>
        </div>
    `;
}
