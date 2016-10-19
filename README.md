# model-jx #

A fluent [data shape projection](https://blogs.msdn.microsoft.com/ericwhite/2008/04/22/projection-2/) library. At this time, the library is designed to be used with typescript, but it may be possible to use it without.

The source to model-jx can be found on [github](https://github.com/redarrowlabs/modeljx).

## Why? ##

Let's say you have an application that communicates with a server via a RESTful API that returns JSON.

The JSON being returned by the server represents the server's view of the persisted state of the object. However, you app wants to translate that domain model into a view model. Perhaps the server was written in Java or C# and uses different naming conventions that look horrible in Javascript. Let's also say that the server isn't perfectly RESTful: some of the POST actions are more like remote procedure calls. You now need to map your modified view model to the parameters on the RPC-style post.

Or perhaps that's not the case: perhaps you have complete control over your server, and just want to cleanly seperate your server responses from you application's state. And you want to be able to test the mappings from server responses to state, and state to server requests seperately from your domain logic.

Perhaps you just want to ensure that all your server responses become immutable when they are added to your application state.

## Examples ##

For complete examples, see the [examples folder](https://github.com/redarrowlabs/modeljx/tree/master/examples/model).

Let's say your server responds with a model like this:
```typescript
interface IDomainObject {
    value: string,
    inner: INestedDomainObject,
    anotherInner: INestedDomainObject,
    DifferentCase?: string
}

interface INestedDomainObject {
    value: string,
}
```

But you want a view model like this:
```typescript
interface IDomainObject {
    value: string,
    isDirty: boolean,
    moreData: INestedDomainObject,
    anotherInner: INestedDomainObject,
    differentcase: string
}

interface INestedDomainObject {
    value: string
}
```

Then you could define projections like this:

```typescript
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
```