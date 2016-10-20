export interface DomainObject {
    value: string,
    inner: NestedDomainObject,
    anotherInner: NestedDomainObject,
    DifferentCase?: string
}

export interface NestedDomainObject {
    value: string,
}