export default function MonthlyBudget() {
    return (
        <div id="monthlyBudget" className="w-1/4 h-[8.5rem] bg-green-600/80 text-xl text-white flex flex-col justify-start items-center rounded-md pt-4">
            <div className="h-11/12 w-11/12 flex flex-col justify-center items-center gap-4">
                <h2 className="text-xl">Monthly budget:</h2>
                <span className="text-xl">3000 zł</span>
                <span className="text-sm">01.01.2025</span>
            </div>
        </div>
    )
}