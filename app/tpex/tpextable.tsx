"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Input,
  Pagination,
} from "@heroui/react";
import { FaFilter } from "react-icons/fa";
import { FinancialReport } from "./page"; // 確保有 export type

export default function TPEXTable() {
  const [data, setData] = useState<FinancialReport[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [pages, setPages] = useState(1); // 假設你之後後端會回傳 total count 來計算總頁數
  const [searchKeyword, setSearchKeyword] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/fiances?page=${page}&limit=${limit}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );
      const json = await res.json();

      setData(json.data);
      setPages(json.meta.totalPages);
    } catch (error) {
      // console.error("載入資料失敗：", error);
    }
  }, [page, limit]);

  const filteredData = useMemo(() => {
    if (!searchKeyword) return data;
    return data.filter(
      (item) =>
        item.company?.company_name?.includes(searchKeyword) ||
        item.company?.company_id?.includes(searchKeyword)
    );
  }, [data, searchKeyword]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onNextPage = useCallback(() => {
    setPage((prev) => Math.min(prev + 1, pages));
  }, [pages]);

  const onPreviousPage = useCallback(() => {
    setPage((prev) => Math.max(prev - 1, 1));
  }, []);

  const topBar = useMemo(() => {
    return (
      <div className="mb-[18px] flex items-center justify-between">
        <div className="flex w-[226px] items-center gap-2">
          <h1 className="text-2xl font-[700] leading-[32px]">財報</h1>
        </div>
      </div>
    );
  }, []);

  const tableFilter = () => {
    return (
      <div className="flex  gap-3">
        <Input
          className="w-[300px]"
          placeholder="Search"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <Button name="Filter" startContent={<FaFilter />}>
          Filter
        </Button>
        <Button className="w-[300px]">Search</Button>
      </div>
    );
  };

  const bottomContent = useMemo(() => {
    return (
      <div className="flex flex-col items-center justify-between gap-2 px-2 py-2 sm:flex-row">
        <Pagination
          isCompact
          showControls
          showShadow
          siblings={3}
          page={page}
          color="primary"
          total={pages}
          onChange={setPage}
        />
        <div className="flex items-center justify-end gap-6">
          <div className="flex items-center gap-3">
            <Button
              isDisabled={page === 1}
              size="sm"
              variant="flat"
              onPress={onPreviousPage}
            >
              Previous
            </Button>
            <Button
              isDisabled={page === pages}
              size="sm"
              variant="flat"
              onPress={onNextPage}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    );
  }, [page, pages, onPreviousPage, onNextPage]);

  return (
    <div>
      <div className="p-3">
        {topBar}
        {tableFilter()}
        <div className="text-sm text-gray-500">共 {pages} 頁財報資料</div>
      </div>
      <Table bottomContent={bottomContent} isHeaderSticky aria-label="財報列表">
        <TableHeader>
          <TableColumn>公司代號</TableColumn>
          <TableColumn>公司名稱</TableColumn>
          <TableColumn>年度</TableColumn>
          <TableColumn>季別</TableColumn>
          <TableColumn>稅前淨利</TableColumn>
          <TableColumn>營業毛利淨額</TableColumn>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.company?.company_id}</TableCell>
              <TableCell>{item.company?.company_name ?? ""}</TableCell>
              <TableCell>{item.year}</TableCell>
              <TableCell>{item.season}</TableCell>
              <TableCell>{item.x7950}</TableCell>
              <TableCell>{item.x5950}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
