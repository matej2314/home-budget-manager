import { BaseApiResponse } from "@utils/asyncUtils/fetchData";

type Technology = {
    id: string;
    name: string;
    icon: string;
};

type Review = {
    id: string;
    rating: number;
    userName: string;
    content: string;
    userId: string;
    date: string;
};

type Shots = string[];

type Technologies = Technology[];
type Reviews = Review[];

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

