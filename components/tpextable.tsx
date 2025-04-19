"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Spinner,
  Pagination,
  SortDescriptor,
  Selection,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from "@heroui/react";
import { useEffect, useMemo, useState } from "react";

import { Company } from "@/app/page";

export enum DataStatus {
  LOADING,
  LOADED,
  ERROR,
}

const category = [
  "生技醫療業",
  "電子零組件業",
  "數位雲端",
  "運動休閒",
  "生技醫療",
  "食品工業",
  "通信網路業",
  "電腦及週邊設備業",
  "半導體業",
  "建材營造",
  "化學工業",
  "電機機械",
  "其他",
  "農林漁牧",
  "光電業",
  "鋼鐵工業",
  "紡織纖維",
  "觀光餐旅",
  "其他電子業",
  "居家生活",
  "電器電纜",
  "航運業",
  "金融業",
  "綠能環保",
  "金融保險業",
  "塑膠工業",
  "文化創意業",
  "資訊服務業",
  "油電燃氣業",
  "農業科技",
  "汽車工業",
  "文化創意",
  "電子科技",
  "電子通路業",
  "造紙工業",
  "橡膠工業",
  "貿易百貨",
  "玻璃陶瓷",
  "水泥工業",
  "生活健康",
];

const columns = [
  { name: "公司代號", uid: "company_id" },
  { name: "公司名稱", uid: "company_name" },
  { name: "產業別", uid: "name" },
  { name: "統一編號", uid: "invo_no" },
  { name: "詳細", uid: "actions" },
];

const financeColumns = [
  { name: "營業收入", key: "x4000" },
  { name: "營業毛利淨額", key: "x5950" },
  { name: "稅前淨利", key: "x7900" },
  { name: "本期淨利", key: "x8200" },
];

export const DrawerWithTable = ({ company }: { company: Company }) => {
  const drawer: React.ReactNode = (
    <DrawerContent>
      <DrawerHeader>{company?.company_name} 的公司資訊</DrawerHeader>
      <DrawerBody>
        <Table className="text-right">
          <TableHeader>
            <TableColumn key="item">項目</TableColumn>
            {company.finance.map((finance) => (
              <TableColumn
                key={`${finance.year}-${finance.season}`}
                align="center"
              >
                {finance.year} Q{finance.season}
              </TableColumn>
            ))}
          </TableHeader>
          <TableBody>
            {financeColumns.map((col) => (
              <TableRow key={col.key} className=" text-right">
                <TableCell>{col.name}</TableCell>
                {company.finance.map((season) => {
                  const raw = season[col.key as keyof typeof season];
                  const num = Number(raw);
                  const value = !isNaN(num)
                    ? num.toLocaleString()
                    : (raw ?? "-");

                  return (
                    <TableCell
                      key={`${season.year}-${season.season}-${col.key}`}
                      className=" text-right"
                    >
                      {value}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DrawerBody>
      <DrawerFooter>
        <Button>確定</Button>
      </DrawerFooter>
    </DrawerContent>
  );

  return drawer;
};

export default function TPEXTable() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [dataStatus, setDataStatus] = useState<DataStatus>(DataStatus.LOADING);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "company_id",
    direction: "ascending",
  });
  const [selectDrawerCompany, setDrawerCompany] = useState<Company>();
  const [seasonFilter, setSeasonFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(columns.map((col) => col.uid))
  );

  const [drawerOpen, setDrawerOpen] = useState(false);

  const rowsPerPage = 20;

  // 清除篩選的函式
  const clearFilters = () => {
    setSearchKeyword("");
    setSeasonFilter(null);
    setCategoryFilter(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/fiances.json`);
        const json = await res.json();

        setCompanies(json);
        setDataStatus(DataStatus.LOADED);
      } catch (err) {
        setDataStatus(DataStatus.ERROR);
      }
    };

    fetchData();
  }, []);

  const filteredItems = useMemo(() => {
    return companies.filter((c) => {
      const matchKeyword =
        c.company_name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        c.invo_no.includes(searchKeyword) ||
        c.company_id.includes(searchKeyword);

      const matchCategory = categoryFilter ? c.name === categoryFilter : true;

      return matchKeyword && matchCategory;
    });
  }, [companies, searchKeyword, seasonFilter, categoryFilter]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const col = sortDescriptor.column as keyof Company;
      const aVal = a[col];
      const bVal = b[col];

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDescriptor.direction === "ascending"
          ? aVal - bVal
          : bVal - aVal;
      }

      return sortDescriptor.direction === "ascending"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [filteredItems, sortDescriptor]);

  const pages = Math.ceil(sortedItems.length / rowsPerPage);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;

    return sortedItems.slice(start, start + rowsPerPage);
  }, [sortedItems, page]);

  const visibleColumnSet = useMemo(() => {
    if (visibleColumns === "all") return new Set(columns.map((col) => col.uid));

    return visibleColumns;
  }, [visibleColumns]);

  return (
    <div>
      <div className="mb-4 flex justify-between items-center font-mono text-sm">
        <h1 className="text-2xl font-bold">財報</h1>
        <div className="flex gap-2">
          <Input
            placeholder="Search"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <div>
            {/* 產業別選單 */}
            <Dropdown>
              <DropdownTrigger>
                <Button>{categoryFilter ?? "選擇產業別"}</Button>
              </DropdownTrigger>
              <DropdownMenu
                onAction={(key) =>
                  setCategoryFilter((prev) =>
                    prev === key ? null : String(key)
                  )
                }
                selectionMode="single"
                selectedKeys={categoryFilter ? [categoryFilter] : []}
              >
                {category.map((cat) => (
                  <DropdownItem key={cat}>{cat}</DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>

          {/* 欄位顯示 */}
          <Dropdown>
            <DropdownTrigger>
              <Button>欄位顯示</Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              closeOnSelect={false}
              selectedKeys={visibleColumns}
              selectionMode="multiple"
              onSelectionChange={setVisibleColumns}
            >
              {columns.map((col) => (
                <DropdownItem key={col.uid}>{col.name}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          <Button
            variant="light"
            color="danger"
            onPress={clearFilters}
            className="ml-2"
          >
            清除篩選
          </Button>
        </div>
      </div>
      <div>
        <Table
          isHeaderSticky
          fullWidth
          aria-label="財報列表"
          classNames={{
            td: "before:bg-transparent",
            th: "before:bg-transparent",
          }}
          sortDescriptor={sortDescriptor}
          topContentPlacement="outside"
          onSortChange={setSortDescriptor}
        >
          <TableHeader columns={columns}>
            {(col) =>
              visibleColumnSet.has(col.uid) && (
                <TableColumn
                  key={col.uid}
                  allowsSorting={col.uid !== "actions"}
                  className={col.uid === "actions" ? "sticky right-0 z-10" : ""}
                >
                  {col.name}
                </TableColumn>
              )
            }
          </TableHeader>
          <TableBody>
            {dataStatus === DataStatus.LOADING ? (
              <TableRow>
                <TableCell
                  colSpan={visibleColumnSet.size}
                  className="text-center py-6"
                >
                  <Spinner /> Loading...
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={visibleColumnSet.size}
                  className="text-center py-6"
                >
                  查無資料
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((company, i) => (
                <TableRow key={i}>
                  {[...visibleColumnSet].map((colKey) => {
                    if (colKey === "actions") {
                      return (
                        <TableCell key={colKey}>
                          <Button
                            size="sm"
                            color="primary"
                            onPress={() => {
                              setDrawerOpen(true);
                              setDrawerCompany(company);
                            }}
                          >
                            明細
                          </Button>
                        </TableCell>
                      );
                    }

                    return (
                      <TableCell key={colKey}>
                        {company[colKey as keyof Company]}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div>
        <Drawer isOpen={drawerOpen} onOpenChange={setDrawerOpen} size="xl">
          <DrawerWithTable company={selectDrawerCompany} />
        </Drawer>
      </div>
      <div className="flex justify-between items-center mt-4">
        <Pagination
          isCompact
          showControls
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="flex gap-2">
          <Button disabled={page === 1} onPress={() => setPage(page - 1)}>
            上一頁
          </Button>
          <Button disabled={page === pages} onPress={() => setPage(page + 1)}>
            下一頁
          </Button>
        </div>
      </div>
    </div>
  );
}
