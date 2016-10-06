import * as Factories from "./example.records";
import ProjectionBuilder from "../../src/modeljx";
const InnerResult_to_InnerModel = ProjectionBuilder
    .defineProjection(Factories.ServerResponseInnerRecord, Factories.ClientViewModelInnerRecord).build();
export const Response_to_ViewModel = ProjectionBuilder
    .defineProjection(Factories.ServerResponseRecord, Factories.ClientViewModelRecord)
    .override({
    fromProperty: (x) => x.inner,
    toProperty: (x) => x.moreData,
    use: InnerResult_to_InnerModel
})
    .override({
    forProperty: (x) => x.anotherInner,
    use: InnerResult_to_InnerModel
})
    .build();
