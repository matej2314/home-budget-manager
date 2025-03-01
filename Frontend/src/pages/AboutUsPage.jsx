import { Icon } from "@iconify/react"
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function AboutUs() {
    useDocumentTitle('About us');

    return (
        <div className="w-full h-full flex flex-col justify-center items-center gap-3">
            <div className="flex flex-col justify-center items-center">
                <Icon icon='noto-v1:construction-worker' width={250} height={250} />
                <p className="w-full h-fit flex justify-center font-semibold text-2xl text-slate-200 mb-[10rem]">Page under construction.</p>
            </div>
        </div>
    )
}