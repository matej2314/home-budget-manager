import TransactionsList from '../dashboard-internal-components/TransactionsList';

export default function LastTransactionsList({ limit }) {

    return (
        <div id="lastActionsList" className="h-fit flex flex-col justify-start rounded-md border-2 border-slate-500/20 my-4 gap-3 pt-2 pb-4">
            <h2 className="h-fit flex justify-center text-[1.22rem] text-slate-700">Last transactions:</h2>
            <TransactionsList limit={limit} mainSite={true} />
        </div>
    )
}