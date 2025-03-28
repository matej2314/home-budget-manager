import { useTranslation } from 'react-i18next';

export default function SignUpCookiesSettings({ clickAction }) {
    const { t } = useTranslation("common");

    return (
        <div>
            <p className='text-sm w-full h-fit flex flex-col justify-center text-pretty'>
                {t("signUpCookiesSettings.cookiesInfoPar")}
                <span
                    className='mt-2'
                >
                    {t("signUpCookiesSettings.cookiesInfoSpan")}
                </span>
            </p>
            <div className='w-full h-fit flex flex-col gap-3 mt-2'>
                <p className='w-full h-fit flex justify-center font-semibold'>{t("signUpCokiesSettings.btnsHeading")}</p>
                <div className='w-full h-fit flex justify-center gap-3 pl-14'>
                    <button
                        className="form-submit-modal-btn"
                        type="button"
                        onClick={() => clickAction(1)}
                    >
                        {t("signUpCookiesSettings.btnAll")}
                    </button>
                    <button
                        className="form-submit-modal-btn"
                        type="button"
                        onClick={() => clickAction(0)}
                    >
                        {t("signUpCookiesSettings.btnMandatory")}
                    </button>
                </div>
            </div>
        </div>
    )
}