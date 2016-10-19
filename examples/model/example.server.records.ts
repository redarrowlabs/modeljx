import {
    INestedDomainObject,
    IDomainObject
} from "./example.server.models";

import {makeTypedFactory, TypedRecord} from "typed-immutable-record";

// Immutable records:
export interface IDomainObjectRecord extends TypedRecord<IDomainObjectRecord>, IDomainObject {}
export interface INestedDomainObjectRecord extends TypedRecord<INestedDomainObjectRecord>, INestedDomainObject {}

// Typed record factories:
export const NestedDomainObject = makeTypedFactory<INestedDomainObject, INestedDomainObjectRecord>({
    value: ''
});

export const DomainObject = makeTypedFactory<IDomainObject, IDomainObjectRecord>({
    value: '',
    inner: {             // Notice: this has a different name than the client model.
        value: ''
    },
    anotherInner: {
        value: ''
    },
    DifferentCase: ''    // Notice: this has a different case than the client model.
});