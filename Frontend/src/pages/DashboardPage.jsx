
export default function DashboardPage() {
    return (
        <main className="w-full flex flex-row justify-start overflow-auto bg-slate-200">
            <div id='dashboardMenu' className="w-[15rem] bg-customGray flex flex-col items-center justify-start text-slate-300 pt-5 gap-7">
                <h2 className="text-xl w-full flex justify-center">Menu:</h2>
                <ul className="w-full h-full flex flex-col items-center gap-4">
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
                <div id="house-info-blocks" className="flex gap-5 border-2 border-b-slate-800/5 py-4 px-5">
                    <div id='housemates' className="w-1/4 h-[8.5rem] bg-red-600/75 text-xl text-white flex flex-col justify-start items-center rounded-md pt-6">
                        <div className="h-1/2 w-1/2 flex flex-col justify-center items-center gap-4">
                            <h2 className="text-2xl">Housemates:</h2>
                            <span className="text-2xl">5</span>
                        </div>
                    </div>
                    <div id="monthlyBudget" className="w-1/4 h-[8.5rem] bg-green-600/80 text-xl text-white flex flex-col justify-start items-center rounded-md pt-4">
                        <div className="h-11/12 w-11/12 flex flex-col justify-center items-center gap-4">
                            <h2 className="text-xl">Monthly budget:</h2>
                            <span className="text-xl">3000 zł</span>
                            <span className="text-sm">01.01.2025</span>
                        </div>
                    </div>
                    <div id="currentBudget" className="w-1/4 h-[8.5rem] bg-sky-400/80 text-xl text-white flex flex-col justify-start items-center rounded-md pt-4">
                        <div className="h-11/12 w-11/12 flex flex-col justify-center items-center gap-4">
                            <h2 className="text-xl">Current budget:</h2>
                            <span className="text-xl text-lime-900/50">800 zł</span>
                            <span className="text-xl text-red-500">-500 zł</span>
                        </div>
                    </div>
                    <div id='newMessages' className="w-1/4 h-[8.5rem] bg-sky-700/85 flex flex-col text-white justify-start items-center rounded-md pt-4">
                        <div className="h-11/12 w-11/12 flex flex-col justify-center items-center gap-4">
                            <h2 className="text-xl">New messages:</h2>
                            <span className="text-xl">0</span>
                        </div>
                    </div>
                </div>
                <div id="middlePart" className="w-full h-fit flex gap-3">
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
                    <div id="lastActionsList" className="w-fit h-fit flex flex-col justify-start rounded-md border-2 border-slate-500/20 my-4 gap-3 py-2 px-[4rem]">
                        <h2 className="w-full h-fit flex justify-center text-[1.22rem] text-slate-700">Last transactions:</h2>
                        <ul className="w-full h-fit flex flex-col justify-center gap-3">
                            <li className="w-full flex justify-center"><span>type</span>-<span>value</span>-<span>user</span>-<span>date</span></li>
                            <li className="w-full flex justify-center"><span>type</span>-<span>value</span>-<span>user</span>-<span>date</span></li>
                            <li className="w-full flex justify-center"><span>type</span>-<span>value</span>-<span>user</span>-<span>date</span></li>
                            <li className="w-full flex justify-center"><span>type</span>-<span>value</span>-<span>user</span>-<span>date</span></li>
                            <li className="w-full flex justify-center"><span>type</span>-<span>value</span>-<span>user</span>-<span>date</span></li>
                            <li className="w-full flex justify-center"><span>type</span>-<span>value</span>-<span>user</span>-<span>date</span></li>
                            <li className="w-full flex justify-center"><span>type</span>-<span>value</span>-<span>user</span>-<span>date</span></li>
                            <li className="w-full flex justify-center"><span>type</span>-<span>value</span>-<span>user</span>-<span>date</span></li>
                            <li className="w-full flex justify-center"><span>type</span>-<span>value</span>-<span>user</span>-<span>date</span></li>
                            <li className="w-full flex justify-center"><span>type</span>-<span>value</span>-<span>user</span>-<span>date</span></li>
                        </ul>
                    </div>
                    <div id='transactions-top-categories' className="w-1/2 h-[25.5rem] flex flex-col justify-start rounded-md border-2 border-slate-500/20 mr-5 gap-3 my-4 py-2 px-[4rem]">
                        <h2 className="w-full h-fit flex justify-center text-xl">Top categories of transactions:</h2>
                        <ul className="w-full h-fit flex flex-col justify-center items-center gap-3">
                            <li><span>Name</span>-<span>usage</span>-<span>overall percentage</span></li>
                            <li><span>Name</span>-<span>usage</span>-<span>overall percentage</span></li>
                            <li><span>Name</span>-<span>usage</span>-<span>overall percentage</span></li>
                            <li><span>Name</span>-<span>usage</span>-<span>overall percentage</span></li>
                            <li><span>Name</span>-<span>usage</span>-<span>overall percentage</span></li>
                            <li><span>Name</span>-<span>usage</span>-<span>overall percentage</span></li>
                            <li><span>Name</span>-<span>usage</span>-<span>overall percentage</span></li>
                            <li><span>Name</span>-<span>usage</span>-<span>overall percentage</span></li>
                            <li><span>Name</span>-<span>usage</span>-<span>overall percentage</span></li>
                        </ul>
                    </div>
                </div>
                <div id='chartsPart' className=" h-[30rem] mb-4 mx-5 flex flex-col gap-3">
                    <div id="budget-per-day-chart" className="w-full h-[45rem] border-2 border-green-600 pt-2">
                        <h2 className="w-full h-fit flex justify-center text-xl">Budget per day - chart</h2>
                    </div>
                    <div id="transactions-per-day-chart" className="w-full h-[45rem] border-2 border-green-600 pt-2">
                        <h2 className="w-full h-fit flex justify-center text-xl">Transactions per day - chart</h2>
                    </div>
                    <div id='transactions-categories-chart' className="w-full h-[45rem] border-2 border-green-600 pt-2">
                        <h2 className="w-full h-fit flex justify-center text-xl">Transactions categories - chart:</h2>
                    </div>
                </div>
            </div>
        </main>
    )
};