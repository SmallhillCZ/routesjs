import { Link } from "./link";

export interface Links {
  self: Link;
  [name: string]: Link
}
