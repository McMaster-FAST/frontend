interface Paginated<T> {
    count: number;
    totalPages: number;
    next: number;
    previous: number;
    results: T[];
}