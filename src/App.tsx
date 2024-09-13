import { DataTable } from "primereact/datatable";
import "./App.css";
import { Column } from "primereact/column";
import { useEffect, useRef, useState } from "react";
import { fetchPageData } from "./utils";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primeicons/primeicons.css";
import { OverlayPanel } from "primereact/overlaypanel";
import { Artwork, Pagination } from "./types";
import RowsSelectionPanel from "./components/RowSelectionPanel";

function App() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [selectedArtworks, setSelectedArtworks] = useState<Artwork[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const panelRef = useRef<OverlayPanel>(null);
  const firstNRowsNoRef = useRef<HTMLInputElement | null>(null);
  const [artworksToBeSelected, setArtworksToBeSelected] = useState<
    Map<number, number>
  >(new Map()); //temp var to remember the pages which are yet to be selected. <key, value> = <PageNo, FirstNRowsToBeSelected>
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    fetchPageData(1).then((dat) => {
      setPagination(dat.pagination);
      setArtworks(dat.data);
      setIsLoading(false);
    });
  }, []);

  const onPageChange = (e: PaginatorPageChangeEvent) => {
    setIsLoading(true);
    fetchPageData(e.page + 1).then((dat) => {
      // if there are artworks(rows) which are not yet inserted into `selectedArtworks`, insert them.
      if (artworksToBeSelected.has(dat.pagination.current_page)) {
        // insert `first` no.of rows into `selectedArtworks`
        setSelectedArtworks((curr) => [
          ...curr,
          ...dat.data.slice(
            0,
            artworksToBeSelected.get(dat.pagination.current_page)
          ),
        ]);
        setArtworksToBeSelected((prev) => {
          const curr = new Map(prev);
          curr.delete(dat.pagination.current_page);
          return curr;
        });
      }

      console.log("{PageNo=>Rows} yet to be selected: ", artworksToBeSelected);

      setPagination(dat.pagination);
      setArtworks(dat.data);
      setIsLoading(false);
    });
  };

  // onClick Handler for Submit Button in "row-selection-panel"
  const selectFirstNRows = () => {
    if (!firstNRowsNoRef.current || !pagination) return;
    const firstNRowsNo = Number(firstNRowsNoRef.current.value); // get the rowsNo
    if (!firstNRowsNo || firstNRowsNo === 0) return;

    setSelectedArtworks((curr) => [
      ...curr,
      ...artworks.slice(
        0,
        firstNRowsNo <= pagination.limit ? firstNRowsNo : pagination.limit
      ),
    ]);
    if (panelRef.current) {
      try {
        panelRef.current.toggle(null);
      } catch (err) {}
    }

    // // if the rowsNo is greater than the rowsLimit(12), then add {pageNo: firstRowsToBeSelected} pairs into `artworksToBeSelected`
    if (firstNRowsNo > pagination.limit) {
      const nextPagesNo = Math.ceil(firstNRowsNo / pagination.limit) - 1; // No.of next pages containing artworks yet to be selected
      const lastPageSelectionsNo =
        firstNRowsNo - nextPagesNo * pagination.limit; // first no.of rows to be selected on the last matched page
      const newArtworksToBeSelected = new Map();
      for (
        let pageNo = pagination.current_page + 1;
        pageNo <= pagination.current_page + nextPagesNo;
        pageNo++
      ) {
        if (pageNo === pagination.current_page + nextPagesNo) {
          newArtworksToBeSelected.set(pageNo, lastPageSelectionsNo);
        } else {
          newArtworksToBeSelected.set(pageNo, pagination.limit);
        }
      }
      setArtworksToBeSelected((prev) => {
        const curr = new Map(prev);
        const merged = new Map([...curr, ...newArtworksToBeSelected]);
        return merged;
      });
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <DataTable
        value={artworks}
        tableStyle={{ minWidth: "50rem" }}
        selectionMode={null}
        selection={selectedArtworks}
        onSelectionChange={(e) => {
          setSelectedArtworks(e.value);
        }}
      >
        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
        <Column
          header={
            <RowsSelectionPanel
              panelRef={panelRef}
              firstNRowsNoRef={firstNRowsNoRef}
              selectFirstNRows={selectFirstNRows}
            />
          }
          style={{ fontSize: "30px", padding: 0 }}
        />
        <Column field="title" header="Title" />
        <Column field="place_of_origin" header="Place of Origin" />
        <Column field="artist_display" header="Artist Display" />
        <Column field="inscriptions" header="Inscriptions" />
        <Column field="date_start" header="Date Start" />
        <Column field="date_end" header="Date End" />
      </DataTable>
      <Paginator
        first={pagination?.offset}
        rows={pagination?.limit}
        totalRecords={pagination?.total}
        onPageChange={onPageChange}
        pageLinkSize={8}
      />
    </>
  );
}

export default App;

function Loader() {
  return (
    <div
      style={{
        position: "fixed",
        zIndex: "50",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <i className="pi pi-spin pi-spinner" style={{ fontSize: "2rem" }}></i>
    </div>
  );
}
