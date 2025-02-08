export default function BasicHouseInfo({ basicHouseInfo }) {

    return (
        <div id="basicHouseInfo" className="w-full h-full flex items-center gap-4">
            <span className="flex gap-2">
                <span className="font-bold">House name:</span>
                <span>{basicHouseInfo.houseName || 'brak danych :('}</span>
            </span>
            <span className="text-md">&#124;</span>
            <span className="flex gap-2">
                <span className="font-bold">Host's username:</span>
                <span>{basicHouseInfo.host || 'brak danych :('}</span>
            </span>
            <span className="text-md">&#124;</span>
            <div className="w-fit flex gap-1">
                <span className="font-bold">Date of last balance:</span>
                <span>{basicHouseInfo.lastBalanceDate || '2025-01-01'}</span>
            </div>
        </div>
    )
}