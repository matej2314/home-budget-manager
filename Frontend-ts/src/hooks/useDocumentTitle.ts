import { useEffect } from "react";

export default function useDocumentTitle(title: string, commonTitle: string = ' | budgetApp') {

    useEffect(() => {
        document.title = `${title}${commonTitle}`;
    }, [title, commonTitle]);

}