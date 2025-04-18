interface DeclaredBudgetObj {
    startPeriod:string;
    endPeriodString: string;
};


export const countDeclaredBudgetPeriod = (): DeclaredBudgetObj => {
    const now: Date = new Date();
    const startPeriod: string = now.toLocaleDateString();
    const endPeriod: Date = new Date(now);
    endPeriod.setDate(now.getDate() + 30);
    const endPeriodString: string = endPeriod.toLocaleDateString();

    return { startPeriod, endPeriodString };
}