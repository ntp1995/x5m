/* FitCoach v3.0 — Water Logging, Cloud Favorites & Firebase Cloud-First Sync */
/* ============ CLOUD FAVORITES & PROTEIN LIBRARY ============ */
function saveScannedToFavorites(portion) {
    const name = (document.getElementById('aiFoodName')?.value || 'อาหาร').trim();
    const cal = Math.round(Number(document.getElementById('aiCal')?.value) || 0);
    const pro = Math.round(Number(document.getElementById('aiPro')?.value) || 0);
    const carbs = Math.round(Number(document.getElementById('aiCarbs')?.value) || 0);
    const fat = Math.round(Number(document.getElementById('aiFat')?.value) || 0);
    const sugar = Math.round(Number(document.getElementById('aiSugar')?.value) || 0);
    const sodium = Math.round(Number(document.getElementById('aiSodium')?.value) || 0);
    const pStr = portion || '1 หน่วยบริโภค';

    if (!D.cfg.savedFoods) D.cfg.savedFoods = [];
    const existingIdx = D.cfg.savedFoods.findIndex(f => f.name.toLowerCase() === name.toLowerCase());
    const newFav = {
        id: 'fav_' + Date.now(),
        name: name,
        portion: pStr,
        cal: cal,
        pro: pro,
        carbs: carbs,
        fat: fat,
        sugar: sugar,
        sodium: sodium,
        cat: (pro >= 20 || name.includes('โปรตีน') || name.includes('เวย์')) ? 'protein' : 'fav',
        updatedAt: Date.now()
    };
    if (existingIdx >= 0) {
        D.cfg.savedFoods[existingIdx] = newFav;
    } else {
        D.cfg.savedFoods.unshift(newFav);
    }
    save();
    if (currentUser && fbDb) pushToCloud();

    const btn = document.getElementById('btnSaveFavCloud');
    if (btn) {
        btn.textContent = '✓ อยู่ในคลังแล้ว';
        btn.style.background = 'rgba(16,185,129,0.15)';
        btn.style.borderColor = '#10b981';
        btn.style.color = '#10b981';
        btn.onclick = null;
    }
    msg('✓ บันทึก "' + name + '" ลงคลังเมนูโปรด & ซิงก์คลาวด์แล้ว');
}

async function addNewCustomFavoriteFood() {
    fcClose();
    const name = await fcPrompt('ชื่อเมนูโปรดหรือเครื่องดื่ม (เช่น นมโปรตีน Hoppe รสกาแฟ):', '');
    if (!name) return setTimeout(() => openAddMealModal(), 200);
    const portion = await fcPrompt('ขนาด/หน่วยบริโภค (เช่น 1 ขวด 350ml):', '1 ขวด (~350ml)') || '1 ขวด';
    const cal = parseInt(await fcPrompt('พลังงานทั้งหมด (kcal):', '180')) || 0;
    const pro = parseInt(await fcPrompt('โปรตีน (กรัม):', '28')) || 0;
    const carbs = parseInt(await fcPrompt('คาร์โบไฮเดรต (กรัม):', '6')) || 0;
    const fat = parseInt(await fcPrompt('ไขมัน (กรัม):', '2')) || 0;

    if (!D.cfg.savedFoods) D.cfg.savedFoods = [];
    D.cfg.savedFoods.unshift({
        id: 'fav_' + Date.now(),
        name: name.trim(),
        portion: portion.trim(),
        cal: cal,
        pro: pro,
        carbs: carbs,
        fat: fat,
        cat: (pro >= 20 || name.includes('โปรตีน') || name.includes('เวย์')) ? 'protein' : 'fav',
        updatedAt: Date.now()
    });
    save();
    if (currentUser && fbDb) pushToCloud();
    setTimeout(() => {
        openAddMealModal();
        setFoodCategoryFilter('fav');
        fcAlert('✓ เพิ่มเมนู "' + name + '" ลงในคลังคลาวด์เรียบร้อยแล้ว!');
    }, 300);
}

async function deleteFavoriteFood(id, event) {
    if (event) event.stopPropagation();
    const confirmed = await fcConfirm('ต้องการลบเมนูนี้ออกจากคลังคลาวด์ใช่หรือไม่?', '🗑️ ยืนยันการลบ');
    if (!confirmed) return;
    D.cfg.savedFoods = (D.cfg.savedFoods || []).filter(f => f.id !== id);
    save();
    if (currentUser && fbDb) pushToCloud();
    filterFoodListUI();
    msg('✓ ลบเมนูออกจากคลังเรียบร้อยแล้ว');
}

function quickLogSavedFood(id) {
    const food = (D.cfg.savedFoods || []).find(f => f.id === id);
    if (!food) return;
    const mType = document.getElementById('modalMealTypeSelect')?.value || 'lunch';
    addMealToToday(mType, food.name, food.portion, food.cal, food.pro, food.carbs, food.fat, food.sugar || 0, food.sodium || 0);
    fcClose();
    msg('✓ บันทึก "' + food.name + '" ลงในมื้อแล้ว');
}

window.saveAIFoodAsFavorite = function(name, cal, event) {
    if (!D.cfg.myFoods) D.cfg.myFoods = [];
    D.cfg.myFoods.unshift({ n: name, c: cal });
    save();
    if (currentUser && fbDb) pushToCloud();
    if (event) {
        event.target.textContent = '⭐ บันทึกลงเมนูโปรดแล้ว!';
        event.target.style.color = 'var(--acc)';
        event.target.style.borderColor = 'var(--acc)';
        event.target.onclick = null;
    }
};

async function addCustomFood() {
    fcClose();
    const name = await fcPrompt('ชื่อเมนูโปรดของคุณ (เช่น ข้าวผัด):', '');
    if (!name) return setTimeout(() => quickAdd('cal'), 300);
    const cal = await fcPrompt(`พลังงานของ ${name} (kcal):`, '350');
    if (!cal || isNaN(cal)) return setTimeout(() => quickAdd('cal'), 300);
    
    if (!D.cfg.myFoods) D.cfg.myFoods = [];
    D.cfg.myFoods.unshift({ n: name.trim(), c: parseInt(cal) });
    save();
    setTimeout(() => quickAdd('cal'), 300);
}

window.removeCustomFood = function(idx, event) {
    event.stopPropagation();
    D.cfg.myFoods.splice(idx, 1);
    save();
    fcClose();
    setTimeout(() => quickAdd('cal'), 300);
};


/* ============ WATER INTAKE LOGGING (ML / LITER) ============ */
function openWaterLogModal() {
    const tc = todayCheck();
    const curWat = tc?.water || 0;
    const tgt = WATER_TARGET || 2700;
    const pct = Math.min(100, Math.round((curWat / tgt) * 100));

    const html = `
        <style>
            .fc-modal-actions { display: none !important; }
            .water-quick-chip {
                background: var(--card2);
                border: 1px solid var(--line);
                color: var(--dim);
                font-size: 11.5px;
                font-weight: 700;
                padding: 5px 9px;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.15s;
            }
            .water-quick-chip:active {
                background: var(--vio);
                color: #fff;
                border-color: var(--vio);
                transform: scale(0.96);
            }
        </style>
        <div style="text-align:center; margin-bottom:14px;">
            <div style="font-size:32px; font-weight:900; color:var(--vio); line-height:1.2;">
                ${curWat.toLocaleString()} <span style="font-size:16px; font-weight:600; color:var(--dim);">/ ${tgt.toLocaleString()} มล.</span>
            </div>
            <div style="font-size:12.5px; color:var(--dim); margin-top:2px;">
                ~${(curWat / 1000).toFixed(2)} / ${(tgt / 1000).toFixed(1)} ลิตร (${pct}%)
            </div>
            <div style="background:var(--card2); border-radius:8px; height:8px; overflow:hidden; margin-top:10px; border:1px solid var(--line);">
                <div style="width:${pct}%; height:100%; background:var(--vio); border-radius:8px; transition:width 0.3s;"></div>
            </div>
        </div>

        <div style="font-size:12.5px; font-weight:700; color:var(--dim); margin-bottom:8px; text-align:left;">⚡ เลือกขนาดภาชนะที่ดื่ม (กดเพื่อบวกทันที):</div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:14px;">
            <button class="btn sm" onclick="addWaterMl(250)" style="padding:10px 8px; font-size:12.5px; background:var(--card2); border:1px solid var(--line); color:var(--tx); text-align:center; border-radius:12px;">
                🥛 <b>+250 ml</b><br><span style="font-size:10.5px; color:var(--dim);">แก้วน้ำทั่วไป / กาแฟ</span>
            </button>
            <button class="btn sm" onclick="addWaterMl(350)" style="padding:10px 8px; font-size:12.5px; background:var(--card2); border:1px solid var(--line); color:var(--tx); text-align:center; border-radius:12px;">
                ☕ <b>+350 ml</b><br><span style="font-size:10.5px; color:var(--dim);">แก้วมัค / กระป๋อง</span>
            </button>
            <button class="btn sm" onclick="addWaterMl(500)" style="padding:10px 8px; font-size:12.5px; background:var(--card2); border:1px solid var(--line); color:var(--tx); text-align:center; border-radius:12px;">
                🧴 <b>+500 ml</b><br><span style="font-size:10.5px; color:var(--dim);">ขวดน้ำเล็กมาตรฐาน</span>
            </button>
            <button class="btn sm" onclick="addWaterMl(600)" style="padding:10px 8px; font-size:12.5px; background:rgba(139,92,246,0.12); border:1px solid rgba(139,92,246,0.3); color:var(--vio); text-align:center; border-radius:12px;">
                🥤 <b>+600 ml</b><br><span style="font-size:10.5px; color:var(--dim);">แก้ว Tyeso / ขวด 600</span>
            </button>
            <button class="btn sm" onclick="addWaterMl(750)" style="padding:10px 8px; font-size:12.5px; background:var(--card2); border:1px solid var(--line); color:var(--tx); text-align:center; border-radius:12px;">
                🚴 <b>+750 ml</b><br><span style="font-size:10.5px; color:var(--dim);">กระบอกน้ำสปอร์ต</span>
            </button>
            <button class="btn sm" onclick="addWaterMl(1000)" style="padding:10px 8px; font-size:12.5px; background:rgba(16,185,129,0.12); border:1px solid rgba(16,185,129,0.3); color:#059669; text-align:center; border-radius:12px;">
                🍶 <b>+1,000 ml (1L)</b><br><span style="font-size:10.5px; color:var(--dim);">ขวดลิตร / Yeti ใหญ่</span>
            </button>
        </div>

        <div style="border-top:1px solid var(--line); padding-top:12px; margin-top:8px;">
            <div style="font-size:12.5px; font-weight:700; color:var(--dim); margin-bottom:8px; text-align:left;">✍️ หรือกรอกปริมาณที่ดื่ม (มล. / ml):</div>
            <div style="display:flex; gap:8px; align-items:center;">
                <div style="position:relative; flex:1; min-width:0;">
                    <input type="number" id="customWaterInput" step="50" min="10" max="5000" placeholder="เช่น 300 หรือ 450" 
                        onkeyup="if(event.key==='Enter')addCustomWater()"
                        style="width:100% !important; margin:0 !important; padding:11px 40px 11px 14px; font-size:15px; font-weight:700; background:var(--bg); border:1.5px solid var(--line); color:var(--tx); border-radius:12px; box-sizing:border-box; text-align:left; -moz-appearance:textfield;">
                    <span style="position:absolute; right:12px; top:50%; transform:translateY(-50%); font-size:12px; color:var(--dim); pointer-events:none; font-weight:600;">มล.</span>
                </div>
                <button type="button" class="btn sm" onclick="addCustomWater()" 
                    style="width:auto !important; flex:0 0 auto; margin:0 !important; padding:11px 18px; font-size:13.5px; font-weight:800; background:var(--acc); color:#fff; border-radius:12px; white-space:nowrap; cursor:pointer;">
                    + เพิ่ม
                </button>
            </div>
            <div style="display:flex; gap:6px; margin-top:8px; flex-wrap:wrap; justify-content:flex-start;">
                <button type="button" class="water-quick-chip" onclick="setCustomWaterVal(150)">150</button>
                <button type="button" class="water-quick-chip" onclick="setCustomWaterVal(200)">200</button>
                <button type="button" class="water-quick-chip" onclick="setCustomWaterVal(300)">300</button>
                <button type="button" class="water-quick-chip" onclick="setCustomWaterVal(450)">450</button>
                <button type="button" class="water-quick-chip" onclick="setCustomWaterVal(800)">800</button>
                <span style="font-size:11px; color:var(--dim); align-self:center; margin-left:2px;">มล.</span>
            </div>
        </div>

        ${curWat > 0 ? `
        <div style="margin-top:14px; display:flex; justify-content:space-between; align-items:center; border-top:1px dashed var(--line); padding-top:10px;">
            <button type="button" onclick="subtractWaterMl(250)" style="background:transparent; border:none; color:var(--dim); font-size:12px; cursor:pointer; padding:4px 6px;">↺ ลบออก 250 ml</button>
            <button type="button" onclick="setWaterTotal(0)" style="background:transparent; border:none; color:var(--red); font-size:12px; cursor:pointer; padding:4px 6px;">🗑️ ล้างเป็น 0</button>
        </div>` : ''}

        <div style="margin-top:14px; text-align:center;">
            <button type="button" onclick="fcClose()" style="background:var(--card2); border:1px solid var(--line); color:var(--dim); font-size:13px; font-weight:700; padding:9px 24px; border-radius:99px; cursor:pointer; width:100%;">✕ ปิดหน้าต่าง</button>
        </div>
    `;

    fcAlert(html, '💧 บันทึกปริมาณน้ำดื่ม');
}

function setCustomWaterVal(val) {
    const inp = document.getElementById('customWaterInput');
    if (inp) {
        inp.value = val;
        inp.focus();
    }
}

function addWaterMl(ml) {
    if (!ml || isNaN(ml)) return;
    let rec = D.checks.find(x => x.d === iso());
    if (!rec) {
        const prev = D.checks[D.checks.length - 1];
        rec = { d: iso(), w: prev?.w || 77.9, bf: prev?.bf || null, hrv: null, pain: null, cal: null, protein: null, water: null };
        D.checks.push(rec);
    }
    rec.water = (rec.water || 0) + ml;
    save();
    render();
    if (currentUser && fbDb) {
        pushToCloud();
    }
    fcClose();
    msg('✓ ดื่มน้ำเพิ่ม +' + ml.toLocaleString() + ' ml แล้ว (รวมวันนี้: ' + rec.water.toLocaleString() + ' ml)');
}

function subtractWaterMl(ml) {
    let rec = D.checks.find(x => x.d === iso());
    if (rec && rec.water) {
        rec.water = Math.max(0, rec.water - ml);
        save();
        render();
        if (currentUser && fbDb) {
            pushToCloud();
        }
        fcClose();
        msg('✓ หักลบน้ำดื่ม -' + ml + ' ml แล้ว (เหลือ: ' + rec.water.toLocaleString() + ' ml)');
    }
}

function setWaterTotal(val) {
    let rec = D.checks.find(x => x.d === iso());
    if (rec) {
        rec.water = val;
        save();
        render();
        if (currentUser && fbDb) {
            pushToCloud();
        }
        fcClose();
        msg('✓ ปรับค่าน้ำดื่มเป็น ' + val + ' ml แล้ว');
    }
}

function addCustomWater() {
    const input = document.getElementById('customWaterInput');
    const val = parseInt(input?.value);
    if (!val || val <= 0) return fcAlert('กรุณากรอกปริมาณน้ำที่มากกว่า 0 มล.');
    addWaterMl(val);
}

async function quickAdd(type) {
    let val, label;
    if (type === 'cal') { 
        const TF = [
            {n: 'ข้าวกะเพราหมู/ไก่', c: 580}, {n: 'ข้าวกะเพราไข่ดาว', c: 120}, {n: 'ข้าวมันไก่', c: 600}, {n: 'ข้าวหมูแดง', c: 540},
            {n: 'ข้าวขาหมู', c: 690}, {n: 'ข้าวไข่เจียว', c: 450}, {n: 'ก๋วยเตี๋ยวน้ำใส', c: 350},
            {n: 'ก๋วยเตี๋ยวต้มยำ', c: 450}, {n: 'ผัดไทย', c: 600}, {n: 'ส้มตำไทย', c: 150},
            {n: 'ไก่ย่าง 1 ไม้', c: 150}, {n: 'หมูปิ้ง 1 ไม้', c: 130}, {n: 'ข้าวเหนียว', c: 160},
            {n: 'โจ๊กหมูไข่', c: 250}, {n: 'ชาบู/หมูกระทะ', c: 1000}, {n: 'อเมริกาโน่', c: 15},
            {n: 'ลาเต้เย็น', c: 150}, {n: 'ชานมไข่มุก', c: 350}, {n: 'เวย์โปรตีน 1 scoop', c: 120}
        ];
        const allFoods = [...(D.cfg.myFoods || []), ...TF];
        
        const html = `<div style="display:flex; gap:8px; margin-bottom:10px;">
            <button class="btn" style="flex:1; border:1px solid var(--acc); background:transparent; color:var(--acc); font-size:13px; padding:8px;" onclick="aiFoodScanner('image')">📸 ถ่ายรูปให้ AI ดู</button>
            <button class="btn" style="flex:1; border:1px solid var(--acc); background:transparent; color:var(--acc); font-size:13px; padding:8px;" onclick="aiFoodScanner('text')">💬 พิมพ์บอก AI</button>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <div style="font-size:12px; color:var(--dim); text-align:left;">เมนูประจำ:</div>
            <button class="btn" style="padding:4px 8px; font-size:12px; border:1px solid var(--line); background:transparent; color:var(--tx);" onclick="addCustomFood()">➕ เพิ่มของโปรด</button>
        </div>
        <div style="text-align:left; font-size:14px; max-height:220px; overflow-y:auto; margin-bottom:10px; border:1px solid var(--line); border-radius:8px; padding:4px;">
            ${allFoods.map((f, i) => `<div onclick="document.getElementById('fcInput').value='${f.c}'; document.getElementById('fcOk').click();" style="display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid var(--line); cursor:pointer;">
                <span>${f.n}</span>
                <span style="color:var(--acc); font-weight:bold;">${f.c} ${i < (D.cfg.myFoods?.length||0) ? `<button onclick="removeCustomFood(${i}, event)" style="margin-left:8px; background:none; border:none; color:var(--red); font-size:12px; cursor:pointer; padding:0;">❌</button>` : ''}</span>
            </div>`).join('')}
        </div><div style="font-size:12px; color:var(--dim); text-align:left;">หรือพิมพ์ตัวเลข (kcal) ด้วยตัวเอง:</div>`;
        
        let r = await fcPrompt('บันทึกแคลอรี่มื้อนี้<br><br>' + html, '');
        if(r===null || r==='') return;
        val = parseInt(r); label = 'แคล'; 
    }
    else if (type === 'protein') { 
        let r = await fcPrompt('เพิ่มโปรตีนกี่กรัม?', '30');
        if(r===null) return;
        val = parseInt(r); label = 'โปรตีน'; 
    }
    else if (type === 'water') { openWaterLogModal(); return; }
    if (!val || isNaN(val) || val <= 0) return;
    let rec = D.checks.find(x => x.d === iso());
    if (!rec) {
        const prev = D.checks[D.checks.length - 1];
        rec = { d: iso(), w: prev?.w || 80, bf: prev?.bf || null, hrv: null, pain: null, cal: null, protein: null, water: null };
        D.checks.push(rec);
    }
    if (type === 'cal') rec.cal = (rec.cal || 0) + val;
    else if (type === 'protein') rec.protein = (rec.protein || 0) + val;
    else if (type === 'water') rec.water = (rec.water || 0) + val;
    save(); render(); autoSync();
    setTimeout(()=>fcAlert(`+${val} ${label} แล้ว!`), 200);
}
function charts() {
    const d = D.checks.slice(-40);
    const box = document.getElementById('chart');
    if (d.length < 2) box.innerHTML = '<div class="sub">บันทึกอย่างน้อย 2 วันเพื่อดูกราฟ</div>';
    else {
        const targetW = D.cfg.targetWeight || 72;
        const Wd = 300, H = 110, mx = Math.max(...d.map(x => x.w), targetW) + .5, mn = Math.min(...d.map(x => x.w), targetW - .5) - .5;
        const pt = d.map((x, i) => [i / (d.length - 1) * Wd, H - (x.w - mn) / (mx - mn) * H]), gy = H - (targetW - mn) / (mx - mn) * H;
        box.innerHTML = `<svg viewBox="-4 -8 ${Wd + 8} ${H + 22}" style="width:100%">
    <line x1="0" y1="${gy}" x2="${Wd}" y2="${gy}" stroke="var(--acc)" stroke-dasharray="4 4" stroke-width="1.5"/>
    <text x="${Wd}" y="${gy - 4}" fill="var(--acc2)" font-size="9" text-anchor="end">เป้า ${targetW}</text>
    <polyline points="${pt.map(p => p.join(',')).join(' ')}" fill="none" stroke="var(--acc)" stroke-width="2.5"/>
    ${pt.map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="3" fill="var(--acc)"/>`).join('')}</svg>`
    }
    const pd = D.checks.filter(x => x.pain != null).slice(-40), pb = document.getElementById('painChart');
    if (pd.length < 2) pb.innerHTML = '<div class="sub">กรอกระดับปวดหลังทุกเช้าเพื่อดูแนวโน้ม (0-10)</div>';
    else {
        const Wd = 300, H = 80; const pt = pd.map((x, i) => [i / (pd.length - 1) * Wd, H - x.pain / 10 * H]);
        pb.innerHTML = `<svg viewBox="-4 -8 ${Wd + 8} ${H + 18}" style="width:100%">
    <polyline points="${pt.map(p => p.join(',')).join(' ')}" fill="none" stroke="#f59e0b" stroke-width="2.5"/>
    ${pt.map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="3" fill="#f59e0b"/>`).join('')}
    <text x="0" y="${H + 14}" fill="#8b98ab" font-size="9">0 = ไม่ปวด • 10 = ปวดมาก</text></svg>`
    }
    /* --- Calorie Chart --- */
    const cd = D.checks.filter(x => x.cal > 0).slice(-40), cb = document.getElementById('calChart');
    if (cd.length < 2) cb.innerHTML = '<div class="sub">บันทึกแคลอรี่อย่างน้อย 2 วันเพื่อดูกราฟ</div>';
    else {
        const Wd = 300, H = 90, mx = Math.max(...cd.map(x => x.cal), CAL_TARGET + 200), mn = 0;
        const pt = cd.map((x, i) => [i / (cd.length - 1) * Wd, H - x.cal / mx * H]);
        const tgtY = H - CAL_TARGET / mx * H;
        const avg7 = cd.slice(-7).reduce((a, x) => a + x.cal, 0) / Math.min(7, cd.length);
        cb.innerHTML = `<svg viewBox="-4 -8 ${Wd + 8} ${H + 28}" style="width:100%">
    <line x1="0" y1="${tgtY}" x2="${Wd}" y2="${tgtY}" stroke="#a78bfa" stroke-dasharray="4 4" stroke-width="1.5"/>
    <text x="${Wd}" y="${tgtY - 4}" fill="#a78bfa" font-size="9" text-anchor="end">เป้า ${CAL_TARGET}</text>
    <polyline points="${pt.map(p => p.join(',')).join(' ')}" fill="none" stroke="#a78bfa" stroke-width="2.5"/>
    ${pt.map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="3" fill="#a78bfa"/>`).join('')}
    <text x="0" y="${H + 18}" fill="#8b98ab" font-size="9">เฉลี่ย 7 วัน: ${Math.round(avg7).toLocaleString()} kcal</text></svg>`
    }
}

/* ============ FIREBASE & GOOGLE AUTH SYNC ============ */
const firebaseConfig = {
    apiKey: "AIzaSyBzvOYLYqCLsISDFxMP190RJ-c_UoZ5-cE",
    authDomain: "fitcoachx5.firebaseapp.com",
    projectId: "fitcoachx5",
    storageBucket: "fitcoachx5.firebasestorage.app",
    messagingSenderId: "829215967374",
    appId: "1:829215967374:web:02f87a90452a65a61361df"
};

let fbApp = null, fbAuth = null, fbDb = null;
let currentUser = null, fbUnsubscribe = null;
let isSyncing = false;

try {
    if (typeof firebase !== 'undefined') {
        fbApp = firebase.initializeApp(firebaseConfig);
        fbAuth = firebase.auth();
        fbDb = firebase.firestore();
        fbDb.enablePersistence({ synchronizeTabs: true }).catch(err => {
            console.warn("Firestore offline persistence:", err.code);
        });
    }
} catch (e) {
    console.error("Firebase init error:", e);
}

function msg(t) {
    const el = document.getElementById('syncMsg');
    if (el) el.innerHTML = t;
}

function saveCfg() {
    if (document.getElementById('aiKey')) {
        D.cfg.aiKey = document.getElementById('aiKey').value.trim();
        if (document.getElementById('aiKeyBackup')) {
            D.cfg.aiKeyBackup = document.getElementById('aiKeyBackup').value.trim();
        }
        save();
        autoSync();
        fcAlert('✓ บันทึก Gemini API Key ลงเครื่องและซิงก์เข้า Firebase เรียบร้อยแล้ว!');
    }
}

function renderAuthUI() {
    const authCard = document.getElementById('authCard');
    const userBadge = document.getElementById('userHeaderBadge');
    if (!authCard) return;

    if (currentUser) {
        const photo = currentUser.photoURL || 'icon.svg';
        const name = currentUser.displayName || 'ผู้ใช้งาน Google';
        const email = currentUser.email || '';
        authCard.innerHTML = `
            <div style="display:flex; align-items:center; gap:12px;">
                <img src="${photo}" style="width:48px; height:48px; border-radius:50%; object-fit:cover; border:2px solid var(--acc);" alt="Avatar">
                <div style="flex:1; min-width:0;">
                    <div style="font-weight:700; font-size:16px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${name}</div>
                    <div style="font-size:12.5px; color:var(--dim); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${email}</div>
                </div>
            </div>
            <div style="margin-top:12px; padding:9px 12px; background:rgba(16,185,129,0.12); border-radius:10px; display:flex; align-items:center; gap:8px; font-size:13px; color:#059669; font-weight:600;">
                <span style="font-size:16px; line-height:1;">●</span> เชื่อมต่อ Google สำเร็จแล้ว
            </div>
            <div class="sub" id="syncMsg" style="margin-top:8px; font-size:12px;">ซิงก์ข้อมูลอัตโนมัติ</div>
            <div class="g2" style="margin-top:12px;">
                <button class="btn sm" onclick="syncNow()">⇅ ซิงก์ตอนนี้</button>
                <button class="btn g sm" onclick="logoutGoogle()">ออกจากระบบ</button>
            </div>
        `;
        if (userBadge) {
            userBadge.innerHTML = `<img src="${photo}" style="width:32px; height:32px; border-radius:50%; border:2px solid var(--acc); object-fit:cover;" title="${name}">`;
            userBadge.style.display = 'block';
        }
    } else {
        authCard.innerHTML = `
            <h3>เข้าสู่ระบบด้วย Google</h3>
            <div class="sub" style="margin:6px 0 14px">กดปุ่มเดียวเพื่อเชื่อมต่อ ข้อมูลจะซิงก์ตรงกันทุกอุปกรณ์ทันที ไม่ต้องจำรหัส</div>
            <button type="button" class="btn" onclick="loginWithGoogle()" style="background:#ffffff; color:#374151; border:1px solid #d1d5db; font-weight:600; display:flex; align-items:center; justify-content:center; gap:10px; width:100%; padding:12px; border-radius:10px; cursor:pointer; font-size:15px; box-shadow:0 1px 3px rgba(0,0,0,0.08);">
                <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.55 10.78l7.98-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
                <span>เข้าสู่ระบบด้วย Google</span>
            </button>
            <div class="sub" id="syncMsg" style="margin-top:12px; font-size:12.5px; text-align:center;">ยังไม่ได้เชื่อมต่อบัญชี</div>
        `;
        if (userBadge) {
            userBadge.innerHTML = `<span style="font-size:12px; font-weight:600; padding:4px 8px; border-radius:12px; background:var(--card2); color:var(--dim); border:1px solid var(--line);">เข้าสู่ระบบ</span>`;
            userBadge.style.display = 'block';
        }
    }
    updateCloudSyncPill();
}

async function loginWithGoogle() {
    if (!fbAuth) return fcAlert('Firebase SDK ยังไม่พร้อมทำงาน กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต');
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
        msg('กำลังเข้าสู่ระบบ Google...');
        await fbAuth.signInWithPopup(provider);
    } catch (err) {
        console.error('Google Sign-in error:', err);
        if (err.code === 'auth/popup-blocked') {
            await fbAuth.signInWithRedirect(provider);
        } else if (err.code === 'auth/configuration-not-found') {
            fcAlert(`ยังไม่ได้เปิดใช้งาน Google Sign-In ใน Firebase!\n\nวิธีแก้ไข:\n1. ไปที่ Firebase Console (โปรเจกต์ fitcoachx5)\n2. ไปที่เมนู Authentication > แท็บ "Sign-in method"\n3. กดเปิดใช้งาน (Enable) Google แล้วกด Save ครับ`);
        } else if (err.code === 'auth/unauthorized-domain') {
            fcAlert(`โดเมนนี้ (${window.location.hostname}) ยังไม่ได้รับอนุญาตใน Firebase!

กรุณาไปที่ Firebase Console > Authentication > Settings > Authorized domains แล้วเพิ่ม ${window.location.hostname} เข้าไปครับ`);
        } else if (err.code !== 'auth/popup-closed-by-user') {
            fcAlert('เข้าสู่ระบบไม่สำเร็จ: ' + err.message);
        }
        renderAuthUI();
    }
}

async function logoutGoogle() {
    const ok = await fcConfirm('ต้องการออกจากระบบ Google หรือไม่? (ข้อมูลในเครื่องจะยังอยู่)');
    if (!ok) return;
    if (fbUnsubscribe) { fbUnsubscribe(); fbUnsubscribe = null; }
    await fbAuth.signOut();
    currentUser = null;
    updateAuthGateState(null);
    renderAuthUI();
    msg('ออกจากระบบแล้ว');
}

function mergeCloudData(cloud) {
    if (!cloud) return;

    // ================= CLOUD-FIRST ARCHITECTURE =================
    // When user opens on another device without pending local offline changes (fc_dirty !== '1'):
    // Cloud is 100% AUTHORITATIVE MASTER. LocalStorage never contaminates Cloud!
    const isDirty = localStorage.getItem('fc_dirty') === '1';

    if (!isDirty) {
        // 100% PURE CLOUD-FIRST ADOPTION
        if (cloud.start) D.start = cloud.start;
        if (cloud.bs !== undefined) D.bs = !!cloud.bs;
        if (cloud.schOffs !== undefined) {
            D.schOffs = cloud.schOffs;
            D.schOffsUpdatedAt = cloud.schOffsUpdatedAt || 0;
        }
        if (cloud.forceFullCardio !== undefined) D.forceFullCardio = !!cloud.forceFullCardio;
        if (cloud.morningCardio !== undefined) D.morningCardio = cloud.morningCardio;

        if (Array.isArray(cloud.checks) && cloud.checks.length > 0) {
            D.checks = JSON.parse(JSON.stringify(cloud.checks));
        }
        if (Array.isArray(cloud.sessions)) {
            D.sessions = JSON.parse(JSON.stringify(cloud.sessions));
        }
        if (Array.isArray(cloud.sets)) {
            D.sets = JSON.parse(JSON.stringify(cloud.sets));
        }
        if (cloud.cfg) {
            D.cfg = { ...(D.cfg || {}), ...cloud.cfg };
            if (D.cfg.calTarget) CAL_TARGET = D.cfg.calTarget;
            if (D.cfg.proteinTarget) PROTEIN_TARGET = D.cfg.proteinTarget;
            if (D.cfg.fatTarget) FAT_TARGET = D.cfg.fatTarget;
            if (D.cfg.carbsTarget) CARBS_TARGET = D.cfg.carbsTarget;
            if (D.cfg.sugarTarget) SUGAR_TARGET = D.cfg.sugarTarget;
            if (D.cfg.sodiumTarget) SODIUM_TARGET = D.cfg.sodiumTarget;
            if (D.cfg.waterTarget) WATER_TARGET = D.cfg.waterTarget <= 50 ? D.cfg.waterTarget * 250 : D.cfg.waterTarget;
        }
        if (cloud.if) {
            D.if = JSON.parse(JSON.stringify(cloud.if));
        }

        // Auto-recalculate macros from meals for all checks
        (D.checks || []).forEach(c => {
            if (c.water != null && c.water > 0 && c.water <= 50) {
                c.water = Math.round(c.water * 250);
            }
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

        try {
            localStorage.setItem('fit', JSON.stringify(D));
        } catch (e) {}
        render();
        updateIFUI();
        if (cloud.outdoorMode !== undefined) D.outdoorMode = !!cloud.outdoorMode;
        const timeStr = typeof formatThaiTime === 'function' ? formatThaiTime(new Date()) : new Date().toLocaleTimeString('th-TH');
        lastCloudSyncTime = timeStr;
        updateCloudSyncPill('synced');
        msg('<span style="color:#10b981;font-weight:600;">✓ โหลดข้อมูลคลาวด์ล่าสุดเรียบร้อย (' + timeStr + ' น.)</span>');
        return;
    }

    // ================= OFFLINE CONFLICT RESOLUTION =================
    // Only runs if user logged changes on THIS device while offline (fc_dirty === '1')
    if (cloud.start) D.start = cloud.start;
    if (cloud.bs !== undefined) D.bs = cloud.bs;
    if (cloud.schOffs !== undefined) {
        const localSchUpdated = D.schOffsUpdatedAt || 0;
        const cloudSchUpdated = cloud.schOffsUpdatedAt || 0;
        if (cloudSchUpdated > localSchUpdated) {
            D.schOffs = cloud.schOffs;
            D.schOffsUpdatedAt = cloudSchUpdated;
        }
    }
    if (cloud.forceFullCardio !== undefined) D.forceFullCardio = cloud.forceFullCardio;
    if (cloud.morningCardio !== undefined) D.morningCardio = cloud.morningCardio;

    if (cloud.checks && Array.isArray(cloud.checks)) {
        const checkMap = new Map();
        (D.checks || []).forEach(c => checkMap.set(c.d, { ...c }));
        cloud.checks.forEach(c => {
            if (!checkMap.has(c.d)) {
                checkMap.set(c.d, { ...c });
            } else {
                const ex = checkMap.get(c.d);
                const isCloudNewer = (c.updatedAt || 0) >= (ex.updatedAt || 0);
                
                let mergedW = null;
                if (c.w != null && c.w >= 30 && ex.w != null && ex.w >= 30) {
                    mergedW = isCloudNewer ? c.w : ex.w;
                } else if (c.w != null && c.w >= 30) {
                    mergedW = c.w;
                } else if (ex.w != null && ex.w >= 30) {
                    mergedW = ex.w;
                }

                let mergedBf = null;
                if (c.bf != null && c.bf > 0 && ex.bf != null && ex.bf > 0) {
                    mergedBf = isCloudNewer ? c.bf : ex.bf;
                } else {
                    mergedBf = (c.bf != null && c.bf > 0) ? c.bf : (ex.bf ?? null);
                }

                let mergedMuscle = null;
                if (c.muscle != null && c.muscle > 0 && ex.muscle != null && ex.muscle > 0) {
                    mergedMuscle = isCloudNewer ? c.muscle : ex.muscle;
                } else {
                    mergedMuscle = (c.muscle != null && c.muscle > 0) ? c.muscle : (ex.muscle ?? null);
                }

                const mergedHrv = (c.hrv != null && c.hrv > 0) ? c.hrv : (ex.hrv ?? null);
                const mergedPain = (c.pain != null) ? (isCloudNewer ? c.pain : ex.pain) : (ex.pain ?? null);
                const mergedWater = Math.max(ex.water || 0, c.water || 0);
                const mergedSteps = Math.max(ex.steps || 0, c.steps || 0);

                const mealMap = new Map();
                (ex.meals || []).forEach(m => { if (m) mealMap.set(m.id || (m.name + '_' + m.time), m); });
                (c.meals || []).forEach(m => { if (m) mealMap.set(m.id || (m.name + '_' + m.time), m); });
                const mergedMeals = [...mealMap.values()];

                checkMap.set(c.d, {
                    ...ex,
                    ...c,
                    w: mergedW,
                    bf: mergedBf,
                    muscle: mergedMuscle,
                    hrv: mergedHrv,
                    pain: mergedPain,
                    water: mergedWater > 0 ? mergedWater : (c.water ?? ex.water ?? null),
                    steps: mergedSteps > 0 ? mergedSteps : (c.steps ?? ex.steps ?? null),
                    meals: mergedMeals,
                    supps: { ...(ex.supps || {}), ...(c.supps || {}) },
                    suppShiftMode: isCloudNewer ? (c.suppShiftMode ?? ex.suppShiftMode ?? false) : (ex.suppShiftMode ?? c.suppShiftMode ?? false),
                    updatedAt: Math.max(ex.updatedAt || 0, c.updatedAt || 0)
                });
            }
        });
        D.checks = [...checkMap.values()].sort((a, b) => a.d.localeCompare(b.d));
    }

    (D.checks || []).forEach(c => {
        if (c.water != null && c.water > 0 && c.water <= 50) {
            c.water = Math.round(c.water * 250);
        }
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

    const sessionMap = new Map();
    (D.sessions || []).forEach(s => sessionMap.set(s.id, s));
    (cloud.sessions || []).forEach(s => sessionMap.set(s.id, s));
    D.sessions = [...sessionMap.values()].sort((a, b) => (a.date || '').localeCompare(b.date || ''));

    const setMap = new Map();
    (D.sets || []).forEach(st => setMap.set(st.id, st));
    (cloud.sets || []).forEach(st => setMap.set(st.id, st));
    D.sets = [...setMap.values()];

    if (cloud.cfg) {
        D.cfg = { ...(D.cfg || {}), ...cloud.cfg };
        if (D.cfg.calTarget) CAL_TARGET = D.cfg.calTarget;
        if (D.cfg.proteinTarget) PROTEIN_TARGET = D.cfg.proteinTarget;
        if (D.cfg.fatTarget) FAT_TARGET = D.cfg.fatTarget;
        if (D.cfg.carbsTarget) CARBS_TARGET = D.cfg.carbsTarget;
        if (D.cfg.waterTarget) WATER_TARGET = D.cfg.waterTarget <= 50 ? D.cfg.waterTarget * 250 : D.cfg.waterTarget;
    }

    if (cloud.if) {
        if (!D.if) D.if = cloud.if;
        else {
            if (cloud.if.goal) D.if.goal = cloud.if.goal;
            const localIfUpdated = D.if.updatedAt || 0;
            const cloudIfUpdated = cloud.if.updatedAt || 0;
            if (cloudIfUpdated >= localIfUpdated) {
                if (cloud.if.start !== undefined) D.if.start = cloud.if.start;
                if (cloud.if.notifiedComplete !== undefined) D.if.notifiedComplete = cloud.if.notifiedComplete;
                D.if.updatedAt = cloudIfUpdated;
            }
        }
    }

    try {
        localStorage.setItem('fit', JSON.stringify(D));
    } catch (e) {}
    if (cloud.outdoorMode !== undefined) D.outdoorMode = !!cloud.outdoorMode;
    if (cloud.cfg && cloud.cfg.savedFoods && Array.isArray(cloud.cfg.savedFoods)) {
        D.cfg.savedFoods = cloud.cfg.savedFoods;
    }
    render();
    updateIFUI();
    // Since this device had offline changes, push the merged result to Cloud and clear dirty flag
    pushToCloud();
}

function deepCleanForFirestore(val) {
    if (val === undefined) return null;
    if (val === null || typeof val !== 'object') return val;
    if (Array.isArray(val)) {
        return val.map(item => (item === undefined ? null : deepCleanForFirestore(item)));
    }
    const res = {};
    for (const [k, v] of Object.entries(val)) {
        if (v !== undefined) {
            res[k] = deepCleanForFirestore(v);
        }
    }
    return res;
}

let isSyncPending = false;
let lastCloudSyncTime = '';

function updateCloudSyncPill(status, customTxt) {
    const pill = document.getElementById('cloudSyncPill');
    const dot = document.getElementById('cloudSyncDot');
    const txt = document.getElementById('cloudSyncTxt');
    if (!pill || !dot || !txt) return;

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
        dot.style.background = '#ef4444';
        dot.style.boxShadow = 'none';
        txt.style.color = '#ef4444';
        txt.textContent = 'ออฟไลน์';
        pill.title = 'ไม่ได้เชื่อมต่ออินเทอร์เน็ต — ข้อมูลถูกบันทึกในเครื่องปลอดภัย';
        return;
    }

    if (!currentUser) {
        dot.style.background = 'var(--dim)';
        dot.style.boxShadow = 'none';
        txt.style.color = 'var(--dim)';
        txt.textContent = 'ยังไม่ล็อกอิน';
        pill.title = 'แตะเพื่อเข้าสู่ระบบ Google เพื่อเปิดระบบซิงก์คลาวด์อัตโนมัติ';
        return;
    }

    if (status === 'syncing') {
        dot.style.background = '#f59e0b';
        dot.style.boxShadow = '0 0 6px #f59e0b';
        txt.style.color = '#d97706';
        txt.textContent = 'กำลังซิงก์...';
        pill.title = 'กำลังอัปเดตข้อมูลขึ้น Google Cloud...';
    } else if (status === 'dirty' || localStorage.getItem('fc_dirty') === '1') {
        dot.style.background = '#f59e0b';
        dot.style.boxShadow = 'none';
        txt.style.color = '#d97706';
        txt.textContent = 'รอซิงก์';
        pill.title = 'มีข้อมูลใหม่ในเครื่องรอส่งขึ้นคลาวด์ แตะเพื่อซิงก์ทันที';
    } else {
        dot.style.background = '#10b981';
        dot.style.boxShadow = '0 0 5px #10b981';
        txt.style.color = '#059669';
        txt.textContent = customTxt || (lastCloudSyncTime ? 'ซิงก์แล้ว ' + lastCloudSyncTime : 'ซิงก์แล้ว');
        pill.title = 'ข้อมูลซิงก์กับ Google Cloud สมบูรณ์ ' + (lastCloudSyncTime ? '(ล่าสุด ' + lastCloudSyncTime + ' น.)' : '') + ' แตะเพื่อซิงก์ซ้ำ';
    }
}

async function handleCloudSyncPillClick() {
    if (!currentUser) {
        go('sync');
        return;
    }
    updateCloudSyncPill('syncing');
    const ok = await pushToCloud();
    if (ok) {
        lastCloudSyncTime = typeof formatThaiTime === 'function' ? formatThaiTime(new Date()) : new Date().toLocaleTimeString('th-TH');
        updateCloudSyncPill('synced');
        msg('✓ ซิงก์คลาวด์สำเร็จ (' + lastCloudSyncTime + ' น.)');
    } else {
        updateCloudSyncPill('dirty');
    }
}

if (typeof window !== 'undefined') {
    window.addEventListener('online', () => updateCloudSyncPill());
    window.addEventListener('offline', () => updateCloudSyncPill());
}

async function pushToCloud() {
    if (!currentUser || !fbDb) {
        updateCloudSyncPill();
        return false;
    }
    if (isSyncing) {
        isSyncPending = true;
        return false;
    }
    isSyncing = true;
    updateCloudSyncPill('syncing');
    try {
        const userDocRef = fbDb.collection('users').doc(currentUser.uid);
        const rawPayload = {
            start: D.start || iso(),
            bs: !!D.bs,
            outdoorMode: !!D.outdoorMode,
            schOffs: D.schOffs || 0,
            schOffsUpdatedAt: D.schOffsUpdatedAt || (D.schOffs ? Date.now() : 0),
            forceFullCardio: !!D.forceFullCardio,
            morningCardio: D.morningCardio || null,
            checks: D.checks || [],
            sessions: D.sessions || [],
            sets: D.sets || [],
            if: D.if || { goal: 16, start: null },
            cfg: {
                ...(D.cfg || {})
            },
            updatedAt: new Date().toISOString()
        };

        // Deep scrub all undefined values (guarantees NO field is ever undefined)
        const cleanPayload = deepCleanForFirestore(rawPayload);

        await userDocRef.set(cleanPayload, { merge: true });
        localStorage.removeItem('fc_dirty'); // Unsynced local changes are safely written to Cloud
        const timeStr = typeof formatThaiTime === 'function' ? formatThaiTime(new Date()) : new Date().toLocaleTimeString('th-TH');
        lastCloudSyncTime = timeStr;
        updateCloudSyncPill('synced');
        msg(`<span style="color:#10b981;font-weight:600;">✓ ซิงก์สมบูรณ์เวลา ${timeStr} น.</span>`);
        return true;
    } catch (err) {
        console.error("Cloud push error:", err);
        updateCloudSyncPill('dirty');
        if (err.code === 'permission-denied' || (err.message && err.message.includes('permission'))) {
            msg('⚠️ ซิงก์ไม่สำเร็จ: ยังไม่ได้ตั้งค่า Rules ใน Firestore');
        } else {
            msg('<span style="color:#ef4444;font-weight:600;">ซิงก์ขัดข้อง: ' + (err.message || 'ไม่สามารถบันทึกข้อมูลได้') + '</span>');
        }
        return false;
    } finally {
        isSyncing = false;
        if (isSyncPending) {
            isSyncPending = false;
            setTimeout(() => pushToCloud(), 150);
        }
    }
}

let syncDebounceTimer = null;
function autoSync() {
    if (!currentUser || !fbDb) return;
    clearTimeout(syncDebounceTimer);
    syncDebounceTimer = setTimeout(() => {
        pushToCloud();
    }, 600);
}

async function syncNow() {
    if (!currentUser) return fcAlert('กรุณาเข้าสู่ระบบ Google ก่อนทำการซิงก์');
    msg('<span style="color:var(--warn);font-weight:600;">⏳ กำลังซิงก์ข้อมูล...</span>');
    const ok = await pushToCloud();
    if (ok) {
        fcAlert('✓ ซิงก์ข้อมูลขึ้น Google Cloud เรียบร้อยแล้ว!');
    } else {
        fcAlert('⚠️ ซิงก์ไม่สำเร็จ กรุณาดูรายละเอียดที่ข้อความแจ้งเตือนสีแดงด้านล่างปุ่ม');
    }
}

if (fbAuth) {
    fbAuth.onAuthStateChanged(async (user) => {
        currentUser = user;
        updateAuthGateState(user);
        renderAuthUI();
        if (user) {
            msg('กำลังเชื่อมต่อฐานข้อมูล...');
            try {
                localStorage.setItem('fc_has_auth', '1');
                const userDocRef = fbDb.collection('users').doc(user.uid);
                const docSnap = await userDocRef.get();
                if (docSnap.exists) {
                    mergeCloudData(docSnap.data());
                    // CLOUD-FIRST: NEVER pushToCloud() on startup! Cloud is already master.
                } else {
                    // Only brand-new users without a Firestore doc push initial baseline
                    await pushToCloud();
                    msg('✓ สร้างฐานข้อมูล Cloud ใหม่เรียบร้อย');
                }

                if (fbUnsubscribe) fbUnsubscribe();
                fbUnsubscribe = userDocRef.onSnapshot((snap) => {
                    if (snap.exists && !snap.metadata.hasPendingWrites) {
                        mergeCloudData(snap.data());
                    }
                });
            } catch (err) {
                console.error("Auth state handling error:", err);
                if (err.code === 'permission-denied' || (err.message && err.message.includes('permission'))) {
                    msg('⚠️ ยังไม่ได้ตั้งค่า Rules ใน Firestore: ไปที่ Firebase Console > Firestore Database > Rules');
                } else {
                    msg('ดึงข้อมูลไม่สำเร็จ: ' + err.message.slice(0, 100));
                }
            }
        } else {
            if (fbUnsubscribe) { fbUnsubscribe(); fbUnsubscribe = null; }
        }
    });
}

function exportJSON() {
    const b = new Blob([JSON.stringify(D, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'fitcoach-backup-' + iso() + '.json'; a.click()
}

