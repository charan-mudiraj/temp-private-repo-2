import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { OverlayPanel } from "primereact/overlaypanel";
import { RowsSelectionPanelProps } from "../types";

export default function RowsSelectionPanel({
  panelRef,
  firstNRowsNoRef,
  selectFirstNRows,
}: RowsSelectionPanelProps) {
  return (
    <div>
      <OverlayPanel ref={panelRef}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            alignItems: "end",
          }}
        >
          <InputText
            keyfilter="pint"
            placeholder="Search rows..."
            className="p-inputtext-sm"
            ref={firstNRowsNoRef}
          />
          <Button
            label="Submit"
            style={{ padding: "5px 10px" }}
            onClick={selectFirstNRows}
          />
        </div>
      </OverlayPanel>
      <i
        className="pi pi-chevron-down overlay-icon"
        style={{
          fontWeight: "bold",
        }}
        onClick={(e) => {
          panelRef.current?.toggle(e);
        }}
      />
    </div>
  );
}
