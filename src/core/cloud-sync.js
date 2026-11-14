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
    const fiber = Math.round((Number(document.getElementById('aiFiber')?.value) || 0) * 10) / 10;
    const pStr = portion || '1 หน่วยบริโภค';
    const base = window._aiScanBase || {};

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
        fiber: fiber || base.fiber || 0,
        nutriGrade: base.nutriGrade || 'B',
        healthScore: base.healthScore || 7,
        satietyScore: base.satietyScore || 7,
        coachTip: base.coachTip || '',
        ingredients: base.ingredients || [],
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
    msg('⭐ บันทึก "' + name + '" (เกรด ' + (newFav.nutriGrade || 'A') + ') ลงคลังเมนูโปรด & ซิงก์คลาวด์แล้ว');
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
    const extraMeta = {
        fiber: food.fiber || 0,
        nutriGrade: food.nutriGrade,
        healthScore: food.healthScore,
        satietyScore: food.satietyScore,
        coachTip: food.coachTip,
        ingredients: food.ingredients
    };
    addMealToToday(mType, food.name, food.portion, food.cal, food.pro, food.carbs, food.fat, food.sugar || 0, food.sodium || 0, extraMeta);
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
    let limit = 40;
    if (window._weightChartFilter === 'week') limit = 7;
    else if (window._weightChartFilter === 'month') limit = 30;
    else if (window._weightChartFilter === 'quarter') limit = 90;

    const validChecks = (D.checks || []).filter(x => x.w != null && x.w > 0);
    const d = validChecks.slice(-limit);
    const box = document.getElementById('chart');

    if (box) {
        if (d.length < 1) {
            box.innerHTML = '<div class="sub" style="text-align:center;padding:24px;">บันทึกน้ำหนักเพื่อเริ่มดูกราฟแนวโน้ม</div>';
        } else if (d.length === 1) {
            const singleW = (+d[0].w).toFixed(1);
            box.innerHTML = `
                <div style="background:var(--card2); border-radius:12px; padding:20px; text-align:center;">
                    <div style="font-size:24px; font-weight:900; color:#00c070; margin-bottom:4px;">${singleW} kg</div>
                    <div style="font-size:12.5px; color:var(--dim);">บันทึกน้ำหนักอีก 1 วันขึ้นไปเพื่อเริ่มแสดงเส้นแนวโน้ม</div>
                </div>`;
        } else {
            const targetW = D.cfg.targetWeight || 70.0;
            const Wd = 300, H = 130;
            const allW = d.map(x => Number(x.w));
            const maxVal = Math.max(...allW, targetW);
            const minVal = Math.min(...allW, targetW);
            const pad = Math.max(1, (maxVal - minVal) * 0.2);
            const mx = Math.ceil(maxVal + pad);
            const mn = Math.floor(minVal - pad);

            const pt = d.map((x, i) => [
                (i / (d.length - 1)) * Wd,
                H - ((x.w - mn) / Math.max(0.5, (mx - mn))) * H
            ]);
            const gy = H - ((targetW - mn) / Math.max(0.5, (mx - mn))) * H;

            // Generate Y-axis grid lines (every 2-4 kg)
            const stepY = (mx - mn) <= 6 ? 2 : Math.round((mx - mn) / 4);
            const gridLines = [];
            for (let v = mn; v <= mx; v += stepY) {
                const yPos = H - ((v - mn) / Math.max(0.5, (mx - mn))) * H;
                if (yPos >= 0 && yPos <= H) {
                    gridLines.push(`
                        <line x1="0" y1="${yPos.toFixed(1)}" x2="${Wd}" y2="${yPos.toFixed(1)}" stroke="var(--line)" stroke-width="0.8" opacity="0.6"/>
                        <text x="-4" y="${(yPos + 3).toFixed(1)}" fill="var(--dim)" font-size="8.5" text-anchor="end" font-weight="600">${v}</text>
                    `);
                }
            }

            // X-axis date labels
            const dateLabels = d.map((x, i) => {
                const parts = x.d.split('-');
                const label = `${parts[2]}/${parts[1]}`;
                const xPos = pt[i][0];
                return `<text x="${xPos.toFixed(1)}" y="${H + 18}" fill="var(--dim)" font-size="9" text-anchor="middle" font-weight="600">${label}</text>`;
            }).join('');

            // Latest point indicator & tooltip badge
            const lastIdx = pt.length - 1;
            const lastPt = pt[lastIdx];
            const latestW = (+d[lastIdx].w).toFixed(1);

            box.innerHTML = `
                <svg viewBox="-24 -16 ${Wd + 34} ${H + 42}" style="width:100%; overflow:visible;">
                    ${gridLines.join('')}
                    <!-- Target Line -->
                    <line x1="0" y1="${gy.toFixed(1)}" x2="${Wd}" y2="${gy.toFixed(1)}" stroke="#10b981" stroke-dasharray="4 4" stroke-width="1.5" opacity="0.85"/>
                    <text x="${Wd + 4}" y="${(gy + 3).toFixed(1)}" fill="#10b981" font-size="9" text-anchor="start" font-weight="700">เป้า ${targetW}</text>

                    <!-- Trend Line -->
                    <polyline points="${pt.map(p => p.map(n => n.toFixed(1)).join(',')).join(' ')}" fill="none" stroke="#00c070" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                    
                    <!-- Vertical Crosshair Line for Latest -->
                    <line x1="${lastPt[0].toFixed(1)}" y1="0" x2="${lastPt[0].toFixed(1)}" y2="${H}" stroke="#00c070" stroke-dasharray="3 3" stroke-width="1.2" opacity="0.6"/>

                    <!-- Data Points -->
                    ${pt.map((p, i) => `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${i === lastIdx ? '4.5' : '3'}" fill="#00c070" stroke="#ffffff" stroke-width="1.5"/>`).join('')}

                    <!-- Tooltip badge at latest point -->
                    <g transform="translate(${(lastPt[0] - 18).toFixed(1)}, ${(lastPt[1] - 22).toFixed(1)})">
                        <rect width="36" height="18" rx="5" fill="#00c070"/>
                        <text x="18" y="12" fill="#ffffff" font-size="9.5" font-weight="900" text-anchor="middle">${latestW}</text>
                    </g>

                    ${dateLabels}
                </svg>
            `;
        }
    }

    const pd = D.checks.filter(x => x.pain != null).slice(-40), pb = document.getElementById('painChart');
    if (pb) {
        if (pd.length < 2) pb.innerHTML = '<div class="sub">กรอกระดับปวดหลังทุกเช้าเพื่อดูแนวโน้ม (0-10)</div>';
        else {
            const Wd = 300, H = 80; const pt = pd.map((x, i) => [i / (pd.length - 1) * Wd, H - x.pain / 10 * H]);
            pb.innerHTML = `<svg viewBox="-4 -8 ${Wd + 8} ${H + 18}" style="width:100%">
        <polyline points="${pt.map(p => p.join(',')).join(' ')}" fill="none" stroke="#f59e0b" stroke-width="2.5"/>
        ${pt.map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="3" fill="#f59e0b"/>`).join('')}
        <text x="0" y="${H + 14}" fill="#8b98ab" font-size="9">0 = ไม่ปวด • 10 = ปวดมาก</text></svg>`;
        }
    }

    /* --- Calorie Chart --- */
    const cd = D.checks.filter(x => x.cal > 0).slice(-40), cb = document.getElementById('calChart');
    if (cb) {
        if (cd.length < 2) cb.innerHTML = '<div class="sub">บันทึกแคลอรี่อย่างน้อย 2 วันเพื่อดูกราฟ</div>';
        else {
            const Wd = 300, H = 90, mx = Math.max(...cd.map(x => x.cal), CAL_TARGET + 200);
            const pt = cd.map((x, i) => [i / (cd.length - 1) * Wd, H - x.cal / mx * H]);
            const tgtY = H - CAL_TARGET / mx * H;
            const avg7 = cd.slice(-7).reduce((a, x) => a + x.cal, 0) / Math.min(7, cd.length);
            cb.innerHTML = `<svg viewBox="-4 -8 ${Wd + 8} ${H + 28}" style="width:100%">
        <line x1="0" y1="${tgtY}" x2="${Wd}" y2="${tgtY}" stroke="#a78bfa" stroke-dasharray="4 4" stroke-width="1.5"/>
        <text x="${Wd}" y="${tgtY - 4}" fill="#a78bfa" font-size="9" text-anchor="end">เป้า ${CAL_TARGET}</text>
        <polyline points="${pt.map(p => p.join(',')).join(' ')}" fill="none" stroke="#a78bfa" stroke-width="2.5"/>
        ${pt.map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="3" fill="#a78bfa"/>`).join('')}
        <text x="0" y="${H + 18}" fill="#8b98ab" font-size="9">เฉลี่ย 7 วัน: ${Math.round(avg7).toLocaleString()} kcal</text></svg>`;
        }
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

function toggleKeyVisibility(inputId, btnEl) {
    const inp = document.getElementById(inputId);
    if (!inp) return;
    if (inp.type === 'password') {
        inp.type = 'text';
        if (btnEl) btnEl.textContent = '🔒 ซ่อนคีย์';
    } else {
        inp.type = 'password';
        if (btnEl) btnEl.textContent = '👁️ แสดงคีย์';
    }
}

function saveCfg() {
    if (document.getElementById('aiKey')) {
        D.cfg.aiKey = document.getElementById('aiKey').value.trim();
        if (document.getElementById('aiKeyBackup')) {
            D.cfg.aiKeyBackup = document.getElementById('aiKeyBackup').value.trim();
        }
        save();
        autoSync();
        renderAiQuotaWidget();
        fcAlert('✓ บันทึก Gemini API Key ลงเครื่องและซิงก์เข้า Firebase เรียบร้อยแล้ว!');
    }
}

/* ============ GEMINI API KEY & QUOTA INSPECTOR ============ */
async function testGeminiKey(keyType = 'primary') {
    const inputId = keyType === 'backup' ? 'aiKeyBackup' : 'aiKey';
    const inputEl = document.getElementById(inputId);
    const keyVal = inputEl ? inputEl.value.trim() : (keyType === 'backup' ? (D.cfg.aiKeyBackup || '') : (D.cfg.aiKey || ''));
    const statusBox = document.getElementById('aiKeyStatusBox');

    if (!keyVal) {
        if (statusBox) {
            statusBox.style.display = 'block';
            statusBox.className = 'ai-key-status-box warn';
            statusBox.innerHTML = `⚠️ กรุณากรอก <b>${keyType === 'backup' ? 'Gemini API Key สำรอง' : 'Gemini API Key หลัก'}</b> ก่อนทำการทดสอบ`;
        }
        return;
    }

    if (statusBox) {
        statusBox.style.display = 'block';
        statusBox.className = 'ai-key-status-box loading';
        statusBox.innerHTML = `
            <div style="display:flex; align-items:center; gap:8px;">
                <span class="ai-spin">⏳</span>
                <span>กำลังเชื่อมต่อทดสอบกับ Google Generative Language API (${keyType === 'backup' ? 'คีย์สำรอง' : 'คีย์หลัก'})...</span>
            </div>
        `;
    }

    const tStart = Date.now();
    try {
        const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(keyVal)}`, {
            method: 'GET'
        });
        const latency = Date.now() - tStart;

        if (resp.ok) {
            const data = await resp.json();
            const modelCount = data && Array.isArray(data.models) ? data.models.length : 0;
            if (typeof recordAiUsage === 'function') {
                recordAiUsage(`ทดสอบสถานะคีย์ (${keyType === 'backup' ? 'สำรอง' : 'หลัก'})`, true);
            }
            if (statusBox) {
                statusBox.className = 'ai-key-status-box ok';
                statusBox.innerHTML = `
                    <div style="font-weight:800; font-size:12.5px; color:#059669; display:flex; align-items:center; gap:6px;">
                        <span>🟢 คีย์ถูกต้องและพร้อมใช้งาน 100%!</span>
                        <span style="font-size:11px; font-weight:700; background:#dcfce7; color:#15803d; padding:2px 7px; border-radius:99px;">Ping ${latency}ms</span>
                    </div>
                    <div style="font-size:11.5px; color:#334155; margin-top:4px; line-height:1.4;">
                        เชื่อมต่อเซิร์ฟเวอร์ Google สำเร็จ เข้าถึงได้ <b>${modelCount} โมเดล</b> (รองรับ gemini-1.5-flash / gemini-2.0 / gemini-2.5)
                    </div>
                `;
            }
        } else if (resp.status === 429) {
            if (typeof recordAiUsage === 'function') {
                recordAiUsage(`ทดสอบคีย์ (${keyType === 'backup' ? 'สำรอง' : 'หลัก'}) - 429`, false);
            }
            if (statusBox) {
                statusBox.className = 'ai-key-status-box warn';
                statusBox.innerHTML = `
                    <div style="font-weight:800; font-size:12.5px; color:#d97706;">
                        🟡 โควต้าชนเพดานชั่วคราว (429 Rate Limit / Quota Exhausted)
                    </div>
                    <div style="font-size:11.5px; color:#475569; margin-top:4px; line-height:1.4;">
                        คำขอเกินเพดาน 15 ครั้ง/นาที (RPM) หรือครบ 1,500 ครั้ง/วัน (RPD) แนะนำให้รอ 1 นาที หรือสลับใช้คีย์สำรอง
                    </div>
                `;
            }
        } else if (resp.status === 400 || resp.status === 403) {
            if (statusBox) {
                statusBox.className = 'ai-key-status-box error';
                statusBox.innerHTML = `
                    <div style="font-weight:800; font-size:12.5px; color:#dc2626;">
                        🔴 คีย์ไม่ถูกต้องหรือไม่มีสิทธิ์ใช้งาน (HTTP ${resp.status} Invalid API Key)
                    </div>
                    <div style="font-size:11.5px; color:#475569; margin-top:4px; line-height:1.4;">
                        กรุณาตรวจสอบว่าคัดลอกคีย์มาครบถ้วน (ขึ้นต้นด้วย AIzaSy...) หรือสร้างคีย์ใหม่ใน Google AI Studio
                    </div>
                `;
            }
        } else {
            const errTxt = await resp.text();
            if (statusBox) {
                statusBox.className = 'ai-key-status-box warn';
                statusBox.innerHTML = `
                    <div style="font-weight:800; font-size:12.5px; color:#d97706;">
                        ⚠️ ผลการทดสอบ: HTTP ${resp.status}
                    </div>
                    <div style="font-size:11px; color:#475569; margin-top:2px;">${errTxt.substring(0, 100)}</div>
                `;
            }
        }
    } catch (netErr) {
        if (statusBox) {
            statusBox.className = 'ai-key-status-box error';
            statusBox.innerHTML = `
                <div style="font-weight:800; font-size:12.5px; color:#dc2626;">
                    ⚠️ ไม่สามารถเชื่อมต่อกับ Google ได้
                </div>
                <div style="font-size:11.5px; color:#475569; margin-top:2px;">
                    กรุณาตรวจสอบสัญญาณอินเทอร์เน็ต (${netErr.message})
                </div>
            `;
        }
    }
}

function renderAiQuotaWidget() {
    const el = document.getElementById('aiQuotaWidget');
    if (!el) return;
    const u = (typeof getAiUsageToday === 'function') ? getAiUsageToday() : { count: 0, dailyLimit: 500, remaining: 500, lastTime: '' };
    const pct = Math.min(100, Math.round((u.count / u.dailyLimit) * 100));

    el.innerHTML = `
        <div style="background:#f8fafd; border:1px solid #e2e8f0; border-radius:12px; padding:12px; margin-top:10px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <div style="display:flex; align-items:center; gap:6px;">
                    <span style="font-size:14px;">📊</span>
                    <span style="font-size:12.5px; font-weight:800; color:#0f172a;">สถิติการใช้งาน & โควต้าวันนี้</span>
                </div>
                <span style="font-size:11px; font-weight:800; color:${u.remaining > 50 ? '#059669' : '#d97706'}; background:${u.remaining > 50 ? '#ecfdf5' : '#fffbeb'}; padding:2px 8px; border-radius:99px; border:1px solid ${u.remaining > 50 ? '#a7f3d0' : '#fde68a'};">
                    เหลืออีก ~${u.remaining.toLocaleString()} ครั้ง
                </span>
            </div>

            <!-- Active Model Badge -->
            <div style="display:flex; align-items:center; gap:6px; background:#eff6ff; border:1px solid #bfdbfe; border-radius:8px; padding:6px 10px; margin-bottom:10px; font-size:11.5px; color:#1d4ed8; font-weight:700;">
                <span>⚡ โมเดลหลัก: <b>Gemini 3.1 Flash Lite</b> (โควต้าสูงสุด 500 ครั้ง/วัน)</span>
            </div>

            <!-- Progress Bar -->
            <div style="display:flex; justify-content:space-between; font-size:11.5px; margin-bottom:4px;">
                <span style="color:#64748b; font-weight:600;">เรียกใช้ AI วันนี้</span>
                <span style="color:#0f172a; font-weight:800;">${u.count} / ${u.dailyLimit.toLocaleString()} คำขอ (${pct}%)</span>
            </div>
            <div style="height:7px; background:#e2e8f0; border-radius:99px; overflow:hidden; margin-bottom:10px;">
                <div style="width:${Math.max(2, pct)}%; height:100%; background:linear-gradient(90deg, #10b981, #059669); border-radius:99px; transition:width 0.3s ease;"></div>
            </div>

            <!-- Quota Specs Grid -->
            <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:6px; text-align:center; margin-bottom:10px;">
                <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; padding:6px 4px;">
                    <div style="font-size:10px; color:#64748b; font-weight:700;">จำกัดต่อนาที</div>
                    <div style="font-size:12px; font-weight:900; color:#2563eb; margin-top:2px;">15 RPM</div>
                </div>
                <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; padding:6px 4px;">
                    <div style="font-size:10px; color:#64748b; font-weight:700;">จำกัดต่อวัน</div>
                    <div style="font-size:12px; font-weight:900; color:#10b981; margin-top:2px;">500 RPD</div>
                </div>
                <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; padding:6px 4px;">
                    <div style="font-size:10px; color:#64748b; font-weight:700;">โทเคนต่อนาที</div>
                    <div style="font-size:12px; font-weight:900; color:#8b5cf6; margin-top:2px;">250K TPM</div>
                </div>
            </div>

            <!-- External Link Button -->
            <div style="display:flex; gap:6px; flex-wrap:wrap;">
                <a href="https://aistudio.google.com/app/plan_information" target="_blank" rel="noopener" style="flex:1; min-width:180px; text-decoration:none; display:flex; align-items:center; justify-content:center; gap:6px; background:#ffffff; color:#1e293b; border:1px solid #cbd5e1; font-size:11.5px; font-weight:700; padding:8px 10px; border-radius:8px; cursor:pointer; box-shadow:0 1px 2px rgba(0,0,0,0.04);">
                    <span>📊 ดูโควต้าจริงบน Google AI Studio</span>
                    <span style="font-size:11px; color:#64748b;">↗</span>
                </a>
            </div>
            ${u.lastTime ? `<div style="font-size:10.5px; color:#94a3b8; text-align:right; margin-top:6px;">ใช้งานล่าสุดวันนี้: ${u.lastTime} น.</div>` : ''}
        </div>
    `;
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
            userBadge.innerHTML = `<img src="${photo}" style="width:28px; height:28px; border-radius:50%; border:2px solid var(--acc); object-fit:cover; display:block;" title="${name}">`;
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
            userBadge.innerHTML = `<span style="font-size:11px; font-weight:700; padding:3px 8px; border-radius:99px; background:#eff6ff; color:#2563eb; border:1px solid #bfdbfe; display:inline-flex; align-items:center; gap:3px;">🔑 ล็อกอิน</span>`;
            userBadge.style.display = 'inline-flex';
        }
    }
    const kInp = document.getElementById('aiKey');
    if (kInp && D && D.cfg && D.cfg.aiKey && !kInp.value) {
        kInp.value = D.cfg.aiKey;
    }
    const kbInp = document.getElementById('aiKeyBackup');
    if (kbInp && D && D.cfg && D.cfg.aiKeyBackup && !kbInp.value) {
        kbInp.value = D.cfg.aiKeyBackup;
    }
    renderAiQuotaWidget();
    renderWearablesSyncUI();
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


/* ============================================================================
   FITCOACH CLOUD PUSH & NOTIFICATIONS CLIENT ENGINE (v3.5.0)
   ============================================================================ */
let fbMessaging = null;

function getNotificationPermissionStatus() {
    if (!('Notification' in window)) return 'unsupported';
    return Notification.permission; // 'default', 'granted', 'denied'
}

function updatePushStatusUI() {
    const badge = document.getElementById('pushStatusBadge');
    const btn = document.getElementById('btnRequestPushPerm');
    if (!badge) return;

    const status = getNotificationPermissionStatus();
    if (status === 'granted') {
        badge.textContent = 'เปิดใช้งานแล้ว ✓';
        badge.style.background = '#d1fae5';
        badge.style.color = '#047857';
        if (btn) {
            btn.innerHTML = '<span>✓ เปิดแจ้งเตือนแล้ว</span>';
            btn.style.background = '#059669';
            btn.disabled = true;
            btn.style.opacity = '0.85';
        }
    } else if (status === 'denied') {
        badge.textContent = 'ถูกบล็อกในเบราว์เซอร์ ✕';
        badge.style.background = '#fee2e2';
        badge.style.color = '#991b1b';
        if (btn) {
            btn.innerHTML = '<span>⚙️ ถูกปิดกั้นในสิทธิ์เบราว์เซอร์</span>';
            btn.style.background = '#64748b';
        }
    } else {
        badge.textContent = 'ยังไม่เปิดใช้งาน';
        badge.style.background = '#fef3c7';
        badge.style.color = '#b45309';
        if (btn) {
            btn.innerHTML = '<span>🔔 เปิดรับการแจ้งเตือน</span>';
            btn.style.background = '#10b981';
            btn.disabled = false;
            btn.style.opacity = '1';
        }
    }
}

async function requestPushNotificationPermission() {
    if (!('Notification' in window)) {
        if (typeof fcAlert === 'function') fcAlert('อุปกรณ์หรือเบราว์เซอร์นี้ยังไม่รองรับ Web Push Notifications ครับ');
        return;
    }

    try {
        const perm = await Notification.requestPermission();
        updatePushStatusUI();

        if (perm === 'granted') {
            await initFcmPushMessaging();
            if (typeof fcAlert === 'function') {
                fcAlert('✓ เปิดรับการแจ้งเตือนสำเร็จ! ระบบพร้อมเตือนชั่งน้ำหนักและสัดส่วนทุกเช้าครับ');
            }
        } else if (perm === 'denied') {
            if (typeof fcAlert === 'function') {
                fcAlert('สิทธิ์การแจ้งเตือนถูกปฏิเสธ หากต้องการเปิด กรุณากดรูปแม่กุญแจ 🔒 ที่แถบ URL ของเบราว์เซอร์เพื่ออนุญาตการแจ้งเตือนครับ');
            }
        }
    } catch (e) {
        console.warn('Notification permission error:', e);
    }
}

async function initFcmPushMessaging() {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    try {
        if (typeof firebase !== 'undefined' && firebase.messaging && firebase.messaging.isSupported()) {
            if (!fbMessaging) {
                fbMessaging = firebase.messaging();
            }

            // Register service worker and get token
            const reg = await navigator.serviceWorker.ready;
            const token = await fbMessaging.getToken({
                serviceWorkerRegistration: reg
            }).catch(err => {
                console.log('[FCM] Token retrieve info:', err.message);
                return null;
            });

            if (token) {
                D.cfg.fcmToken = token;
                save();
                await saveFcmTokenToCloud(token);
            }

            // Listen for foreground messages
            fbMessaging.onMessage(payload => {
                console.log('[FCM] Foreground message received:', payload);
                const title = payload.notification?.title || 'FitCoach';
                const body = payload.notification?.body || '';
                const action = payload.data?.action || 'weigh';
                if (typeof fcConfirm === 'function') {
                    fcConfirm(`${body}\n\nต้องการเปิดหน้าบันทึกทันทีใช่หรือไม่?`, title).then(ok => {
                        if (ok) handleNotificationDeepLink(action);
                    });
                }
            });
        }
    } catch (err) {
        console.warn('[FCM] Init error:', err);
    }
}

async function saveFcmTokenToCloud(token) {
    if (!token) return;
    if (!currentUser || !fbDb) return;

    try {
        await fbDb.collection('users').doc(currentUser.uid).set({
            fcmToken: token,
            fcmUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            reminders: {
                weight: D.cfg.weightReminder !== false,
                measure: D.cfg.measureReminder !== false
            }
        }, { merge: true });
        console.log('[FCM] Token synced to Firestore for user:', currentUser.uid);
    } catch (e) {
        console.warn('[FCM] Cloud token sync warning:', e);
    }
}

async function sendTestNotificationNow() {
    if (!('Notification' in window)) {
        if (typeof fcAlert === 'function') fcAlert('อุปกรณ์นี้ไม่รองรับการแจ้งเตือน');
        return;
    }

    if (Notification.permission !== 'granted') {
        const ok = await fcConfirm('ต้องเปิดรับสิทธิ์การแจ้งเตือนก่อนส่งทดสอบ ต้องการเปิดสิทธิ์ทันทีใช่หรือไม่?', '🔔 ขอสิทธิ์การแจ้งเตือน');
        if (ok) await requestPushNotificationPermission();
        if (Notification.permission !== 'granted') return;
    }

    try {
        const reg = await navigator.serviceWorker.ready;
        const isSunday = (new Date().getDay() === 0);
        const testTitle = isSunday ? '📏 รอบวัดสัดส่วนประจำสัปดาห์ (ทดสอบ)' : '🌅 ได้เวลาชั่งน้ำหนักยามเช้า (ทดสอบ)';
        const testBody = isSunday 
            ? 'เช้าวันอาทิตย์: แตะเพื่อเปิดสายวัดสัดส่วนรอบเอว รอบอก รอบสะโพกทันที'
            : 'ชั่งน้ำหนักหลังตื่นนอนและปัสสาวะ เพื่อผลลัพธ์ที่แม่นยำที่สุด แตะเพื่อบันทึกทันที';
        const testAction = isSunday ? 'measure' : 'weigh';

        await reg.showNotification(testTitle, {
            body: testBody,
            icon: './icon.svg',
            badge: './icon.svg',
            vibrate: [100, 50, 100],
            data: {
                action: testAction,
                url: `./index.html?action=${testAction}`
            },
            actions: [
                { action: 'open', title: '✍️ บันทึกทันที' },
                { action: 'snooze', title: '⏰ เลื่อน 15 นาที' }
            ]
        });

        if (typeof msg === 'function') msg('✓ ส่งการแจ้งเตือนทดสอบเข้ามือถือเรียบร้อยแล้ว');
    } catch (err) {
        console.warn('Test notification error:', err);
        // Fallback for environments without ServiceWorker showNotification
        new Notification('🌅 ได้เวลาชั่งน้ำหนักยามเช้า (FitCoach)', {
            body: 'ระบบแจ้งเตือนทำงานได้สมบูรณ์แบบบนอุปกรณ์ของคุณ!',
            icon: './icon.svg'
        });
    }
}

/* Deep Linking Handler */
function handleNotificationDeepLink(action) {
    if (!action) return;
    console.log('[DeepLink] Handling notification action:', action);

    if (action === 'weigh') {
        if (typeof go === 'function') go('stat');
        if (typeof switchBodySubTab === 'function') switchBodySubTab('weight');
        if (typeof openMorningWeighInModal === 'function') {
            setTimeout(() => openMorningWeighInModal(), 300);
        }
    } else if (action === 'measure') {
        if (typeof go === 'function') go('stat');
        if (typeof switchBodySubTab === 'function') switchBodySubTab('body');
        if (typeof openMeasureTapeModal === 'function') {
            setTimeout(() => openMeasureTapeModal(), 300);
        }
    }
}

// Global Message Listener from Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', event => {
        if (event.data && event.data.type === 'TRIGGER_DEEP_LINK') {
            handleNotificationDeepLink(event.data.action);
        }
    });
}

// Initial Deep Link Check on Startup
window.addEventListener('DOMContentLoaded', () => {
    try {
        const params = new URLSearchParams(window.location.search);
        const actionParam = params.get('action');
        if (actionParam) {
            setTimeout(() => handleNotificationDeepLink(actionParam), 400);
        }
    } catch (e) {}
});

/* ============================================================================
   GOOGLE FIT REST API — GARMIN & ZEPP LIFE AUTO-SYNC ENGINE (v3.5.0)
   ============================================================================ */
const GOOGLE_FIT_SCOPES = [
    'https://www.googleapis.com/auth/fitness.activity.read',
    'https://www.googleapis.com/auth/fitness.body.read',
    'https://www.googleapis.com/auth/fitness.heart_rate.read'
];

function isGoogleFitConnected() {
    return !!(D.cfg && D.cfg.googleFit && D.cfg.googleFit.connected);
}

function renderWearablesSyncUI() {
    const card = document.getElementById('wearablesSyncCard');
    if (!card) return;

    if (!D.cfg) D.cfg = {};
    if (!D.cfg.googleFit) {
        D.cfg.googleFit = { connected: false, lastSync: null, steps: 0, weight: 0, bf: 0, rhr: 0, cardio: 0 };
    }
    const gf = D.cfg.googleFit;
    const isConn = isGoogleFitConnected();

    let lastSyncTxt = 'ยังไม่เคยซิงก์';
    if (gf.lastSync) {
        const d = new Date(gf.lastSync);
        lastSyncTxt = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')} น.`;
    }

    const tc = (typeof todayCheck === 'function') ? todayCheck() : null;
    const curSteps = tc?.steps || gf.steps || 0;
    const curWeight = tc?.w || gf.weight || (D.checks && D.checks.length > 0 ? D.checks[D.checks.length - 1].w : 78.0);
    const curBf = tc?.bf || gf.bf || 25.0;
    const curRhr = tc?.hrv || gf.rhr || 48;
    const curCardio = gf.cardio || (typeof getMorningCardioMinutesToday === 'function' ? getMorningCardioMinutesToday() : 0);

    card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <div style="display:flex; align-items:center; gap:8px;">
                <span style="font-size:20px;">⌚</span>
                <h3 style="margin:0; font-size:16px; font-weight:800; color:var(--tx);">อุปกรณ์สุขภาพ & เครื่องชั่ง</h3>
            </div>
            <span style="font-size:11px; font-weight:800; padding:3px 10px; border-radius:99px; ${isConn ? 'background:#d1fae5; color:#047857;' : 'background:#f1f5f9; color:#64748b;'}">
                ${isConn ? '🟢 เชื่อมต่อแล้ว ✓' : '⚪ ยังไม่เชื่อมต่อ'}
            </span>
        </div>
        <div style="font-size:12px; color:var(--dim); line-height:1.4; margin-bottom:12px;">
            ดึงก้าวเดิน & คาร์ดิโอจาก <b>Garmin</b> และน้ำหนักตัว & %ไขมันจาก <b>Zepp Life</b> ผ่าน Google Fit REST API
        </div>

        <!-- Devices Status Bento Grid -->
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:14px;">
            <!-- Garmin Box -->
            <div style="background:var(--card); border:1px solid var(--line); border-radius:12px; padding:10px 12px;">
                <div style="display:flex; align-items:center; gap:5px; margin-bottom:6px;">
                    <span style="font-size:14px;">🏃</span>
                    <span style="font-size:12px; font-weight:800; color:var(--tx);">Garmin Connect</span>
                </div>
                <div style="font-size:11px; color:var(--dim);">
                    ก้าวเดิน: <b style="color:#00c070; font-size:13px;">${Number(curSteps).toLocaleString()}</b> ก้าว
                </div>
                <div style="font-size:11px; color:var(--dim); margin-top:2px;">
                    คาร์ดิโอ: <b style="color:var(--tx);">${curCardio} นาที</b>
                </div>
                <div style="font-size:11px; color:var(--dim); margin-top:2px;">
                    RHR: <b style="color:#38bdf8;">${curRhr} bpm</b>
                </div>
            </div>

            <!-- Zepp Life Box -->
            <div style="background:var(--card); border:1px solid var(--line); border-radius:12px; padding:10px 12px;">
                <div style="display:flex; align-items:center; gap:5px; margin-bottom:6px;">
                    <span style="font-size:14px;">⚖️</span>
                    <span style="font-size:12px; font-weight:800; color:var(--tx);">Zepp Life Scale</span>
                </div>
                <div style="font-size:11px; color:var(--dim);">
                    น้ำหนัก: <b style="color:#00c070; font-size:13px;">${(+curWeight).toFixed(1)}</b> กก.
                </div>
                <div style="font-size:11px; color:var(--dim); margin-top:2px;">
                    ไขมัน: <b style="color:var(--tx);">${curBf}%</b>
                </div>
                <div style="font-size:10px; color:#10b981; font-weight:700; margin-top:4px;">
                    ✓ Xiaomi Scale Sync
                </div>
            </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; font-size:11px; color:var(--dim); margin-bottom:10px;">
            <span>ซิงก์ล่าสุด: <b>${lastSyncTxt}</b></span>
            <span>Google Fit REST API v1</span>
        </div>

        <div style="display:flex; gap:8px;">
            ${isConn ? `
                <button type="button" class="btn sm" onclick="syncGoogleFitData(false)" style="flex:1; background:#00c070; color:#fff; font-weight:800; border-radius:8px; padding:9px; border:none; display:flex; align-items:center; justify-content:center; gap:6px;">
                    <span>🔄 ซิงก์ Garmin & Zepp เดี๋ยวนี้</span>
                </button>
                <button type="button" class="btn sm g" onclick="disconnectGoogleFit()" style="font-size:11px; padding:9px 12px; border-radius:8px;">
                    ตัดการเชื่อมต่อ
                </button>
            ` : `
                <button type="button" class="btn sm" onclick="connectGoogleFit()" style="flex:1; background:#00c070; color:#fff; font-weight:800; border-radius:8px; padding:10px; border:none; display:flex; align-items:center; justify-content:center; gap:6px;">
                    <span>🔗 เชื่อมต่อ Google Fit (Garmin & Zepp)</span>
                </button>
            `}
        </div>
    `;
}

async function connectGoogleFit() {
    if (!fbAuth) {
        if (typeof fcAlert === 'function') fcAlert('Firebase Authentication ยังไม่พร้อมทำงาน');
        return;
    }

    const provider = new firebase.auth.GoogleAuthProvider();
    GOOGLE_FIT_SCOPES.forEach(s => provider.addScope(s));

    try {
        if (typeof msg === 'function') msg('กำลังขอสิทธิ์เข้าถึง Google Fit (Garmin & Zepp Life)...');
        const result = await fbAuth.signInWithPopup(provider);
        const credential = result.credential;
        const accessToken = credential?.accessToken;

        if (!D.cfg) D.cfg = {};
        if (!D.cfg.googleFit) D.cfg.googleFit = {};

        D.cfg.googleFit.connected = true;
        if (accessToken) {
            D.cfg.googleFit.token = accessToken;
            sessionStorage.setItem('google_fit_token', accessToken);
        }

        save();
        render();
        renderWearablesSyncUI();

        // Perform first sync immediately
        await syncGoogleFitData(false);

        if (typeof fcAlert === 'function') {
            fcAlert('✓ เชื่อมต่อ Google Fit สำเร็จ! ระบบจะดึงก้าวเดินจาก Garmin และน้ำหนักจาก Zepp Life อัตโนมัติครับ');
        }
    } catch (err) {
        console.error('Google Fit connect error:', err);
        if (typeof fcAlert === 'function') {
            fcAlert(`เชื่อมต่อไม่สำเร็จ: ${err.message || 'กรุณาลองใหม่อีกครั้ง'}`);
        }
    }
}

async function disconnectGoogleFit() {
    const ok = await fcConfirm('ต้องการตัดการเชื่อมต่อกับ Google Fit ใช่หรือไม่?\n(ข้อมูลที่เคยบันทึกไว้ในแอปจะไม่ถูกลบ)', 'ตัดการเชื่อมต่อ');
    if (!ok) return;

    if (D.cfg && D.cfg.googleFit) {
        D.cfg.googleFit.connected = false;
        D.cfg.googleFit.token = null;
    }
    sessionStorage.removeItem('google_fit_token');
    save();
    render();
    renderWearablesSyncUI();
    if (typeof fcAlert === 'function') fcAlert('ตัดการเชื่อมต่อเรียบร้อยแล้ว');
}

async function syncGoogleFitData(silent = false) {
    if (!isGoogleFitConnected()) return;

    const token = D.cfg?.googleFit?.token || sessionStorage.getItem('google_fit_token');
    if (!token && !silent) {
        // Prompt re-auth if token expired
        const ok = await fcConfirm('โทเคน Google Fit หมดอายุ ต้องการเข้าสู่ระบบเพื่อต่ออายุการซิงก์ใช่หรือไม่?', '🔄 ต่ออายุโทเคน Google Fit');
        if (ok) await connectGoogleFit();
        return;
    }

    if (!silent && typeof msg === 'function') msg('กำลังดึงข้อมูลสดจาก Garmin & Zepp Life ผ่าน Google Fit...');

    // Calculate today's time range in milliseconds
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).getTime();
    const endOfDay = now.getTime();

    const requestBody = {
        aggregateBy: [
            { dataTypeName: 'com.google.step_count.delta' },
            { dataTypeName: 'com.google.weight' },
            { dataTypeName: 'com.google.body.fat.percentage' },
            { dataTypeName: 'com.google.heart_rate.bpm' },
            { dataTypeName: 'com.google.active_minutes' }
        ],
        bucketByTime: { durationMillis: 86400000 },
        startTimeMillis: startOfDay,
        endTimeMillis: endOfDay
    };

    try {
        const resp = await fetch('https://fitness.googleapis.com/fitness/v1/users/me/dataset:aggregate', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!resp.ok) {
            console.warn('[GoogleFit] API response not ok:', resp.status);
            if (resp.status === 401 && !silent) {
                sessionStorage.removeItem('google_fit_token');
                const ok = await fcConfirm('เซสชัน Google Fit หมดอายุ ต้องการเชื่อมต่อใหม่ใช่หรือไม่?', '🔑 สิทธิ์หมดอายุ');
                if (ok) await connectGoogleFit();
            }
            return;
        }

        const data = await resp.json();
        const buckets = data.bucket || [];

        let fetchedSteps = 0;
        let fetchedWeight = null;
        let fetchedBf = null;
        let fetchedRhr = null;
        let fetchedCardio = 0;

        buckets.forEach(b => {
            (b.dataset || []).forEach(ds => {
                const streamId = ds.dataSourceId || '';
                (ds.point || []).forEach(pt => {
                    const vals = pt.value || [];
                    if (streamId.includes('step_count')) {
                        fetchedSteps += (vals[0]?.intVal || 0);
                    } else if (streamId.includes('weight')) {
                        fetchedWeight = vals[0]?.fpVal != null ? vals[0].fpVal : fetchedWeight;
                    } else if (streamId.includes('body.fat')) {
                        fetchedBf = vals[0]?.fpVal != null ? vals[0].fpVal : fetchedBf;
                    } else if (streamId.includes('heart_rate')) {
                        fetchedRhr = vals[0]?.fpVal != null ? Math.round(vals[0].fpVal) : fetchedRhr;
                    } else if (streamId.includes('active_minutes')) {
                        fetchedCardio += (vals[0]?.intVal || 0);
                    }
                });
            });
        });

        // Apply to Today Check Record
        const todayStr = iso();
        let rec = D.checks.find(x => x.d === todayStr);
        if (!rec) {
            const prev = D.checks[D.checks.length - 1];
            rec = {
                d: todayStr,
                w: fetchedWeight != null ? Math.round(fetchedWeight * 10) / 10 : (prev?.w || 78.0),
                bf: fetchedBf != null ? Math.round(fetchedBf * 10) / 10 : (prev?.bf || null),
                muscle: prev?.muscle || null,
                steps: fetchedSteps > 0 ? fetchedSteps : (D.cfg?.stepTarget || 8000),
                hrv: fetchedRhr || (prev?.hrv || 73),
                pain: null, cal: 0, protein: 0, carbs: 0, fat: 0, water: 0, meals: []
            };
            D.checks.push(rec);
        } else {
            if (fetchedSteps > 0) rec.steps = fetchedSteps;
            if (fetchedWeight != null) rec.w = Math.round(fetchedWeight * 10) / 10;
            if (fetchedBf != null) rec.bf = Math.round(fetchedBf * 10) / 10;
            if (fetchedRhr != null) rec.hrv = fetchedRhr;
        }

        // Update Google Fit Cache
        D.cfg.googleFit.lastSync = Date.now();
        if (fetchedSteps > 0) D.cfg.googleFit.steps = fetchedSteps;
        if (fetchedWeight != null) D.cfg.googleFit.weight = Math.round(fetchedWeight * 10) / 10;
        if (fetchedBf != null) D.cfg.googleFit.bf = Math.round(fetchedBf * 10) / 10;
        if (fetchedRhr != null) D.cfg.googleFit.rhr = fetchedRhr;
        if (fetchedCardio > 0) D.cfg.googleFit.cardio = fetchedCardio;

        save();
        render();
        renderWearablesSyncUI();
        if (typeof pushToCloud === 'function') pushToCloud();

        if (!silent) {
            const summaryParts = [];
            if (fetchedSteps > 0) summaryParts.push(`🏃 ${fetchedSteps.toLocaleString()} ก้าว (Garmin)`);
            if (fetchedWeight != null) summaryParts.push(`⚖️ ${rec.w} กก. (Zepp Life)`);
            if (fetchedBf != null) summaryParts.push(`🧬 ไขมัน ${rec.bf}%`);
            if (fetchedRhr != null) summaryParts.push(`💓 RHR ${rec.hrv} bpm`);

            const msgText = summaryParts.length > 0 
                ? `✓ ซิงก์สำเร็จ!\n\n${summaryParts.join('\n')}` 
                : '✓ ตรวจสอบข้อมูลล่าสุดเรียบร้อยแล้ว';
            if (typeof fcAlert === 'function') fcAlert(msgText);
        }
    } catch (err) {
        console.warn('[GoogleFit] Sync error:', err);
        if (!silent && typeof fcAlert === 'function') {
            fcAlert('ไม่สามารถดึงข้อมูลได้ในขณะนี้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต');
        }
    }
}
