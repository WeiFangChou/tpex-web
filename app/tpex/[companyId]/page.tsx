import { prisma } from "@/libs/prisma";

export default async function Page({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = await params;
  const companyData = await prisma.company.findFirst({
    where: {
      company_id: companyId,
    },
  });

  return (
    <div className="rounded overflow-hidden shadow-lg   p-6">
      <h2 className="text-xl font-semibold mb-4">
        {companyData?.company_name}
      </h2>
      <div className="mb-2">
        <strong>Company Tel:</strong> {companyData?.company_tel}
      </div>
      <div className="mb-2">
        <strong>President (EN):</strong> {companyData?.president_name_e}
      </div>
      <div className="mb-2">
        <strong>English Name:</strong> {companyData?.english_name}
      </div>
      <div className="mb-2">
        <strong>Address:</strong> {companyData?.company_address}
      </div>
      <div className="mb-2">
        <strong>Chairman (EN):</strong> {companyData?.chairman_name_e}
      </div>
      <div className="mb-2">
        <strong>Capital:</strong> {companyData?.capital_amt}
      </div>
      <div className="mb-2">
        <strong>Business Area:</strong> {companyData?.main_business1}
      </div>
      <div className="mb-2">
        <strong>Website:</strong>{" "}
        <a
          href={companyData?.internet_address ?? ""}
          className="text-blue-500"
          target="_blank"
          rel="noopener noreferrer"
        >
          {companyData?.internet_address}
        </a>
      </div>
      <div className="mb-2">
        <strong>Listing Date:</strong> {companyData?.listing_date}
      </div>
      <div className="mt-4">
        <strong>About:</strong>
        <p className="text-sm">{companyData?.main_business4}</p>
      </div>
    </div>
  );
}
