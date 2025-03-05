export default function SignUpCookiesSettings({ clickAction }) {

    return (
        <div>
            <p className='text-sm w-full h-fit flex flex-col justify-center text-pretty'>
                Na tej stronie wykorzystujemy pliki cookies w celu uwierzytelniania użytkowników oraz zbierania anonimowych statystyk
                dotyczących ruchu i sposobu korzystania ze strony (Google Analytics).
                <span className='mt-2'>Nie przechowujemy żadnych danych reklamowych ani
                    śledzących. Wybrane ustawienie zostanie zapisane w bazie danych.</span>
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