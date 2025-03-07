import { create } from 'zustand';
import { serverUrl } from '../url';
import fetchData from '../utils/asyncUtils/fetchData';

const useHomePageStore = create((set) => ({
    homePageData: null,
    homePageDataError: null,
    isHomePageDataLoading: false,

    fetchHomePageData: async () => {
        set({ isHomePageDataLoading: true, homePageDataError: null });

        try {
            const response = await fetchData(`${serverUrl}/homepage/dataCollection`);

            if (response.status === 'success') {
                set({ homePageData: response.homePageData });
            } else if (response.status === 'error') {
                set({ homePageDataError: response.message });
            }
        } catch (error) {
            set({ homePageDataError: error.message });
        } finally {
            set({ isHomePageDataLoading: false });
        }
    },
}));

export default useHomePageStore;