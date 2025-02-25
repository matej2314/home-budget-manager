export default function BasicHouseInfo({ basicHouseInfo }) {
    const keysToDisplay = ['houseName', 'host', 'lastBalanceDate'];
    return (
        <div id="basicHouseInfo" className="lg:w-full h-full text-xs lg:text-base flex justify-center items-center gap-4">
            {keysToDisplay.map((key, index) => (
                <div key={key} className="flex flex-col lg:flex-row gap-2">
                    <span className="text-xs lg:text-base font-bold">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                    </span>
                    <span>{basicHouseInfo[key] || 'brak danych :('}</span>
                    {index < keysToDisplay.length - 1 && <span className="text-md -translate-y-0.5">&#124;</span>}
                </div>
            ))}
        </div>
    );
}
