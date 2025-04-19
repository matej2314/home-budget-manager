import { create } from 'zustand';
import { serverUrl } from 'url';
import fetchData from '@utils/asyncUtils/fetchData';
import { type  HomePageDataStore, HomePageDataResponse } from '@models/homePageStoreTypes';

const useHomePageStore = create<HomePageDataStore>((set) => ({
    homePageData: null,
    homePageDataError: null,
    isHomePageDataLoading: false,

    fetchHomePageData: async () => {
        set({ isHomePageDataLoading: true, homePageDataError: null });

        try {
            const response = await fetchData<HomePageDataResponse>(`${serverUrl}/homepage/dataCollection`);

            if (response.status === 'success') {
                set({ homePageData: response.homePageData });
            } else if (response.status === 'error') {
                set({ homePageDataError: response.message });
            }
        } catch (error: unknown) {
            const err = error as Error;
            set({ homePageDataError: err.message });
        } finally {
            set({ isHomePageDataLoading: false });
        }
    },
}));

export default useHomePageStore;

