class ProjectionStage {
    constructor(from, to) {
        this.from = from;
        this.to = to;
    }
    override(props) {
        props;
        return this;
    }
    build() {
        return (from) => {
            if (from) {
            }
            return this.to({});
        };
    }
}
export default class ProjectionBuilder {
    static defineProjection(from, to) {
        return new ProjectionStage(from, to);
    }
}
