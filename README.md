 ```javascript

// Example of complete auto projection. 
// Note that since innerServerToClient ultimately uses makeTypedFactory
// you get default values for free w/out having to specify any further 
// overrides.

export const PatientResult_to_PatientModel = Projection
    .withDefinition(innerServerToClient)
    .autoProject();
    
// example of projection with more than one step:
 
const builder = Projection.withDefinition(serverToClient);
    
builder
    .use(PatientResult_to_PatientModel)
    .from((x: IServerResponse) => x.inner)
    .to((x: IClientViewModel) => x.moreData);
    
builder
    .use(PatientResult_to_PatientModel)
    .for((x: IServerResponse) => x.anotherInner);
    
export const AnotherResult_to_AnotherModel = builder.autoProject();

/// some other file.

const dest = AnotherResult_to_AnotherModel(src);
```