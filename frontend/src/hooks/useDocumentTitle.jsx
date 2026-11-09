import { useEffect } from "react";

export default function useDocumentTitle(title, commonTitle = ' | budgetApp') {

    useEffect(() => {
        document.title = `${title}${commonTitle}`;
    }, [title, commonTitle]);
}