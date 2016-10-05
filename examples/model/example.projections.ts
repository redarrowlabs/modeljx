import {
    IClientViewModel,
    IServerResponse,
    IServerResponseInner,
    IClientViewModelInner
} from "./example.models";

import * as Factories from "./example.records";

import ProjectionBuilder from "../../src/modeljx";

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
    .override({
        forProperty: (x: IServerResponse) => x.anotherInner,
        use: InnerResult_to_InnerModel
    })
    .build();