export default function DashboardHeader() {
    return (
        <div id='dashboard-header' className="w-full h-fit flex flex-row items-center text-slate-900 bg-slate-200 py-3 pl-5 gap-4 border-2 border-b-slate-800/5">
            <div id="user-info" className="flex justify-around items-center gap-3">
                <div className="w-14 h-14 bg-white rounded-full">
                    <p className="text-black flex justify-center items-center mt-3">photo</p>
                </div>
                <span>mateo2314</span>
            </div>
            <div id="icons-container" className="flex justify-around items-center gap-2">
                <span>nots</span>
                <span>msgs</span>
                <span>houseinfo</span>
            </div>
            <div id="user-opts" className="w-full h-full flex justify-end items-center gap-2 mr-5">
                <p>Language: icon</p>
                <button type="button">Logout</button>
            </div>
        </div>
    )
}