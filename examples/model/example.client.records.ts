import {TypedRecord, makeTypedFactory} from "typed-immutable-record";

import {
    NestedDomainObject,
    DomainObject
} from "./example.client.models";

export interface DomainObjectRecord extends TypedRecord<DomainObjectRecord>, DomainObject {}
export interface NestedDomainObjectRecord extends TypedRecord<NestedDomainObjectRecord>, NestedDomainObject {}

export class ClientFactoryImpl {
    nestedDomainObject = makeTypedFactory<NestedDomainObject, NestedDomainObjectRecord>({
        value: ''
    });

    domainObject = makeTypedFactory<DomainObject, DomainObjectRecord>({
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
}

export const ClientFactory = new ClientFactoryImpl();