import {
    NestedDomainObject,
    DomainObject
} from "./example.server.models";

import {makeTypedFactory, TypedRecord} from "typed-immutable-record";

export interface DomainObjectRecord extends TypedRecord<DomainObjectRecord>, DomainObject {}
export interface NestedDomainObjectRecord extends TypedRecord<NestedDomainObjectRecord>, NestedDomainObject {}

export class ServerFactoryImpl {
    nestedDomainObject = makeTypedFactory<NestedDomainObject, NestedDomainObjectRecord>({
        value: ''
    });

    domainObject = makeTypedFactory<DomainObject, DomainObjectRecord>({
        value: '',
        inner: {             // Notice: this has a different name than the client model.
            value: ''
        },
        anotherInner: {
            value: ''
        },
        DifferentCase: ''    // Notice: this has a different case than the client model.
    });
}

export const ServerFactory = new ServerFactoryImpl();