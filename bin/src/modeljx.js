import * as Immutable from 'immutable';
class ProjectionStage {
    constructor(from, to) {
        this._projections = Immutable.Map();
        this.from = from;
        this.to = to;
    }
    overrideProperty(fromProperty, toProperty, use) {
        this._projections = this._projections.set(`${fromProperty}|${toProperty}`, use);
    }
    override(props) {
        props;
        let { fromProperty, toProperty, forProperty, use } = props;
        let from = '';
        let to = '';
        if (fromProperty) {
            from = ProjectionStage.extractPropertyName(fromProperty);
            to = ProjectionStage.extractPropertyName(toProperty);
            this.overrideProperty(from, to, use);
        }
        else if (forProperty) {
            from = to = ProjectionStage.extractPropertyName(forProperty);
        }
        else {
            throw "unsupported projection type";
        }
        this.overrideProperty(from, to, use);
        return this;
    }
    // ~todo~ Add error checking and make this more safe.
    static extractPropertyName(fromProperty) {
        let serialized = fromProperty.toString();
        let isLambda = serialized.indexOf('=>') > -1;
        return isLambda
            ? serialized.split('=>')[1].trim().split('.').splice(-1, 1)[0]
            : serialized.split('return')[1].split(';')[0].split('.')[1].trim();
    }
    build() {
        return (from) => {
            if (from) {
            }
            var result = this.to({});
            // 1. loop through every property on the 'from' object.
            for (let propertyName in from) {
                // 2. attempt to lookup a specific projection for that property and execute it.
                let hasProjection = false;
                if (hasProjection) {
                }
            }
            return result;
        };
    }
}
export default class ProjectionBuilder {
    static defineProjection(from, to) {
        return new ProjectionStage(from, to);
    }
}
