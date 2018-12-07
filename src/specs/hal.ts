export interface HalDoc {
  _links?:HalLink
}
export interface HalLinks {
  self: HalLink;
  [resource:string]: HalLink;
}

export interface HalLink {
  href:string;
  templated?:boolean;
}