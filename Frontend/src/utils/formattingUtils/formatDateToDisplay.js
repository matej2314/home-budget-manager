export const formatDbDate = (date, split) => {
    const inputDate = new Date(date);
    const localDate = inputDate.toLocaleString();
    let formattedDate;

    if (split) {
        formattedDate = localDate.split(',')[0];
    } else if (!split) {
        formattedDate = localDate;
    };

    return formattedDate;
};
