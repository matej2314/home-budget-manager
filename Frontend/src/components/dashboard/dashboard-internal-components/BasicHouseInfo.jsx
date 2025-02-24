export default function BasicHouseInfo({ basicHouseInfo }) {

    return (
        <div id="basicHouseInfo" className="lg:w-full h-full text-xs lg:text-base flex items-center gap-4">
            <span className="flex flex-col lg:flex-row gap-2">
                <span className="text-xs lg:text-base font-bold">House name:</span>
                <span>{basicHouseInfo.houseName || 'brak danych :('}</span>
            </span>
            <span className="text-md">&#124;</span>
            <span className="flex flex-col lg:flex-row gap-2">
                <span className="text-xs lg:text-base font-bold">Host's username:</span>
                <span>{basicHouseInfo.host || 'brak danych :('}</span>
            </span>
            <span className="text-md">&#124;</span>
            <div className="w-fit flex flex-col lg:flex-row gap-1">
                <span className="font-bold">Last balance date:</span>
                <span>{basicHouseInfo.lastBalanceDate || 'Not found'}</span>
            </div>
        </div>
    )
}