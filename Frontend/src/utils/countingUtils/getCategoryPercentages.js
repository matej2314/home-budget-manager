const { mapArray, filterArray } = require('../arraysUtils/arraysFunctions');

export const getCategoryPercentages = (transactions) => {
    const transactionsCategories = mapArray(transactions, (action) => action.categoryName);
    const uniqueCategories = new Set(transactionsCategories);

    const categoryPercentages = Array.from(uniqueCategories).map((category) => {
        const categoryCount = filterArray(transactionsCategories, (c) => c === category).length;
        const percentage = ((categoryCount / transactionsCategories.length) * 100);
        return { label: category, value: percentage };
    });

    const labels = mapArray(categoryPercentages, (cat) => cat.label);
    const dataValues = mapArray(categoryPercentages, (cat) => cat.value);

    return { labels, dataValues };
};