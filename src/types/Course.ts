interface Course {
    code: string;
    name: string;
    year: number;
    semester: number;
    units?: Unit[];
}