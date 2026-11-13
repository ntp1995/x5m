/* ============================================================================
   FitCoach v3.2 Helper: Shift-Day / Late-Duty Protection Mode
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
}
