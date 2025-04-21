import { ReactNode } from "react";
// import { type SingleValue, StylesConfig } from "react-select";

export type LanguageOption = {
    value: string;
    icon: ReactNode;
};

export type LanguageSwitchProps = {
    isHomePage?: boolean;
};