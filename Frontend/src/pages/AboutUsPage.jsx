import { Icon } from "@iconify/react"

import HomePageMenu from "../components/home-page-components/HomePageMenu"

export default function AboutUs() {

    return (
        <main className="w-full h-screen flex flex-col justify-start items-center gap-4 pt-1">
            <div className="w-screen h-fit flex justify-center">
                <HomePageMenu />
            </div>
            <div className="w-full h-full flex flex-col justify-start items-center pt-5 gap-3">
                <Icon icon='noto-v1:construction-worker' width={250} height={250} />
                <p className="w-full h-fit flex justify-center font-semibold text-2xl">Page under construction.</p>
            </div>
        </main>
    )
}