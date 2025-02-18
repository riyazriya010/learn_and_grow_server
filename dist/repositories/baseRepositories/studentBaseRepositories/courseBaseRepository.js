"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StudentCourseBaseRepository {
    constructor(models) {
        this.models = models;
    }
    findAll(modelName, query) {
        const model = this.models[modelName];
        if (!model)
            throw new Error(`Model ${String(modelName)} not found`);
        // return model.find(query || {})
        let queryBuilder = model.find(query || {});
        return queryBuilder;
    }
    findById(modelName, id) {
        const model = this.models[modelName];
        if (!model)
            throw new Error(`Model ${String(modelName)} not found`);
        return model.findById(id);
    }
    findOne(modelName, query) {
        const model = this.models[modelName];
        if (!model)
            throw new Error(`Model ${String(modelName)} not found`);
        return model.findOne(query);
    }
    createData(modelName, data) {
        const model = this.models[modelName];
        if (!model)
            throw new Error(`Model ${String(modelName)} not found`);
        return model.create(data);
    }
}
exports.default = StudentCourseBaseRepository;
