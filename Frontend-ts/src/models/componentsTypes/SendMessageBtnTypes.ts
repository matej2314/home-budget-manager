type StateType = {
    type: string;
};

export type SendMessageBtnProps = {
    form: string;
    setState: (param: string) => void;
    resetState: () => void;
    state:StateType;
};