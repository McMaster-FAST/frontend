import { JSX } from "react/jsx-dev-runtime";
import { ContinueAction } from "./ContinueAction";

export default interface ActionInfo {
  type: ContinueAction;
  caption: JSX.Element;
  action: () => void | Promise<void>;
}