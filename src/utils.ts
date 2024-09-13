import { PageData } from "./types";

export const fetchPageData = async (pageNo: number): Promise<PageData> => {
  const res = await fetch(
    `https://api.artic.edu/api/v1/artworks?page=${pageNo}`
  );
  if (!res.ok) throw new Error("Network response was not ok");

  return await res.json();
};
