import { OverlayPanel } from "primereact/overlaypanel";
import React from "react";

export interface Artwork {
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: string;
  date_end: string;
}

export interface Pagination {
  total: number;
  limit: number;
  offset: number;
  total_pages: number;
  current_page: number;
}

export interface PageData {
  pagination: Pagination;
  data: Artwork[];
}

export interface RowsSelectionPanelProps {
  panelRef: React.RefObject<OverlayPanel>;
  firstNRowsNoRef: React.RefObject<HTMLInputElement>;
  selectFirstNRows: () => void;
}
