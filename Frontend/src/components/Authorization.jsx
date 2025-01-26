import LoginForm from './forms/LoginForm';
import SignUpForm from './forms/SignUpForm';

const formMapping = {
    login: <LoginForm />,
    register: <SignUpForm />
};

export default function Authorization({ mode }) {

    return formMapping[mode] || null;

}