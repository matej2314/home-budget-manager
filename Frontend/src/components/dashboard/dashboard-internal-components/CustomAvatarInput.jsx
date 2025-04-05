import { forwardRef, useState } from "react";
import { useTranslation } from 'react-i18next';

const CustomAvatarInput = forwardRef((_, ref) => {
    const [avatarName, setAvatarName] = useState('');
    const { t } = useTranslation("pages");

    const handleChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarName(file.name);
        }
    };

    return (
        <div className="relative w-full flex flex-col items-center">
            {avatarName && (
                <p className="mb-2 text-sm text-center text-gray-700 truncate max-w-xs">{avatarName}</p>
            )}
            <button
                type="button"
                className='w-5/12 h-fit border-2 border-slate-400 rounded-md p-3 hover:bg-slate-400 hover:text-slate-50'
                onClick={() => ref?.current?.click()}
            >
                {t ? t('userProfile.selectAvatar', 'Select avatar') : 'Select avatar'}
            </button>
            <input
                type="file"
                ref={ref}
                onChange={handleChange}
                className="hidden"
                accept="image/*"
                name="user-avatar"
            />
        </div>
    );
});

export default CustomAvatarInput;
