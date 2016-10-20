export interface DomainObject {
    value: string,
    isDirty: boolean,
    moreData: NestedDomainObject,
    anotherInner: NestedDomainObject,
    differentcase: string
}

export interface NestedDomainObject {
    value: string
}