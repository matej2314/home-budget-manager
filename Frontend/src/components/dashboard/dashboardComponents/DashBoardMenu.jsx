export default function DashBoardMenu() {
    return (
        <div className="w-full h-fit flex flex-col gap-3">
            <div>
                <ul>
                    {/* osobna podstrona wyświetlająca użytkowników gospodarstwa z możliwością kontaktu z wybranym użytkownikiem,
                    admin gospodarstwa może usuwać poszczególnych użytkowników, ten sam komponent co HouseMates.jsx ale
                    z dodatkowymi możliwościami, dodatkowy podkomponent do zapraszania użytkownika do gospodarstwa  */}
                    <li>House mates</li>
                    po kliknięciu wyświetla się lista transakcji, przy każdej transakcji przycisk 'usuń',
                    obok listy przycisk 'dodaj transakcje'
                    <li>Transactions</li>
                    <li>Calendar</li>
                    {/* kontakt do twórców  */}
                    <li>Contact</li>
                </ul>
            </div>
        </div>
    )
}