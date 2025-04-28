import { useState, useRef, FormEvent } from "react"
import { useMutation } from "@tanstack/react-query";
import { serverUrl } from "url";
import sendRequest from "@utils/asyncUtils/sendRequest";
import { useTranslation } from "react-i18next";
import { showErrorToast, showInfoToast } from "@configs/toastify";
import { BaseApiResponse } from "@utils/asyncUtils/fetchData";

type HouseData = {
    houseName: string;
};

const addHouseRequest = async (houseData: HouseData) => {
    return await sendRequest<HouseData, BaseApiResponse>('POST', houseData, `${serverUrl}/house/new`);
};

export default function DashBoardForUser() {
    const [sended, setSended] = useState<boolean>(false);
    const houseNameRef = useRef<HTMLInputElement>(null);
    const { t } = useTranslation("pages");

    const { mutate: addHouse, isPending } = useMutation({
        mutationFn: addHouseRequest,
        onMutate: () => {
            setSended(false)
        },
        onSuccess: (response: BaseApiResponse) => {

            if (response.status === 'success') {
                showInfoToast(t(`${response.message}`));
                setTimeout(() => {
                    window.location.href = "/dashboard";
                }, 1000);
            } else if (response.status === 'error') {
                console.error(response.message);
            }
        },
        onError: (error: Error | string) => {
            console.error(error);
        },
        onSettled: () => {
            setSended(true);
        },
    });
    
    const handleAddHouse = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (houseNameRef.current?.value === '') {
            showErrorToast(t("userDashboard.emptyInputError"));
            return;
        };

        const houseData: HouseData = { houseName: houseNameRef.current?.value as string };

        await addHouse(houseData);
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
                        disabled={sended || isPending}
                        className="w-fit h-fit flex justify-center mx-auto border-2 border-slate-400 p-3 mt-4 rounded-xl hover:bg-slate-400 hover:text-slate-100"
                    >
                        {t("userDashboard.addBtnLabel")}
                    </button>
                </form>
            </div>
        </main>
    )
}