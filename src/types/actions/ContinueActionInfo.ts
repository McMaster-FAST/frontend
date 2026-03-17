import { JSX } from "react/jsx-dev-runtime";

export default interface ActionInfo {
    caption: JSX.Element;
    action: (() => (void | Promise<void>));
}