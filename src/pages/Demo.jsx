import { useState } from "react";
import { SupplierSelectionModal } from "./common/SupplierSelectionModal";

export default function Demo() {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [supplier, setSupplier] = useState(null);

  return (
    <div style={{ minHeight: "100vh", background: "#F6F3EC", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit',sans-serif" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>

        <button
          onClick={() => setPickerOpen(true)}
          style={{ padding: "10px 22px", background: "#1B1713", color: "#F6F3EC", border: "none", borderRadius: 8, fontFamily: "sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
        >
          Select Supplier
        </button>

        {supplier && <p style={{ fontSize: 13, color: "#1B1713" }}>Selected: <strong>{supplier.name}</strong></p>}

      </div>

      <SupplierSelectionModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(s) => setSupplier(s)}
        onAddNew={() => console.log("go to add supplier page")}
        selected={supplier}
      />
    </div>
  );
}