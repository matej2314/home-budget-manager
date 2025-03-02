export default function BasicHouseInfo({ basicHouseInfo }) {
    const keysToDisplay = ['houseName', 'host', 'lastBalanceDate'];
    return (
        <div id="basicHouseInfo" className="w-full lg:w-full h-full text-xs lg:text-base flex justify-center items-center gap-4">
            {keysToDisplay.map((key, index) => (
                <div key={key} className="flex h-full items-center">
                    <div className="flex flex-col md:flex-row justify-center items-center gap-0.5 lg:gap-2">
                        <span className="text-[0.65rem] lg:text-base font-bold">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                        </span>
                        <span className="w-full lg:w-fit">{basicHouseInfo[key] || 'brak danych :('}</span>
                    </div>
                    {index < keysToDisplay.length - 1 && (
                        <span className="block lg:block mx-4 text-xl">|</span>
                    )}
                </div>
            ))}
        </div>
    );
}
