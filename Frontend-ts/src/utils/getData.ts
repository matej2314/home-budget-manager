export const getData = <T>
    (
        isLoading: boolean,
        error: string | null | undefined,
        extraVal: boolean = true,
        data: T,
        defaultValue: T
): T => {
  return  (!isLoading && !error && extraVal && data) || defaultValue;
};
