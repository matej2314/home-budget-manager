import TransactionsList from '../../internal-components/TransactionsList';

export default function LastTransactionsList() {

    return (
        <div id="lastActionsList" className="w-[48vw] h-fit flex flex-col justify-start rounded-md border-2 border-slate-500/20 my-4 gap-3 py-2">
            <h2 className="w-full h-fit flex justify-center text-[1.22rem] text-slate-700">Last transactions:</h2>
            <TransactionsList limit={5} mainSite={true} />
        </div>
    )
}