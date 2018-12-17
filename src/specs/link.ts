export interface Link {
  href:string;
  allowed:{
    [method:string]:boolean
  };
  templated?:boolean;
}