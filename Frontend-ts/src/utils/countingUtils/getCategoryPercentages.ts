import { mapArray, filterArray } from "@utils/arraysUtils/arraysFunctions";

interface Transaction {
    categoryName: string;
    type: string;
    value: number;
};

interface CategoryPercentagesObj {
    label: string;
    value: number;
};

export const getCategoryPercentages = (transactions: Transaction[]) => {
    const transactionsCategories = mapArray(transactions, (action) => action.categoryName);
    const uniqueCategories = new Set(transactionsCategories);

    const categoryPercentages = Array.from(uniqueCategories).map((category: string): CategoryPercentagesObj => {
        const categoryCount = filterArray(transactionsCategories, (c) => c === category).length;
        const percentage = +((categoryCount / transactionsCategories.length) * 100);
        const label = category;
        const value = percentage;
        return { label, value };
});

    const labels = mapArray(categoryPercentages, (cat) => cat.label);
    const dataValues = mapArray(categoryPercentages, (cat) => cat.value);

    return { labels, dataValues };

}