export const formatDbDate = (date: Date, split: boolean) => {
    const inputDate: Date = new Date(date);
    const localDate: string = inputDate.toLocaleString();
    let formattedDate;

    if (split) {
        formattedDate = localDate.split(',')[0];
    } else if (!split) {
        formattedDate = localDate;
    };

    return formattedDate;
};