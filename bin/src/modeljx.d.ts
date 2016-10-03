export interface NamedProjectionDefinition {
    from: Function;
    to: Function;
}
export interface IProjection {
    (from: any): any;
}
export declare class ProjectionContainer {
    private _projections;
    register(key: number, projection: Function): void;
    project(key: number, from: any): any;
    using(definition: NamedProjectionDefinition): ProjectionContext;
}
export declare class ProjectionContext {
    private _definition;
    private _container;
    constructor(definition: NamedProjectionDefinition, container: ProjectionContainer);
    private static hashCode(str);
    private hashCode();
    register(projection: IProjection): void;
    private projectSingle(from);
    project(from: any): any;
}
export declare var Projection: ProjectionContainer;
