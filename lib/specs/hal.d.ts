export interface Links {
    [resource: string]: Link;
}
export interface Link {
    href: string;
    templated?: boolean;
}
