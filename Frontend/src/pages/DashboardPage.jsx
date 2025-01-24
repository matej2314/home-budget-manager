
export default function DashboardPage() {
    return (
        <main className="w-full h-screen flex flex-row justify-start">
            <div id='dashboardMenu' className="h-screen w-[15rem] bg-customGray flex flex-col items-center justify-start text-slate-300 pt-5 gap-7">
                <h2 className="text-xl">Menu:</h2>
                <ul className="w-full h-fit flex flex-col items-center gap-4">
                    <li>info</li>
                    <li>info</li>
                    <li>info</li>
                    <li>info</li>
                    <li>info</li>
                    <li>info</li>
                    <li>info</li>
                    <li>info</li>
                    <li>info</li>
                    <li>info</li>
                </ul>
            </div>
            <div id="pagecontent" className="bg-slate-200 w-full h-full">
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
                        <p>languages</p>
                        <p>logoutBtn</p>
                    </div>
                </div>
                <div id="house-info-blocks">
                    <div>

                    </div>
                </div>
            </div>
        </main>
    )
};