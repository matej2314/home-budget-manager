import MatesList from "../dashboard-internal-components/MatesList";

export default function DisplayMatesList() {

    return (
        <div id="matesList" className="w-1/3 h-fit flex flex-col justify-center rounded-md border-2 border-slate-500/20 mt-4 ml-5 gap-3 pt-2 pb-4 px-2">
            <h2 className="w-full h-fit flex justify-center text-xl text-slate-700">Your housemates:</h2>
            <MatesList />
        </div>
    );
}

