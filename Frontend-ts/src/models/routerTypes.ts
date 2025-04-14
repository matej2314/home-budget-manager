
interface Route {
    path: string;
    index?: boolean,
    element: React.FC,
    children?: Route[],
};

export type Routes = Route[];