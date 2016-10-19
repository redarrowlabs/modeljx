export interface IDomainObject {
    value: string,
    isDirty: boolean,
    moreData: INestedDomainObject,
    anotherInner: INestedDomainObject,
    differentcase: string
}

export interface INestedDomainObject {
    value: string
}