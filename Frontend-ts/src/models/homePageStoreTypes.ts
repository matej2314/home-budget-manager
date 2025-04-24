import { BaseApiResponse } from "@utils/asyncUtils/fetchData";

export type Technology = {
    id: string;
    name: string;
    icon: string;
};

export type Review = {
    id: string;
    rating: number;
    userName: string;
    content: string;
    userId: string;
    date: string;
};

export type Shots = string[];

export type Technologies = Technology[];
export type Reviews = Review[];

export type HomePageData = {
    technologies: Technologies;
    reviews: Reviews;
    shots: Shots;
};

export type HomePageDataResponse = BaseApiResponse & {
    homePageData: HomePageData;
};

export type HomePageDataStore = {
    homePageData: HomePageData | null;
    homePageDataError: string | null;
    isHomePageDataLoading: boolean;
    fetchHomePageData: () => Promise<void>;
}

