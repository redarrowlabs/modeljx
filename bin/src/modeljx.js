import * as Immutable from 'immutable';
export class ProjectionContainer {
    constructor() {
        this._projections = Immutable.Map();
    }
    register(key, projection) {
        this._projections = this._projections.set(key, projection);
    }
    project(key, from) {
        const f = this._projections.get(key);
        return f(from);
    }
    using(definition) {
        return new ProjectionContext(definition, this);
    }
}
export class ProjectionContext {
    constructor(definition, container) {
        this._definition = definition;
        this._container = container;
    }
    static hashCode(str) {
        let hash = 0;
        if (this.length === 0)
            return hash;
        for (let i = 0; i < str.length; i++) {
            hash = (((hash << 3) - hash) + str.charCodeAt(i)) | 0;
        }
        return hash;
    }
    ;
    hashCode() {
        const fromType = JSON.stringify(this._definition.from({}));
        const toType = JSON.stringify(this._definition.to({}));
        return ProjectionContext.hashCode(`${fromType}||${toType}`);
    }
    register(projection) {
        this._container.register(this.hashCode(), projection);
    }
    projectSingle(from) {
        var rawObject = this._container.project(this.hashCode(), from);
        return this._definition.to(rawObject);
    }
    project(from) {
        if (Array.isArray(from)) {
            return Immutable.List(from.map((x) => this.projectSingle(x)));
        }
        return this.projectSingle(from);
    }
}
export var Projection = new ProjectionContainer();
