declare module "@tawk.to/tawk-messenger-react" {
  import type { ComponentType, MutableRefObject } from "react";

  export type TawkMessengerHandle = {
    setAttributes?: (attributes: Record<string, string>, callback?: (error?: unknown) => void) => void;
  };

  export type TawkMessengerReactProps = {
    propertyId: string;
    widgetId: string;
    useRef?: MutableRefObject<TawkMessengerHandle | null>;
    onLoad?: () => void;
    [key: string]: unknown;
  };

  const TawkMessengerReact: ComponentType<TawkMessengerReactProps>;

  export default TawkMessengerReact;
}
