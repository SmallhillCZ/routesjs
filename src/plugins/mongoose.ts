import * as mongoParser from "mongo-parse";
import * as mongoose from 'mongoose';

declare var routesStore;

export interface RoutesMongoosePluginOptions {
  cmpFn: (doc:mongoose.Document,resource:string) => boolean;
  expFn: (doc:mongoose.Document,href:string) => boolean;
}

export function routesMongoosePlugin(schema:mongoose.Schema,options:RoutesMongoosePluginOptions){

  var defaultOptions = {
    cmpFn: (doc,resource) => doc.constructor.modelName.toLowerCase() === resource.split(":")[0],
    expFn: (doc,href) => href.replace(/\{id}/,doc._id)
  };

  options = Object.assign({},defaultOptions,options);
  
  schema.virtual("_links").get(function(){

    const links = {};

    routesStore.routes
      .filter(route => options.cmpFn(this,route.resource))
      .forEach(route => {
        const match = route.resource.match(/^[^\:]+\:(.+)$/);
        const link = match ? match[1] : "self";
        links[link] = { href: options.expFn(this,route.href) };
      });

    return links;
  });
}