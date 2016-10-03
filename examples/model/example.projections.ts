import {makeTypedFactory} from "typed-immutable-record";

import {Projection, NamedProjectionDefinition} from '../../src/modeljx';

import {
    IClientViewModelRecord,
    IServerResponseRecord,
    IServerResponseInnerRecord,
    IClientViewModelInnerRecord
} from './example.records';

import {
    IClientViewModel,
    IServerResponse,
    IServerResponseInner,
    IClientViewModelInner
} from "./example.models";

export const innerServerToClient: NamedProjectionDefinition = {
    from: makeTypedFactory<IServerResponseInner, IServerResponseInnerRecord>({
        value: ''
    }),
    to: makeTypedFactory<IClientViewModelInner, IClientViewModelInnerRecord>({
        value: ''
    })
};

Projection
    .using(innerServerToClient)
    .register((from: IServerResponseInner) => {
        return {
            value: from.value
        };
    });

export const serverToClient: NamedProjectionDefinition = {
    from: makeTypedFactory<IServerResponse, IServerResponseRecord>({
        value: '',
        inner: {
            value: ''
        },
    }),
    to: makeTypedFactory<IClientViewModel, IClientViewModelRecord>({
        value: '',
        isDirty: false,
        moreData: {
            value: ''
        }
    })
};

Projection
    .using(serverToClient)
    .register((from: IServerResponseRecord) => {
            return {
                value: `${from.value}: Logic added.`,
                isDirty: false,
                moreData: Projection.using(innerServerToClient).project(from.inner)
            };
        }
    );