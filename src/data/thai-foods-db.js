/* FitCoach v3.0 — Thai Food Database, Satiety Engine & AI Meal Suggester */
/* ============ THAI FOOD & MACRONUTRIENT DATABASE ============ */
const TF_MACROS = [
    /* --- เครื่องดื่มโปรตีน & RTD ยอดนิยม (Ready-to-Drink High Protein) --- */
    { id: 'tf_meiji_high_pro', cat: 'protein', name: 'นมโปรตีน Meiji High Protein (ช็อกโกแลต)', portion: '1 ขวด (350ml)', cal: 170, pro: 28, carbs: 9, fat: 2, sugar: 4, sodium: 150 },
    { id: 'tf_meiji_high_pro_vanilla', cat: 'protein', name: 'นมโปรตีน Meiji High Protein (วานิลลา)', portion: '1 ขวด (350ml)', cal: 170, pro: 28, carbs: 9, fat: 2, sugar: 4, sodium: 150 },
    { id: 'tf_hoppe_high_pro', cat: 'protein', name: 'นมโปรตีน Hoppe High Protein', portion: '1 ขวด (~350ml)', cal: 180, pro: 30, carbs: 6, fat: 2, sugar: 3, sodium: 130 },
    { id: 'tf_tofusan_high_pro', cat: 'protein', name: 'นมถั่วเหลือง Tofusan High Protein (ไม่ใส่น้ำตาล)', portion: '1 ขวด (350ml)', cal: 160, pro: 28, carbs: 5, fat: 3, sugar: 0, sodium: 110 },
    { id: 'tf_dutchmill_high_pro', cat: 'protein', name: 'นม Dutch Mill High Protein Whey', portion: '1 ขวด (350ml)', cal: 170, pro: 28, carbs: 8, fat: 2, sugar: 5, sodium: 140 },
    { id: 'tf_7eleven_chicken', cat: 'protein', name: 'อกไก่นุ่ม 7-Eleven (ปรุงสุก)', portion: '1 ซอง (~90g)', cal: 120, pro: 22, carbs: 1, fat: 2, sugar: 0, sodium: 390 },
    { id: 'tf_cp_egg_boiled_2', cat: 'protein', name: 'ไข่ต้ม CP (2 ฟอง)', portion: '2 ฟอง (~100g)', cal: 150, pro: 13, carbs: 1, fat: 10, sugar: 0.6, sodium: 140 },
    /* --- อาหารเหนือยอดนิยม (Northern Thai Specialties) --- */
    { id: 'tf_khao_soi_chicken', cat: 'north', name: 'ข้าวซอยไก่ (น่องไก่ + เส้น)', portion: '1 ชาม (~400g)', cal: 540, pro: 26, carbs: 52, fat: 25, sugar: 6, sodium: 1250 },
    { id: 'tf_khao_soi_beef', cat: 'north', name: 'ข้าวซอยเนื้อน่องลาย', portion: '1 ชาม (~400g)', cal: 580, pro: 28, carbs: 52, fat: 28, sugar: 6, sodium: 1320 },
    { id: 'tf_khanom_jeen_nam_ngiao', cat: 'north', name: 'ขนมจีนน้ำเงี้ยว (กระดูกหมู+เลือด)', portion: '1 ชาม (~400g)', cal: 360, pro: 20, carbs: 44, fat: 12, sugar: 4, sodium: 1150 },
    { id: 'tf_nam_prik_num', cat: 'north', name: 'น้ำพริกหนุ่ม + ผักสด/ผักลวก', portion: '1 ถ้วยเล็ก (~50g)', cal: 35, pro: 1.5, carbs: 6, fat: 0.5, sugar: 2, sodium: 420 },
    { id: 'tf_nam_prik_ong', cat: 'north', name: 'น้ำพริกอ่อง (หมูสับมะเขือส้ม)', portion: '1 ถ้วย (~100g)', cal: 160, pro: 11, carbs: 8, fat: 9.5, sugar: 5, sodium: 580 },
    { id: 'tf_gaeng_hung_lay', cat: 'north', name: 'แกงฮังเลหมู', portion: '1 ถ้วย (~150g)', cal: 390, pro: 18, carbs: 10, fat: 31, sugar: 8, sodium: 890 },
    { id: 'tf_sai_oua', cat: 'north', name: 'ไส้อั่วสมุนไพรย่าง (100g)', portion: '1 เส้น (~100g)', cal: 280, pro: 15, carbs: 3, fat: 23, sugar: 2, sodium: 720 },
    { id: 'tf_larb_kua_pork', cat: 'north', name: 'ลาบคั่วหมูเมืองเหนือ (มะแขว่น)', portion: '1 จาน (~120g)', cal: 220, pro: 24, carbs: 4, fat: 12, sugar: 1.5, sodium: 620 },
    { id: 'tf_larb_kua_chicken', cat: 'north', name: 'ลาบคั่วอกไก่เมืองเหนือ (คลีน)', portion: '1 จาน (~120g)', cal: 170, pro: 28, carbs: 3, fat: 5, sugar: 1, sodium: 580 },
    { id: 'tf_gaeng_khae_chicken', cat: 'north', name: 'แกงแคไก่ (แกงผักพื้นบ้าน ไม่กะทิ)', portion: '1 ชาม (~250g)', cal: 160, pro: 18, carbs: 8, fat: 6, sugar: 3, sodium: 680 },
    { id: 'tf_gaeng_ho', cat: 'north', name: 'แกงโฮะคั่วใส่วุ้นเส้น', portion: '1 จาน (~200g)', cal: 310, pro: 12, carbs: 32, fat: 14, sugar: 4, sodium: 850 },
    { id: 'tf_gaeng_om_northern', cat: 'north', name: 'แกงอ่อมหมู/ไก่เมืองเหนือ (ไม่กะทิ)', portion: '1 ถ้วย (~200g)', cal: 210, pro: 22, carbs: 5, fat: 11, sugar: 2, sodium: 740 },
    { id: 'tf_gaeng_phak_wan', cat: 'north', name: 'แกงผักหวานป่าใส่ไข่มดแดง/ปลาแห้ง', portion: '1 ถ้วย (~200g)', cal: 130, pro: 14, carbs: 8, fat: 4, sugar: 3, sodium: 590 },
    { id: 'tf_tam_khanun', cat: 'north', name: 'ตำขนุนอ่อน (ตำบ่าหนุน)', portion: '1 จาน (~120g)', cal: 180, pro: 5, carbs: 18, fat: 10, sugar: 3, sodium: 620 },
    { id: 'tf_jin_som_mok_khai', cat: 'north', name: 'จิ้นส้มหมกไข่ (แหนมหมูย่างใบตอง)', portion: '1 ห่อ (~100g)', cal: 190, pro: 16, carbs: 3, fat: 12.5, sugar: 1, sodium: 650 },
    { id: 'tf_jin_neung_nam_prik_kha', cat: 'north', name: 'จิ้นนึ่งสมุนไพร + น้ำพริกข่า (เนื้อนึ่ง)', portion: '1 ชุด (~120g)', cal: 180, pro: 28, carbs: 2, fat: 6.5, sugar: 1, sodium: 540 },
    { id: 'tf_khaep_mu_lean', cat: 'north', name: 'แคบหมูไร้มัน (โปรตีนสูง)', portion: '1 ถุงเล็ก (~30g)', cal: 150, pro: 19, carbs: 0, fat: 8, sugar: 0, sodium: 320 },
    { id: 'tf_khaep_mu_fat', cat: 'north', name: 'แคบหมูติดมันโบราณ', portion: '1 ถุงเล็ก (~30g)', cal: 195, pro: 14, carbs: 0, fat: 15, sugar: 0, sodium: 450 },
    { id: 'tf_khao_kan_jin', cat: 'north', name: 'ข้าวกั้นจิ๊น (ข้าวเงี้ยว)', portion: '1 ห่อ (~120g)', cal: 260, pro: 12, carbs: 36, fat: 7, sugar: 2, sodium: 580 },
    { id: 'tf_gaeng_het_thob', cat: 'north', name: 'แกงเห็ดถอบ / เห็ดเผาะยอดชะอม', portion: '1 ถ้วย (~200g)', cal: 120, pro: 6, carbs: 14, fat: 4, sugar: 2, sodium: 520 },

    /* --- เมนูโปรตีนสูง & อาหารคลีน (High Protein & Clean) --- */
    { id: 'tf_chicken_breast', cat: 'clean', name: 'อกไก่ต้ม/นึ่ง (100g)', portion: '100 กรัม', cal: 165, pro: 31, carbs: 0, fat: 3.6, sugar: 0, sodium: 75 },
    { id: 'tf_chicken_grill', cat: 'clean', name: 'อกไก่ย่างไร้น้ำมัน (100g)', portion: '100 กรัม', cal: 175, pro: 32, carbs: 1, fat: 4, sugar: 0, sodium: 220 },
    { id: 'tf_egg_boiled', cat: 'clean', name: 'ไข่ต้ม (1 ฟอง)', portion: '1 ฟอง (~50g)', cal: 75, pro: 6.5, carbs: 0.6, fat: 5, sugar: 0.3, sodium: 70 },
    { id: 'tf_egg_white', cat: 'clean', name: 'ไข่ขาวต้ม (1 ฟอง)', portion: '1 ฟอง (~33g)', cal: 17, pro: 3.6, carbs: 0.2, fat: 0.1, sugar: 0.2, sodium: 55 },
    { id: 'tf_whey', cat: 'clean', name: 'เวย์โปรตีน (1 สกู๊ป)', portion: '1 สกู๊ป (~30g)', cal: 120, pro: 24, carbs: 2, fat: 1.5, sugar: 1.5, sodium: 140 },
    { id: 'tf_salmon_grill', cat: 'clean', name: 'แซลมอนย่างเกลือ (150g)', portion: '150 กรัม', cal: 310, pro: 34, carbs: 0, fat: 18, sugar: 0, sodium: 95 },
    { id: 'tf_tuna_water', cat: 'clean', name: 'ทูน่าในน้ำแร่ (1 กระป๋อง)', portion: '1 กระป๋อง (~130g)', cal: 120, pro: 28, carbs: 0, fat: 1, sugar: 0, sodium: 280 },
    { id: 'tf_tofu_firm', cat: 'clean', name: 'เต้าหู้ขาวแข็ง (100g)', portion: '100 กรัม', cal: 85, pro: 9, carbs: 2, fat: 5, sugar: 0.5, sodium: 15 },
    { id: 'tf_soy_milk_unsweet', cat: 'clean', name: 'นมถั่วเหลือง ไม่หวาน (250ml)', portion: '1 กล่อง (~250ml)', cal: 100, pro: 8, carbs: 5, fat: 5, sugar: 1, sodium: 90 },
    { id: 'tf_milk_skim', cat: 'clean', name: 'นมขาดมันเนย 0% (200ml)', portion: '1 แก้ว (~200ml)', cal: 70, pro: 7, carbs: 10, fat: 0.2, sugar: 10, sodium: 105 },
    { id: 'tf_greek_yogurt', cat: 'clean', name: 'กรีกโยเกิร์ตแท้ ไม่หวาน (150g)', portion: '1 ถ้วย (~150g)', cal: 95, pro: 15, carbs: 4, fat: 1.5, sugar: 4, sodium: 65 },
    { id: 'tf_kaprao_chicken_clean', cat: 'clean', name: 'กะเพราอกไก่คลีน (ไม่ใส่น้ำมัน)', portion: '1 จาน (เฉพาะกับ)', cal: 210, pro: 32, carbs: 4, fat: 7, sugar: 1.5, sodium: 480 },
    { id: 'tf_sukiyaki_chicken', cat: 'clean', name: 'สุกี้น้ำอกไก่ (ผักเยอะ)', portion: '1 ชาม', cal: 280, pro: 26, carbs: 28, fat: 6, sugar: 5, sodium: 680 },
    { id: 'tf_tom_yum_goong', cat: 'clean', name: 'ต้มยำกุ้งน้ำใส', portion: '1 ถ้วย (กุ้ง 4 ตัว)', cal: 120, pro: 18, carbs: 5, fat: 2.5, sugar: 2.5, sodium: 780 },
    { id: 'tf_avocado', cat: 'clean', name: 'อะโวคาโด (ครึ่งลูก ~75g)', portion: 'ครึ่งลูก', cal: 120, pro: 1.5, carbs: 6, fat: 11, sugar: 0.5, sodium: 5 },
    { id: 'tf_almonds', cat: 'clean', name: 'อัลมอนด์อบ (1 กำมือ ~30g)', portion: '1 กำมือ (~30g)', cal: 170, pro: 6, carbs: 6, fat: 15, sugar: 1.2, sodium: 1 },
    { id: 'tf_banana', cat: 'clean', name: 'กล้วยหอม (1 ลูกกลาง)', portion: '1 ลูก (~110g)', cal: 95, pro: 1.2, carbs: 24, fat: 0.3, sugar: 14, sodium: 1 },
    { id: 'tf_apple', cat: 'clean', name: 'แอปเปิ้ล (1 ผลกลาง)', portion: '1 ผล (~150g)', cal: 80, pro: 0.4, carbs: 20, fat: 0.2, sugar: 15, sodium: 2 },
    { id: 'tf_sweet_potato', cat: 'clean', name: 'มันเทศ/มันหวานนึ่ง (100g)', portion: '100 กรัม', cal: 90, pro: 1.6, carbs: 21, fat: 0.1, sugar: 6, sodium: 55 },
    { id: 'tf_americano', cat: 'clean', name: 'อเมริกาโน่เย็น ไม่หวาน', portion: '1 แก้ว', cal: 10, pro: 0.5, carbs: 1, fat: 0.1, sugar: 0, sodium: 5 },

    /* --- อาหารจานเดียว & สตรีทฟู้ดยอดนิยม (Single Dishes & Street Food) --- */
    { id: 'tf_rice_jasmine', cat: 'dish', name: 'ข้าวสวยหอมมะลิ (1 ทัพพี)', portion: '1 ทัพพี (~80g)', cal: 110, pro: 2.2, carbs: 24, fat: 0.3, sugar: 0.1, sodium: 1 },
    { id: 'tf_rice_berry', cat: 'dish', name: 'ข้าวไรซ์เบอร์รี่/กล้อง (1 ทัพพี)', portion: '1 ทัพพี (~80g)', cal: 100, pro: 2.5, carbs: 22, fat: 0.5, sugar: 0.2, sodium: 2 },
    { id: 'tf_sticky_rice', cat: 'dish', name: 'ข้าวเหนียวนึ่ง (1 ห่อเล็ก)', portion: '1 ห่อ (~80g)', cal: 180, pro: 3.2, carbs: 40, fat: 0.5, sugar: 0.1, sodium: 1 },
    { id: 'tf_egg_fried', cat: 'dish', name: 'ไข่ดาว (1 ฟอง)', portion: '1 ฟอง', cal: 120, pro: 6.5, carbs: 0.8, fat: 10, sugar: 0.4, sodium: 150 },
    { id: 'tf_egg_omelet', cat: 'dish', name: 'ไข่เจียว (2 ฟอง)', portion: '1 จาน (ไข่ 2 ฟอง)', cal: 240, pro: 13, carbs: 2, fat: 20, sugar: 0.8, sodium: 320 },
    { id: 'tf_kaprao_chicken_street', cat: 'dish', name: 'ข้าวกะเพราไก่สตรีทฟู้ด + ไข่ดาว', portion: '1 จานปกติ', cal: 620, pro: 28, carbs: 68, fat: 26, sugar: 4, sodium: 1100 },
    { id: 'tf_kaprao_pork', cat: 'dish', name: 'ข้าวกะเพราหมูสับ + ไข่ดาว', portion: '1 จานปกติ', cal: 680, pro: 24, carbs: 68, fat: 34, sugar: 4, sodium: 1180 },
    { id: 'tf_fried_rice_chicken', cat: 'dish', name: 'ข้าวผัดไก่ (จานเดียว)', portion: '1 จานปกติ', cal: 550, pro: 22, carbs: 70, fat: 20, sugar: 3, sodium: 920 },
    { id: 'tf_chicken_rice', cat: 'dish', name: 'ข้าวมันไก่ต้ม (ไม่เอาหนัง)', portion: '1 จาน', cal: 520, pro: 26, carbs: 65, fat: 18, sugar: 2, sodium: 850 },
    { id: 'tf_chicken_rice_skin', cat: 'dish', name: 'ข้าวมันไก่ต้ม (รวมหนัง)', portion: '1 จาน', cal: 640, pro: 24, carbs: 65, fat: 32, sugar: 2, sodium: 920 },
    { id: 'tf_pork_leg_rice', cat: 'dish', name: 'ข้าวขาหมู (เนื้อล้วน ไม่หนัง)', portion: '1 จาน', cal: 480, pro: 28, carbs: 60, fat: 14, sugar: 5, sodium: 1050 },
    { id: 'tf_sukiyaki_dry', cat: 'dish', name: 'สุกี้แห้งอกไก่', portion: '1 จาน', cal: 360, pro: 25, carbs: 32, fat: 14, sugar: 6, sodium: 880 },
    { id: 'tf_noodle_soup_chicken', cat: 'dish', name: 'ก๋วยเตี๋ยวน้ำใสไก่ฉีก', portion: '1 ชาม', cal: 320, pro: 20, carbs: 45, fat: 6, sugar: 3, sodium: 980 }
];

const MEAL_LABELS = {
    breakfast: '🌅 มื้อเช้า',
    lunch: '☀️ มื้อเที่ยง',
    dinner: '🌙 มื้อเย็น',
    snack: '🍎 ของว่าง'
};

function recalculateDailyNutrition(dateKey) {
    const dStr = dateKey || iso();
    let rec = D.checks.find(x => x.d === dStr);
    if (!rec) return;
    if (rec.meals && rec.meals.length > 0) {
        let totalCal = 0, totalPro = 0, totalCarbs = 0, totalFat = 0, totalSugar = 0, totalSodium = 0;
        rec.meals.forEach(m => {
            totalCal += Number(m.cal) || 0;
            totalPro += Number(m.pro) || 0;
            totalCarbs += Number(m.carbs) || 0;
            totalFat += Number(m.fat) || 0;
            totalSugar += Number(m.sugar) || 0;
            totalSodium += Number(m.sodium) || 0;
        });
        rec.cal = Math.round(totalCal);
        rec.protein = Math.round(totalPro);
        rec.carbs = Math.round(totalCarbs);
        rec.fat = Math.round(totalFat);
        rec.sugar = Math.round(totalSugar);
        rec.sodium = Math.round(totalSodium);
    }
}

/* ============ FOOD HEALTH & SATIETY METRICS ENGINE (v2.12.0) ============ */
function computeFoodHealthMetrics(cal, pro, carbs, fat, sugar = 0, sodium = 0, fiber = null, aiMeta = null) {
    const c = Number(cal) || 0;
    const p = Number(pro) || 0;
    const cb = Number(carbs) || 0;
    const f = Number(fat) || 0;
    const sg = Number(sugar) || 0;
    const na = Number(sodium) || 0;
    const fb = (fiber != null && fiber !== '' && !isNaN(Number(fiber)))
        ? Number(fiber)
        : (aiMeta && aiMeta.fiber != null && !isNaN(Number(aiMeta.fiber))
            ? Number(aiMeta.fiber)
            : Math.round(Math.max(0, cb * 0.06) * 10) / 10);

    // 1. Health Score (1-10)
    let hScore = aiMeta && Number(aiMeta.healthScore) > 0 ? Math.round(Number(aiMeta.healthScore)) : 0;
    if (!hScore) {
        let rawH = 7.0;
        const proCalRatio = c > 0 ? (p * 4) / c : 0;
        if (proCalRatio >= 0.30) rawH += 2.0;
        else if (proCalRatio >= 0.20) rawH += 1.2;
        else if (proCalRatio >= 0.12) rawH += 0.5;
        else if (c > 120 && proCalRatio < 0.08) rawH -= 1.0;

        if (fb >= 5) rawH += 1.0;
        else if (fb >= 2.5) rawH += 0.5;

        if (sg > 25) rawH -= 2.5;
        else if (sg > 15) rawH -= 1.5;
        else if (sg > 8) rawH -= 0.8;

        if (na > 1200) rawH -= 1.8;
        else if (na > 800) rawH -= 1.0;
        else if (na > 500) rawH -= 0.4;

        const fatCalRatio = c > 0 ? (f * 9) / c : 0;
        if (fatCalRatio > 0.50) rawH -= 1.5;
        else if (fatCalRatio > 0.38) rawH -= 0.7;

        hScore = Math.max(1, Math.min(10, Math.round(rawH)));
    } else {
        hScore = Math.max(1, Math.min(10, hScore));
    }

    // 2. Satiety Score (1-10)
    let sScore = aiMeta && Number(aiMeta.satietyScore) > 0 ? Math.round(Number(aiMeta.satietyScore)) : 0;
    if (!sScore) {
        let rawS = 3.0 + Math.min(4.0, (p / 10) * 1.1) + Math.min(2.0, (fb / 3) * 0.9) + Math.min(1.5, (c / 350) * 0.8) - (sg > 15 ? 1.2 : sg > 8 ? 0.5 : 0);
        sScore = Math.max(1, Math.min(10, Math.round(rawS)));
    } else {
        sScore = Math.max(1, Math.min(10, sScore));
    }

    // 3. Nutri-Grade (A-E)
    const validGrades = ['A', 'B', 'C', 'D', 'E'];
    let grade = (aiMeta && typeof aiMeta.nutriGrade === 'string' && validGrades.includes(aiMeta.nutriGrade.trim().toUpperCase()))
        ? aiMeta.nutriGrade.trim().toUpperCase()
        : (hScore >= 8 ? 'A' : hScore >= 7 ? 'B' : hScore >= 5 ? 'C' : hScore >= 3 ? 'D' : 'E');

    const gradeColors = {
        A: '#10b981',
        B: '#84cc16',
        C: '#eab308',
        D: '#f97316',
        E: '#ef4444'
    };
    const gradeColor = gradeColors[grade] || '#10b981';

    // 4. Coach Tip
    let tip = (aiMeta && aiMeta.coachTip) ? String(aiMeta.coachTip).trim() : '';
    if (!tip) {
        if (na >= 900) {
            tip = 'โซเดียมค่อนข้างสูง แนะนำเลี่ยงการซดน้ำซุปหรือลดน้ำจิ้มลงครึ่งหนึ่งเพื่อลดการบวมน้ำครับ';
        } else if (sg >= 15) {
            tip = 'มีน้ำตาลค่อนข้างสูง แนะนำเดินย่อยหลังมื้ออาหาร 10-15 นาทีเพื่อช่วยดึงน้ำตาลไปใช้เป็นพลังงานครับ';
        } else if (p >= 25 && hScore >= 7) {
            tip = 'โปรตีนสูงและสารอาหารสมดุลมาก! ช่วยรักษามวลกล้ามเนื้อและอยู่ท้องนานในช่วงลดไขมันครับ';
        } else if (p < 12 && c > 250) {
            tip = 'โปรตีนในมื้อนี้ค่อนข้างน้อย แนะนำเสริมไข่ต้ม 1-2 ฟองหรืออกไก่เพื่อให้ถึงเป้าโปรตีนและอิ่มนานขึ้นครับ';
        } else {
            tip = 'สัดส่วนพลังงานกำลังดี แนะนำเคี้ยวช้าๆ และดื่มน้ำเปล่าตาม 1-2 แก้วเพื่อช่วยให้ระบบเผาผลาญทำงานเต็มที่ครับ';
        }
    }

    const ingredients = (aiMeta && Array.isArray(aiMeta.ingredients)) ? aiMeta.ingredients : [];

    return {
        nutriGrade: grade,
        gradeColor,
        healthScore: hScore,
        satietyScore: sScore,
        fiber: Math.round(fb * 10) / 10,
        coachTip: tip,
        ingredients
    };
}

function renderNutriScoreWidgetHtml(metrics) {
    const grades = [
        { g: 'A', c: '#10b981' },
        { g: 'B', c: '#84cc16' },
        { g: 'C', c: '#eab308' },
        { g: 'D', c: '#f97316' },
        { g: 'E', c: '#ef4444' }
    ];
    const gradePills = grades.map(item => {
        const isActive = item.g === metrics.nutriGrade;
        return `<span style="display:inline-flex; align-items:center; justify-content:center; width:${isActive ? '26px' : '20px'}; height:${isActive ? '26px' : '20px'}; border-radius:6px; font-size:${isActive ? '13px' : '10.5px'}; font-weight:900; background:${item.c}; color:#fff; opacity:${isActive ? '1' : '0.32'}; transform:${isActive ? 'scale(1.08)' : 'none'}; box-shadow:${isActive ? '0 2px 6px ' + item.c + '66' : 'none'}; transition:all 0.2s;">${item.g}</span>`;
    }).join('');

    const buildSegBar = (score, activeColor) => {
        let segs = '';
        for (let i = 1; i <= 10; i++) {
            const on = i <= score;
            segs += `<span style="flex:1; height:6px; border-radius:3px; background:${on ? activeColor : 'var(--line)'}; opacity:${on ? '1' : '0.45'};"></span>`;
        }
        return `<div style="display:flex; gap:2.5px; margin-top:4px;">${segs}</div>`;
    };

    const hColor = metrics.healthScore >= 8 ? '#10b981' : metrics.healthScore >= 5 ? '#eab308' : '#ef4444';
    const sColor = metrics.satietyScore >= 8 ? '#3b82f6' : metrics.satietyScore >= 5 ? '#f59e0b' : '#ef4444';

    const ingHtml = (metrics.ingredients && metrics.ingredients.length > 0) ? `
        <div style="margin-top:10px; padding-top:8px; border-top:1px dashed var(--line);">
            <div style="font-size:11px; font-weight:800; color:var(--dim); margin-bottom:5px;">🍲 แยกส่วนประกอบในจาน (ประมาณการ):</div>
            <div id="aiIngBreakdownList" style="display:flex; flex-direction:column; gap:4px;">
                ${metrics.ingredients.map(ing => `
                    <div style="display:flex; justify-content:space-between; align-items:center; font-size:11.5px; background:var(--bg); padding:4px 8px; border-radius:6px; border:1px solid var(--line);">
                        <span style="color:var(--tx); font-weight:600;">• ${ing.name || 'ส่วนประกอบ'}</span>
                        <span class="ai-ing-cal" data-base-cal="${Number(ing.cal) || 0}" style="color:var(--acc); font-weight:800;">${Math.round(Number(ing.cal) || 0)} kcal</span>
                    </div>
                `).join('')}
            </div>
        </div>
    ` : '';

    return `
        <div style="background:var(--card2); border:1px solid var(--line); border-radius:12px; padding:10px 12px; margin-bottom:12px;">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:8px;">
                <div>
                    <div style="font-size:10.5px; font-weight:800; color:var(--dim); text-transform:uppercase; letter-spacing:0.3px;">Nutri-Score คุณภาพอาหาร</div>
                    <div style="display:flex; align-items:center; gap:3px; margin-top:4px;">${gradePills}</div>
                </div>
                <div style="text-align:right;">
                    <span style="display:inline-block; padding:3px 8px; border-radius:8px; font-size:11.5px; font-weight:800; background:${metrics.gradeColor}20; color:${metrics.gradeColor}; border:1px solid ${metrics.gradeColor}55;">
                        เกรด ${metrics.nutriGrade}
                    </span>
                </div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:6px;">
                <div style="background:var(--bg); border:1px solid var(--line); border-radius:8px; padding:7px 9px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; font-size:11px; font-weight:800;">
                        <span style="color:var(--tx);">💚 คะแนนสุขภาพ</span>
                        <span style="color:${hColor};">${metrics.healthScore}/10</span>
                    </div>
                    ${buildSegBar(metrics.healthScore, hColor)}
                </div>
                <div style="background:var(--bg); border:1px solid var(--line); border-radius:8px; padding:7px 9px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; font-size:11px; font-weight:800;">
                        <span style="color:var(--tx);">⭐ ความอิ่มอยู่ท้อง</span>
                        <span style="color:${sColor};">${metrics.satietyScore}/10</span>
                    </div>
                    ${buildSegBar(metrics.satietyScore, sColor)}
                </div>
            </div>

            ${ingHtml}

            <div style="margin-top:10px; background:rgba(249,115,22,0.08); border-left:3px solid var(--acc); border-radius:6px; padding:7px 9px; font-size:11.5px; color:var(--tx); line-height:1.45;">
                <strong style="color:var(--acc);">💡 คำแนะนำโค้ช:</strong> ${metrics.coachTip}
            </div>
        </div>
    `;
}

function addMealToToday(mealType, name, portion, cal, pro, carbs, fat, sugar = 0, sodium = 0, extraMeta = null) {
    const todayStr = iso();
    let rec = todayCheck();
    if (!rec) {
        rec = { d: todayStr, w: null, cal: 0, protein: 0, carbs: 0, fat: 0, sugar: 0, sodium: 0, water: 0, meals: [] };
        D.checks.push(rec);
    }
    if (!rec.meals) rec.meals = [];

    const timeStr = formatThaiTime(new Date());
    const metrics = computeFoodHealthMetrics(cal, pro, carbs, fat, sugar, sodium, extraMeta?.fiber, extraMeta);

    const newMealItem = {
        id: 'm_' + Date.now(),
        type: mealType || 'lunch',
        time: timeStr,
        name: (name || 'อาหาร').trim(),
        portion: (portion || '1 จาน').trim(),
        cal: Math.round(Number(cal) || 0),
        pro: Math.round(Number(pro) || 0),
        carbs: Math.round(Number(carbs) || 0),
        fat: Math.round(Number(fat) || 0),
        sugar: Math.round(Number(sugar) || 0),
        sodium: Math.round(Number(sodium) || 0),
        fiber: metrics.fiber,
        nutriGrade: metrics.nutriGrade,
        healthScore: metrics.healthScore,
        satietyScore: metrics.satietyScore,
        coachTip: metrics.coachTip,
        ingredients: metrics.ingredients
    };

    rec.meals.push(newMealItem);
    recalculateDailyNutrition(todayStr);
    save();
    render();
    if (typeof pushToCloud === 'function') pushToCloud();
    msg('✓ บันทึกมื้ออาหารเรียบร้อย (+ ' + newMealItem.cal + ' kcal • เกรด ' + newMealItem.nutriGrade + ')');
}

/* ============ EDIT / ADJUST LOGGED MEAL PORTION ============ */
async function editMealItem(dateKey, mealIndex) {
    const dStr = dateKey || iso();
    let rec = D.checks.find(x => x.d === dStr);
    if (!rec || !rec.meals || !rec.meals[mealIndex]) return;

    const m = rec.meals[mealIndex];
    const baseCal = m.baseCal || m.cal;
    const basePro = m.basePro || m.pro;
    const baseCarbs = m.baseCarbs || m.carbs;
    const baseFat = m.baseFat || m.fat;
    const baseSugar = m.baseSugar != null ? m.baseSugar : (m.sugar || 0);
    const baseSodium = m.baseSodium != null ? m.baseSodium : (m.sodium || 0);
    const basePortion = m.basePortion || m.portion || '1 จาน';

    window._mealBaseValues = { cal: baseCal, pro: basePro, carbs: baseCarbs, fat: baseFat, sugar: baseSugar, sodium: baseSodium, portion: basePortion };
    window.applyMealPortionPct = function(pct, label) {
        const b = window._mealBaseValues;
        if (!b) return;
        const calInp = document.getElementById('edMealCal');
        const proInp = document.getElementById('edMealPro');
        const carbsInp = document.getElementById('edMealCarbs');
        const fatInp = document.getElementById('edMealFat');
        const sugarInp = document.getElementById('edMealSugar');
        const sodiumInp = document.getElementById('edMealSodium');
        const portionInp = document.getElementById('edMealPortion');
        const lbl = document.getElementById('edMealPortionLabel');

        if (calInp) calInp.value = Math.round(b.cal * pct);
        if (proInp) proInp.value = Math.round(b.pro * pct);
        if (carbsInp) carbsInp.value = Math.round(b.carbs * pct);
        if (fatInp) fatInp.value = Math.round(b.fat * pct);
        if (sugarInp) sugarInp.value = Math.round(b.sugar * pct);
        if (sodiumInp) sodiumInp.value = Math.round(b.sodium * pct);
        if (lbl) lbl.textContent = label;
        if (portionInp) {
            portionInp.value = pct === 1.0 ? b.portion : `${b.portion} (${label})`;
        }
    };

    const mealMetrics = computeFoodHealthMetrics(m.cal, m.pro, m.carbs, m.fat, m.sugar, m.sodium, m.fiber, m);
    const html = `
        <div style="text-align:left; font-size:13.5px; line-height:1.5;">
            <div style="font-weight:800; font-size:15px; color:var(--acc); margin-bottom:2px;">🍽️ ${m.name}</div>
            <div style="font-size:12px; color:var(--dim); margin-bottom:10px;">มื้อ: <b>${MEAL_LABELS[m.type] || m.type}</b> • เวลา: ${m.time || ''}</div>
            ${renderNutriScoreWidgetHtml(mealMetrics)}

            <div style="background:var(--card2); border:1px solid var(--line); border-radius:12px; padding:12px; margin-bottom:12px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <span style="font-size:12px; font-weight:700; color:var(--dim);">⚡ เลือกสัดส่วนที่ทานจริง:</span>
                    <span id="edMealPortionLabel" style="font-size:11.5px; font-weight:800; color:var(--acc);">${m.portion ? m.portion : 'ปรับสัดส่วน'}</span>
                </div>
                <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:6px; margin-bottom:12px;">
                    <button type="button" class="btn sm" onclick="applyMealPortionPct(1.0, 'ทานหมด 100%')" style="padding:6px 2px; font-size:11.5px; font-weight:700; background:var(--bg); border:1px solid var(--line); color:var(--tx); border-radius:8px;">100%<br><span style="font-size:9.5px; color:var(--dim); font-weight:400;">หมดจาน</span></button>
                    <button type="button" class="btn sm" onclick="applyMealPortionPct(0.75, 'ทาน 75%')" style="padding:6px 2px; font-size:11.5px; font-weight:700; background:var(--bg); border:1px solid var(--line); color:var(--tx); border-radius:8px;">75%<br><span style="font-size:9.5px; color:var(--dim); font-weight:400;">เหลือ 1/4</span></button>
                    <button type="button" class="btn sm" onclick="applyMealPortionPct(0.5, 'ทานครึ่งเดียว (50%)')" style="padding:6px 2px; font-size:11.5px; font-weight:700; background:rgba(234,88,12,0.12); border:1.5px solid var(--acc); color:var(--acc); border-radius:8px;">50%<br><span style="font-size:9.5px; color:var(--acc); font-weight:700;">ครึ่งเดียว</span></button>
                    <button type="button" class="btn sm" onclick="applyMealPortionPct(0.33, 'ทาน 33% (1/3)')" style="padding:6px 2px; font-size:11.5px; font-weight:700; background:var(--bg); border:1px solid var(--line); color:var(--tx); border-radius:8px;">33%<br><span style="font-size:9.5px; color:var(--dim); font-weight:400;">1 ใน 3</span></button>
                </div>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                    <div>
                        <label style="font-size:11.5px; font-weight:700; color:var(--acc); display:block; margin-bottom:2px;">⚡ แคลอรี่ (kcal)</label>
                        <input type="number" id="edMealCal" value="${m.cal}" style="width:100%; padding:8px; font-size:14px; font-weight:700; border-radius:8px; border:1px solid var(--line); background:var(--bg); color:var(--tx); box-sizing:border-box;">
                    </div>
                    <div>
                        <label style="font-size:11.5px; font-weight:700; color:var(--acc2); display:block; margin-bottom:2px;">🍗 โปรตีน (g)</label>
                        <input type="number" id="edMealPro" value="${m.pro || 0}" style="width:100%; padding:8px; font-size:14px; font-weight:700; border-radius:8px; border:1px solid var(--line); background:var(--bg); color:var(--tx); box-sizing:border-box;">
                    </div>
                    <div>
                        <label style="font-size:11.5px; font-weight:700; color:#3b82f6; display:block; margin-bottom:2px;">🍚 คาร์บ (g)</label>
                        <input type="number" id="edMealCarbs" value="${m.carbs || 0}" style="width:100%; padding:8px; font-size:14px; font-weight:700; border-radius:8px; border:1px solid var(--line); background:var(--bg); color:var(--tx); box-sizing:border-box;">
                    </div>
                    <div>
                        <label style="font-size:11.5px; font-weight:700; color:#10b981; display:block; margin-bottom:2px;">🥑 ไขมัน (g)</label>
                        <input type="number" id="edMealFat" value="${m.fat || 0}" style="width:100%; padding:8px; font-size:14px; font-weight:700; border-radius:8px; border:1px solid var(--line); background:var(--bg); color:var(--tx); box-sizing:border-box;">
                    </div>
                </div>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:8px;">
                    <div>
                        <label style="font-size:11.5px; font-weight:700; color:#ec4899; display:block; margin-bottom:2px;">🍭 น้ำตาล (g)</label>
                        <input type="number" id="edMealSugar" value="${m.sugar || 0}" style="width:100%; padding:8px; font-size:14px; font-weight:700; border-radius:8px; border:1px solid var(--line); background:var(--bg); color:var(--tx); box-sizing:border-box;">
                    </div>
                    <div>
                        <label style="font-size:11.5px; font-weight:700; color:#8b5cf6; display:block; margin-bottom:2px;">🧂 โซเดียม (mg)</label>
                        <input type="number" id="edMealSodium" value="${m.sodium || 0}" style="width:100%; padding:8px; font-size:14px; font-weight:700; border-radius:8px; border:1px solid var(--line); background:var(--bg); color:var(--tx); box-sizing:border-box;">
                    </div>
                </div>

                <div style="margin-top:10px;">
                    <label style="font-size:11.5px; font-weight:700; color:var(--dim); display:block; margin-bottom:2px;">คำอธิบายปริมาณ (Portion):</label>
                    <input type="text" id="edMealPortion" value="${m.portion || ''}" placeholder="เช่น ทาน 50% หรือ ครึ่งจาน" style="width:100%; padding:8px; font-size:13px; border-radius:8px; border:1px solid var(--line); background:var(--bg); color:var(--tx); box-sizing:border-box;">
                </div>
            </div>
        </div>
    `;

    const confirmed = await fcConfirm(html, '✏️ ปรับสัดส่วน / หักลบอาหารที่ทาน');
    if (!confirmed) return;

    const finalCal = parseInt(document.getElementById('edMealCal')?.value) || 0;
    const finalPro = parseInt(document.getElementById('edMealPro')?.value) || 0;
    const finalCarbs = parseInt(document.getElementById('edMealCarbs')?.value) || 0;
    const finalFat = parseInt(document.getElementById('edMealFat')?.value) || 0;
    const finalSugar = parseInt(document.getElementById('edMealSugar')?.value) || 0;
    const finalSodium = parseInt(document.getElementById('edMealSodium')?.value) || 0;
    const finalPortion = (document.getElementById('edMealPortion')?.value || m.portion || '').trim();

    m.baseCal = baseCal;
    m.basePro = basePro;
    m.baseCarbs = baseCarbs;
    m.baseFat = baseFat;
    m.baseSugar = baseSugar;
    m.baseSodium = baseSodium;
    m.basePortion = basePortion;
    m.cal = finalCal;
    m.pro = finalPro;
    m.carbs = finalCarbs;
    m.fat = finalFat;
    m.sugar = finalSugar;
    m.sodium = finalSodium;
    m.portion = finalPortion;

    recalculateDailyNutrition(dStr);
    save();
    render();
    if (currentUser && fbDb) {
        pushToCloud();
    }
    msg('✓ ปรับสัดส่วนอาหารเรียบร้อย (คำนวณแคลอรี่ใหม่แล้ว)');
}

async function deleteMealItem(dateKey, mealIndex) {
    const dStr = dateKey || iso();
    let rec = D.checks.find(x => x.d === dStr);
    if (!rec || !rec.meals || !rec.meals[mealIndex]) return;

    const item = rec.meals[mealIndex];
    const confirmed = await fcConfirm(
        `ต้องการลบรายการ <b>${item.name}</b> (${item.cal} kcal) ออกจากบันทึกใช่หรือไม่?`,
        '🗑️ ยืนยันการลบรายการ'
    );
    if (!confirmed) return;

    rec.meals.splice(mealIndex, 1);
    recalculateDailyNutrition(dStr);
    save();
    render();
    if (currentUser && fbDb) {
        pushToCloud();
    }
    msg('✓ ลบรายการอาหารแล้ว');
}

/* ============ FEATURE: QUICK FAVORITE MEALS & 1-TAP LOGGING ============ */
function toggleMealFavorite(dateKey, mealIndex) {
    const dStr = dateKey || iso();
    const rec = D.checks.find(x => x.d === dStr);
    if (!rec || !rec.meals || !rec.meals[mealIndex]) return;
    const m = rec.meals[mealIndex];
    if (!D.cfg.savedFoods) D.cfg.savedFoods = [];

    const cleanName = m.name.trim();
    const existingIdx = D.cfg.savedFoods.findIndex(f => f.name.trim().toLowerCase() === cleanName.toLowerCase());

    if (existingIdx >= 0) {
        D.cfg.savedFoods.splice(existingIdx, 1);
        msg('ลบ "' + cleanName + '" ออกจากเมนูโปรดแล้ว');
    } else {
        D.cfg.savedFoods.unshift({
            id: 'fav_' + Date.now(),
            name: cleanName,
            portion: m.portion || '1 จาน',
            cal: m.cal || 0,
            pro: m.pro || 0,
            carbs: m.carbs || 0,
            fat: m.fat || 0,
            sugar: m.sugar || 0,
            sodium: m.sodium || 0
        });
        msg('⭐ บันทึก "' + cleanName + '" ลงเมนูโปรดแล้ว!');
    }
    save();
    render();
    if (typeof pushToCloud === 'function') pushToCloud();
}

function quickLogFavoriteMeal(favId) {
    const fav = (D.cfg.savedFoods || []).find(f => f.id === favId);
    if (!fav) return;

    const nowH = new Date().getHours() + (new Date().getMinutes() / 60);
    let mType = 'lunch';
    if (nowH < 10.5) mType = 'breakfast';
    else if (nowH < 14.5) mType = 'lunch';
    else if (nowH < 17.5) mType = 'snack';
    else mType = 'dinner';

    addMealToToday(mType, fav.name, fav.portion, fav.cal, fav.pro, fav.carbs, fav.fat, fav.sugar || 0, fav.sodium || 0);
    msg('⭐ บันทึก "' + fav.name + '" ลงในมื้อ' + (MEAL_LABELS[mType] || '') + ' เรียบร้อย (+ ' + fav.cal + ' kcal)');
}


/* ============ AI NEXT MEAL SUGGESTER & FAVORITE COMBOS ============ */
async function suggestNextMealAI() {
    const tc = todayCheck() || {};
    const cal = tc.cal || 0, pro = tc.protein || 0, carbs = tc.carbs || 0, fat = tc.fat || 0;
    const remCal = Math.max(0, CAL_TARGET - cal);
    const remPro = Math.max(0, PROTEIN_TARGET - pro);
    const remCarbs = Math.max(0, CARBS_TARGET - carbs);
    const remFat = Math.max(0, FAT_TARGET - fat);

    if (remCal <= 100 && remPro <= 10) {
        fcAlert(`
            <div style="text-align:center; padding:10px;">
                <div style="font-size:32px; margin-bottom:8px;">🎉</div>
                <div style="font-weight:800; font-size:16px; color:var(--acc);">วันนี้ทานครบโควตาแล้วครับ!</div>
                <div style="font-size:13px; color:var(--dim); margin-top:6px;">คุณได้รับพลังงานและสารอาหารเกือบครบตามเป้าหมายแล้ว หากยังหิวแนะนำดื่มน้ำเปล่า, ชาอุ่นไม่ใส่น้ำตาล หรือผักลวกจิ้มน้ำพริกหนุ่มเล็กน้อยครับ</div>
            </div>
        `);
        return;
    }

    // Local Smart Match from TF_MACROS as instant fallback or direct engine
    const matchingDishes = TF_MACROS.filter(f => f.cal <= remCal + 120 && f.cal >= 80)
        .sort((a, b) => {
            // Prioritize protein if protein is lagging
            if (remPro > 30) return b.pro - a.pro;
            // Otherwise sort by calories closeness to ~50% of remaining
            const idealTarget = Math.max(200, remCal * 0.6);
            return Math.abs(a.cal - idealTarget) - Math.abs(b.cal - idealTarget);
        }).slice(0, 3);

    let suggestionsHtml = matchingDishes.map((f, i) => `
        <div style="background:var(--card2); border:1px solid var(--line); border-radius:10px; padding:10px 12px; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
            <div style="flex:1; padding-right:8px;">
                <div style="font-weight:800; font-size:13.5px; color:var(--tx);">${f.name} ${f.cat === 'north' ? '<span style="background:rgba(16,185,129,0.15);color:#10b981;font-size:10px;font-weight:700;padding:1px 5px;border-radius:4px;">อาหารเหนือ</span>' : ''}</div>
                <div style="font-size:11.5px; color:var(--dim); margin-top:2px;">
                    ขนาด: ${f.portion} • 🍗 P ${f.pro}g • 🍚 C ${f.carbs}g • 🥑 F ${f.fat}g
                </div>
            </div>
            <div style="text-align:right;">
                <div style="font-weight:800; color:var(--acc); font-size:14px; margin-bottom:4px;">${f.cal} kcal</div>
                <button class="btn sm" onclick="fcClose(); selectFoodToLog('${f.id}');" style="padding:4px 8px; font-size:11px;">✓ เลือกเมนูนี้</button>
            </div>
        </div>
    `).join('');

    fcAlert(`
        <div style="text-align:left; font-size:14px;">
            <div style="font-weight:800; font-size:16px; color:var(--acc); margin-bottom:4px;">🤖 AI แนะนำเมนูมื้อถัดไป</div>
            <div style="font-size:12px; color:var(--dim); margin-bottom:12px;">
                โควตาสารอาหารที่ยังเหลือ: ⚡ <b>${remCal} kcal</b> • 🍗 P <b>${remPro}g</b> • 🍚 C <b>${remCarbs}g</b>
            </div>

            <div style="max-height:60vh; overflow-y:auto;">
                ${suggestionsHtml}
            </div>

            <div style="margin-top:12px; text-align:center;">
                <button class="btn sm g" onclick="fcClose(); openAddMealModal();" style="padding:6px 14px; font-size:12px;">🔍 ค้นหาเมนูอื่นในฐานข้อมูล</button>
            </div>
        </div>
    `);
}

function saveCurrentMealsAsCombo() {
    const tc = todayCheck();
    if (!tc || !tc.meals || tc.meals.length === 0) {
        fcAlert('ยังไม่มีรายการอาหารที่บันทึกไว้ในวันนี้ครับ');
        return;
    }
    const defaultName = 'เซ็ตอาหาร ' + (tc.meals[0].name || '') + ' (' + tc.cal + ' kcal)';
    fcPrompt('ตั้งชื่อเซ็ตเมนูประจำนี้:', defaultName).then(name => {
        if (!name || !name.trim()) return;
        if (!D.cfg.myCombos) D.cfg.myCombos = [];
        const combo = {
            id: 'combo_' + Date.now(),
            name: name.trim(),
            items: tc.meals.map(m => ({ ...m })),
            totalCal: tc.cal,
            totalPro: tc.protein,
            totalCarbs: tc.carbs,
            totalFat: tc.fat
        };
        D.cfg.myCombos.push(combo);
        save();
        if (typeof pushToCloud === 'function') pushToCloud();
        msg('✓ บันทึกเซ็ตเมนูประจำเรียบร้อย!');
        openAddMealModal();
    });
}

function logComboToMeal(comboId, mealType) {
    const combo = (D.cfg.myCombos || []).find(c => c.id === comboId);
    if (!combo || !combo.items) return;
    combo.items.forEach(it => {
        addMealToToday(mealType, it.name, it.portion, it.cal, it.pro, it.carbs, it.fat);
    });
    fcClose();
    msg('✓ บันทึกเซ็ต ' + combo.name + ' เรียบร้อย!');
}

function deleteCombo(comboId, ev) {
    if (ev) ev.stopPropagation();
    if (!D.cfg.myCombos) return;
    D.cfg.myCombos = D.cfg.myCombos.filter(c => c.id !== comboId);
    save();
    if (typeof pushToCloud === 'function') pushToCloud();
    filterFoodListUI();
    msg('✓ ลบเซ็ตโปรดแล้ว');
}

function openAddMealModal(defaultMealType) {
    const mType = defaultMealType || 'lunch';
    const html = `
        <div style="text-align:left; font-size:14px; max-height:75vh; display:flex; flex-direction:column;">
            <div style="font-weight:800; font-size:16px; color:var(--acc); margin-bottom:8px;">🥗 บันทึกมื้ออาหาร</div>
            <div style="margin-bottom:12px;">
                <label style="font-size:12px; font-weight:700; color:var(--dim); display:block; margin-bottom:4px;">เลือกมื้ออาหาร:</label>
                <select id="modalMealTypeSelect" style="width:100%; padding:10px; border-radius:10px; font-size:14px; font-weight:700; background:var(--card2); border:1px solid var(--line); color:var(--tx);">
                    <option value="breakfast" ${mType === 'breakfast' ? 'selected' : ''}>🌅 มื้อเช้า</option>
                    <option value="lunch" ${mType === 'lunch' ? 'selected' : ''}>☀️ มื้อเที่ยง</option>
                    <option value="dinner" ${mType === 'dinner' ? 'selected' : ''}>🌙 มื้อเย็น</option>
                    <option value="snack" ${mType === 'snack' ? 'selected' : ''}>🍎 ของว่าง</option>
                </select>
            </div>

            <div style="display:flex; gap:8px; margin-bottom:12px;">
                <button class="btn sm" onclick="openManualMealForm()" style="flex:1; padding:8px; font-size:12px; background:rgba(234,88,12,0.12); color:var(--acc); border:1px solid var(--acc);">✍️ กรอกเอง</button>
                <button class="btn sm" onclick="fcClose(); openAiFoodScanner();" style="flex:1; padding:8px; font-size:12px; background:var(--card2); border:1px solid var(--line); color:var(--tx);">📸 สแกน AI</button>
            </div>

            <!-- Category Tabs Filter -->
            <div style="display:flex; gap:6px; margin-bottom:10px; overflow-x:auto; padding-bottom:2px;" id="foodCatTabs">
                <button type="button" class="btn sm on" onclick="setFoodCategoryFilter('all', this)" style="padding:4px 10px; font-size:12px; border-radius:99px; white-space:nowrap; flex:0 0 auto;">ทั้งหมด</button>
                <button type="button" class="btn sm" onclick="setFoodCategoryFilter('fav', this)" style="padding:4px 10px; font-size:12px; border-radius:99px; white-space:nowrap; flex:0 0 auto; background:var(--card2); border:1px solid var(--line); color:var(--tx);">⭐ เมนูโปรดคลาวด์</button>
                <button type="button" class="btn sm" onclick="setFoodCategoryFilter('protein', this)" style="padding:4px 10px; font-size:12px; border-radius:99px; white-space:nowrap; flex:0 0 auto; background:var(--card2); border:1px solid var(--line); color:var(--tx);">🥤 โปรตีนขวด & RTD</button>
                <button type="button" class="btn sm" onclick="setFoodCategoryFilter('north', this)" style="padding:4px 10px; font-size:12px; border-radius:99px; white-space:nowrap; flex:0 0 auto; background:var(--card2); border:1px solid var(--line); color:var(--tx);">🍲 อาหารเหนือ</button>
                <button type="button" class="btn sm" onclick="setFoodCategoryFilter('clean', this)" style="padding:4px 10px; font-size:12px; border-radius:99px; white-space:nowrap; flex:0 0 auto; background:var(--card2); border:1px solid var(--line); color:var(--tx);">💪 โปรตีน/คลีน</button>
                <button type="button" class="btn sm" onclick="setFoodCategoryFilter('dish', this)" style="padding:4px 10px; font-size:12px; border-radius:99px; white-space:nowrap; flex:0 0 auto; background:var(--card2); border:1px solid var(--line); color:var(--tx);">🍚 อาหารจานเดียว</button>
                <button type="button" class="btn sm" onclick="setFoodCategoryFilter('combo', this)" style="padding:4px 10px; font-size:12px; border-radius:99px; white-space:nowrap; flex:0 0 auto; background:var(--card2); border:1px solid var(--line); color:var(--tx);">🍱 เซ็ตโปรด</button>
            </div>

            <div style="position:relative; margin-bottom:10px;">
                <input type="text" id="foodSearchInput" placeholder="🔍 ค้นหาเมนู (เช่น ข้าวซอย, น้ำพริกหนุ่ม, อกไก่)..." oninput="filterFoodListUI()" style="width:100%; padding:10px 12px; font-size:13.5px; border-radius:10px; border:1px solid var(--line); background:var(--bg); color:var(--tx); box-sizing:border-box;">
            </div>

            <div id="foodListContainer" style="overflow-y:auto; flex:1; max-height:280px; border:1px solid var(--line); border-radius:12px; padding:6px; background:var(--card);">
                <!-- Food Items Rendered Here -->
            </div>
        </div>
    `;
    fcAlert(html);
    filterFoodListUI();
}

let currentFoodCatFilter = 'all';

function setFoodCategoryFilter(cat, btn) {
    currentFoodCatFilter = cat;
    if (btn && btn.parentElement) {
        btn.parentElement.querySelectorAll('button').forEach(b => {
            b.classList.remove('on');
            b.style.background = 'var(--card2)';
            b.style.borderColor = 'var(--line)';
            b.style.color = 'var(--tx)';
        });
        btn.classList.add('on');
        btn.style.background = 'var(--acc)';
        btn.style.borderColor = 'var(--acc)';
        btn.style.color = '#fff';
    }
    filterFoodListUI();
}

function filterFoodListUI() {
    const query = (document.getElementById('foodSearchInput')?.value || '').trim().toLowerCase();
    const container = document.getElementById('foodListContainer');
    if (!container) return;

    // 1. Saved Cloud Favorites Tab
    if (currentFoodCatFilter === 'fav') {
        const favs = D.cfg.savedFoods || [];
        const mType = document.getElementById('modalMealTypeSelect')?.value || 'lunch';
        const filteredFavs = favs.filter(f => !query || f.name.toLowerCase().includes(query));

        if (filteredFavs.length === 0) {
            container.innerHTML = `
                <div style="text-align:center; padding:20px; color:var(--dim); font-size:13px;">
                    ${favs.length === 0 ? 'ยังไม่มีเมนูโปรดที่บันทึกไว้ในคลาวด์<br><span style="font-size:11.5px;">คุณสามารถสแกนโปรตีนขวด/อาหาร แล้วกด <b>"⭐ บันทึกลงคลัง"</b> หรือกดเพิ่มเองได้ครับ</span>' : 'ไม่พบเมนูโปรดที่ค้นหา'}<br>
                    <button class="btn sm" onclick="addNewCustomFavoriteFood()" style="margin-top:12px; font-size:12px; padding:6px 14px; background:var(--acc); color:#fff; border-radius:8px;">+ เพิ่มเมนูโปรดใหม่ด้วยตัวเอง</button>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div style="padding:4px; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:11.5px; color:var(--dim); font-weight:700;">☁️ บันทึกลงคลาวด์แล้ว (${filteredFavs.length} เมนู)</span>
                <button class="btn sm" onclick="addNewCustomFavoriteFood()" style="font-size:11px; padding:3px 8px; background:transparent; border:1px solid var(--acc); color:var(--acc); border-radius:6px;">+ เพิ่มเมนู</button>
            </div>
        ` + filteredFavs.map(f => `
            <div style="display:flex; align-items:center; justify-content:space-between; padding:10px 12px; border-bottom:1px solid var(--line); border-radius:8px; background:var(--card2); margin-bottom:6px;">
                <div onclick="promptPortionAndLog(${JSON.stringify(f).replace(/"/g, '&quot;')}, '${mType}')" style="flex:1; padding-right:8px; cursor:pointer;">
                    <div style="font-weight:800; font-size:13.5px; color:var(--tx); display:flex; align-items:center; gap:6px;">
                        <span>⭐ ${f.name}</span>
                        <span class="tag" style="font-size:9.5px; padding:1px 5px; background:rgba(234,88,12,0.15); color:var(--acc);">${f.portion || '1 หน่วย'}</span>
                    </div>
                    <div style="font-size:11.5px; color:var(--dim); margin-top:2px;">
                        ⚡ ${f.cal} kcal • <b style="color:var(--acc2);">🍗 P ${f.pro}g</b> • 🍚 C ${f.carbs}g • 🥑 F ${f.fat}g
                    </div>
                </div>
                <div style="display:flex; align-items:center; gap:6px;">
                    <button class="btn sm" onclick="quickLogSavedFood('${f.id}')" style="font-size:11px; padding:5px 8px; background:var(--acc); color:#fff; font-weight:700; border-radius:6px; white-space:nowrap;">+ บันทึก</button>
                    <button onclick="deleteFavoriteFood('${f.id}', event)" style="background:none; border:none; color:var(--red); font-size:13px; cursor:pointer; padding:2px;" title="ลบออกจากคลัง">🗑️</button>
                </div>
            </div>
        `).join('');
        return;
    }

    if (currentFoodCatFilter === 'combo') {
        const combos = D.cfg.myCombos || [];
        const mType = document.getElementById('modalMealTypeSelect')?.value || 'lunch';
        if (combos.length === 0) {
            container.innerHTML = `
                <div style="text-align:center; padding:20px; color:var(--dim); font-size:13px;">
                    ยังไม่มีเซ็ตเมนูประจำที่บันทึกไว้<br>
                    <button class="btn sm" onclick="saveCurrentMealsAsCombo()" style="margin-top:10px; font-size:12px; padding:6px 12px; background:var(--acc); color:#fff;">+ บันทึกมื้ออาหารวันนี้เป็นเซ็ตโปรด</button>
                </div>
            `;
            return;
        }
        container.innerHTML = `
            <div style="padding:4px; margin-bottom:8px; text-align:right;">
                <button class="btn sm" onclick="saveCurrentMealsAsCombo()" style="font-size:11px; padding:4px 8px; background:transparent; border:1px solid var(--acc); color:var(--acc);">+ บันทึกมื้อวันนี้เป็นเซ็ตโปรด</button>
            </div>
        ` + combos.map(c => `
            <div onclick="logComboToMeal('${c.id}', '${mType}')" style="display:flex; align-items:center; justify-content:space-between; padding:10px 12px; border-bottom:1px solid var(--line); cursor:pointer; border-radius:8px; background:var(--card2); margin-bottom:6px;">
                <div style="flex:1; padding-right:8px;">
                    <div style="font-weight:800; font-size:13.5px; color:var(--tx);">⭐ ${c.name}</div>
                    <div style="font-size:11.5px; color:var(--dim); margin-top:2px;">
                        ${c.items.length} รายการ • 🍗 P ${c.totalPro || 0}g • 🍚 C ${c.totalCarbs || 0}g • 🥑 F ${c.totalFat || 0}g
                    </div>
                </div>
                <div style="display:flex; align-items:center; gap:8px;">
                    <span style="font-weight:800; color:var(--acc); font-size:14px;">${c.totalCal || 0} kcal</span>
                    <button onclick="deleteCombo('${c.id}', event)" style="background:none; border:none; color:var(--red); font-size:13px; cursor:pointer; padding:2px;" title="ลบเซ็ตนี้">❌</button>
                </div>
            </div>
        `).join('');
        return;
    }

    const filtered = TF_MACROS.filter(f => {
        const matchQuery = !query || f.name.toLowerCase().includes(query);
        const matchCat = currentFoodCatFilter === 'all' || f.cat === currentFoodCatFilter;
        return matchQuery && matchCat;
    });

    if (filtered.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:20px; color:var(--dim); font-size:13px;">ไม่พบเมนูที่ค้นหา<br><a href="javascript:void(0)" onclick="openManualMealForm()" style="color:var(--acc); font-weight:700; text-decoration:underline; display:inline-block; margin-top:8px;">+ กรอกสารอาหารเอง</a></div>';
        return;
    }

    container.innerHTML = filtered.map(f => {
        const isNorth = f.cat === 'north';
        const northBadge = isNorth ? '<span style="background:rgba(16,185,129,0.15); color:#10b981; font-size:10.5px; font-weight:800; padding:1px 6px; border-radius:4px; margin-left:6px; vertical-align:1px;">อาหารเหนือ</span>' : '';
        return `
            <div onclick="selectFoodToLog('${f.id}')" style="display:flex; align-items:center; justify-content:space-between; padding:10px 12px; border-bottom:1px solid var(--line); cursor:pointer; border-radius:8px; transition:background .15s ease;" onmouseover="this.style.background='var(--card2)'" onmouseout="this.style.background='transparent'">
                <div style="flex:1; padding-right:8px;">
                    <div style="font-weight:700; font-size:13.5px; color:var(--tx); display:flex; align-items:center; flex-wrap:wrap;">
                        <span>${f.name}</span>${northBadge}
                    </div>
                    <div style="font-size:11.5px; color:var(--dim); margin-top:2px;">
                        🍗 P ${f.pro}g • 🍚 C ${f.carbs}g • 🥑 F ${f.fat}g
                    </div>
                </div>
                <div style="text-align:right;">
                    <span style="font-weight:800; color:var(--acc); font-size:14px;">${f.cal}</span>
                    <span style="font-size:11px; color:var(--dim);"> kcal</span>
                </div>
            </div>
        `;
    }).join('');
}

function selectFoodToLog(foodId) {
    const food = TF_MACROS.find(f => f.id === foodId);
    if (!food) return;
    const mealType = document.getElementById('modalMealTypeSelect')?.value || 'lunch';
    promptPortionAndLog(food, mealType);
}

function promptPortionAndLog(food, mealType) {
    const sSugar = (food.sugar != null && food.sugar > 0) ? ' • 🍭 ' + food.sugar + 'g' : '';
    const sSodium = (food.sodium != null && food.sodium > 0) ? ' • 🧂 ' + food.sodium + 'mg' : '';
    const html = `
        <div style="text-align:left; font-size:14px;">
            <div style="font-weight:800; font-size:15px; color:var(--acc); margin-bottom:4px;">${food.name}</div>
            <div style="font-size:12px; color:var(--dim); margin-bottom:14px;">ขนาดปกติ: ${food.portion} (⚡ ${food.cal} kcal, P ${food.pro}g, C ${food.carbs}g, F ${food.fat}g${sSugar}${sSodium})</div>

            <label style="font-weight:700; font-size:13px; display:block; margin-bottom:4px;">จำนวนหน่วยบริโภค (เท่า):</label>
            <input type="number" id="foodMultiplierInput" value="1" step="0.25" min="0.25" max="10" oninput="updatePortionPreview(${food.cal}, ${food.pro}, ${food.carbs}, ${food.fat}, ${food.sugar || 0}, ${food.sodium || 0})" style="width:100%; padding:10px; font-size:16px; font-weight:700; border-radius:10px; border:1px solid var(--line); background:var(--bg); color:var(--tx); box-sizing:border-box;">

            <div id="portionPreviewBox" style="margin-top:12px; padding:10px 14px; background:var(--card2); border-radius:10px; border:1px solid var(--line); font-size:13px;">
                สรุป: ⚡ <b style="color:var(--acc);">${food.cal}</b> kcal • 🍗 <b>${food.pro}g</b> • 🍚 <b>${food.carbs}g</b> • 🥑 <b>${food.fat}g</b>${(food.sugar != null && food.sugar > 0) ? ' • 🍭 <b>' + food.sugar + 'g</b>' : ''}${(food.sodium != null && food.sodium > 0) ? ' • 🧂 <b>' + food.sodium + 'mg</b>' : ''}
            </div>

            <div style="margin-top:16px; display:flex; gap:8px;">
                <button class="btn sm g" onclick="openAddMealModal('${mealType}')" style="flex:1;">ย้อนกลับ</button>
                <button class="btn sm" onclick="confirmPortionAndSave('${food.id}', '${mealType}')" style="flex:1.5;">✓ บันทึกมื้อนี้</button>
            </div>
        </div>
    `;
    fcAlert(html);
}

function updatePortionPreview(baseCal, basePro, baseCarbs, baseFat, baseSugar = 0, baseSodium = 0) {
    const mult = parseFloat(document.getElementById('foodMultiplierInput')?.value) || 1;
    const pBox = document.getElementById('portionPreviewBox');
    if (pBox) {
        pBox.innerHTML = 'สรุป: ⚡ <b style="color:var(--acc);">' + Math.round(baseCal * mult) + '</b> kcal • 🍗 <b>' + Math.round(basePro * mult) + 'g</b> • 🍚 <b>' + Math.round(baseCarbs * mult) + 'g</b> • 🥑 <b>' + Math.round(baseFat * mult) + 'g</b>' + (baseSugar > 0 ? ' • 🍭 <b>' + Math.round(baseSugar * mult) + 'g</b>' : '') + (baseSodium > 0 ? ' • 🧂 <b>' + Math.round(baseSodium * mult) + 'mg</b>' : '');
    }
}

function confirmPortionAndSave(foodId, mealType) {
    const food = TF_MACROS.find(f => f.id === foodId);
    if (!food) return;
    const mult = parseFloat(document.getElementById('foodMultiplierInput')?.value) || 1;
    const portionText = mult === 1 ? food.portion : mult + 'x (' + food.portion + ')';
    addMealToToday(
        mealType,
        food.name,
        portionText,
        Math.round(food.cal * mult),
        Math.round(food.pro * mult),
        Math.round(food.carbs * mult),
        Math.round(food.fat * mult),
        Math.round((food.sugar || 0) * mult),
        Math.round((food.sodium || 0) * mult)
    );
    fcClose();
}

function openManualMealForm(defaultMealType) {
    const mType = defaultMealType || document.getElementById('modalMealTypeSelect')?.value || 'lunch';
    const html = `
        <div style="text-align:left; font-size:14px; max-height:75vh; overflow-y:auto;">
            <div style="font-weight:800; font-size:16px; color:var(--acc); margin-bottom:10px;">✍️ กรอกสารอาหารด้วยตนเอง</div>

            <label style="font-size:12px; font-weight:700; color:var(--dim); display:block; margin-bottom:3px;">มื้ออาหาร:</label>
            <select id="manMealType" style="width:100%; padding:9px; border-radius:8px; font-size:13.5px; font-weight:700; background:var(--card2); border:1px solid var(--line); color:var(--tx); margin-bottom:10px;">
                <option value="breakfast" ${mType === 'breakfast' ? 'selected' : ''}>🌅 มื้อเช้า</option>
                <option value="lunch" ${mType === 'lunch' ? 'selected' : ''}>☀️ มื้อเที่ยง</option>
                <option value="dinner" ${mType === 'dinner' ? 'selected' : ''}>🌙 มื้อเย็น</option>
                <option value="snack" ${mType === 'snack' ? 'selected' : ''}>🍎 ของว่าง</option>
            </select>

            <label style="font-size:12px; font-weight:700; color:var(--dim); display:block; margin-bottom:3px;">ชื่ออาหาร:</label>
            <input type="text" id="manFoodName" placeholder="เช่น สลัดแซลมอน, โปรตีนเชค" style="width:100%; padding:9px; font-size:14px; border-radius:8px; border:1px solid var(--line); background:var(--bg); color:var(--tx); box-sizing:border-box; margin-bottom:10px;">

            <label style="font-size:12px; font-weight:700; color:var(--dim); display:block; margin-bottom:3px;">ปริมาณ / ขนาดบริโภค:</label>
            <input type="text" id="manFoodPortion" value="1 จาน" placeholder="เช่น 1 จาน, 1 ถ้วย" style="width:100%; padding:9px; font-size:14px; border-radius:8px; border:1px solid var(--line); background:var(--bg); color:var(--tx); box-sizing:border-box; margin-bottom:10px;">

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:10px;">
                <div>
                    <label style="font-size:12px; font-weight:700; color:var(--acc); display:block; margin-bottom:3px;">⚡ แคลอรี่ (kcal)*</label>
                    <input type="number" id="manFoodCal" placeholder="0" style="width:100%; padding:9px; font-size:15px; font-weight:700; border-radius:8px; border:1px solid var(--line); background:var(--bg); color:var(--tx); box-sizing:border-box;">
                </div>
                <div>
                    <label style="font-size:12px; font-weight:700; color:var(--acc2); display:block; margin-bottom:3px;">🍗 โปรตีน (g)</label>
                    <input type="number" id="manFoodPro" placeholder="0" style="width:100%; padding:9px; font-size:15px; font-weight:700; border-radius:8px; border:1px solid var(--line); background:var(--bg); color:var(--tx); box-sizing:border-box;">
                </div>
                <div>
                    <label style="font-size:12px; font-weight:700; color:#3b82f6; display:block; margin-bottom:3px;">🍚 คาร์โบไฮเดรต (g)</label>
                    <input type="number" id="manFoodCarbs" placeholder="0" style="width:100%; padding:9px; font-size:15px; font-weight:700; border-radius:8px; border:1px solid var(--line); background:var(--bg); color:var(--tx); box-sizing:border-box;">
                </div>
                <div>
                    <label style="font-size:12px; font-weight:700; color:#10b981; display:block; margin-bottom:3px;">🥑 ไขมัน (g)</label>
                    <input type="number" id="manFoodFat" placeholder="0" style="width:100%; padding:9px; font-size:15px; font-weight:700; border-radius:8px; border:1px solid var(--line); background:var(--bg); color:var(--tx); box-sizing:border-box;">
                </div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:14px;">
                <div>
                    <label style="font-size:12px; font-weight:700; color:#ec4899; display:block; margin-bottom:3px;">🍭 น้ำตาล (g)</label>
                    <input type="number" id="manFoodSugar" placeholder="0" style="width:100%; padding:9px; font-size:15px; font-weight:700; border-radius:8px; border:1px solid var(--line); background:var(--bg); color:var(--tx); box-sizing:border-box;">
                </div>
                <div>
                    <label style="font-size:12px; font-weight:700; color:#8b5cf6; display:block; margin-bottom:3px;">🧂 โซเดียม (mg)</label>
                    <input type="number" id="manFoodSodium" placeholder="0" style="width:100%; padding:9px; font-size:15px; font-weight:700; border-radius:8px; border:1px solid var(--line); background:var(--bg); color:var(--tx); box-sizing:border-box;">
                </div>
            </div>

            <div style="display:flex; gap:8px;">
                <button class="btn sm g" onclick="openAddMealModal()" style="flex:1;">ย้อนกลับ</button>
                <button class="btn sm" onclick="saveManualMeal()" style="flex:1.5;">💾 บันทึกอาหาร</button>
            </div>
        </div>
    `;
    fcAlert(html);
}

function saveManualMeal() {
    const mType = document.getElementById('manMealType')?.value || 'lunch';
    const name = (document.getElementById('manFoodName')?.value || 'อาหาร').trim();
    const portion = (document.getElementById('manFoodPortion')?.value || '1 จาน').trim();
    const cal = Math.round(Number(document.getElementById('manFoodCal')?.value) || 0);
    const pro = Math.round(Number(document.getElementById('manFoodPro')?.value) || 0);
    const carbs = Math.round(Number(document.getElementById('manFoodCarbs')?.value) || 0);
    const fat = Math.round(Number(document.getElementById('manFoodFat')?.value) || 0);
    const sugar = Math.round(Number(document.getElementById('manFoodSugar')?.value) || 0);
    const sodium = Math.round(Number(document.getElementById('manFoodSodium')?.value) || 0);

    if (cal <= 0 && pro <= 0 && carbs <= 0 && fat <= 0) {
        msg('กรุณากรอกพลังงานหรือสารอาหารอย่างน้อย 1 ค่า');
        return;
    }

    addMealToToday(mType, name, portion, cal, pro, carbs, fat, sugar, sodium);
    fcClose();
}
const WEIGH_WARN_DAYS = 2;
function save() {
    try {
        localStorage.setItem('fit', JSON.stringify(D));
        if (currentUser && fbDb) {
            localStorage.setItem('fc_dirty', '1');
        }
    } catch (e) {
        console.warn('localStorage save error:', e);
    }
    if (typeof autoSync === 'function') {
        autoSync();
    }
}
