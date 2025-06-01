import AddUnitModal from "@/pages/units/AddUnitModal";
import { SortableList } from "@/sortable/SortableList";
import truncateText from "@/utils/truncateText";
import { FiEdit2 } from "react-icons/fi";
import DeleteModal from "../DeleteModal";
import { FaRegTrashCan } from "react-icons/fa6";

export default function DragDropUnitTable({ dragData, setDragData }) {
  return (
    <div>
      <table className="w-full text-sm text-gray-700 bg-white border">
        <div className="flex items-center w-full border-b-[1px] h-10 px-3 bg-[#F9FAFB] py-2 text-left table_header  font-medium text-sm  text-slate-800 ">
          <th className="w-[5%]">S.N.</th>
          <th className="w-2/6">Unit name</th>
          <th className="w-1/6">Subject</th>
          <th className="w-1/6">Course</th>
          <th className="w-1/6">Description</th>
          <th className="w-1/6">Action</th>
        </div>

        <tbody className="w-full bg-blue-100">
          <SortableList
            items={dragData ?? []}
            onChange={setDragData}
            renderItem={(item, index) => (
              <SortableList.Item id={item?.id}>
                <tr
                  key={item?.id}
                  className=" w-full flex bg-white justify-between items-center h-10"
                >
                  <td className=" w-[5%] text-center">{index + 1}</td>
                  <div className="w-2/6 ">
                    <SortableList.DragHandle>
                      <div className="flex items-center gap-1">
                        {item?.thumbnail ? (
                          <img
                            className="h-8 w-8 object-cover rounded-full"
                            src={item?.thumbnail}
                            alt=""
                          />
                        ) : (
                          <div className="min-h-8 min-w-8 rounded-full bg-gray-100"></div>
                        )}
                        <p className="flex items-center gap-1 line-clamp-1">
                          {truncateText(item?.title, 40)}
                        </p>
                      </div>
                    </SortableList.DragHandle>
                  </div>
                  <td className=" w-1/6">{item?.subject?.title}</td>
                  <td className=" w-1/6">{item?.course?.courseID}</td>
                  <td className=" w-1/6">
                    {truncateText(item?.description, 40)}
                  </td>
                  <div className="flex gap-2 w-1/6 text-base justify-center">
                    <AddUnitModal asChild edit editData={item}>
                      <FiEdit2 className="text-[#4365a7] cursor-pointer" />
                    </AddUnitModal>
                    <DeleteModal
                      asChild
                      desc={"Are you sure you want to delete this unit"}
                      title={"Delete Unit"}
                      id={item}
                    >
                      <FaRegTrashCan className="text-red-600 cursor-pointer" />
                    </DeleteModal>
                  </div>
                </tr>
              </SortableList.Item>
            )}
          />
        </tbody>
      </table>
    </div>
  );
}
