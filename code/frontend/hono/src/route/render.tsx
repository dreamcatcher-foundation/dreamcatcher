import {
  Root,
  createRoot
} from "react-dom/client";
export const root: () => Root = () => createRoot(document.getElementById('root')!);
export const render: (content: JSX.Element) => void = (content: JSX.Element): void => root().render(content);