import { useState, useRef } from "react"
import { serverUrl } from "../../url";
import sendRequest from "../../utils/asyncUtils/sendRequest";
import DashboardHeader from "../../components/dashboard/dashboardComponents/DashBoardHeader";
import { showErrorToast, showInfoToast } from "../../configs/toastify";

export default function DashBoardForUser() {
    const [sended, setIsSended] = useState(false);
    const houseNameRef = useRef();

    const handleAddHouse = async (e) => {
        e.preventDefault();

        if (houseNameRef.current.value === '') {
            showErrorToast('Wpisz nazwę gospodarstwa!');
        };


        const houseData = { houseName: houseNameRef.current.value };

        try {
            setIsSended(false);
            const addHouse = await sendRequest('POST', houseData, `${serverUrl}/house/new`);
            if (addHouse.status === 'success') {
                showInfoToast(addHouse.message);
                setTimeout(() => {
                    window.location.reload();
                }, 1000)
            }
        } catch (error) {
            showErrorToast(addHouse.message);
        } finally {
            setIsSended(true);
        }
    };

    return (
        <main className="w-screen h-screen flex flex-col justify-start items-center gap-3">
            <DashboardHeader />
            <h2 className="w-full h-fit flex justify-center text-2xl font-semibold">To use website functions, add your household:</h2>
            <div className="w-full h-fit flex flex-col justify-start items-center">
                <form onSubmit={handleAddHouse} className="w-1/3 h-fit flex flex-col justify-start items-center mt-5 border-2 border-slate-500 rounded-md py-2">
                    <label htmlFor="houseName" className="text-lg">Type name of your household:</label>
                    <p className="text-xs mb-5">If household exists, you will be added to it</p>
                    <input type="text" name="houseName" id="houseName" className="bg-slate-200" ref={houseNameRef} />
                    <button
                        type="submit"
                        disabled={sended}
                        className="w-fit h-fit flex justify-center mx-auto border-2 border-slate-400 p-3 mt-4 rounded-xl hover:bg-slate-400 hover:text-slate-100"
                    >
                        Add
                    </button>
                </form>
            </div>
        </main>
    )
}