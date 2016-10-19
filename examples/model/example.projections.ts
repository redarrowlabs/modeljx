import * as ClientModel from './example.client.models';
import * as ServerModel from './example.server.models';

import * as ClientFactory from './example.client.records';
import * as ServerFactory from './example.server.records';

import {ProjectionBuilder} from "../../src/modeljx";

import * as Immutable from 'immutable';

const MapToLowerCase = (propertyName: string) => propertyName.toLowerCase();

// No need to export this, since it's only used by another projection:
const InnerResult_to_InnerModel = ProjectionBuilder
    .defineProjection<ServerModel.INestedDomainObject, ClientModel.INestedDomainObject>(
        ServerFactory.NestedDomainObject,
        ClientFactory.NestedDomainObject
    ).build();

// ...exported, so the rest of the application can use the projection:
export const Response_to_ViewModel = ProjectionBuilder
    //
    // This will define a typed projection from the server's version of
    // a domain object to the client's view model of the same object.
    //
    // Note that these can handle collections like arrays and Immutable.Lists
    // w/out any additional work (see tests in example directory).
    //
    .defineProjection<ServerModel.IDomainObject, ClientModel.IDomainObject>(
        ServerFactory.DomainObject,
        ClientFactory.DomainObject,
    )
    //
    // This will map all server objects properties that contain capital letters
    // to properties on the client model that are all lower case:
    //
    .withMapping(MapToLowerCase)
    //
    // This will override the projection for a specific property.
    // Notice how it uses the previously defined projection for the INestedDomainObject type.
    // This form of an override provides both the name of the source and target properties:
    // you'd generally do this is they differ in a way that's not covered by any 'withMappings'.
    //
    .override({
        // You may specify the name of a property with a lambda (if you like code completion), but a string will also work.
        fromProperty: (x: ServerModel.IDomainObject) => x.inner,  // Map the 'inner' property on the server response.
        toProperty: (x: ClientModel.IDomainObject) => x.moreData, // To the 'moreData' property on the client view model.
        use: InnerResult_to_InnerModel
    })
    //
    // ...but there's another form using 'forProperty' can be used if the target property's name doesn't need to be
    // specified.
    //
    .override({
        forProperty: (x: ServerModel.IDomainObject) => x.anotherInner,
        use: InnerResult_to_InnerModel,
        // You can also project based on conditions.
        // In this case, when the value isn't 'magic', we use the default projection...
        when: (x: ServerModel.IDomainObject) => x.anotherInner.value != "magic"
    })
    .override({
        forProperty: (x: ServerModel.IDomainObject) => x.anotherInner,
        // ...But when it is 'magic', we project it differently.
        use: (x: ServerModel.IDomainObject) => "did some magic",
        when: (x: ServerModel.IDomainObject) => x.anotherInner.value == "magic"
    })
    .build();