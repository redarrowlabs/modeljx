import * as Immutable from 'immutable';

export interface NamedProjectionDefinition {
    from: Function,
    to: Function
}

export interface IProjection {
    (from: any): any
}

export class ProjectionContainer {
    private _projections: Immutable.Map<number, Function> = Immutable.Map<number, Function>();

    register(key: number, projection: Function) {
        this._projections = this._projections.set(key, projection);
    }

    project(key: number, from: any): any {
        const f = this._projections.get(key);
        return f(from);
    }

    using(definition: NamedProjectionDefinition) {
        return new ProjectionContext(definition, this);
    }
}

export class ProjectionContext {
    private _definition: NamedProjectionDefinition;
    private _container: ProjectionContainer;

    constructor(definition: NamedProjectionDefinition, container: ProjectionContainer) {
        this._definition = definition;
        this._container = container;
    }

    private static hashCode(str: string) {
        let hash = 0;
        if (this.length === 0) return hash;
        for (let i = 0; i < str.length; i++) {
            hash = (((hash << 3) - hash) + str.charCodeAt(i)) | 0;
        }
        return hash;
    };

    private hashCode(): number {
        const fromType = JSON.stringify(this._definition.from({}));
        const toType = JSON.stringify(this._definition.to({}));
        return ProjectionContext.hashCode(`${fromType}||${toType}`);
    }

    register(projection: IProjection): void {
        this._container.register(this.hashCode(), projection);
    }

    private projectSingle(from: any): any {
        var rawObject = this._container.project(this.hashCode(), from);
        return this._definition.to(rawObject);
    }

    project(from: any): any {
        if (Array.isArray(from)) {
            return Immutable.List(from.map((x: any) => this.projectSingle(x)));
        }
        return this.projectSingle(from);
    }
}

export var Projection = new ProjectionContainer();