import {
    IClientViewModel,
    IServerResponse,
    IServerResponseInner,
    IClientViewModelInner
} from "./example.models";

import * as Factories from "./example.records";

import {ProjectionBuilder} from "../../src/modeljx";

import * as Immutable from 'immutable';

const InnerResult_to_InnerModel = ProjectionBuilder
    .defineProjection<IServerResponseInner, IClientViewModelInner>(
        Factories.ServerResponseInnerRecord,
        Factories.ClientViewModelInnerRecord
    ).build();

export const Response_to_ViewModel = ProjectionBuilder
    .defineProjection<IServerResponse, IClientViewModel>(
        Factories.ServerResponseRecord,
        Factories.ClientViewModelRecord,
    )
    .withMapping(
        (propertyName: string) => propertyName.toLowerCase()
    )
    .override({
        fromProperty: (x: IServerResponse) => x.inner,
        toProperty: (x: IClientViewModel) => x.moreData,
        use: InnerResult_to_InnerModel
    })
    .override({
        forProperty: (x: IServerResponse) => x.anotherInner,
        use: InnerResult_to_InnerModel,
        when: (x: IServerResponse) => x.anotherInner.value != "magic"
    })
    .override({
        forProperty: (x: IServerResponse) => x.anotherInner,
        use: (x: IServerResponse) => "did some magic",
        when: (x: IServerResponse) => x.anotherInner.value == "magic"
    })
    .build();