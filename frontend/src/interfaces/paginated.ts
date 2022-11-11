export default interface Paginated<T> {
    countResults : number;
    nextPage: number;
    page: number
    previousPage: number
    results: T[];
    totalPages: number
}