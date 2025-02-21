import { createContext, useState, useContext } from "react";
import { serverUrl } from "../url";

export const HomePageContext = createContext({
    homePageData: null,
    homePageDataError: null,
    isHomePageDataLoading: false,
    fetchHomePageData: () => { },
});
export const useHomePageContext = () => useContext(HomePageContext);

export const HomePageDataProvider = ({ children }) => {
    const [homePageData, setHomePageData] = useState([]);
    const [isHomePageDataLoading, setIsHomePageDataLoading] = useState(false);
    const [homePageDataError, setHomePageDataError] = useState(null);


    const fetchHomePageData = async () => {
        setIsHomePageDataLoading(true);
        setHomePageDataError(null);

        try {
            const result = await fetch(`${serverUrl}/homepage/dataCollection`);

            const resultData = await result.json();

            if (resultData.status === 'success') {
                setHomePageData(prevData => ({ ...prevData, ...resultData.homePageData }))
            } else if (resultData.status === 'error') {
                setHomePageDataError(resultData.message);
            };

        } catch (error) {
            setHomePageDataError(error.message);

        } finally {
            setIsHomePageDataLoading(false);
        };
    };

    return <HomePageContext.Provider value={{ homePageData, homePageDataError, isHomePageDataLoading, fetchHomePageData }}>
        {children}
    </HomePageContext.Provider>
};