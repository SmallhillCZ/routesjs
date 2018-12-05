import * as mongoose from 'mongoose';
export interface RoutesMongoosePluginOptions {
    cmpFn: (doc: mongoose.Document, resource: string) => boolean;
    expFn: (doc: mongoose.Document, href: string) => boolean;
}
export declare function routesMongoosePlugin(schema: mongoose.Schema, options: RoutesMongoosePluginOptions): void;
