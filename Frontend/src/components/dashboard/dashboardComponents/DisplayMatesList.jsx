import MatesList from "../../dashboard-internal-components/MatesList";

export default function DisplayMatesList() {

    return (
        <div id="matesList" className="w-1/3 h-fit flex flex-col justify-start items-center rounded-md border-2 border-slate-500/20 my-4 ml-5 gap-3 py-2 px-5">
            <h2 className="w-full h-fit flex justify-center text-xl text-slate-700">Your housemates:</h2>
            <MatesList />
        </div>
    );
}

