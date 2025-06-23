import { useEffect, useMemo, useRef, useState } from "react";
import { useRiskData, useRiskDetailsData } from "@/hooks/useQueryData";
import { useSearchParams } from "react-router-dom";
import { FiFileText } from "react-icons/fi";
import EmptyPage from "@/components/EmptyPage";
import truncateText from "@/utils/truncateText";
import { ReactTable } from "@/components/Table";
import { FiDownload } from "react-icons/fi";
import { jsPDF } from "jspdf";

export default function Users() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState(
    searchParams.get("searchText") ?? ""
  );
  const [pageSize, setPageSize] = useState(
    searchParams.get("pageSize") ?? "10"
  );
  const [page, setPage] = useState(searchParams.get("page") ?? 1);
  const [selectedFile, setSelectedFile] = useState([]);
  const { data, isLoading, isError } = useRiskData(
    searchText,
    selectedFile?.id,
    pageSize,
    page
  );

  // const data = [
  //   {
  //     id: 5,
  //     title: "Risk",
  //     description:
  //       " risk description is a concise statement that summarizes a potential problem and its consequences if it occurs. It should clearly communicate the potential adverse event or condition and how it could impact objectives. A well-structured risk statement helps all stakeholders better understand the program risks and enhances system engineering planning and communicationTo effectively describe a risk, it should include three main components: the event, the root cause, and the consequence.The event is the trigger for the risk, the root cause is the underlying reason for the risk, and the consequence is the impact on objectives if the risk occurs. The risk statement should be clear and concise, using everyday business terms that are easily understood by all stakeholders. it occurs. It should clearly communicate the potential adverse event or condition and how it could impact objectives. A well-structured risk statement helps all stakeholders better understand the program risks and enhances system engineering planning and communicationTo effectively describe a risk, it should include three main components: the event, the root cause, and the consequence.The event is the trigger for the risk, the root cause is the underlying reason for the risk, and the consequence is the impact on objectives if the risk occurs. The risk statement should be clear and concise, using everyday business terms that are easily understood by all stakeholders.",
  //     createdby: 1,
  //     threatlevel: 2,
  //     risk: "risk",
  //     action: "patching",
  //     assignees: null,
  //     status: "mitigation",
  //   },
  //   {
  //     id: 6,
  //     title: "data",
  //     description: "this is data risk",
  //     createdby: 1,
  //     threatlevel: 3,
  //     risk: "risk",
  //     action: "evaluating",
  //     assignees: null,
  //     status: "mitigation",
  //   },
  //   {
  //     id: 7,
  //     title: "Database",
  //     description: "database risk",
  //     createdby: 1,
  //     threatlevel: 4,
  //     risk: "risk",
  //     action: "patching",
  //     assignees: null,
  //     status: "mitigation",
  //   },
  //   {
  //     id: 5,
  //     title: "Risk",
  //     description:
  //       " risk description is a concise statement that summarizes a potential problem and its consequences if it occurs. It should clearly communicate the potential adverse event or condition and how it could impact objectives. A well-structured risk statement helps all stakeholders better understand the program risks and enhances system engineering planning and communicationTo effectively describe a risk, it should include three main components: the event, the root cause, and the consequence.The event is the trigger for the risk, the root cause is the underlying reason for the risk, and the consequence is the impact on objectives if the risk occurs. The risk statement should be clear and concise, using everyday business terms that are easily understood by all stakeholders. it occurs. It should clearly communicate the potential adverse event or condition and how it could impact objectives. A well-structured risk statement helps all stakeholders better understand the program risks and enhances system engineering planning and communicationTo effectively describe a risk, it should include three main components: the event, the root cause, and the consequence.The event is the trigger for the risk, the root cause is the underlying reason for the risk, and the consequence is the impact on objectives if the risk occurs. The risk statement should be clear and concise, using everyday business terms that are easily understood by all stakeholders.",
  //     createdby: 1,
  //     threatlevel: 2,
  //     risk: "risk",
  //     action: "patching",
  //     assignees: null,
  //     status: "mitigation",
  //   },
  //   {
  //     id: 6,
  //     title: "data",
  //     description: "this is data risk",
  //     createdby: 1,
  //     threatlevel: 3,
  //     risk: "risk",
  //     action: "evaluating",
  //     assignees: null,
  //     status: "mitigation",
  //   },
  //   {
  //     id: 7,
  //     title: "Database",
  //     description: "database risk",
  //     createdby: 1,
  //     threatlevel: 4,
  //     risk: "risk",
  //     action: "patching",
  //     assignees: null,
  //     status: "mitigation",
  //   },
  //   {
  //     id: 5,
  //     title: "Risk",
  //     description:
  //       " risk description is a concise statement that summarizes a potential problem and its consequences if it occurs. It should clearly communicate the potential adverse event or condition and how it could impact objectives. A well-structured risk statement helps all stakeholders better understand the program risks and enhances system engineering planning and communicationTo effectively describe a risk, it should include three main components: the event, the root cause, and the consequence.The event is the trigger for the risk, the root cause is the underlying reason for the risk, and the consequence is the impact on objectives if the risk occurs. The risk statement should be clear and concise, using everyday business terms that are easily understood by all stakeholders. it occurs. It should clearly communicate the potential adverse event or condition and how it could impact objectives. A well-structured risk statement helps all stakeholders better understand the program risks and enhances system engineering planning and communicationTo effectively describe a risk, it should include three main components: the event, the root cause, and the consequence.The event is the trigger for the risk, the root cause is the underlying reason for the risk, and the consequence is the impact on objectives if the risk occurs. The risk statement should be clear and concise, using everyday business terms that are easily understood by all stakeholders.",
  //     createdby: 1,
  //     threatlevel: 2,
  //     risk: "risk",
  //     action: "patching",
  //     assignees: null,
  //     status: "mitigation",
  //   },
  //   {
  //     id: 6,
  //     title: "data",
  //     description: "this is data risk",
  //     createdby: 1,
  //     threatlevel: 3,
  //     risk: "risk",
  //     action: "evaluating",
  //     assignees: null,
  //     status: "mitigation",
  //   },
  //   {
  //     id: 11,
  //     title: "Database",
  //     description:
  //       "description is a concise statement that summarizes a potential problem and its consequences if it occurs. It should clearly communicate the potential adverse event or condition and how it could impact objectives. A well-structured risk statement helps all stakeholders better understand the program risks and enhances system engineering planning and communicationTo effectively describe a risk, it should include three main components: the event, the root cause, and the consequence.The event is the trigger for the risk, the root cause is the underlying reason for the risk, and the consequence is the impact on objectives if the risk occurs. The risk statement should be clear and concise, using everyday business terms that are easily understood by all stakeholders. it occurs. It should clearly communicate the potential adverse event or condition and how it could impact objectives. A well-structured risk statement helps all stakeholders better understand the program risks and enhances system engineering planning and communicationTo effectively describe a risk, it should include three main components: the event, the root cause",
  //     createdby: 1,
  //     threatlevel: 4,
  //     risk: "risk",
  //     action: "patching",
  //     assignees: null,
  //     status: "mitigation",
  //     auditLog: [
  //       {
  //         id: 9,
  //         createdAt: "2025-04-29 02:19:18",
  //         createdBy: "Sakshi",
  //         risk: 15,
  //         user: 0,
  //       },
  //       {
  //         id: 9,
  //         createdAt: "2025-04-29 02:19:18",
  //         createdBy: "Rohan",
  //         risk: 15,
  //         user: 0,
  //       },
  //     ],
  //   },
  // ];

  useEffect(() => {
    setSelectedFile(data?.data?.[0]);
  }, []);

  const { data: riskDetailsData } = useRiskDetailsData(
    selectedFile?.id ?? data?.data?.[0]?.id ?? 1
  );

  const riskData = riskDetailsData?.data ?? data?.data?.[0];

  const pdfRef = useRef(null);
  const handleDownload = () => {
    const content = pdfRef.current;
    const doc = new jsPDF("portrait", "px", "a3");
    doc.html(content, {
      callback: function (doc) {
        doc.save(`${riskData?.title}.pdf`);
      },
    });
  };

  const columns = useMemo(
    () => [
      {
        accessorFn: (row, index) => index + 1,
        id: "id",
        header: () => <span>S.N.</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.createdBy,
        id: "createdBy",
        header: () => <span>Created by</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.createdAt,
        id: "createdAt",
        header: () => <span>Created at</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.risk,
        id: "risk",
        header: () => <span>Risk</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.user,
        id: "user",
        header: () => <span>User</span>,
        footer: (props) => props.column.id,
      },
    ],
    []
  );

  useEffect(() => {
    const searchQuery = {
      searchText: searchText,
      page: page,
      pageSize: pageSize,
    };
    setSearchParams(searchQuery);
  }, [page, pageSize, searchText]);

  return (
    <div>
      {data?.data ? (
        <div className="flex p-4 gap-4">
          <div className="p-4 w-2/5 border bg-white px-5 ">
            <p className="border-b mb-3 pb-1 font-bold text-gray-600">
              Risk List
            </p>
            <div className=" flex gap-3  flex-wrap ">
              {data?.data?.map((item, index) => {
                return (
                  <div
                    key={index}
                    className={`w-1/5 md:min-w-[40%] lg:min-w-[27%] sm:min-w-[90%] min-w-[60px] h-[100px] flex flex-col gap-1 items-center justify-center text-xs max-w-[100px] border  border-gray-300 max-h-[100px] rounded-l-[4px] rounded-tr-[16px] cursor-pointer font-semibold text-blue-900  hover:bg-blue-100 ${
                      selectedFile?.id == item?.id
                        ? "bg-blue-100"
                        : "bg-blue-50 "
                    }`}
                    onClick={() => setSelectedFile(item)}
                  >
                    <div className="  text-[20px]">
                      <FiFileText />
                    </div>
                    {truncateText(item?.title, 8)}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="w-3/5 bg-white border p-4   overflow-auto">
            <p className="flex justify-between items-center border-b mb-3 pb-1 font-bold text-gray-600">
              <p>Risk Details</p>
              <div
                onClick={() => handleDownload()}
                className="border border-blue-600 rounded-[4px] text-xs flex gap-1 items-center text-blue-800 px-4 py-1 cursor-pointer mb-1 hover:text-white hover:bg-blue-800"
              >
                <FiDownload className=" text-sm" />
                <p>Download</p>
              </div>
            </p>
            <div
              ref={pdfRef}
              className="max-h-[70vh] p-4 min-h-[400px] overflow-auto"
            >
              <div className="flex flex-col gap-2">
                <p className="text-lg font-medium"> {riskData?.title}</p>
                <div className="text-xs">
                  <p>
                    <span className="font-semibold text-sm">Action : </span>
                    {riskData?.action}
                  </p>
                  <p>
                    <span className="font-semibold text-sm">Status : </span>
                    {riskData?.status}
                  </p>
                </div>
                <p className="text-xs">
                  <span className="font-semibold text-sm">Created by : </span>{" "}
                  {riskData?.createdBy}
                </p>
                <p className="text-xs">
                  <span className="font-semibold text-sm">Threat level :</span>{" "}
                  {riskData?.threatLevel}
                </p>

                <div className="text-xs flex gap-2">
                  <p className="font-semibold text-sm">Assignees : </p>
                  <div className="flex gap-2">
                    {riskData?.assignees?.map((item) => {
                      return <p>{item?.username}</p>;
                    })}
                  </div>
                </div>
                <p className="text-xs">
                  <span className="font-semibold text-sm">Risk :</span>{" "}
                  {riskData?.risk}
                </p>
                <p className="text-sm font-semibold mt-4">Description</p>
                <p className="text-xs">{riskData?.description}</p>
                {riskData?.auditLog && (
                  <>
                    <p className="text-sm font-semibold mt-4">Audit Log</p>
                    <ReactTable
                      columns={columns}
                      data={riskData?.auditLog ?? []}
                      currentPage={1}
                      totalPage={1}
                      emptyMessage="Oops! No auditLog available right now."
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="my-20">
          <EmptyPage message={"No data to show "} />
        </div>
      )}
    </div>
  );
}
