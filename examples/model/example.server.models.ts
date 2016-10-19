export interface IDomainObject {
    value: string,
    inner: INestedDomainObject,
    anotherInner: INestedDomainObject,
    DifferentCase?: string
}

export interface INestedDomainObject {
    value: string,
}