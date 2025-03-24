import { useState, useRef } from "react"
import { serverUrl } from "../../url";
import sendRequest from "../../utils/asyncUtils/sendRequest";
import { useTranslation } from "react-i18next";
import { showErrorToast, showInfoToast } from "../../configs/toastify";

export default function DashBoardForUser() {
    const [sended, setIsSended] = useState(false);
    const houseNameRef = useRef();
    const { t } = useTranslation("pages");

    const handleAddHouse = async (e) => {
        e.preventDefault();

        if (houseNameRef.current.value === '') {
            showErrorToast(t("userDashboard.emptyInputError"));
        };

        const houseData = { houseName: houseNameRef.current.value };

        try {
            setIsSended(false);
            const addHouse = await sendRequest('POST', houseData, `${serverUrl}/house/new`);
            if (addHouse.status === 'success') {
                showInfoToast(t(`${addHouse.message}`));
                setTimeout(() => {
                    window.location.reload();
                }, 1000)
            }
        } catch (error) {
            showErrorToast("userDashboard.failedError");
        } finally {
            setIsSended(true);
        }
    };

    return (
        <main className="w-full h-full flex flex-col justify-start items-center gap-3 text-slate-300">
            <h2 className="w-full h-fit flex justify-center text-2xl font-semibold">{t("userDashboard.heading")}</h2>
            <div className="w-full h-fit flex flex-col justify-start items-center">
                <form
                    onSubmit={handleAddHouse}
                    className="w-1/3 h-fit flex flex-col justify-start items-center mt-5 border-2 border-slate-500 rounded-md py-2">
                    <label htmlFor="houseName" className="text-lg">{t("userDashboard.inputLabel")}</label>
                    <p className="text-sm mb-5 text-red-500">{t("userDashboard.infoParagraph")}</p>
                    <input type="text" name="houseName" id="houseName" className="bg-slate-200 text-slate-700 pl-2 rounded-md" ref={houseNameRef} />
                    <button
                        type="submit"
                        disabled={sended}
                        className="w-fit h-fit flex justify-center mx-auto border-2 border-slate-400 p-3 mt-4 rounded-xl hover:bg-slate-400 hover:text-slate-100"
                    >
                        {t("userDashboard.addBtnLabel")}
                    </button>
                </form>
            </div>
        </main>
    )
}