import { forwardRef } from "react";
import { useTranslation } from 'react-i18next';

const CustomAvatarInput = forwardRef(({ onChange }, ref) => {
    const handleFileClick = () => {
        ref.current.click();
    };

    return (
        <div className="relative">
            <button
                onClick={handleFileClick}
                className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none"
            >
                Select avatar
            </button>
            <input
                type="file"
                ref={ref}
                onChange={onChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept="image/*"
                name="user-avatar"
            />
        </div>
    );
});

export default CustomAvatarInput;