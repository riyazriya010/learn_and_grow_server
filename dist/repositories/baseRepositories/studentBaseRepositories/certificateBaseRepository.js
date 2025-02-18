"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StudentCertificateBaseRepository {
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
        // return model.find(query || {})
        let queryBuilder = model.find(query || {});
        return queryBuilder;
    }
}
exports.default = StudentCertificateBaseRepository;
