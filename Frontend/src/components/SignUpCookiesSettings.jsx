export default function SignUpCookiesSettings({ clickAction }) {

    return (
        <div>
            <p className='text-sm w-full h-fit flex flex-col justify-center text-pretty'>
                On this site, we use cookies to authenticate users and collect anonymous statistics regarding traffic and usage of the site (Google Analytics).
                <span
                    className='mt-2'
                >
                    We do not store any advertising or tracking data. The selected setting will be stored in the database.
                </span>
            </p>
            <div className='w-full h-fit flex flex-col gap-3 mt-2'>
                <p className='w-full h-fit flex justify-center font-semibold'>Akceptuję:</p>
                <div className='w-full h-fit flex justify-center gap-3 pl-14'>
                    <button
                        className="form-submit-modal-btn"
                        type="button"
                        onClick={() => clickAction(1)}
                    >
                        Wszystkie
                    </button>
                    <button
                        className="form-submit-modal-btn"
                        type="button"
                        onClick={() => clickAction(0)}
                    >
                        Tylko obowiązkowe
                    </button>
                </div>
            </div>
        </div>
    )
}