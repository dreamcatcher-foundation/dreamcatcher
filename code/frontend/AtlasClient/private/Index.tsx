import {RemoteColumn} from "./component/RemoteColumn.tsx";
import {RemoteRow} from "./component/RemoteRow.tsx";
import {EventEmitter} from "fbemitter";
import {render} from "./Render.tsx";
const internalEventsNetwork: EventEmitter = new EventEmitter();
render(
  <RemoteColumn
    name={"main-wrapper"}
    internalNetwork={internalEventsNetwork}
    width={"100vw"}
    height={"100vh"}
    initialStylesheet={{
      zIndex: "100000",
      background: "#161616"
    }}>
      
  </RemoteColumn>
);