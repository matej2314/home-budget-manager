import LoginForm from '@components/forms/LoginForm';
import SignUpForm from '../forms/SignUpForm';
import { type JSX } from 'react';

const formMapping: Record<string, JSX.Element> = {
    login: <LoginForm />,
    register: <SignUpForm />,
};

type AuthorizationProps = {
    mode: string;
};

export default function Authorization({ mode }: AuthorizationProps): JSX.Element {

    return formMapping[mode] || null;

}