export const CountDeclaredBudgetPeriod = () => {
    const now = new Date();
    const startPeriod = now.toLocaleDateString();
    const endPeriod = new Date(now);
    endPeriod.setDate(now.getDate() + 30);
    const endPeriodString = endPeriod.toLocaleDateString();
    
    return { startPeriod, endPeriodString }
};

