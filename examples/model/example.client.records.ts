import {TypedRecord, makeTypedFactory} from "typed-immutable-record";

import {
    INestedDomainObject,
    IDomainObject
} from "./example.client.models";

// Immutable records:
export interface IDomainObjectRecord extends TypedRecord<IDomainObjectRecord>, IDomainObject {}
export interface INestedDomainObjectRecord extends TypedRecord<INestedDomainObjectRecord>, INestedDomainObject {}

// Typed record factories:
export const NestedDomainObject = makeTypedFactory<INestedDomainObject, INestedDomainObjectRecord>({
    value: ''
});

export const DomainObject = makeTypedFactory<IDomainObject, IDomainObjectRecord>({
    value: '',
    isDirty: false,
    moreData: {
        value: ''
    },
    anotherInner: {
        value: ''
    },
    differentcase: ''
});