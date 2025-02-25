export default function BasicHouseInfo({ basicHouseInfo }) {
    const keysToDisplay = ['houseName', 'host', 'lastBalanceDate'];
    return (
        <div id="basicHouseInfo" className="lg:w-full h-full text-xs lg:text-base flex justify-center items-center gap-4">
            {keysToDisplay.map((key, index) => (
                <div key={key} className="flex flex-row items-center justify-center lg:flex-row gap-2">
                    <div className="flex justify-center items-center gap-1 lg:gap-2">
                        <span className="text-[0.65rem] lg:text-base font-bold">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                        </span>
                        <span className="w-full lg:w-fit">{basicHouseInfo[key] || 'brak danych :('}</span>
                    </div>
                    {index < keysToDisplay.length - 1 && <span className=" text-xl lg:text-md -translate-y-0.5">&#124;</span>}
                </div>
            ))}
        </div>
    );
}
