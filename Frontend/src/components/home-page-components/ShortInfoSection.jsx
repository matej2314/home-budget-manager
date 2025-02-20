export default function ShortInfoSection() {


    return (
        <div className="w-full h-fit flex flex-col items-center gap-3">
            <h2 className="w-full h-fit flex flex-row justify-center items-center text-black text-2xl">What is Home Budget Web Manager?</h2>
            <div id="boxes" className="w-full h-fit flex flex-row justify-around items-center gap-3 border-b-2 border-slate-500/25 pb-4">
                <div id='infoBox' className="w-full h-[10rem] flex flex-col items-center gap-3 border-2 border-slate-400 rounded-md p-2 bg-slate-400/25 shadow-lg">
                    <h2 className="text-2xl">Available at your fingertips</h2>
                    <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Deleniti architecto quod voluptatem consectetur, vel repudiandae quidem voluptas accusamus ut nesciunt.</p>
                </div>
                <div id='infoBox' className="w-full h-[10rem] flex flex-col gap-3 items-center border-2 border-slate-400 rounded-md p-2 bg-slate-400/25 shadow-lg">
                    <h2 className="text-2xl">Completely free</h2>
                    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Est voluptatum nam quaerat dicta, architecto magnam unde, asperiores facere enim, perferendis sunt! Tempore optio laboriosam sit, nam illum facere modi eum?</p>
                </div>
                <div id='infoBox' className="w-full h-[10rem] flex flex-col gap-3 items-center border-2 border-slate-400 rounded-md p-2 bg-slate-400/25 shadow-lg">
                    <h2 className="text-2xl">Only necessary information</h2>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione quis consectetur quam dolor ea nobis vitae maxime magni, velit enim!</p>
                </div>
            </div>
        </div>
    )
}