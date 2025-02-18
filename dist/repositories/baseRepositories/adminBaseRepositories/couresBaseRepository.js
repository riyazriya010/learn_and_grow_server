"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AdminCourseBaseRepository {
    constructor(models) {
        this.models = models;
    }
    findById(modelName, id) {
        const model = this.models[modelName];
        if (!model)
            throw new Error(`Model ${String(modelName)} not found`);
        return model.findById(id);
    }
    createData(modelName, data) {
        const model = this.models[modelName];
        if (!model)
            throw new Error(`Model ${String(modelName)} not found`);
        return model.create(data);
    }
    findOne(modelName, query) {
        const model = this.models[modelName];
        if (!model)
            throw new Error(`Model ${String(modelName)} not found`);
        return model.findOne(query);
    }
    findAll(modelName, query) {
        const model = this.models[modelName];
        if (!model)
            throw new Error(`Model ${String(modelName)} not found`);
        let queryBuilder = model.find(query || {});
        return queryBuilder;
    }
    updateById(modelName, id, data) {
        const model = this.models[modelName];
        if (!model)
            throw new Error(`Model ${String(modelName)} not found`);
        return model.findByIdAndUpdate(id, data, { new: true }).exec();
    }
    deleteById(modelName, id) {
        const model = this.models[modelName];
        if (!model)
            throw new Error(`Model ${String(modelName)} not found`);
        return model.findByIdAndDelete(id).exec();
    }
    updateMany(modelName, query, data) {
        const model = this.models[modelName];
        if (!model)
            throw new Error(`Model ${String(modelName)} not found`);
        return model.updateMany(query, data).exec();
    }
    deleteMany(modelName, query) {
        const model = this.models[modelName];
        if (!model)
            throw new Error(`Model ${String(modelName)} not found`);
        return model.deleteMany(query).exec();
    }
}
exports.default = AdminCourseBaseRepository;
