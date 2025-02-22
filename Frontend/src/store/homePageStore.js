import { create } from 'zustand';
import { serverUrl } from '../url';

const useHomePageStore = create((set) => ({
    homePageData: null,
    homePageDataError: null,
    isHomePageDataLoading: false,

    fetchHomePageData: async () => {
        set({ isHomePageDataLoading: true, homePageDataError: null });

        try {
            const response = await fetch(`${serverUrl}/homepage/dataCollection`);
            const resultData = await response.json();

            if (resultData.status === 'success') {
                set({ homePageData: resultData.homePageData });
            } else if (homePageData.status === 'error') {
                set({ homePageDataError: resultData.message });
            }
        } catch (error) {
            set({ homePageDataError: error.message });
        } finally {
            set({ isHomePageDataLoading: false });
        }
    },
}));

export default useHomePageStore;