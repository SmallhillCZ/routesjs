import { Links } from "./links";
import { Actions } from "./actions";
export interface Resource {
    _links: Links;
    _actions: Actions;
}
