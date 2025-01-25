export default function HouseMatesList() {
    return (
        <div id="matesList" className="w-1/3 h-fit flex flex-col justify-start items-center rounded-md border-2 border-slate-500/20 my-4 ml-5 gap-3 py-2">
            <h2 className="w-full h-fit flex justify-center text-xl text-slate-700">Your housemates:</h2>
            <ul className="w-full h-fit flex flex-col justify-start items-center text-lg gap-3">
                <li className="flex items-center gap-2 text-lg">user <span className="w-full h-full flex items-center text-base">msg + actions + del (ifadmin)</span></li>
                <li className="flex items-center gap-2 text-lg">user <span className="w-full h-full flex items-center text-base">msg + actions + del (ifadmin)</span></li>
                <li className="flex items-center gap-2 text-lg">user <span className="w-full h-full flex items-center text-base">msg + actions + del (ifadmin)</span></li>
                <li className="flex items-center gap-2 text-lg">user <span className="w-full h-full flex items-center text-base">msg + actions + del (ifadmin)</span></li>
                <li className="flex items-center gap-2 text-lg">user <span className="w-full h-full flex items-center text-base">msg + actions + del (ifadmin)</span></li>
            </ul>
        </div>
    )
}