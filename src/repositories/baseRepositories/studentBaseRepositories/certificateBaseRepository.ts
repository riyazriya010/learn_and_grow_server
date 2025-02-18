import { Model, Document, FilterQuery, SortOrder, Query } from "mongoose";

export default class StudentCertificateBaseRepository<TModels extends Record<string, Document>> {

    protected models: { [K in keyof TModels]: Model<TModels[K]> };

    constructor(models: { [K in keyof TModels]: Model<TModels[K]> }) {
        this.models = models;
    }

    findById<K extends keyof TModels>(modelName: K, id: string): Query<TModels[K] | null, TModels[K]> {
        const model = this.models[modelName];
        if (!model) throw new Error(`Model ${String(modelName)} not found`);
    
        return model.findById(id);
    }

    createData<K extends keyof TModels>(modelName: K, data: Partial<TModels[K]>): Promise<TModels[K]> {
        const model = this.models[modelName];
        if (!model) throw new Error(`Model ${String(modelName)} not found`);
    
        return model.create(data);
    }

    findOne<K extends keyof TModels>(modelName: K, query: FilterQuery<TModels[K]>): Query<TModels[K] | null, TModels[K]> {
        const model = this.models[modelName];
        if (!model) throw new Error(`Model ${String(modelName)} not found`);
    
        return model.findOne(query);
    }

    findAll<K extends keyof TModels>(modelName: K, query?: FilterQuery<TModels[K]>): Query<TModels[K][], TModels[K]> {
        const model = this.models[modelName];
        if (!model) throw new Error(`Model ${String(modelName)} not found`);

        // return model.find(query || {})
        let queryBuilder = model.find(query || {})
        return queryBuilder;
    }

}